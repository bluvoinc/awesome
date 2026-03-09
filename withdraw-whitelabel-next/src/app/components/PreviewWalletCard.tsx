'use client';

import React from 'react';
import type { WalletPreviewState } from '@bluvo/react';

export interface PreviewWalletCardProps {
    preview: WalletPreviewState;
    onSelect: (walletId: string, exchange: string) => void;
}

/**
 * Preview card for a wallet showing its balance or error state
 */
export function PreviewWalletCard({ preview, onSelect }: PreviewWalletCardProps) {
    const { walletId, exchange, status, balances, error } = preview;

    const isDisabled = status.startsWith('error_');
    const isLoading = status === 'loading';
    const isReady = status === 'ready';

    const handleClick = () => {
        if (!isDisabled && !isLoading) {
            onSelect(walletId, exchange);
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'loading':
                return '⏳';
            case 'ready':
                return '✅';
            case 'error_not_found':
                return '❌';
            case 'error_invalid_credentials':
                return '🔒';
            case 'error_unknown':
                return '⚠️';
            default:
                return '💼';
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'loading':
                return 'Loading wallet...';
            case 'ready':
                return 'Ready to withdraw';
            case 'error_not_found':
                return 'Wallet not found';
            case 'error_invalid_credentials':
                return 'Invalid API credentials';
            case 'error_unknown':
                return error?.message || 'An error occurred';
            default:
                return 'Not loaded';
        }
    };

    const getTotalBalance = () => {
        if (!balances || balances.length === 0) return null;

        const totalInFiat = balances.reduce((sum, b) => {
            const fiat = parseFloat(b.balanceInFiat || '0');
            return sum + fiat;
        }, 0);

        if (totalInFiat > 0) {
            return `$${totalInFiat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        return null;
    };

    return (
        <div
            onClick={handleClick}
            style={{
                padding: '20px',
                border: '1px solid var(--cb-border)',
                borderRadius: '12px',
                backgroundColor: isDisabled ? 'var(--cb-background-secondary)' : 'var(--cb-background)',
                cursor: isDisabled || isLoading ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.6 : 1,
                transition: 'var(--cb-transition)',
                minWidth: '280px',
            }}
            className="preview-wallet-card"
        >
            {/* Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span style={{ fontSize: '24px' }}>{getStatusIcon()}</span>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: 0,
                        textTransform: 'capitalize',
                        color: 'var(--cb-text-primary)'
                    }}>
                        {exchange}
                    </h3>
                </div>
            </div>

            {/* Status Message */}
            <p style={{
                fontSize: '14px',
                color: isReady ? 'var(--cb-success)' : isDisabled ? 'var(--cb-error)' : 'var(--cb-text-secondary)',
                margin: '0 0 12px 0'
            }}>
                {getStatusMessage()}
            </p>

            {/* Balance Display */}
            {isLoading && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--cb-text-secondary)',
                    fontSize: '14px'
                }}>
                    <div style={{
                        display: 'inline-block',
                        width: '14px',
                        height: '14px',
                        border: '2px solid var(--cb-border)',
                        borderTop: '2px solid var(--cb-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Fetching balance...</span>
                </div>
            )}

            {isReady && balances && balances.length > 0 && (
                <div>
                    {/* Total Fiat Balance */}
                    {getTotalBalance() && (
                        <div style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            color: 'var(--cb-primary)',
                            marginBottom: '8px'
                        }}>
                            {getTotalBalance()}
                        </div>
                    )}

                    {/* Asset Balances */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        maxHeight: '120px',
                        overflowY: 'auto'
                    }}>
                        {balances.slice(0, 5).map((balance, idx) => (
                            <div
                                key={idx}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: '13px',
                                    color: 'var(--cb-text-secondary)'
                                }}
                            >
                                <span style={{ fontWeight: '500' }}>{balance.asset}</span>
                                <span>
                                    {parseFloat(balance.balance).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 8
                                    })}
                                    {balance.balanceInFiat && (
                                        <span style={{ marginLeft: '4px', color: 'var(--cb-text-tertiary)' }}>
                                            (${parseFloat(balance.balanceInFiat).toLocaleString(undefined, {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2
                                            })})
                                        </span>
                                    )}
                                </span>
                            </div>
                        ))}
                        {balances.length > 5 && (
                            <div style={{
                                fontSize: '12px',
                                color: 'var(--cb-text-tertiary)',
                                fontStyle: 'italic',
                                marginTop: '4px'
                            }}>
                                +{balances.length - 5} more assets
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Wallet ID (truncated) */}
            <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid var(--cb-border)',
                fontSize: '11px',
                color: 'var(--cb-text-tertiary)',
                fontFamily: 'monospace'
            }}>
                {walletId.slice(0, 8)}...{walletId.slice(-6)}
            </div>

            <style>{`
                .preview-wallet-card:not([style*="cursor: not-allowed"]):hover {
                    border-color: var(--cb-primary);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
}
