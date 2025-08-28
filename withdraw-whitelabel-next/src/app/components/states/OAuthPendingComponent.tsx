import React from 'react';

interface OAuthPendingComponentProps {
  onCancel: () => void;
}

export function OAuthPendingComponent({ onCancel }: OAuthPendingComponentProps) {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      backgroundColor: '#000000',
      borderRadius: '0.5rem',
      border: '1px solid #2196f3'
    }}>
      <h2>🔐 OAuth Authentication</h2>
      <p>Please complete the authentication in the popup window...</p>
      <div style={{ margin: '1rem 0' }}>
        <div className="spinner" style={{
          display: 'inline-block',
          width: '20px',
          height: '20px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #2196f3',
          borderRadius: '50%',
          animation: 'spin 2s linear infinite'
        }}></div>
      </div>
      <button
        onClick={onCancel}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: 'pointer'
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