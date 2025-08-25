"use client";

import { useState, useEffect } from "react";
import { createWebClient } from "@bluvo/sdk-ts";
import { useMutation } from "@tanstack/react-query";
import { getWalletById } from "../actions/wallet";
import { getWithdrawalQuote, transactFunds } from "../actions/withdrawal";
import { Balance } from "../types/wallet";

// UI Components
import { OAuth2SetupForm } from "../components/OAuth2SetupForm";
import { StatusMessage } from "../components/StatusMessage";
import { WalletBalances } from "../components/WalletBalances";
import styles from "../page.module.css";

// Constants
const MOMENTO_TOKEN = 'eyJlbmRwb2ludCI6ImNlbGwtNC11cy13ZXN0LTItMS5wcm9kLmEubW9tZW50b2hxLmNvbSIsImFwaV9rZXkiOiJleUpoYkdjaU9pSklVekkxTmlKOS5leUp6ZFdJaU9pSm1iRzlBWW14MWRtOHVZMjhpTENKMlpYSWlPakVzSW5BaU9pSkZhRWxMUlVKSlQwTkJTV0ZEUVc5SFlqSkdNV1JIWjNsSlowRTlJbjAuU0Y2M3NHWkoxYUdKckJpRVZCdXZlbG9pOEFWWkNFVzd1ZnNOUklGYUx5dyJ9'

const PREFILL_DESTINATION_ADDRESSES = {
  "LTC": "ltc1q4cj9y83hg5f5zvwu8f2he4g9j6u8l7skw3q5tu",
  "BTC": "bc1qm50vw9uh7k4dghewqygyye2cqavjgyrk9y6lj4",
}

// Utility function
function randomUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Bluvo SDK Integration Example
 * 
 * This page demonstrates the complete flow of:
 * 1. OAuth2 authentication with Coinbase
 * 2. Wallet balance retrieval
 * 3. Withdrawal quote generation
 * 4. Transaction execution with 2FA
 */
export default function Home() {
  // OAuth2 Configuration
  const [orgId, setOrgId] = useState("a2e98409-cd68-48c4-853c-73d9228764c0");
  const [projectId, setProjectId] = useState("b16e1c13-74ad-4b95-b252-0c12e2215b18");
  const [walletId, setWalletId] = useState(randomUUID());
  const [idem, setIdem] = useState(randomUUID());

  // App State
  const [status, setStatus] = useState<{ message: string; type: "info" | "success" | "error" }>({ message: "", type: "info" });
  const [isLoading, setIsLoading] = useState(false);
  const [walletBalances, setWalletBalances] = useState<Balance[] | null>(null);
  const [showLoadingWallet, setShowLoadingWallet] = useState(false);

  // Withdrawal State
  const [expandedCrypto, setExpandedCrypto] = useState<string | null>(null);
  const [withdrawalForms, setWithdrawalForms] = useState<Record<string, { amount: string; destinationAddress: string; twoFactorCode: string; selectedNetwork?: string }>>({});
  const [activeQuotes, setActiveQuotes] = useState<Record<string, any>>({});

  // ==========================================
  // STEP 1: Wallet Balance Retrieval
  // ==========================================
  const walletMutation = useMutation({
    mutationFn: getWalletById,
    onSuccess: (result) => {
      if (result.success && result.data) {
        setWalletBalances(result.data.balances);
        setShowLoadingWallet(false);
      } else {
        setStatus({ message: `Failed to fetch wallet: ${result.error}`, type: "error" });
        setShowLoadingWallet(false);
      }
    },
    onError: (error) => {
      setStatus({ message: `Error fetching wallet: ${error.message}`, type: "error" });
      setShowLoadingWallet(false);
    },
  });

  // Check for existing session on mount
  useEffect(() => {
    const storedWalletId = localStorage.getItem('coinbase-wallet-id');
    if (storedWalletId) {
      setShowLoadingWallet(true);
      setStatus({ message: "Found existing session. Loading wallet data...", type: "info" });
      walletMutation.mutate(storedWalletId);
    }
  }, []);

  // ==========================================
  // STEP 2: OAuth2 Flow with Coinbase
  // ==========================================
  const handleOAuth2Click = async () => {
    if (!orgId || !projectId || !walletId || !idem) {
      setStatus({ message: "Please fill in all fields", type: "error" });
      return;
    }

    setIsLoading(true);
    setStatus({ message: "Initializing OAuth2 flow...", type: "info" });

    try {
      // Initialize Bluvo WebClient
      const webClient = createWebClient({
        orgId,
        projectId
      });

      // Open OAuth2 window
      await webClient.oauth2.openWindow(
        "coinbase",
        {
          walletId: walletId,
          idem: idem,
        },
        {
          onWindowClose: () => {
            console.log("OAuth2 window was closed");
            setStatus({ message: "OAuth2 window was closed by user", type: "info" });
            setIsLoading(false);
          },
        }
      );

      // Listen for OAuth2 completion
      await webClient.listen(
        idem,
        MOMENTO_TOKEN,
        {
          onMessage: (data: {
            [key: string]: any;
            success?: boolean | undefined;
            walletId?: string | undefined;
          }) => {
            console.log("Received OAuth2 token data:", data);
            
            // Persist wallet ID
            const receivedWalletId = data.walletId || walletId;
            localStorage.setItem('coinbase-wallet-id', receivedWalletId);
            
            // Fetch wallet data
            setShowLoadingWallet(true);
            setStatus({ message: "OAuth2 successful! Fetching wallet data...", type: "info" });
            setIsLoading(false);
            walletMutation.mutate(receivedWalletId);
          },
          onError: (error:any) => {
            console.error("Error receiving OAuth2 token data:", error);
            setStatus({ message: `Error receiving token data: ${error.message}`, type: "error" });
            setIsLoading(false);
          },
          onComplete: () => {
            console.log("OAuth2 flow complete");
            setStatus({ message: "OAuth2 flow complete", type: "success" });
            setIsLoading(false);
          },
        }
      );

      setStatus({ message: "OAuth2 window opened successfully! Check for popups if you don't see it.", type: "success" });
    } catch (error: any) {
      console.error("OAuth2 error:", error);
      setStatus({ message: `Error: ${error.message}`, type: "error" });
      setIsLoading(false);
    }
  };

  // ==========================================
  // STEP 3: Withdrawal Quote Generation
  // ==========================================
  const quoteMutation = useMutation({
    mutationFn: getWithdrawalQuote,
    onSuccess: (result, variables) => {
      if (result.success && result.data) {
        setActiveQuotes(prev => ({
          ...prev,
          [variables.asset]: result.data
        }));
        setStatus({ 
          message: `Quote received! This quote expires in 30 seconds.`, 
          type: "success" 
        });
      } else {
        setStatus({ message: `Failed to get quote: ${result.error}`, type: "error" });
      }
    },
    onError: (error) => {
      setStatus({ message: `Error getting quote: ${error.message}`, type: "error" });
    },
  });

  const handleGetQuote = (crypto: string) => {
    const form = withdrawalForms[crypto];
    if (!form || !form.amount || !form.destinationAddress) {
      setStatus({ message: "Please fill in amount and destination address", type: "error" });
      return;
    }

    const storedWalletId = localStorage.getItem('coinbase-wallet-id');
    if (!storedWalletId) {
      setStatus({ message: "No wallet ID found. Please sign in first.", type: "error" });
      return;
    }

    quoteMutation.mutate({
      walletId: storedWalletId,
      asset: crypto,
      amount: parseFloat(form.amount),
      destinationAddress: form.destinationAddress,
      network: form.selectedNetwork || undefined,
    });
  };

  // ==========================================
  // STEP 4: Transaction Execution with 2FA
  // ==========================================
  const transactMutation = useMutation({
    mutationFn: transactFunds,
    onSuccess: (result) => {
      if (result.success && result.data) {
        setStatus({ 
          message: `Transaction initiated! Workflow ID: ${result.data.workflowRunId}`, 
          type: "success" 
        });
        
        // Clear form after successful transaction
        const crypto = Object.keys(activeQuotes).find(key => 
          activeQuotes[key].quoteId === result.data.quoteId
        );
        if (crypto) {
          setWithdrawalForms(prev => ({
            ...prev,
            [crypto]: { amount: '', destinationAddress: '', twoFactorCode: '' }
          }));
          setActiveQuotes(prev => {
            const newQuotes = { ...prev };
            delete newQuotes[crypto];
            return newQuotes;
          });
        }
      } else {
        setStatus({ message: `Failed to transact: ${result.error}`, type: "error" });
      }
    },
    onError: (error) => {
      setStatus({ message: `Error transacting: ${error.message}`, type: "error" });
    },
  });

  const handleTransactFunds = (crypto: string) => {
    const quote = activeQuotes[crypto];
    const form = withdrawalForms[crypto];
    
    if (!quote || !form?.twoFactorCode) {
      setStatus({ message: "Please enter 2FA code", type: "error" });
      return;
    }

    transactMutation.mutate({
      quoteId: quote.quoteId,
      twoFactorCode: form.twoFactorCode
    });
  };

  // ==========================================
  // Helper Functions
  // ==========================================
  const handleClearSession = () => {
    localStorage.removeItem('coinbase-wallet-id');
    setWalletBalances(null);
    setExpandedCrypto(null);
    setWithdrawalForms({});
    setActiveQuotes({});
    setStatus({ message: "Session cleared. You can sign in again.", type: "info" });
  };

  const toggleCrypto = (crypto: string) => {
    setExpandedCrypto(expandedCrypto === crypto ? null : crypto);
    // Initialize form data if not exists
    if (!withdrawalForms[crypto]) {
      setWithdrawalForms(prev => ({
        ...prev,
        [crypto]: {
          amount: '',
          destinationAddress: PREFILL_DESTINATION_ADDRESSES[crypto as keyof typeof PREFILL_DESTINATION_ADDRESSES] || '',
          twoFactorCode: '',
          selectedNetwork: undefined
        }
      }));
    }
  };

  const updateWithdrawalForm = (crypto: string, field: 'amount' | 'destinationAddress' | 'twoFactorCode' | 'selectedNetwork', value: string) => {
    setWithdrawalForms(prev => ({
      ...prev,
      [crypto]: {
        ...prev[crypto],
        [field]: value
      }
    }));
  };

  // ==========================================
  // Render UI
  // ==========================================
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>BluvoWebClient OAuth2 Test</h1>

        <OAuth2SetupForm
          orgId={orgId}
          setOrgId={setOrgId}
          projectId={projectId}
          setProjectId={setProjectId}
          walletId={walletId}
          setWalletId={setWalletId}
          idem={idem}
          setIdem={setIdem}
          onSubmit={handleOAuth2Click}
          isLoading={isLoading}
        />

        {!!walletBalances && (
          <button
            onClick={handleClearSession}
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1.5rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Clear Session
          </button>
        )}

        <StatusMessage message={status.message} type={status.type} />

        {showLoadingWallet && (
          <div
            style={{
              padding: "1rem",
              borderRadius: "0.25rem",
              backgroundColor: "#cff4fc",
              color: "#0c5460",
              textAlign: "center",
            }}
          >
            Loading wallet data...
          </div>
        )}

        {!!walletBalances && (
          <WalletBalances
            balances={walletBalances}
            expandedCrypto={expandedCrypto}
            onToggleCrypto={toggleCrypto}
            withdrawalForms={withdrawalForms}
            onUpdateWithdrawalForm={updateWithdrawalForm}
            onGetQuote={handleGetQuote}
            activeQuotes={activeQuotes}
            onTransactFunds={handleTransactFunds}
            isGettingQuote={quoteMutation.isPending}
            isTransacting={transactMutation.isPending}
          />
        )}
      </main>
    </div>
  );
}