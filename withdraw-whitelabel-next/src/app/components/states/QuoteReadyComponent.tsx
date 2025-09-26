import React, { useState, useEffect } from 'react';
import { ExpiresInComponent } from '../common/ExpiresInComponent';

interface Quote {
  id: string;
  asset: string;
  amount: string;
  estimatedFee: string;
  estimatedTotal: string;

    amountWithFeeInFiat: string;
    amountNoFeeInFiat: string;
    estimatedFeeInFiat: string;
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
    <div className="cb-card" style={{ 
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px',
        lineHeight: '1',
        textAlign: 'center'
      }}>💰</div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '16px',
        color: 'var(--cb-text-primary)',
        textAlign: 'center'
      }}>Withdrawal Quote Ready</h2>
      <div style={{ 
        backgroundColor: 'var(--cb-background-secondary)',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ 
            fontSize: '14px',
            color: 'var(--cb-text-tertiary)',
            display: 'block',
            marginBottom: '4px'
          }}>Asset</span>
          <span style={{ 
            fontSize: '16px',
            color: 'var(--cb-text-primary)',
            fontWeight: '500'
          }}>{quote.asset}</span>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ 
            fontSize: '14px',
            color: 'var(--cb-text-tertiary)',
            display: 'block',
            marginBottom: '4px'
          }}>Amount</span>
          <span style={{ 
            fontSize: '16px',
            color: 'var(--cb-text-primary)',
            fontWeight: '500'
          }}>{quote.amount}</span>
          <span style={{ 
            fontSize: '14px',
            color: 'var(--cb-text-secondary)',
            marginLeft: '8px'
          }}>(${quote.amountNoFeeInFiat} without fee, ${quote.amountWithFeeInFiat} with fee)</span>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ 
            fontSize: '14px',
            color: 'var(--cb-text-tertiary)',
            display: 'block',
            marginBottom: '4px'
          }}>Fee</span>
          <span style={{ 
            fontSize: '16px',
            color: 'var(--cb-text-primary)',
            fontWeight: '500'
          }}>{quote.estimatedFee}</span>
          <span style={{ 
            fontSize: '14px',
            color: 'var(--cb-text-secondary)',
            marginLeft: '8px'
          }}>(${quote.estimatedFeeInFiat})</span>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <span style={{ 
            fontSize: '14px',
            color: 'var(--cb-text-tertiary)',
            display: 'block',
            marginBottom: '4px'
          }}>Total</span>
          <span style={{ 
            fontSize: '16px',
            color: 'var(--cb-text-primary)',
            fontWeight: '500'
          }}>{quote.estimatedTotal}</span>
          <span style={{ 
            fontSize: '14px',
            color: 'var(--cb-text-secondary)',
            marginLeft: '8px'
          }}>(${quote.amountWithFeeInFiat})</span>
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
          width: '100%',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '500',
          backgroundColor: expiresIn <= 0 ? 'var(--cb-text-tertiary)' : 'var(--cb-success)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: (isExecuting || expiresIn <= 0) ? 'not-allowed' : 'pointer',
          transition: 'var(--cb-transition)',
          opacity: (isExecuting || expiresIn <= 0) ? '0.5' : '1'
        }}
      >
        {isExecuting ? 'Executing...' : expiresIn <= 0 ? 'Quote Expired' : 'Execute Withdrawal'}
      </button>
    </div>
  );
}