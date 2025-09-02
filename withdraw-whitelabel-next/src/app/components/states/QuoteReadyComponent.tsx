import React, { useState, useEffect } from 'react';
import { ExpiresInComponent } from '../common/ExpiresInComponent';

interface Quote {
  id: string;
  asset: string;
  amount: string;
  estimatedFee: string;
  estimatedTotal: string;
  expiresAt: number;
}

interface QuoteReadyComponentProps {
  quote: Quote;
  onExecuteWithdrawal: () => void;
  isExecuting?: boolean;
}

export function QuoteReadyComponent({ quote, onExecuteWithdrawal, isExecuting }: QuoteReadyComponentProps) {
  const [expiresIn, setExpiresIn] = useState(() => 
    Math.max(0, Math.round((quote.expiresAt - Date.now()) / 1000))
  );

  // Update expiresIn for button state
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeRemaining = Math.max(0, Math.round((quote.expiresAt - Date.now()) / 1000));
      setExpiresIn(newTimeRemaining);
      
      if (newTimeRemaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [quote.expiresAt]);
  
  return (
    <div style={{ 
      padding: '1.5rem',
      backgroundColor: '#000000',
      borderRadius: '0.5rem',
      border: '1px solid #28a745'
    }}>
      <h2>💰 Withdrawal Quote Ready</h2>
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Asset:</strong> {quote.asset}
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Amount:</strong> {quote.amount}
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Fee:</strong> {quote.estimatedFee}
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Total:</strong> {quote.estimatedTotal}
        </div>
        <ExpiresInComponent 
          expiresAt={quote.expiresAt}
          label="Expires in:"
          size="normal"
          showIcon={true}
        />
      </div>
      <button
        onClick={onExecuteWithdrawal}
        disabled={isExecuting || expiresIn <= 0}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: expiresIn <= 0 ? '#000' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: (isExecuting || expiresIn <= 0) ? 'not-allowed' : 'pointer',
          width: '100%'
        }}
      >
        {isExecuting ? 'Executing...' : expiresIn <= 0 ? 'Quote Expired' : 'Execute Withdrawal'}
      </button>
    </div>
  );
}