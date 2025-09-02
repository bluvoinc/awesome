import React from 'react';

interface Withdrawal {
  id: string;
  status: string;
  transactionId?: string;
}

interface WithdrawalCompletedComponentProps {
  withdrawal: Withdrawal;
  onStartNew: () => void;
}

export function WithdrawalCompletedComponent({ 
  withdrawal, 
  onStartNew 
}: WithdrawalCompletedComponentProps) {
  return (
    <div style={{ 
      padding: '2rem',
      backgroundColor: '#000',
      borderRadius: '0.5rem',
      border: '1px solid #28a745',
      textAlign: 'center'
    }}>
      <h2>🎉 Withdrawal Completed Successfully!</h2>
      <div style={{ 
        padding: '1rem',
        borderRadius: '0.25rem',
        margin: '1rem 0',
        border: '1px solid #000000'
      }}>
        {withdrawal.transactionId && (
          <div style={{ marginBottom: '0.5rem' }}>
            <strong>Transaction ID:</strong> {withdrawal.transactionId}
          </div>
        )}
        <div>
          <strong>Status:</strong> {withdrawal.status}
        </div>
      </div>
      <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>
        Your withdrawal has been processed successfully. 
        Please check your destination wallet for the transferred funds.
      </p>
      <button
        onClick={onStartNew}
        style={{
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Start New Withdrawal
      </button>
    </div>
  );
}