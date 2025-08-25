import React from 'react';
import { ExpirationCountdown } from './ExpirationCountdown';

interface WithdrawalQuoteProps {
  crypto: string;
  quote: {
    amount: number;
    estimatedFee: number;
      estimatedTotal: number;
    destinationAddress: string;
    expiresAt: string;
  };
  twoFactorCode: string;
  onUpdateTwoFactorCode: (value: string) => void;
  onTransactFunds: () => void;
  isTransacting: boolean;
}

export function WithdrawalQuote({
  crypto,
  quote,
  twoFactorCode,
  onUpdateTwoFactorCode,
  onTransactFunds,
  isTransacting
}: WithdrawalQuoteProps) {
  const isValidCode = twoFactorCode.length >= 6;

  return (
    <div 
      style={{ 
        marginTop: "1rem", 
        padding: "1rem", 
        backgroundColor: "#000",
        border: "1px solid #b3d9ff",
        borderRadius: "0.25rem"
      }}
    >
      <h5 style={{ marginTop: 0, marginBottom: "0.75rem", color: "#004085" }}>
        Withdrawal Quote
      </h5>
      <div style={{ fontSize: "0.875rem", lineHeight: "1.6" }}>
        <div style={{ marginBottom: "0.5rem" }}>
          <strong>Amount:</strong> {quote.amount} {crypto}
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <strong>Network Fee:</strong> {quote.estimatedFee} {crypto}
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <strong>Total Deduction:</strong> {quote.estimatedTotal} {crypto}
        </div>
        <div style={{ marginBottom: "0.5rem" }}>
          <strong>Destination:</strong>
          <div style={{ 
            fontSize: "0.75rem", 
            wordBreak: "break-all",
            marginTop: "0.25rem"
          }}>
            {quote.destinationAddress}
          </div>
        </div>
        <ExpirationCountdown expiresAt={quote.expiresAt} />
        
        <div style={{ 
          borderTop: "1px solid #b3d9ff", 
          paddingTop: "1rem",
          marginTop: "1rem" 
        }}>
          <label 
            htmlFor={`2fa-${crypto}`}
            style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}
          >
            Enter 2FA Code:
          </label>
          <input
            id={`2fa-${crypto}`}
            type="text"
            placeholder="000000"
            maxLength={7}
            value={twoFactorCode}
            onChange={(e) => onUpdateTwoFactorCode(e.target.value.replace(/\D/g, ''))}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ced4da",
              borderRadius: "0.25rem",
              fontSize: "0.875rem",
              marginBottom: "0.75rem"
            }}
          />
          <button
            onClick={onTransactFunds}
            disabled={!isValidCode || isTransacting}
            style={{
              width: "100%",
              padding: "0.5rem 1rem",
              backgroundColor: !isValidCode ? "#6c757d" : isTransacting ? "#6c757d" : "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "0.25rem",
              cursor: (!isValidCode || isTransacting) ? "not-allowed" : "pointer",
              fontSize: "0.875rem",
              fontWeight: "500"
            }}
          >
            {isTransacting ? "Processing..." : "Transact Funds"}
          </button>
        </div>
      </div>
    </div>
  );
}