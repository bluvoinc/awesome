import React from 'react';

interface RequireKYCComponentProps {
  onCancel: () => void;
}

export function RequireKYCComponent({ onCancel }: RequireKYCComponentProps) {
  return (
    <div style={{ 
      padding: '1.5rem',
      backgroundColor: '#000000',
      borderRadius: '0.5rem',
      border: '1px solid #dc3545'
    }}>
      <h2>🆔 KYC Verification Required</h2>
      <p>Your account requires Know Your Customer (KYC) verification before you can proceed with withdrawals.</p>
      <div style={{ 
        padding: '1rem',
        backgroundColor: 'black',
        borderRadius: '0.25rem',
        margin: '1rem 0',
        border: '1px solid #000000'
      }}>
        <h4>Next Steps:</h4>
        <ol style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Visit your exchange platform</li>
          <li>Complete the KYC verification process</li>
          <li>Wait for approval (typically 1-3 business days)</li>
          <li>Return here to retry the withdrawal</li>
        </ol>
      </div>
      <button
        onClick={onCancel}
        style={{
          width: '100%',
          padding: '0.75rem',
          fontSize: '1rem',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
        }}
      >
        Cancel and Return Later
      </button>
    </div>
  );
}