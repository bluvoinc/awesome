import React from 'react';

interface StartFlowComponentProps {
  onStartFlow: () => void;
  isLoading?: boolean;
}

export function StartFlowComponent({ onStartFlow, isLoading }: StartFlowComponentProps) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Start Withdrawal Flow</h2>
      <p>Click the button below to begin the crypto withdrawal process.</p>
      <button
        onClick={onStartFlow}
        disabled={isLoading}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? 'Starting...' : 'Start Withdrawal Flow'}
      </button>
    </div>
  );
}