"use client";

import React from 'react';
import {
    fetchWithdrawableBalances,
    requestQuotation,
    executeWithdrawal
} from '../actions/flowActions';

// State-specific components
import {StartFlowComponent} from '../components/states/StartFlowComponent';
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
    const [selectedExchange, setSelectedExchange] = React.useState<'coinbase' | 'kraken' | 'gemini'>('coinbase');
    const [showOAuthClosedMessage, setShowOAuthClosedMessage] =
        React.useState(false);
    const [useSimulator, setUseSimulator] = React.useState(false);

    // FIXME: ⨯ ReferenceError: localStorage is not defined
    const PREVIOUSLY_CONNECTED_WALLET_ID =
        // helpatbluvo's kraken
        // "a107c79d-a302-49c2-ae90-2a47aaa90586"
        // flo's coinbase
        "fdab8410-0f9b-41c5-8a4a-cc44401d9d78"
        // "345b0e00-e979-4873-be4d-653b802253b4",
        //"624ed616-ba33-44e0-a9a1-896bd9804f75";
        // localStorage.getItem('connectedWalletId') || 'unknown-wallet-id';

    // Initialize the flow with server action callbacks
    const flow = useBluvoFlow({
        orgId: "imSgZyiY2EsbKboJzbbhMDHcknWB3pfY",
        projectId: "VOPomUho1UWAfLc2To9uCYdcZ2dGDeR7",

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

    const handleStartFlow = async () => {
        await flow.startWithdrawalFlow({
            exchange: selectedExchange,
            walletId: generateId()
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
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    backgroundColor: '#000',
                    borderRadius: '1rem',
                    border: '2px solid #dc3545',
                    maxWidth: '500px',
                    margin: '2rem auto'
                }}>
                    <div style={{
                        fontSize: '3rem',
                        marginBottom: '1rem'
                    }}>
                        ❌
                    </div>
                    <h2 style={{
                        color: '#dc3545',
                        marginBottom: '1rem',
                        fontSize: '1.5rem'
                    }}>
                        OAuth Window Closed
                    </h2>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#ccc',
                        marginBottom: '1.5rem'
                    }}>
                        You closed the authentication window before completing the process.
                    </p>
                    <p style={{
                        fontSize: '0.9rem',
                        color: '#888'
                    }}>
                        Returning to exchange selection in 3 seconds...
                    </p>
                    <div style={{
                        marginTop: '1rem',
                        display: 'inline-block',
                        width: '20px',
                        height: '20px',
                        border: '3px solid #444',
                        borderTop: '3px solid #dc3545',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                </div>
            )}

            {!flowState.state && !showOAuthClosedMessage && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <h2>Choose an Option</h2>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
                            Select Exchange:
                        </label>
                        <select
                            value={selectedExchange}
                            onChange={(e) => setSelectedExchange(e.target.value as 'coinbase' | 'kraken' | 'gemini')}
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '1rem',
                                borderRadius: '0.25rem',
                                border: '1px solid #444',
                                backgroundColor: '#2a2a2a',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="coinbase">Coinbase</option>
                            <option value="kraken">Kraken</option>
                            <option value="gemini">Gemini</option>
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                        <button
                            onClick={handleStartFlow}
                            style={{
                                padding: '1rem 2rem',
                                backgroundColor: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Start New Withdrawal
                        </button>
                        <button
                            onClick={handleResumeFlow}
                            style={{
                                padding: '1rem 2rem',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.5rem',
                                fontSize: '1rem',
                                cursor: 'pointer'
                            }}
                        >
                            Resume with Existing Wallet
                        </button>
                    </div>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6c757d' }}>
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
                <div style={{textAlign: 'center', padding: '2rem'}}>
                    <h2>🔄 Processing Withdrawal</h2>
                    <p>Current state: {flowState.state?.type}</p>
                    <div style={{margin: '1rem 0'}}>
                        <div className="spinner" style={{
                            display: 'inline-block',
                            width: '20px',
                            height: '20px',
                            border: '3px solid #f3f3f3',
                            borderTop: '3px solid #007bff',
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
                <div style={{textAlign: 'center', padding: '2rem'}}>
                    <h2>Unknown State</h2>
                    <p>Current state: {flowState.state?.type}</p>
                    <button onClick={handleStartNewWithdrawal}>
                        Restart
                    </button>
                </div>
            )}
        </>
    );

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Bluvo Withdrawal Flow</h1>

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
                        backgroundColor: useSimulator ? '#00ff00' : '#1e1e1e',
                        color: useSimulator ? '#000' : '#00ff00',
                        border: '2px solid #00ff00',
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
                        backgroundColor: '#000000',
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