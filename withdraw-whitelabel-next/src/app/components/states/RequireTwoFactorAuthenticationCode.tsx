import React, { useState } from 'react';
import { ExpiresInComponent } from '../common/ExpiresInComponent';

interface RequireTwoFactorAuthenticationCodeProps {
  onSubmit2FA: (code: string) => void;
  isSubmitting?: boolean;
  invalid2FAAttempts?: number;
  expiresAt?: number;
}

export function RequireTwoFactorAuthenticationCode({
  onSubmit2FA, 
  isSubmitting,
  invalid2FAAttempts = 0,
  expiresAt
}: RequireTwoFactorAuthenticationCodeProps) {
  const [twoFACode, setTwoFACode] = useState('');
  
  // Clear the input when invalid attempts change (new invalid attempt)
  React.useEffect(() => {
    if (invalid2FAAttempts > 0) {
      setTwoFACode('');
    }
  }, [invalid2FAAttempts]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFACode.length >= 6) {
      onSubmit2FA(twoFACode);
    }
  };

  const hasInvalidAttempts = invalid2FAAttempts > 0;

  return (
    <div style={{ 
      padding: '1.5rem',
      backgroundColor: '#000000',
      borderRadius: '0.5rem',
      border: hasInvalidAttempts ? '1px solid #dc3545' : '1px solid #ffc107',
      color: 'white'
    }}>
      <h2 style={{ color: 'white' }}>🔐 Two-Factor Authentication Required</h2>
      {hasInvalidAttempts && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          backgroundColor: '#2d1b1b',
          border: '1px solid #dc3545',
          borderRadius: '0.25rem',
          color: '#f8d7da'
        }}>
          <strong style={{ color: '#dc3545' }}>❌ Invalid 2FA Code</strong>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#f8d7da' }}>
            The 2FA code you entered is incorrect. Please try again. 
            {invalid2FAAttempts > 1 && ` (${invalid2FAAttempts} failed attempts)`}
          </p>
        </div>
      )}
      <p style={{ color: 'white' }}>Please enter your 2FA authentication code to continue:</p>
      {expiresAt && (
        <div style={{ 
          marginBottom: '1rem', 
          padding: '0.5rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '0.25rem',
          border: '1px solid #444'
        }}>
          <ExpiresInComponent 
            expiresAt={expiresAt}
            label="Quote expires in:"
            size="small"
            showIcon={true}
          />
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Enter 2FA code (6 digits)"
          value={twoFACode}
          onChange={(e) => setTwoFACode(e.target.value)}
          maxLength={6}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1.2rem',
            textAlign: 'center',
            letterSpacing: '0.2em',
            border: hasInvalidAttempts ? '2px solid #dc3545' : '1px solid #ffc107',
            borderRadius: '0.25rem',
            marginBottom: '1rem',
            backgroundColor: hasInvalidAttempts ? '#2d1b1b' : '#1a1a1a',
            color: hasInvalidAttempts ? '#f8d7da' : 'white'
          }}
          autoFocus
        />
        <button
          type="submit"
          disabled={twoFACode.length < 6 || isSubmitting}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: twoFACode.length < 6 ? '#333333' : '#ffc107',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: (twoFACode.length < 6 || isSubmitting) ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit 2FA Code'}
        </button>
      </form>
    </div>
  );
}