import React from 'react';
import { WithdrawalForm } from './WithdrawalForm';
import { WithdrawalQuote } from './WithdrawalQuote';
import { Network } from '../types/wallet';

interface CryptoBalanceProps {
  crypto: string;
  amount: number;
  networks: Network[];
  isExpanded: boolean;
  onToggle: () => void;
  withdrawalForm?: { amount: string; destinationAddress: string; twoFactorCode: string; selectedNetwork?: string };
  onUpdateForm: (field: 'amount' | 'destinationAddress' | 'twoFactorCode' | 'selectedNetwork', value: string) => void;
  onGetQuote: () => void;
  activeQuote?: any;
  onTransactFunds: () => void;
  isGettingQuote: boolean;
  isTransacting: boolean;
}

export function CryptoBalance({
  crypto,
  amount,
  networks,
  isExpanded,
  onToggle,
  withdrawalForm,
  onUpdateForm,
  onGetQuote,
  activeQuote,
  onTransactFunds,
  isGettingQuote,
  isTransacting
}: CryptoBalanceProps) {
  // Check if balance is sufficient for withdrawal
  const minWithdrawal = networks.length > 0 ? Math.min(...networks.map(n => parseFloat(n.minWithdrawal))) : 0;
  const isInsufficientBalance = networks.length > 0 && amount < minWithdrawal;
  const hasNetworks = networks.length > 0;
  return (
    <div>
      <button
        onClick={onToggle}
        disabled={isInsufficientBalance}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          backgroundColor: isInsufficientBalance ? "#000000" : "#000",
          border: `1px solid ${isInsufficientBalance ? "#000000" : "#000000"}`,
          borderRadius: "0.25rem",
          cursor: isInsufficientBalance ? "not-allowed" : "pointer",
          fontSize: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "background-color 0.2s",
          opacity: isInsufficientBalance ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isInsufficientBalance) {
            e.currentTarget.style.backgroundColor = "#000";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isInsufficientBalance ? "#000" : "#000";
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <span style={{ 
            fontWeight: "bold",
            color: isInsufficientBalance ? "#6c757d" : "white"
          }}>
            {crypto}
          </span>
          {isInsufficientBalance && (
            <span style={{ 
              fontSize: "0.75rem", 
              color: "#dc3545",
              marginTop: "0.25rem"
            }}>
              Insufficient balance (min: {minWithdrawal})
            </span>
          )}
        </div>
        <span style={{
          color: isInsufficientBalance ? "#6c757d" : "white"
        }}>
          {typeof amount === 'number' ? amount.toFixed(8) : amount}
        </span>
      </button>
      
      {isExpanded && (
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#000",
            border: "1px solid #000000",
            borderTop: "none",
            borderRadius: "0 0 0.25rem 0.25rem",
            marginTop: "-1px",
          }}
        >
          <div>
            <h4 style={{ marginTop: 0, marginBottom: "1rem" }}>Withdraw {crypto}</h4>
            
            {isInsufficientBalance ? (
              <div style={{
                padding: "1rem",
                backgroundColor: "#000000",
                border: "1px solid #f5c6cb",
                borderRadius: "0.25rem",
                color: "#721c24",
                textAlign: "center"
              }}>
                <strong>Insufficient Balance</strong>
                <br />
                You have {amount.toFixed(8)} {crypto}, but the minimum withdrawable amount is {minWithdrawal} {crypto}.
              </div>
            ) : (
              <>
                <WithdrawalForm
                  crypto={crypto}
                  ownedAmount={amount}
                  form={withdrawalForm}
                  networks={networks}
                  onUpdateForm={onUpdateForm}
                  onGetQuote={onGetQuote}
                  isGettingQuote={isGettingQuote}
                />
                
                {activeQuote && (
                  <WithdrawalQuote
                    crypto={crypto}
                    quote={activeQuote}
                    twoFactorCode={withdrawalForm?.twoFactorCode || ''}
                    onUpdateTwoFactorCode={(value) => onUpdateForm('twoFactorCode', value)}
                    onTransactFunds={onTransactFunds}
                    isTransacting={isTransacting}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}