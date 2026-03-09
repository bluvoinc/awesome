import React, {useState, useEffect, useCallback, useRef} from 'react';
import { ExpiresInComponent } from '../common/ExpiresInComponent';
import { QRCodeDisplay } from '../QRCodeDisplay';

interface MultiStep2FAStep {
  type: 'GOOGLE' | 'EMAIL' | 'FACE' | 'SMS';
  status: 'pending' | 'success' | 'failed';
  required: boolean;
  metadata?: {
    email?: string;
    emailSent?: boolean;
    qrCodeUrl?: string;
    qrCodeValidSeconds?: number;
  };
}

interface MfaVerified {
  GOOGLE?: boolean;
  EMAIL?: boolean;
  FACE?: boolean;
  SMS?: boolean;
}

interface MultiStep2FAComponentProps {
  steps: MultiStep2FAStep[];
  relation: 'AND' | 'OR';
  onSubmitCode: (stepType: 'GOOGLE' | 'EMAIL' | 'SMS', code: string) => void;
  onPollFaceVerification: () => void;
  onConfirm?: () => void;
  isSubmitting?: boolean;
  isReadyToConfirm?: boolean;
  faceQrCodeUrl?: string;
  faceQrCodeExpiresAt?: number;
  expiresAt?: number;
  collectedCodes?: {
    twofa?: string;
    emailCode?: string;
    smsCode?: string;
  };
  mfaVerified?: MfaVerified;
}

// Status badge component
function StepStatusBadge({ status }: { status: 'pending' | 'success' | 'failed' }) {
  const styles: Record<string, React.CSSProperties> = {
    pending: {
      backgroundColor: '#3d3d00',
      color: '#ffc107',
      border: '1px solid #ffc107',
    },
    success: {
      backgroundColor: '#1a3d1a',
      color: '#28a745',
      border: '1px solid #28a745',
    },
    failed: {
      backgroundColor: '#3d1a1a',
      color: '#dc3545',
      border: '1px solid #dc3545',
    },
  };

  const icons: Record<string, string> = {
    pending: '⏳',
    success: '✓',
    failed: '✗',
  };

  return (
    <span style={{
      ...styles[status],
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: '600',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Step type icon
function StepTypeIcon({ type }: { type: 'GOOGLE' | 'EMAIL' | 'FACE' | 'SMS' }) {
  const icons: Record<string, string> = {
    GOOGLE: '🔐',
    EMAIL: '📧',
    FACE: '📱',
    SMS: '💬',
  };
  return <span style={{ fontSize: '1.5rem' }}>{icons[type]}</span>;
}

// Individual step input component
function StepInput({
  step,
  onSubmit,
  isSubmitting,
  collectedCode,
  verificationFailed,
}: {
  step: MultiStep2FAStep;
  onSubmit: (code: string) => void;
  isSubmitting?: boolean;
  collectedCode?: string;
  verificationFailed?: boolean;
}) {
  const [code, setCode] = useState(collectedCode || '');

  // Don't show input for FACE type (handled separately with QR code)
  if (step.type === 'FACE') return null;

  // Don't show input for verified steps
  if (step.status === 'success') {
    return (
      <div style={{
        padding: '0.75rem',
        backgroundColor: '#1a3d1a',
        borderRadius: '0.5rem',
        border: '1px solid #28a745',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      }}>
        <span style={{ color: '#28a745' }}>✓</span>
        <span style={{ color: '#28a745' }}>Verified</span>
      </div>
    );
  }

  const placeholder = step.type === 'GOOGLE'
    ? 'Enter authenticator code (6 digits)'
    : step.type === 'EMAIL'
    ? 'Enter email verification code'
    : 'Enter SMS code';

  const maxLength = step.type === 'GOOGLE' ? 6 : 10;
  const minLength = step.type === 'GOOGLE' ? 6 : 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length >= minLength) {
      onSubmit(code);
    }
  };

  // Determine if we should show error styling (verification failed or step failed)
  const showError = verificationFailed || step.status === 'failed';

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          placeholder={placeholder}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={maxLength}
          style={{
            flex: 1,
            padding: '0.5rem 0.75rem',
            fontSize: '1rem',
            textAlign: 'center',
            letterSpacing: '0.1em',
            border: showError ? '2px solid #dc3545' : '1px solid #ffc107',
            borderRadius: '0.25rem',
            backgroundColor: showError ? '#2d1b1b' : '#1a1a1a',
            color: 'white',
          }}
        />
        <button
          type="submit"
          disabled={code.length < minLength || isSubmitting}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            backgroundColor: code.length < minLength ? '#333333' : '#ffc107',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: (code.length < minLength || isSubmitting) ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? '...' : 'Submit'}
        </button>
      </div>
      {verificationFailed && (
        <p style={{ fontSize: '0.8rem', color: '#dc3545', marginTop: '0.25rem' }}>
          Invalid code. Please try again.
        </p>
      )}
      {step.type === 'EMAIL' && step.metadata?.email && (
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>
          Code sent to: {step.metadata.email}
        </p>
      )}
    </form>
  );
}

// Helper to get step verification status using mfaVerified as PRIMARY source
function isStepVerified(step: MultiStep2FAStep, mfaVerified?: MfaVerified): boolean {
  // Use mfa.verified as PRIMARY source of truth
  if (mfaVerified && mfaVerified[step.type] === true) {
    return true;
  }
  // Fallback to step status
  return step.status === 'success';
}

// Helper to detect verification failure (wrong code submitted)
function isStepVerificationFailed(stepType: 'GOOGLE' | 'EMAIL' | 'FACE' | 'SMS', mfaVerified?: MfaVerified): boolean {
  return mfaVerified?.[stepType] === false;
}

export function MultiStep2FAComponent({
                                          steps,
                                          relation,
                                          onSubmitCode,
                                          onPollFaceVerification,
                                          onConfirm,
                                          isSubmitting,
                                          isReadyToConfirm,
                                          faceQrCodeUrl,
                                          faceQrCodeExpiresAt,
                                          expiresAt,
                                          collectedCodes,
                                          mfaVerified,
                                      }: MultiStep2FAComponentProps) {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isPollingRef = useRef(false);
    const isActiveRef = useRef(false);

    // Use mfaVerified as PRIMARY source for FACE step status
    const isFaceVerified = mfaVerified?.FACE === true || steps.find(s => s.type === 'FACE')?.status === 'success';
    const faceStepPending = steps.find(s => s.type === 'FACE' && s.status === 'pending');

    const shouldPoll = !isFaceVerified &&
        faceStepPending &&
        faceQrCodeUrl;

    // Use mfaVerified as PRIMARY source for verified count
    const verifiedCount = steps.filter(s => isStepVerified(s, mfaVerified)).length;
    const totalSteps = steps.length;

    const stopPolling = useCallback(() => {
        isActiveRef.current = false;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const poll = useCallback(async () => {
        if (!isActiveRef.current) return;
        if (isPollingRef.current) return; // prevent concurrency

        try {
            isPollingRef.current = true;
            await onPollFaceVerification();
        } finally {
            isPollingRef.current = false;
        }

        if (!isActiveRef.current) return;

        timeoutRef.current = setTimeout(poll, 5000);
    }, [onPollFaceVerification]);

    useEffect(() => {
        if (!shouldPoll) {
            stopPolling();
            return;
        }

        isActiveRef.current = true;

        // initial 10 second delay
        timeoutRef.current = setTimeout(() => {
            poll();
        }, 10000);

        return stopPolling;
    }, [shouldPoll, poll, stopPolling]);

  return (
    <div style={{
      padding: '1.5rem',
      backgroundColor: '#000000',
      borderRadius: '0.5rem',
      border: '1px solid #ffc107',
      color: 'white',
    }}>
      <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>
        🔐 Multi-Step Verification Required
      </h2>

      <p style={{ color: '#aaa', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Complete {relation === 'AND' ? 'all' : 'one of'} the following verification steps:
      </p>

      {/* Progress indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        padding: '0.5rem',
        backgroundColor: '#1a1a1a',
        borderRadius: '0.25rem',
      }}>
        <div style={{
          flex: 1,
          height: '4px',
          backgroundColor: '#333',
          borderRadius: '2px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${(verifiedCount / totalSteps) * 100}%`,
            height: '100%',
            backgroundColor: '#28a745',
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{ fontSize: '0.8rem', color: '#888' }}>
          {verifiedCount}/{totalSteps} verified
        </span>
      </div>

      {/* Quote expiration */}
      {expiresAt && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '0.25rem',
          border: '1px solid #444',
        }}>
          <ExpiresInComponent
            expiresAt={expiresAt}
            label="Quote expires in:"
            size="small"
            showIcon={true}
          />
        </div>
      )}

      {/* Steps list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {steps.map((step, index) => {
          // Use mfaVerified as PRIMARY source for step status
          const verified = isStepVerified(step, mfaVerified);
          const effectiveStatus = verified ? 'success' : step.status;

          return (
            <div
              key={step.type}
              style={{
                padding: '1rem',
                backgroundColor: '#111',
                borderRadius: '0.5rem',
                border: effectiveStatus === 'success'
                  ? '1px solid #28a745'
                  : effectiveStatus === 'failed'
                  ? '1px solid #dc3545'
                  : '1px solid #444',
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <StepTypeIcon type={step.type} />
                  <span style={{ fontWeight: '600' }}>
                    {step.type === 'GOOGLE' && 'Authenticator App'}
                    {step.type === 'EMAIL' && 'Email Verification'}
                    {step.type === 'FACE' && 'Face Recognition'}
                    {step.type === 'SMS' && 'SMS Verification'}
                  </span>
                  {step.required && (
                    <span style={{
                      fontSize: '0.7rem',
                      color: '#888',
                      backgroundColor: '#222',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}>
                      Required
                    </span>
                  )}
                </div>
                <StepStatusBadge status={effectiveStatus} />
              </div>

              {/* FACE step with QR code - only show if not verified */}
              {step.type === 'FACE' && !verified && faceQrCodeUrl && (
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    Scan this QR code with your exchange app to verify your identity
                  </p>
                  <div style={{
                    margin: '0.5rem auto',
                    padding: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    display: 'inline-block',
                  }}>
                    <QRCodeDisplay url={faceQrCodeUrl} size={150} />
                  </div>
                  {faceQrCodeExpiresAt && (
                    <FaceQRCodeCountdown expiresAt={faceQrCodeExpiresAt} />
                  )}
                  <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    Auto-checking every 3 seconds...
                  </p>
                </div>
              )}

              {/* Code input for non-FACE steps - only show if not verified */}
              {step.type !== 'FACE' && !verified && (
                <StepInput
                  step={step}
                  onSubmit={(code) => onSubmitCode(step.type as 'GOOGLE' | 'EMAIL' | 'SMS', code)}
                  isSubmitting={isSubmitting}
                  collectedCode={
                    step.type === 'GOOGLE' ? collectedCodes?.twofa
                    : step.type === 'EMAIL' ? collectedCodes?.emailCode
                    : collectedCodes?.smsCode
                  }
                  verificationFailed={isStepVerificationFailed(step.type, mfaVerified)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Confirm Withdrawal Button - shown when all steps are verified */}
      {isReadyToConfirm && onConfirm && (
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: '#1a3d1a',
            borderRadius: '0.5rem',
            border: '1px solid #28a745',
            marginBottom: '1rem',
          }}>
            <p style={{ color: '#28a745', margin: 0, fontWeight: '600' }}>
              ✓ All verification steps completed!
            </p>
          </div>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              backgroundColor: isSubmitting ? '#333' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
            }}
          >
            {isSubmitting ? 'Processing...' : '✓ Confirm Withdrawal'}
          </button>
        </div>
      )}
    </div>
  );
}

// Simple countdown for FACE QR code
function FaceQRCodeCountdown({ expiresAt }: { expiresAt: number }) {
  const [timeLeft, setTimeLeft] = useState<number>(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <p style={{
      fontSize: '0.8rem',
      color: timeLeft < 30 ? '#dc3545' : '#888',
      marginTop: '0.25rem',
    }}>
      QR code expires in {minutes}:{seconds.toString().padStart(2, '0')}
    </p>
  );
}
