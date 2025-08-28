import React, { useState } from 'react';

interface RequireSMSCodeProps {
  onSubmitSMS: (code: string) => void;
  isSubmitting?: boolean;
}

export function RequireSMSCode({ onSubmitSMS, isSubmitting }: RequireSMSCodeProps) {
  const [smsCode, setSmsCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (smsCode.trim()) {
      onSubmitSMS(smsCode.trim());
    }
  };

  return (
    <div style={{ 
      padding: '1.5rem',
      backgroundColor: '#000000',
      borderRadius: '0.5rem',
      border: '1px solid #2196f3'
    }}>
      <h2>📱 SMS Verification Required</h2>
      <p>Please enter the verification code sent to your mobile device:</p>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Enter SMS verification code"
          value={smsCode}
          onChange={(e) => setSmsCode(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1.1rem',
            textAlign: 'center',
            border: '1px solid #000000',
            borderRadius: '0.25rem',
            marginBottom: '1rem'
          }}
          autoFocus
        />
        <button
          type="submit"
          disabled={!smsCode.trim() || isSubmitting}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            backgroundColor: !smsCode.trim() ? '#6c757d' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: (!smsCode.trim() || isSubmitting) ? 'not-allowed' : 'pointer'
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit SMS Code'}
        </button>
      </form>
    </div>
  );
}