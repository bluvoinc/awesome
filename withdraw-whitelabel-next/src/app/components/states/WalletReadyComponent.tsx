import React, { useState } from 'react';
import type { QuoteRequestOptions } from '@bluvo/react';

interface Network {
  id: string;
  name: string;
  displayName: string;
  minWithdrawal: string;
  maxWithdrawal?: string;
  assetName: string;
  addressRegex?: string | null;
}

interface Balance {
  asset: string;
  balance: string;
  balanceInFiat?: string;
  networks?: Network[];
}

interface WalletReadyComponentProps {
  balances: Balance[];
  onRequestQuote: (options: QuoteRequestOptions) => void;
}

export function WalletReadyComponent({ balances, onRequestQuote }: WalletReadyComponentProps) {

  // Pre-filled defaults for different assets
  const assetDefaults: Record<string, {
    network?: string;
    amount: string;
    destinationAddress: string;
    tag?: string;
  }> = {
    'BTC': {
      network: 'bitcoin',
      amount: '0.0001',
      destinationAddress: 'bc1qm50vw9uh7k4dghewqygyye2cqavjgyrk9y6lj4',
    },
    'ETH': {
      network: 'ethereum',
      amount: '0.02019836',
      destinationAddress: '0x8aaaa9c3a06a4a9fe7c5cce17d8b5db1e225eadf',
    },
    'USDC': {
      network: 'base',
      amount: '10',
      destinationAddress: '0x2694F5A5b35b8911Ba2146ea41C7E191c80d4853', // my USDC base address
    },
    'XRP': {
      amount: '25',
      destinationAddress: '',
      tag: '12345',
    },

  };

  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [tag, setTag] = useState<string>('');
  const [includeFee, setIncludeFee] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const selectedBalance = balances.find(b => b.asset === selectedAsset);
  const selectedNetworkInfo = selectedBalance?.networks?.find(n => n.id === selectedNetwork);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!selectedAsset) newErrors.asset = 'Please select an asset';
    if (!amount) newErrors.amount = 'Please enter an amount';
    if (!destinationAddress) newErrors.address = 'Please enter a destination address';
    if (selectedBalance?.networks && selectedBalance.networks.length > 0 && !selectedNetwork) {
      newErrors.network = 'Please select a network';
    }

    // Validate amount
    if (amount) {
      const amountNum = parseFloat(amount);
      const balanceNum = parseFloat(selectedBalance?.balance || '0');
      
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      } else if (amountNum > balanceNum) {
        newErrors.amount = 'Insufficient balance';
      } else if (selectedNetworkInfo) {
        const minWithdrawal = parseFloat(selectedNetworkInfo.minWithdrawal);
        const maxWithdrawal = parseFloat(selectedNetworkInfo.maxWithdrawal || 'Infinity');
        
        if (amountNum < minWithdrawal) {
          newErrors.amount = `Minimum withdrawal: ${minWithdrawal} ${selectedAsset}`;
        } else if (amountNum > maxWithdrawal) {
          newErrors.amount = `Maximum withdrawal: ${maxWithdrawal} ${selectedAsset}`;
        }
      }
    }

    // Validate address with regex if available
    if (destinationAddress && selectedNetworkInfo?.addressRegex) {
      const regex = new RegExp(selectedNetworkInfo.addressRegex);
      if (!regex.test(destinationAddress)) {
        newErrors.address = 'Invalid address format for this network';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const options: QuoteRequestOptions = {
        asset: selectedAsset,
        amount,
        destinationAddress,
        network: selectedNetwork || undefined,
        tag: tag || undefined,
        includeFee
      };
      
      onRequestQuote(options);
    }
  };

  return (
    <div className="cb-card" style={{ 
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px',
        lineHeight: '1',
        textAlign: 'center'
      }}>✅</div>
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '8px',
        color: 'var(--cb-text-primary)',
        textAlign: 'center'
      }}>Wallet Ready</h2>
      <p style={{
        fontSize: '16px',
        color: 'var(--cb-text-secondary)',
        marginBottom: '24px',
        textAlign: 'center'
      }}>Select asset and enter withdrawal details:</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        {/* Asset Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--cb-text-primary)'
          }}>
            Select Asset
          </label>
          <select
            value={selectedAsset}
            onChange={(e) => {
              const asset = e.target.value;
              setSelectedAsset(asset);
              
              // Apply defaults if available
              if (asset && assetDefaults[asset]) {
                const defaults = assetDefaults[asset];
                
                // Set network if specified in defaults
                if (defaults.network) {
                  // Check if this network exists for the selected asset
                  const assetBalance = balances.find(b => b.asset === asset);
                  const networkExists = assetBalance?.networks?.some(n => n.id === defaults.network);
                  setSelectedNetwork(networkExists ? defaults.network : '');
                } else {
                  setSelectedNetwork('');
                }
                
                // Apply other defaults
                setAmount(defaults.amount);
                setDestinationAddress(defaults.destinationAddress);
                setTag(defaults.tag || '');
              } else {
                // Reset fields if no defaults
                setSelectedNetwork('');
                setAmount('');
                setDestinationAddress('');
                setTag('');
              }
            }}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'var(--cb-background)',
              border: '1px solid var(--cb-border)',
              borderRadius: '8px',
              color: 'var(--cb-text-primary)',
              fontSize: '16px',
              transition: 'var(--cb-transition)',
              cursor: 'pointer'
            }}
          >
            <option value="">-- Select Asset --</option>
            {balances.map((balance) => (
              <option key={balance.asset} value={balance.asset}>
                {balance.asset} - Balance: {balance.balance} - USD Balance: {balance.balanceInFiat || 'N/A'}
              </option>
            ))}
          </select>
          {errors.asset && <span style={{ color: 'var(--cb-error)', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.asset}</span>}
        </div>

        {/* Network Selection (if available) */}
        {selectedBalance?.networks && selectedBalance.networks.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: 'var(--cb-text-primary)'
            }}>
              Select Network
            </label>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'var(--cb-background)',
                border: '1px solid var(--cb-border)',
                borderRadius: '8px',
                color: 'var(--cb-text-primary)',
                fontSize: '16px',
                transition: 'var(--cb-transition)',
                cursor: 'pointer'
              }}
            >
              <option value="">-- Select Network --</option>
              {selectedBalance.networks.map((network) => (
                <option key={network.id} value={network.id}>
                  {network.displayName || network.name}
                </option>
              ))}
            </select>
            {errors.network && <span style={{ color: 'var(--cb-error)', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.network}</span>}
          </div>
        )}

        {/* Amount Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--cb-text-primary)'
          }}>
            Amount
            {selectedNetworkInfo && (
              <span style={{ fontSize: '14px', color: 'var(--cb-text-tertiary)', marginLeft: '8px' }}>
                (Min: {selectedNetworkInfo.minWithdrawal}, Max: {selectedNetworkInfo.maxWithdrawal})
              </span>
            )}
          </label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'var(--cb-background)',
              border: '1px solid var(--cb-border)',
              borderRadius: '8px',
              color: 'var(--cb-text-primary)',
              fontSize: '16px',
              transition: 'var(--cb-transition)',
              cursor: 'pointer'
            }}
          />
          {errors.amount && <span style={{ color: 'var(--cb-error)', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.amount}</span>}
        </div>

        {/* Destination Address */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--cb-text-primary)'
          }}>
            Destination Address
          </label>
          <input
            type="text"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            placeholder="Enter destination address"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'var(--cb-background)',
              border: '1px solid var(--cb-border)',
              borderRadius: '8px',
              color: 'var(--cb-text-primary)',
              fontSize: '16px',
              transition: 'var(--cb-transition)',
              cursor: 'pointer'
            }}
          />
          {errors.address && <span style={{ color: 'var(--cb-error)', fontSize: '14px', marginTop: '4px', display: 'block' }}>{errors.address}</span>}
        </div>

        {/* Tag/Memo (optional) */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: 'var(--cb-text-primary)'
          }}>
            Tag/Memo (optional)
          </label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter tag if required"
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: 'var(--cb-background)',
              border: '1px solid var(--cb-border)',
              borderRadius: '8px',
              color: 'var(--cb-text-primary)',
              fontSize: '16px',
              transition: 'var(--cb-transition)',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Include Fee Checkbox */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center',
            fontSize: '14px',
            color: 'var(--cb-text-primary)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={includeFee}
              onChange={(e) => setIncludeFee(e.target.checked)}
              style={{ 
                marginRight: '8px',
                width: '18px',
                height: '18px',
                cursor: 'pointer'
              }}
            />
            Include fee in withdrawal amount
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="primary"
          style={{
            width: '100%',
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
          Request Quotation
        </button>
      </form>
    </div>
  );
}