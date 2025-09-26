import React from 'react';

interface OAuthPendingComponentProps {
  onCancel: () => void;
}

export function OAuthPendingComponent({ onCancel }: OAuthPendingComponentProps) {
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
      }}>🔐</div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '8px',
        color: 'var(--cb-text-primary)'
      }}>OAuth Authentication</h2>
      <p style={{
        fontSize: '16px',
        color: 'var(--cb-text-secondary)',
        marginBottom: '24px'
      }}>Please complete the authentication in the popup window...</p>
      <div style={{ marginBottom: '24px' }}>
        <div className="spinner" style={{
          display: 'inline-block',
          width: '24px',
          height: '24px',
          border: '2px solid var(--cb-border)',
          borderTop: '2px solid var(--cb-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
      <button
        onClick={onCancel}
        style={{
          padding: '12px 24px',
          backgroundColor: 'var(--cb-background)',
          color: 'var(--cb-error)',
          border: '1px solid var(--cb-error)',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'var(--cb-transition)'
        }}
      >
        Cancel
      </button>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}