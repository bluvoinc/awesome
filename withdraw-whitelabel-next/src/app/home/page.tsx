"use client";

import React from 'react';
import {
    fetchWithdrawableBalances,
    requestQuotation,
    executeWithdrawal
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

import styles from '../page.module.css';
import { useBluvoFlow } from "@bluvo/react";

const generateId = () => crypto.randomUUID();

const handleStartNewWithdrawal = () => {
    // Reset by reloading the page (in production, you might want a cleaner reset)
    window.location.reload();
};

export default function Home() {
    const [selectedExchange, setSelectedExchange] = React.useState<'coinbase' | 'kraken' | 'gemini'>('coinbase');

    // FIXME: ⨯ ReferenceError: localStorage is not defined
    const PREVIOUSLY_CONNECTED_WALLET_ID =
        // helpatbluvo's kraken
        "a107c79d-a302-49c2-ae90-2a47aaa90586"
        // flo's coinbase
        // "624ed616-ba33-44e0-a9a1-896bd9804f75";
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

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <h1>Bluvo Withdrawal Flow</h1>

                {!flow.state && (
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
                        invalid2FAAttempts={flow.invalid2FAAttempts}
                        expiresAt={flow.quote?.expiresAt}
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

                {/* 
                ==============================================
                TEST SECTION - COMMENT/UNCOMMENT AS NEEDED 
                ==============================================
                */}
                {/*{flow.isWithdrawing && (*/}
                {/*    <div style={{*/}
                {/*        marginTop: '2rem',*/}
                {/*        padding: '1rem',*/}
                {/*        backgroundColor: '#2a2a2a',*/}
                {/*        borderRadius: '0.5rem',*/}
                {/*        border: '2px dashed #ffc107',*/}
                {/*        textAlign: 'center'*/}
                {/*    }}>*/}
                {/*        <h3 style={{ color: '#ffc107', margin: '0 0 1rem 0' }}>🧪 TEST ZONE</h3>*/}
                {/*        <p style={{ color: '#ccc', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>*/}
                {/*            Click below to simulate withdrawal completion without real transaction*/}
                {/*        </p>*/}
                {/*        <button*/}
                {/*            onClick={() => flow.testWithdrawalComplete()}*/}
                {/*            style={{*/}
                {/*                padding: '0.75rem 1.5rem',*/}
                {/*                fontSize: '1rem',*/}
                {/*                backgroundColor: '#dc3545',*/}
                {/*                color: 'white',*/}
                {/*                border: 'none',*/}
                {/*                borderRadius: '0.25rem',*/}
                {/*                cursor: 'pointer',*/}
                {/*                fontWeight: 'bold'*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            🧪 TEST: Simulate Withdrawal Complete*/}
                {/*        </button>*/}
                {/*        <p style={{ color: '#888', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>*/}
                {/*            Check console for detailed logs*/}
                {/*        </p>*/}
                {/*    </div>*/}
                {/*)}*/}

                
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