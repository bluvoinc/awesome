"use client";

import React from 'react';
import { CryptoBalance } from './CryptoBalance';
import { Balance } from '../types/wallet';

interface WalletBalancesProps {
  balances: Balance[];
  expandedCrypto: string | null;
  onToggleCrypto: (crypto: string) => void;
  withdrawalForms: Record<string, { amount: string; destinationAddress: string; twoFactorCode: string; selectedNetwork?: string }>;
  onUpdateWithdrawalForm: (crypto: string, field: 'amount' | 'destinationAddress' | 'twoFactorCode' | 'selectedNetwork', value: string) => void;
  onGetQuote: (crypto: string) => void;
  activeQuotes: Record<string, any>;
  onTransactFunds: (crypto: string) => void;
  isGettingQuote: boolean;
  isTransacting: boolean;
}

export function WalletBalances({
  balances,
  expandedCrypto,
  onToggleCrypto,
  withdrawalForms,
  onUpdateWithdrawalForm,
  onGetQuote,
  activeQuotes,
  onTransactFunds,
  isGettingQuote,
  isTransacting
}: WalletBalancesProps) {
  // Split balances into two groups and sort
  const balancesWithNetworks = balances
    .filter(balance => balance.networks && balance.networks.length > 0)
    .sort((a, b) => b.networks.length - a.networks.length); // Sort by network count (descending)
    
  const balancesWithoutNetworks = balances
    .filter(balance => !balance.networks || balance.networks.length === 0);

  return (
    <div
      style={{
        padding: "1rem",
        borderRadius: "0.25rem",
        border: "1px solid #000000",
        marginTop: "1rem",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Wallet Balances:</h3>
      
      {/* Balances with networks (withdrawable) */}
      {balancesWithNetworks.length > 0 && (
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ 
            marginTop: 0, 
            marginBottom: "0.75rem", 
            color: "#28a745", 
            fontSize: "1rem",
            fontWeight: "600"
          }}>
            Withdrawable Assets ({balancesWithNetworks.length})
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {balancesWithNetworks.map((balance) => (
              <CryptoBalance
                key={balance.asset}
                crypto={balance.asset}
                amount={balance.amount}
                networks={balance.networks}
                isExpanded={expandedCrypto === balance.asset}
                onToggle={() => onToggleCrypto(balance.asset)}
                withdrawalForm={withdrawalForms[balance.asset]}
                onUpdateForm={(field, value) => onUpdateWithdrawalForm(balance.asset, field, value)}
                onGetQuote={() => onGetQuote(balance.asset)}
                activeQuote={activeQuotes[balance.asset]}
                onTransactFunds={() => onTransactFunds(balance.asset)}
                isGettingQuote={isGettingQuote}
                isTransacting={isTransacting}
              />
            ))}
          </div>
        </div>
      )}

      {/* Balances without networks (non-withdrawable) */}
      {balancesWithoutNetworks.length > 0 && (
        <div>
          <h4 style={{ 
            marginTop: 0, 
            marginBottom: "0.75rem", 
            color: "#6c757d", 
            fontSize: "1rem",
            fontWeight: "600"
          }}>
            Non-Withdrawable Assets ({balancesWithoutNetworks.length})
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {balancesWithoutNetworks.map((balance) => (
              <CryptoBalance
                key={balance.asset}
                crypto={balance.asset}
                amount={balance.amount}
                networks={balance.networks || []}
                isExpanded={expandedCrypto === balance.asset}
                onToggle={() => onToggleCrypto(balance.asset)}
                withdrawalForm={withdrawalForms[balance.asset]}
                onUpdateForm={(field, value) => onUpdateWithdrawalForm(balance.asset, field, value)}
                onGetQuote={() => onGetQuote(balance.asset)}
                activeQuote={activeQuotes[balance.asset]}
                onTransactFunds={() => onTransactFunds(balance.asset)}
                isGettingQuote={isGettingQuote}
                isTransacting={isTransacting}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}