import React, { useState } from 'react';
import { Network } from '../types/wallet';

interface WithdrawalFormProps {
  crypto: string;
  ownedAmount: number;
  form?: { amount: string; destinationAddress: string; twoFactorCode: string; selectedNetwork?: string };
  networks: Network[];
  onUpdateForm: (field: 'amount' | 'destinationAddress' | 'twoFactorCode' | 'selectedNetwork', value: string) => void;
  onGetQuote: () => void;
  isGettingQuote: boolean;
}

export function WithdrawalForm({
  crypto,
  ownedAmount,
  form,
  networks,
  onUpdateForm,
  onGetQuote,
  isGettingQuote
}: WithdrawalFormProps) {
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);

  // Set default network if not selected
  React.useEffect(() => {
    if (networks.length > 0 && !form?.selectedNetwork) {
      onUpdateForm('selectedNetwork', networks[0].id);
    }
  }, [networks, form?.selectedNetwork, onUpdateForm]);

  // Get selected network
  const selectedNetwork = networks.find(n => n.id === form?.selectedNetwork) || networks[0];
  
  // Calculate and pre-fill amount when network changes or amount is empty
  React.useEffect(() => {
    if (selectedNetwork) {
      const minWithdrawal = parseFloat(selectedNetwork.minWithdrawal);
      const prefillAmount = Math.min(ownedAmount, minWithdrawal);
      if (prefillAmount > 0) {
        onUpdateForm('amount', prefillAmount.toFixed(8));
      }
    }
  }, [selectedNetwork?.id, ownedAmount, onUpdateForm]);
  
  // Validate address against regex
  const isAddressValid = React.useMemo(() => {
    if (!form?.destinationAddress || !selectedNetwork?.addressRegex) {
      return true; // No validation if no address or no regex
    }
    
    try {
      const regex = new RegExp(selectedNetwork.addressRegex);
      return regex.test(form.destinationAddress);
    } catch (error) {
      console.warn('Invalid addressRegex pattern:', selectedNetwork.addressRegex);
      return true; // If regex is invalid, don't block
    }
  }, [form?.destinationAddress, selectedNetwork?.addressRegex]);

  // Handle Get Quote click
  const handleGetQuote = () => {
    if (isAddressValid || !selectedNetwork?.addressRegex) {
      // Address is valid or no validation needed
      setRequiresConfirmation(false);
      onGetQuote();
    } else {
      // Address is invalid
      if (requiresConfirmation) {
        // Second click - proceed anyway
        setRequiresConfirmation(false);
        onGetQuote();
      } else {
        // First click - require confirmation
        setRequiresConfirmation(true);
      }
    }
  };

  // Reset confirmation when address changes
  React.useEffect(() => {
    setRequiresConfirmation(false);
  }, [form?.destinationAddress, form?.selectedNetwork]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div>
        <label 
          htmlFor={`amount-${crypto}`}
          style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}
        >
          Amount:
        </label>
        <input
          id={`amount-${crypto}`}
          type="number"
          step="0.00000001"
          placeholder="0.00000000"
          value={form?.amount || ''}
          onChange={(e) => onUpdateForm('amount', e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #ced4da",
            borderRadius: "0.25rem",
            fontSize: "0.875rem"
          }}
        />
      </div>
      
      <div>
        <label 
          htmlFor={`address-${crypto}`}
          style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}
        >
          Destination Address:
        </label>
        <input
          id={`address-${crypto}`}
          type="text"
          placeholder="Enter destination address"
          value={form?.destinationAddress || ''}
          onChange={(e) => onUpdateForm('destinationAddress', e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            border: `1px solid ${!isAddressValid && selectedNetwork?.addressRegex && form?.destinationAddress ? "#dc3545" : "#ced4da"}`,
            borderRadius: "0.25rem",
            fontSize: "0.875rem"
          }}
        />
        {!isAddressValid && selectedNetwork?.addressRegex && form?.destinationAddress && (
          <div style={{
            fontSize: "0.75rem",
            color: "#dc3545",
            marginTop: "0.25rem"
          }}>
            Invalid address format for {selectedNetwork.displayName || selectedNetwork.name} network
          </div>
        )}
      </div>
      
      {networks.length > 0 && (
        <div>
          <label 
            htmlFor={`network-${crypto}`}
            style={{ display: "block", marginBottom: "0.25rem", fontSize: "0.875rem" }}
          >
            Network:
          </label>
          <select
            id={`network-${crypto}`}
            value={form?.selectedNetwork || networks[0]?.id || ''}
            onChange={(e) => onUpdateForm('selectedNetwork', e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ced4da",
              borderRadius: "0.25rem",
              fontSize: "0.875rem"
            }}
          >
            {networks.map((network) => (
              <option key={network.id} value={network.id}>
                {network.displayName || network.name || network.code || 'Unknown Network'} (Min: {network.minWithdrawal}, Max: {network.maxWithdrawal})
              </option>
            ))}
          </select>
        </div>
      )}
      
      <button
        onClick={handleGetQuote}
        disabled={isGettingQuote}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: isGettingQuote ? "#6c757d" : (!isAddressValid && selectedNetwork?.addressRegex && form?.destinationAddress ? "#dc3545" : "#28a745"),
          color: "white",
          border: "none",
          borderRadius: "0.25rem",
          cursor: isGettingQuote ? "not-allowed" : "pointer",
          fontSize: "0.875rem",
          fontWeight: "500"
        }}
      >
        {isGettingQuote ? "Getting Quote..." : 
         (!isAddressValid && selectedNetwork?.addressRegex && form?.destinationAddress ? 
          (requiresConfirmation ? "Click Again to Confirm" : "Get Quote (Invalid Address)") : 
          "Get Quote")}
      </button>
      
      {requiresConfirmation && (
        <div style={{
          fontSize: "0.75rem",
          color: "#dc3545",
          textAlign: "center",
          marginTop: "-0.5rem"
        }}>
          Warning: Address format is invalid. Click again to proceed anyway.
        </div>
      )}
    </div>
  );
}