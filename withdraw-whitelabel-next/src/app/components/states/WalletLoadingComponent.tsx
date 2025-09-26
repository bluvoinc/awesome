import React from 'react';

export function WalletLoadingComponent() {
  return (
    <div className="cb-card" style={{ 
      textAlign: 'center',
      maxWidth: '480px',
      margin: '0 auto'
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px',
        lineHeight: '1'
      }}>💳</div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '8px',
        color: 'var(--cb-text-primary)'
      }}>Loading Wallet</h2>
      <p style={{
        fontSize: '16px',
        color: 'var(--cb-text-secondary)',
        marginBottom: '24px'
      }}>Loading your wallet balances...</p>
      <div style={{ marginBottom: '24px' }}>
        <div className="spinner"></div>
      </div>
    </div>
  );
}