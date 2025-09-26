import React, { useState } from 'react';
import type { FlowContext } from '@bluvo/react';

interface StateSimulatorProps {
  children: (flowState: SimulatedFlowState) => React.ReactNode;
}

interface SimulatedFlowState {
  state?: { type: string };
  context: FlowContext;
  walletBalances?: Array<{
    asset: string;
    balance: string;
    balanceInFiat?: string;
    networks?: Array<{
      id: string;
      name: string;
      displayName: string;
      minWithdrawal: string;
      maxWithdrawal: string;
      assetName: string;
      addressRegex?: string;
    }>;
  }>;
  quote?: {
    id: string;
    asset: string;
    amount: string;
    estimatedFee: string;
    estimatedTotal: string;
    amountWithFeeInFiat: string;
    amountNoFeeInFiat: string;
    estimatedFeeInFiat: string;
    expiresAt: number;
  };
  withdrawal?: {
    id: string;
    status: string;
    transactionId?: string;
  };
  error?: Error;
  invalid2FAAttempts?: number;
  
  // State helpers
  isOAuthPending: boolean;
  isOAuthWindowBeenClosedByTheUser: boolean;
  isWalletLoading: boolean;
  isWalletReady: boolean;
  isQuoteLoading: boolean;
  isQuoteReady: boolean;
  isQuoteExpired: boolean;
  isWithdrawing: boolean;
  requires2FA: boolean;
  requiresSMS: boolean;
  requiresKYC: boolean;
  isWithdrawalComplete: boolean;
  canRetry: boolean;
  hasFatalError: boolean;
  hasError: boolean;

  // Mock actions
  cancel: () => void;
  requestQuote: (options: any) => void;
  executeWithdrawal: (quoteId: string) => void;
  submit2FA: (code: string) => void;
  submitSMS: (code: string) => void;
  retryWithdrawal: () => void;
}

// Mock data generators
const generateMockBalances = () => [
  {
    asset: 'BTC',
    balance: '0.05234',
    balanceInFiat: '2,145.94',
    networks: [
      {
        id: 'bitcoin',
        name: 'bitcoin',
        displayName: 'Bitcoin',
        minWithdrawal: '0.0001',
        maxWithdrawal: '10',
        assetName: 'BTC',
        addressRegex: '^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$'
      },
      {
        id: 'bitcoin-lightning',
        name: 'bitcoin-lightning',
        displayName: 'Lightning Network',
        minWithdrawal: '0.00001',
        maxWithdrawal: '1',
        assetName: 'BTC',
        addressRegex: '^lnbc[0-9]+(m|u|n|p)?[a-z0-9]+$'
      }
    ]
  },
  {
    asset: 'ETH',
    balance: '1.2345',
    balanceInFiat: '3,456.78',
    networks: [
      {
        id: 'ethereum',
        name: 'ethereum',
        displayName: 'Ethereum',
        minWithdrawal: '0.001',
        maxWithdrawal: '100',
        assetName: 'ETH',
        addressRegex: '^0x[a-fA-F0-9]{40}$'
      }
    ]
  },
  {
    asset: 'USDC',
    balance: '5000.00',
    balanceInFiat: '5,000.00',
    networks: [
      {
        id: 'ethereum',
        name: 'ethereum',
        displayName: 'Ethereum',
        minWithdrawal: '10',
        maxWithdrawal: '50000',
        assetName: 'USDC',
        addressRegex: '^0x[a-fA-F0-9]{40}$'
      },
      {
        id: 'polygon',
        name: 'polygon',
        displayName: 'Polygon',
        minWithdrawal: '1',
        maxWithdrawal: '50000',
        assetName: 'USDC',
        addressRegex: '^0x[a-fA-F0-9]{40}$'
      }
    ]
  }
];

const generateMockQuote = () => ({
  id: 'quote_' + Math.random().toString(36).substring(7),
  asset: 'BTC',
  amount: '0.01',
  estimatedFee: '0.0001',
  estimatedTotal: '0.0101',
  amountWithFeeInFiat: '414.10',
  amountNoFeeInFiat: '410.00',
  estimatedFeeInFiat: '4.10',
  expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutes from now
});

const generateMockWithdrawal = () => ({
  id: 'withdrawal_' + Math.random().toString(36).substring(7),
  status: 'completed',
  transactionId: '0x' + Math.random().toString(16).substring(2, 66)
});

const mockContext: FlowContext = {
  orgId: 'mock_org_id',
  projectId: 'mock_project_id',
  exchange: 'coinbase',
  walletId: 'mock_wallet_id',
  retryAttempts: 0,
  maxRetryAttempts: 3
};

const stateOptions = [
  { value: 'idle', label: 'Initial State' },
  { value: 'oauth:waiting', label: 'OAuth - Waiting' },
  { value: 'oauth:processing', label: 'OAuth - Processing' },
  { value: 'oauth:window_closed_by_user', label: 'OAuth - Window Closed' },
  { value: 'wallet:loading', label: 'Wallet - Loading' },
  { value: 'wallet:ready', label: 'Wallet - Ready' },
  { value: 'wallet:error', label: 'Wallet - Error' },
  { value: 'quote:requesting', label: 'Quote - Requesting' },
  { value: 'quote:ready', label: 'Quote - Ready' },
  { value: 'quote:expired', label: 'Quote - Expired' },
  { value: 'quote:error', label: 'Quote - Error' },
  { value: 'withdraw:processing', label: 'Withdrawal - Processing' },
  { value: 'withdraw:error2FA', label: 'Withdrawal - Requires 2FA' },
  { value: 'withdraw:errorSMS', label: 'Withdrawal - Requires SMS' },
  { value: 'withdraw:errorKYC', label: 'Withdrawal - Requires KYC' },
  { value: 'withdraw:errorBalance', label: 'Withdrawal - Insufficient Balance' },
  { value: 'withdraw:completed', label: 'Withdrawal - Completed' },
  { value: 'withdraw:fatal', label: 'Withdrawal - Fatal Error' },
];

export function StateSimulator({ children }: StateSimulatorProps) {
  const [selectedState, setSelectedState] = useState('idle');
  const [invalid2FAAttempts, setInvalid2FAAttempts] = useState(0);

  const generateFlowState = (): SimulatedFlowState => {
    const baseState: SimulatedFlowState = {
      state: { type: selectedState },
      context: mockContext,
      error: undefined,
      invalid2FAAttempts,
      
      // State helpers - all false by default
      isOAuthPending: false,
      isOAuthWindowBeenClosedByTheUser: false,
      isWalletLoading: false,
      isWalletReady: false,
      isQuoteLoading: false,
      isQuoteReady: false,
      isQuoteExpired: false,
      isWithdrawing: false,
      requires2FA: false,
      requiresSMS: false,
      requiresKYC: false,
      isWithdrawalComplete: false,
      canRetry: false,
      hasFatalError: false,
      hasError: false,

      // Mock actions
      cancel: () => console.log('Mock: cancel()'),
      requestQuote: (options) => console.log('Mock: requestQuote()', options),
      executeWithdrawal: (quoteId) => console.log('Mock: executeWithdrawal()', quoteId),
      submit2FA: (code) => console.log('Mock: submit2FA()', code),
      submitSMS: (code) => console.log('Mock: submitSMS()', code),
      retryWithdrawal: () => console.log('Mock: retryWithdrawal()')
    };

    // Set state-specific data and flags
    switch (selectedState) {
      case 'oauth:waiting':
      case 'oauth:processing':
        baseState.isOAuthPending = true;
        break;
        
      case 'oauth:window_closed_by_user':
        baseState.isOAuthWindowBeenClosedByTheUser = true;
        break;
        
      case 'wallet:loading':
        baseState.isWalletLoading = true;
        break;
        
      case 'wallet:ready':
        baseState.isWalletReady = true;
        baseState.walletBalances = generateMockBalances();
        break;
        
      case 'wallet:error':
        baseState.hasError = true;
        baseState.error = new Error('Failed to fetch wallet balances');
        break;
        
      case 'quote:requesting':
        baseState.isQuoteLoading = true;
        baseState.walletBalances = generateMockBalances();
        break;
        
      case 'quote:ready':
        baseState.isQuoteReady = true;
        baseState.walletBalances = generateMockBalances();
        baseState.quote = generateMockQuote();
        break;
        
      case 'quote:expired':
        baseState.isQuoteExpired = true;
        baseState.walletBalances = generateMockBalances();
        baseState.quote = {
          ...generateMockQuote(),
          expiresAt: Date.now() - 1000 // Already expired
        };
        break;
        
      case 'quote:error':
        baseState.hasError = true;
        baseState.error = new Error('Failed to generate quote');
        break;
        
      case 'withdraw:processing':
        baseState.isWithdrawing = true;
        baseState.quote = generateMockQuote();
        break;
        
      case 'withdraw:error2FA':
        baseState.requires2FA = true;
        baseState.quote = generateMockQuote();
        baseState.invalid2FAAttempts = invalid2FAAttempts;
        break;
        
      case 'withdraw:errorSMS':
        baseState.requiresSMS = true;
        baseState.quote = generateMockQuote();
        break;
        
      case 'withdraw:errorKYC':
        baseState.requiresKYC = true;
        break;
        
      case 'withdraw:errorBalance':
        baseState.canRetry = true;
        baseState.error = new Error('Insufficient balance for withdrawal');
        break;
        
      case 'withdraw:completed':
        baseState.isWithdrawalComplete = true;
        baseState.withdrawal = generateMockWithdrawal();
        break;
        
      case 'withdraw:fatal':
        baseState.hasFatalError = true;
        baseState.error = new Error('Fatal error: Unable to complete withdrawal');
        break;
    }

    return baseState;
  };

  const flowState = generateFlowState();

  return (
    <>
      {/* Simulator Panel */}
      <div
          style={{
            position: 'fixed',
            bottom: '70px',
            right: '20px',
            width: '350px',
            maxHeight: '500px',
            backgroundColor: '#1e1e1e',
            border: '2px solid #00ff00',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            fontFamily: 'monospace',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '15px',
              borderBottom: '1px solid #333',
              backgroundColor: '#2a2a2a',
              borderRadius: '10px 10px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h3 style={{ margin: 0, color: '#00ff00', fontSize: '16px' }}>
              🔧 Flow State Simulator
            </h3>
            <span style={{ color: '#666', fontSize: '12px' }}>DEV MODE</span>
          </div>

          {/* Content */}
          <div style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
            {/* State Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label
                style={{
                  display: 'block',
                  color: '#00ff00',
                  fontSize: '12px',
                  marginBottom: '5px',
                  textTransform: 'uppercase',
                }}
              >
                Select Flow State:
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#2a2a2a',
                  color: '#fff',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Controls */}
            {selectedState === 'withdraw:error2FA' && (
              <div style={{ marginBottom: '15px' }}>
                <label
                  style={{
                    display: 'block',
                    color: '#00ff00',
                    fontSize: '12px',
                    marginBottom: '5px',
                    textTransform: 'uppercase',
                  }}
                >
                  Invalid 2FA Attempts:
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  value={invalid2FAAttempts}
                  onChange={(e) => setInvalid2FAAttempts(parseInt(e.target.value) || 0)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#2a2a2a',
                    color: '#fff',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    fontSize: '14px',
                  }}
                />
              </div>
            )}

            {/* Current State Info */}
            <div
              style={{
                backgroundColor: '#2a2a2a',
                padding: '10px',
                borderRadius: '6px',
                marginBottom: '15px',
                border: '1px solid #444',
              }}
            >
              <h4 style={{ margin: '0 0 10px 0', color: '#00ff00', fontSize: '14px' }}>
                Current State Data:
              </h4>
              <pre
                style={{
                  margin: 0,
                  color: '#aaa',
                  fontSize: '11px',
                  maxHeight: '150px',
                  overflow: 'auto',
                }}
              >
                {JSON.stringify(
                  {
                    state: flowState.state?.type,
                    hasBalances: !!flowState.walletBalances,
                    hasQuote: !!flowState.quote,
                    hasWithdrawal: !!flowState.withdrawal,
                    hasError: !!flowState.error,
                    errorMessage: flowState.error?.message,
                    invalid2FAAttempts: flowState.invalid2FAAttempts,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            {/* State Flags */}
            <div style={{ fontSize: '11px', color: '#666' }}>
              <div style={{ marginBottom: '5px' }}>
                <strong style={{ color: '#00ff00' }}>Active Flags:</strong>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {Object.entries(flowState)
                  .filter(([key, value]) => key.startsWith('is') || key.startsWith('requires') || key.startsWith('has') || key.startsWith('can'))
                  .filter(([_, value]) => value === true)
                  .map(([key]) => (
                    <span
                      key={key}
                      style={{
                        padding: '2px 6px',
                        backgroundColor: '#333',
                        borderRadius: '3px',
                        border: '1px solid #444',
                      }}
                    >
                      {key}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '10px 15px',
              borderTop: '1px solid #333',
              fontSize: '11px',
              color: '#666',
              textAlign: 'center',
            }}
          >
            Mock data generated for testing purposes
          </div>
        </div>

      {/* Render children with simulated flow state */}
      {children(flowState)}
    </>
  );
}