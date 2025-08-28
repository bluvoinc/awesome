import React from 'react';

export function WalletLoadingComponent() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      backgroundColor: '#000',
      borderRadius: '0.5rem',
      border: '1px solid #ffc107'
    }}>
      <h2>💳 Loading Wallet</h2>
      <p>Loading your wallet balances...</p>
      <div style={{ margin: '1rem 0' }}>
        <div className="spinner" style={{
          display: 'inline-block',
          width: '20px',
          height: '20px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #ffc107',
          borderRadius: '50%',
          animation: 'spin 2s linear infinite'
        }}></div>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}