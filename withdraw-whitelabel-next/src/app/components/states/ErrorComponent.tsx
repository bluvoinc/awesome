import React from 'react';

interface ErrorComponentProps {
  error: Error;
  onRetry?: () => void;
  onCancel: () => void;
  canRetry?: boolean;
}

export function ErrorComponent({ error, onRetry, onCancel, canRetry = false }: ErrorComponentProps) {
  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#000000',
      borderRadius: '0.5rem',
      border: '1px solid #dc3545'
    }}>
      <h2>❌ Error Occurred</h2>
      <div style={{
        padding: '1rem',
        backgroundColor: 'black',
        borderRadius: '0.25rem',
        margin: '1rem 0',
        border: '1px solid #000000',
        fontFamily: 'monospace',
        fontSize: '0.9rem'
      }}>
        {error?.message}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {canRetry && onRetry && (
          <button
            onClick={onRetry}
            style={{
              flex: 1,
              padding: '0.75rem',
              fontSize: '1rem',
              backgroundColor: '#ffc107',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        )}
        <button
          onClick={onCancel}
          style={{
            flex: canRetry ? 1 : 2,
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}