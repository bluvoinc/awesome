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

import styles from '../page.module.css';
import { useBluvoFlow } from "@bluvo/react";

const generateId = () => crypto.randomUUID();

const handleStartNewWithdrawal = () => {
    // Reset by reloading the page (in production, you might want a cleaner reset)
    window.location.reload();
};

export default function Home() {
    // Example of a previously connected wallet ID that could be retrieved from storage
    const PREVIOUSLY_CONNECTED_WALLET_ID = "d8d71673-2513-41cc-bccf-df50fbca7cfc";
    const PREVIOUSLY_CONNECTED_EXCHANGE = "coinbase";

    // Initialize the flow with server action callbacks
    const flow = useBluvoFlow({
        orgId: "a2e98409-cd68-48c4-853c-73d9228764c0",
        projectId: "b16e1c13-74ad-4b95-b252-0c12e2215b18", // <- deprecated soon to be removed

        fetchWithdrawableBalanceFn: fetchWithdrawableBalances,
        requestQuotationFn: requestQuotation,
        executeWithdrawalFn: executeWithdrawal,

        onWalletConnectedFn: (walletId, exchange) => {
            // call server action store this walletId for the currently-logged in user
            console.log("Should store walletId for the user:", walletId, exchange);
        }
    });

    const handleStartFlow = async () => {
        await flow.startWithdrawalFlow({
            exchange: 'coinbase',
            walletId: generateId()
        });
    };

    const handleResumeFlow = async () => {
        await flow.resumeWithdrawalFlow({
            exchange: PREVIOUSLY_CONNECTED_EXCHANGE,
            walletId: PREVIOUSLY_CONNECTED_WALLET_ID
        });
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Bluvo Withdrawal Flow</h1>

                {!flow.state && (
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <h2>Choose an Option</h2>
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
                
                {flow.isOAuthPending && <OAuthPendingComponent onCancel={flow.cancel} />}
                
                {flow.isWalletLoading && <WalletLoadingComponent />}
                
                {flow.isWalletReady && <WalletReadyComponent
                    balances={flow.walletBalances}
                    onRequestQuote={flow.requestQuote}
                />}
                
                {flow.isQuoteLoading && <QuoteLoadingComponent />}
                
                {flow.isQuoteReady && flow.quote && (
                    <QuoteReadyComponent
                        quote={flow.quote}
                        onExecuteWithdrawal={() => flow.executeWithdrawal(flow.quote!.id)}
                        isExecuting={flow.isWithdrawing}
                    />
                )}
                
                {flow.isQuoteExpired && (
                    <ErrorComponent
                        error={new Error('Quote has expired. Please start a new withdrawal.')}
                        onCancel={handleStartNewWithdrawal}
                    />
                )}
                
                {flow.requires2FA && (
                    <RequireTwoFactorAuthenticationCode
                        onSubmit2FA={flow.submit2FA}
                        isSubmitting={false}
                    />
                )}
                
                {flow.requiresSMS && (
                    <RequireSMSCode
                        onSubmitSMS={flow.submitSMS}
                        isSubmitting={false}
                    />
                )}
                
                {flow.requiresKYC && <RequireKYCComponent onCancel={flow.cancel} />}
                
                {flow.isWithdrawalComplete && flow.withdrawal && (
                    <WithdrawalCompletedComponent
                        withdrawal={flow.withdrawal}
                        onStartNew={handleStartNewWithdrawal}
                    />
                )}

                {flow.canRetry && (
                    <ErrorComponent
                        error={new Error('Withdrawal failed but can be retried')}
                        onRetry={flow.retryWithdrawal}
                        onCancel={flow.cancel}
                        canRetry={true}
                    />
                )}
                
                {flow.hasFatalError && (
                    <ErrorComponent
                        error={flow.error || new Error('A fatal error occurred during withdrawal')}
                        onCancel={handleStartNewWithdrawal}
                    />
                )}

                {/*{flow.hasError && (*/}
                {/*    <ErrorComponent*/}
                {/*        error={flow.error!}*/}
                {/*        onCancel={handleStartNewWithdrawal}*/}
                {/*    />*/}
                {/*)}*/}
                
                {flow.isWithdrawing && (
                    <div style={{textAlign: 'center', padding: '2rem'}}>
                        <h2>🔄 Processing Withdrawal</h2>
                        <p>Current state: {flow.state?.type}</p>
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
                
                {flow.state && !flow.isOAuthPending && !flow.isWalletLoading && !flow.isWalletReady && 
                 !flow.isQuoteLoading && !flow.isQuoteReady && !flow.isQuoteExpired && 
                 !flow.requires2FA && !flow.requiresSMS && !flow.requiresKYC && 
                 !flow.isWithdrawalComplete && !flow.canRetry && !flow.hasFatalError && 
                 !flow.hasError && !flow.isWithdrawing && (
                    <div style={{textAlign: 'center', padding: '2rem'}}>
                        <h2>Unknown State</h2>
                        <p>Current state: {flow.state?.type}</p>
                        <button onClick={handleStartNewWithdrawal}>
                            Restart
                        </button>
                    </div>
                )}

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
                error: flow.error?.message
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