"use client";

import React from 'react';
import {
    fetchWithdrawableBalances,
    requestQuotation,
    executeWithdrawal,
    listExchanges
} from '../actions/flowActions';

// State-specific components
import {OAuthPendingComponent} from '../components/states/OAuthPendingComponent';
import {WalletLoadingComponent} from '../components/states/WalletLoadingComponent';
import {WalletReadyComponent} from '../components/states/WalletReadyComponent';
import {QuoteLoadingComponent} from '../components/states/QuoteLoadingComponent';
import {QuoteReadyComponent} from '../components/states/QuoteReadyComponent';
import {RequireTwoFactorAuthenticationCode} from '../components/states/RequireTwoFactorAuthenticationCode';
import {RequireSMSCode} from '../components/states/RequireSMSCode';
import {RequireKYCComponent} from '../components/states/RequireKYCComponent';
import {WithdrawalCompletedComponent} from '../components/states/WithdrawalCompletedComponent';
import {ErrorComponent} from '../components/states/ErrorComponent';
import {StateSimulator} from '../components/StateSimulator';

import styles from '../page.module.css';
import { useBluvoFlow } from "@bluvo/react";

const generateId = () => crypto.randomUUID();

const handleStartNewWithdrawal = () => {
    // Reset by reloading the page (in production, you might want a cleaner reset)
    window.location.reload();
};

export default function Home() {
    const [selectedExchange, setSelectedExchange] = React.useState<string>('');
    const [showOAuthClosedMessage, setShowOAuthClosedMessage] =
        React.useState(false);
    const [useSimulator, setUseSimulator] = React.useState(false);

    // FIXME: ⨯ ReferenceError: localStorage is not defined
    const PREVIOUSLY_CONNECTED_WALLET_ID = "174edb8f-2f6d-4bbc-9cd5-38a453723ed3";

    // Initialize the flow with server action callbacks
    const flow = useBluvoFlow({
        orgId: "imSgZyiY2EsbKboJzbbhMDHcknWB3pfY",
        projectId: "VOPomUho1UWAfLc2To9uCYdcZ2dGDeR7",

        listExchangesFn: listExchanges,
        fetchWithdrawableBalanceFn: fetchWithdrawableBalances,
        requestQuotationFn: requestQuotation,
        executeWithdrawalFn: executeWithdrawal,

        onWalletConnectedFn: (walletId, exchange) => {
            // call server action store this walletId for the currently-logged in user
            console.log("Should store walletId for the user:", walletId, exchange);

            // store the walletId in localStorage for demo purposes
            localStorage.setItem('connectedWalletId', walletId);
            localStorage.setItem('connectedExchange', exchange);
        }
    });

    // Load exchanges on component mount
    React.useEffect(() => {
        const loadExchanges = async () => {
            try {
                await flow.listExchanges('live'); // Only load live exchanges
                // Set default selection to first available exchange
                if (flow.exchanges.length > 0 && !selectedExchange) {
                    setSelectedExchange(flow.exchanges[0].id);
                }
            } catch (error) {
                console.error('Failed to load exchanges:', error);
            }
        };
        loadExchanges();
    }, [flow.exchanges.length, selectedExchange]);

    const handleStartFlow = async () => {
        await flow.startWithdrawalFlow({
            exchange: selectedExchange,
            walletId: generateId(),
            // optional:
            // popupOptions: {
            //     width: 500,
            //     height: 650,
            //     left: window.screenX + (window.outerWidth - 500) / 2,
            //     top: window.screenY + (window.outerHeight - 700) / 2
            // }
        });
    };

    // TODO: add a state "wallet:resuming" to show a loading spinner while resuming invoked by resumeWithdrawalFlow
    const handleResumeFlow = async () => {
        await flow.resumeWithdrawalFlow({
            exchange: selectedExchange,
            walletId: PREVIOUSLY_CONNECTED_WALLET_ID
        });
    };

    // Handle OAuth window closed by user
    React.useEffect(() => {
        if (flow.isOAuthWindowBeenClosedByTheUser) {
            setShowOAuthClosedMessage(true);
            
            // Set timeout to return to default UI after 3 seconds
            const timer = setTimeout(() => {
                setShowOAuthClosedMessage(false);
                flow.cancel(); // Cancel the flow to reset to initial state
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [flow.isOAuthWindowBeenClosedByTheUser, flow]);

    // Function to render the flow UI (used by both real flow and simulator)
    const renderFlowUI = (flowState: typeof flow) => (
        <>
            {/* OAuth Window Closed by User Message */}
            {showOAuthClosedMessage && (
                <div className="cb-card" style={{
                    textAlign: 'center',
                    maxWidth: '480px',
                    margin: '0 auto',
                    border: '1px solid var(--cb-error)',
                    backgroundColor: 'var(--cb-background)'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px',
                        lineHeight: '1'
                    }}>
                        ❌
                    </div>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'var(--cb-text-primary)'
                    }}>
                        OAuth Window Closed
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        color: 'var(--cb-text-secondary)',
                        marginBottom: '16px'
                    }}>
                        You closed the authentication window before completing the process.
                    </p>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--cb-text-tertiary)'
                    }}>
                        Returning to exchange selection in 3 seconds...
                    </p>
                    <div style={{
                        marginTop: '16px',
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        border: '2px solid var(--cb-border)',
                        borderTop: '2px solid var(--cb-error)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
            )}

            {!flowState.state && !showOAuthClosedMessage && (
                <div className="cb-card" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>Withdrawal Widget</h2>
                    <p style={{ color: 'var(--cb-text-secondary)', marginBottom: '32px' }}>Connect your exchange account to withdraw funds</p>
                    
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: '500', color: 'var(--cb-text-secondary)', textAlign: 'left' }}>
                            Exchange
                        </label>
                        {flow.isExchangesLoading ? (
                            <div style={{ color: 'var(--cb-text-tertiary)', fontSize: '14px' }}>Loading exchanges...</div>
                        ) : flow.exchangesError ? (
                            <div style={{ color: 'var(--cb-error)', fontSize: '14px' }}>Error loading exchanges: {flow.exchangesError.message}</div>
                        ) : (
                            <select
                                value={selectedExchange}
                                onChange={(e) => setSelectedExchange(e.target.value)}
                                disabled={flow.exchanges.length === 0}
                                style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    fontSize: '16px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--cb-border)',
                                    backgroundColor: 'var(--cb-background)',
                                    color: 'var(--cb-text-primary)',
                                    cursor: 'pointer',
                                    transition: 'var(--cb-transition)'
                                }}
                            >
                                {flow.exchanges.length === 0 ? (
                                    <option value="">No exchanges available</option>
                                ) : (
                                    flow.exchanges.map((exchange) => (
                                        <option key={exchange.id} value={exchange.id}>
                                            {exchange.name}
                                        </option>
                                    ))
                                )}
                            </select>
                        )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button
                            onClick={handleStartFlow}
                            disabled={!selectedExchange || flow.isExchangesLoading}
                            style={{
                                width: '100%',
                                padding: '16px 24px',
                                backgroundColor: (!selectedExchange || flow.isExchangesLoading) ? 'var(--cb-text-tertiary)' : 'var(--cb-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: (!selectedExchange || flow.isExchangesLoading) ? 'not-allowed' : 'pointer',
                                transition: 'var(--cb-transition)'
                            }}
                        >
                            Start New Withdrawal
                        </button>
                        <button
                            onClick={handleResumeFlow}
                            disabled={!selectedExchange || flow.isExchangesLoading}
                            style={{
                                width: '100%',
                                padding: '16px 24px',
                                backgroundColor: 'var(--cb-background)',
                                color: (!selectedExchange || flow.isExchangesLoading) ? 'var(--cb-text-tertiary)' : 'var(--cb-text-primary)',
                                border: '1px solid var(--cb-border)',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: (!selectedExchange || flow.isExchangesLoading) ? 'not-allowed' : 'pointer',
                                transition: 'var(--cb-transition)'
                            }}
                        >
                            Resume with Existing Wallet
                        </button>
                    </div>
                    <p style={{ marginTop: '16px', fontSize: '12px', color: 'var(--cb-text-tertiary)' }}>
                        Resume uses wallet ID: {PREVIOUSLY_CONNECTED_WALLET_ID.slice(0, 8)}...
                    </p>
                </div>
            )}
            
            {flowState.isOAuthPending && <OAuthPendingComponent onCancel={flowState.cancel} />}
            
            {flowState.isWalletLoading && <WalletLoadingComponent />}
            
            {flowState.isWalletReady && <WalletReadyComponent
                balances={flowState.walletBalances || []}
                onRequestQuote={flowState.requestQuote}
            />}
            
            {flowState.isQuoteLoading && <QuoteLoadingComponent />}
            
            {flowState.isQuoteReady && flowState.quote && (
                <QuoteReadyComponent
                    quote={flowState.quote}
                    onExecuteWithdrawal={() => flowState.executeWithdrawal(flowState.quote!.id)}
                    isExecuting={flowState.isWithdrawing}
                />
            )}
            
            {flowState.isQuoteExpired && (
                <ErrorComponent
                    error={new Error('Quote has expired. Please start a new withdrawal.')}
                    onCancel={handleStartNewWithdrawal}
                />
            )}
            
            {flowState.requires2FA && (
                <RequireTwoFactorAuthenticationCode
                    onSubmit2FA={flowState.submit2FA}
                    isSubmitting={false}
                    invalid2FAAttempts={flowState.invalid2FAAttempts || 0}
                    expiresAt={flowState.quote?.expiresAt}
                />
            )}
            
            {flowState.requiresSMS && (
                <RequireSMSCode
                    onSubmitSMS={flowState.submitSMS}
                    isSubmitting={false}
                />
            )}
            
            {flowState.requiresKYC && <RequireKYCComponent onCancel={flowState.cancel} />}
            
            {flowState.isWithdrawalComplete && flowState.withdrawal && (
                <WithdrawalCompletedComponent
                    withdrawal={flowState.withdrawal}
                    onStartNew={handleStartNewWithdrawal}
                />
            )}

            {flowState.canRetry && (
                <ErrorComponent
                    error={new Error('Withdrawal failed but can be retried')}
                    onRetry={flowState.retryWithdrawal}
                    onCancel={flowState.cancel}
                    canRetry={true}
                />
            )}
            
            {flowState.hasFatalError && (
                <ErrorComponent
                    error={flowState.error || new Error('A fatal error occurred during withdrawal')}
                    onCancel={handleStartNewWithdrawal}
                />
            )}
            
            {flowState.isWithdrawing && (
                <div className="cb-card" style={{textAlign: 'center'}}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px',
                        lineHeight: '1'
                    }}>🔄</div>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'var(--cb-text-primary)'
                    }}>Processing Withdrawal</h2>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--cb-text-secondary)'
                    }}>Current state: {flowState.state?.type}</p>
                    <div style={{margin: '16px 0'}}>
                        <div className="spinner" style={{
                            display: 'inline-block',
                            width: '20px',
                            height: '20px',
                            border: '2px solid var(--cb-border)',
                            borderTop: '2px solid var(--cb-primary)',
                            borderRadius: '50%',
                            animation: 'spin 2s linear infinite'
                        }}></div>
                    </div>
                </div>
            )}
            
            {flowState.state && !flowState.isOAuthPending && !flowState.isWalletLoading && !flowState.isWalletReady && 
             !flowState.isQuoteLoading && !flowState.isQuoteReady && !flowState.isQuoteExpired && 
             !flowState.requires2FA && !flowState.requiresSMS && !flowState.requiresKYC && 
             !flowState.isWithdrawalComplete && !flowState.canRetry && !flowState.hasFatalError && 
             !flowState.hasError && !flowState.isWithdrawing && !flowState.isOAuthWindowBeenClosedByTheUser && (
                <div className="cb-card" style={{textAlign: 'center'}}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: 'var(--cb-text-primary)'
                    }}>Unknown State</h2>
                    <p style={{
                        fontSize: '14px',
                        color: 'var(--cb-text-secondary)',
                        marginBottom: '24px'
                    }}>Current state: {flowState.state?.type}</p>
                    <button 
                        onClick={handleStartNewWithdrawal}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: 'var(--cb-primary)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'var(--cb-transition)'
                        }}
                    >
                        Restart
                    </button>
                </div>
            )}
        </>
    );

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginBottom: '32px',
                    color: 'var(--cb-text-primary)'
                }}>Bluvo Withdrawal Flow</h1>

                {/* Render real flow by default, or simulator when enabled */}
                {useSimulator ? (
                    <StateSimulator>
                        {(simulatedFlow) => renderFlowUI(simulatedFlow as any)}
                    </StateSimulator>
                ) : (
                    renderFlowUI(flow)
                )}

                {/* Toggle button to enable/disable simulator */}
                <button
                    onClick={() => setUseSimulator(!useSimulator)}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000,
                        padding: '10px 15px',
                        backgroundColor: useSimulator ? 'var(--cb-primary)' : 'var(--cb-background)',
                        color: useSimulator ? 'white' : 'var(--cb-primary)',
                        border: '1px solid var(--cb-primary)',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '14px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                        transition: 'all 0.2s ease',
                    }}
                >
                    🔧 {useSimulator ? 'Exit Simulator' : 'Enable Simulator'}
                </button>

                {/* Debug Info */}
                <details style={{marginTop: '2rem', fontSize: '0.8rem'}}>
                    <summary>Debug Info</summary>
                    <pre style={{
                        backgroundColor: 'var(--cb-background-secondary)',
                        padding: '1rem',
                        borderRadius: '0.25rem',
                        overflow: 'auto'
                    }}>
                        {JSON.stringify({
                            state: flow.state?.type,
                            context: flow.context,
                            error: flow.error?.message,
                            invalid2FAAttempts: flow.invalid2FAAttempts
                        }, null, 2)}
                    </pre>
                </details>
            </main>

            <style>{`
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}