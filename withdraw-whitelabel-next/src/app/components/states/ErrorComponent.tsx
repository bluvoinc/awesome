import React from 'react';

interface ErrorComponentProps {
  error: Error;
  onRetry?: () => void;
  onCancel: () => void;
  canRetry?: boolean;
}

export function ErrorComponent({ error, onRetry, onCancel, canRetry = false }: ErrorComponentProps) {
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
      }}>❌</div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '8px',
        color: 'var(--cb-text-primary)',
        textAlign: 'center'
      }}>Error Occurred</h2>
      <div style={{
        padding: '16px',
        backgroundColor: 'var(--cb-background-secondary)',
        borderRadius: '8px',
        marginBottom: '24px',
        border: '1px solid var(--cb-border)',
        fontFamily: 'var(--cb-font-family)',
        fontSize: '14px',
        color: 'var(--cb-error)'
      }}>
        {error?.message}
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        {canRetry && onRetry && (
          <button
            onClick={onRetry}
            style={{
              flex: 1,
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: '500',
              backgroundColor: 'var(--cb-warning)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'var(--cb-transition)'
            }}
          >
            Retry
          </button>
        )}
        <button
          onClick={onCancel}
          style={{
            flex: canRetry ? 1 : 2,
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            backgroundColor: 'var(--cb-background)',
            color: 'var(--cb-error)',
            border: '1px solid var(--cb-error)',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'var(--cb-transition)'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}