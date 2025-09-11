import React, { useState } from 'react';
import type { QuoteRequestOptions } from '@bluvo/react';

interface Network {
  id: string;
  name: string;
  displayName: string;
  minWithdrawal: string;
  maxWithdrawal: string;
  assetName: string;
  addressRegex?: string;
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
      amount: '0.01',
      destinationAddress: '',
    },
    'USDC': {
      network: 'ethereum',
      amount: '10',
      destinationAddress: '',
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
        const maxWithdrawal = parseFloat(selectedNetworkInfo.maxWithdrawal);
        
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
    <div style={{ 
      padding: '1.5rem',
      backgroundColor: '#000',
      borderRadius: '0.5rem',
      border: '1px solid #28a745'
    }}>
      <h2>✅ Wallet Ready</h2>
      <p>Select asset and enter withdrawal details:</p>
      
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        {/* Asset Selection */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Select Asset:
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
              padding: '0.5rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '0.25rem',
              color: 'white'
            }}
          >
            <option value="">-- Select Asset --</option>
            {balances.map((balance) => (
              <option key={balance.asset} value={balance.asset}>
                {balance.asset} - Balance: {balance.balance} - USD Balance: {balance.balanceInFiat || 'N/A'}
              </option>
            ))}
          </select>
          {errors.asset && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.asset}</span>}
        </div>

        {/* Network Selection (if available) */}
        {selectedBalance?.networks && selectedBalance.networks.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Select Network:
            </label>
            <select
              value={selectedNetwork}
              onChange={(e) => setSelectedNetwork(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '0.25rem',
                color: 'white'
              }}
            >
              <option value="">-- Select Network --</option>
              {selectedBalance.networks.map((network) => (
                <option key={network.id} value={network.id}>
                  {network.displayName || network.name}
                </option>
              ))}
            </select>
            {errors.network && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.network}</span>}
          </div>
        )}

        {/* Amount Input */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Amount:
            {selectedNetworkInfo && (
              <span style={{ fontSize: '0.8rem', color: '#6c757d', marginLeft: '0.5rem' }}>
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
              padding: '0.5rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '0.25rem',
              color: 'white'
            }}
          />
          {errors.amount && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.amount}</span>}
        </div>

        {/* Destination Address */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Destination Address:
          </label>
          <input
            type="text"
            value={destinationAddress}
            onChange={(e) => setDestinationAddress(e.target.value)}
            placeholder="Enter destination address"
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '0.25rem',
              color: 'white'
            }}
          />
          {errors.address && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.address}</span>}
        </div>

        {/* Tag/Memo (optional) */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Tag/Memo (optional):
          </label>
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="Enter tag if required"
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '0.25rem',
              color: 'white'
            }}
          />
        </div>

        {/* Include Fee Checkbox */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={includeFee}
              onChange={(e) => setIncludeFee(e.target.checked)}
              style={{ marginRight: '0.5rem' }}
            />
            Include fee in withdrawal amount
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          Request Quotation
        </button>
      </form>
    </div>
  );
}