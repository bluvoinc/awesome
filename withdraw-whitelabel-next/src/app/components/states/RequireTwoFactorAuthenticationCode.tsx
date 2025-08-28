import React, { useState } from 'react';

interface RequireTwoFactorAuthenticationCodeProps {
  onSubmit2FA: (code: string) => void;
  isSubmitting?: boolean;
}

export function RequireTwoFactorAuthenticationCode({ 
  onSubmit2FA, 
  isSubmitting 
}: RequireTwoFactorAuthenticationCodeProps) {
  const [twoFACode, setTwoFACode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFACode.length >= 6) {
      onSubmit2FA(twoFACode);
    }
  };

  return (
    <div style={{ 
      padding: '1.5rem',
      backgroundColor: '#fff3cd',
      borderRadius: '0.5rem',
      border: '1px solid #ffc107'
    }}>
      <h2>🔐 Two-Factor Authentication Required</h2>
      <p>Please enter your 2FA authentication code to continue:</p>
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
            border: '1px solid #000000',
            borderRadius: '0.25rem',
            marginBottom: '1rem'
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
            backgroundColor: twoFACode.length < 6 ? '#000' : '#ffc107',
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