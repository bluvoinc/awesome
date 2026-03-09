'use client';

import React from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
    url: string;
    size?: number;
}

type QRState = 'loading' | 'ready' | 'error';

export function QRCodeDisplay({ url, size = 200 }: QRCodeDisplayProps) {
    const [state, setState] = React.useState<QRState>('loading');
    const [dataUrl, setDataUrl] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const generateQRCode = React.useCallback(async () => {
        setState('loading');
        setError(null);

        try {
            // Generate data URL for visual display
            const qrDataUrl = await QRCode.toDataURL(url, {
                width: size,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                }
            });
            setDataUrl(qrDataUrl);
            setState('ready');

            // Also print ASCII QR code to console as fallback
            const asciiQR = await QRCode.toString(url, {
                type: 'terminal',
                small: true
            });
            console.log('\n--- QR Code (scan with exchange app) ---');
            console.log(asciiQR);
            console.log('URL:', url);
            console.log('--- End QR Code ---\n');
        } catch (err) {
            console.error('Failed to generate QR code:', err);
            setError(err instanceof Error ? err.message : 'Failed to generate QR code');
            setState('error');

            // Even on error, try to log the URL to console
            console.log('QR Code URL (copy manually):', url);
        }
    }, [url, size]);

    React.useEffect(() => {
        generateQRCode();
    }, [generateQRCode]);

    if (state === 'loading') {
        return (
            <div style={{
                width: size,
                height: size,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: '8px'
            }}>
                <div style={{
                    display: 'inline-block',
                    width: '24px',
                    height: '24px',
                    border: '3px solid #e5e7eb',
                    borderTop: '3px solid #3b82f6',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div style={{
                width: size,
                height: size,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>
                    ⚠️
                </div>
                <p style={{
                    fontSize: '12px',
                    color: '#ef4444',
                    marginBottom: '8px'
                }}>
                    {error || 'QR code failed'}
                </p>
                <button
                    onClick={generateQRCode}
                    style={{
                        padding: '6px 12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                >
                    Retry
                </button>
                <p style={{
                    fontSize: '10px',
                    color: '#6b7280',
                    marginTop: '8px'
                }}>
                    Check console for URL
                </p>
            </div>
        );
    }

    return (
        <img
            src={dataUrl || ''}
            alt="QR Code"
            style={{
                width: size,
                height: size,
                display: 'block'
            }}
        />
    );
}
