import React from 'react';

interface OAuth2SetupFormProps {
  orgId: string;
  setOrgId: (value: string) => void;
  projectId: string;
  setProjectId: (value: string) => void;
  walletId: string;
  setWalletId: (value: string) => void;
  idem: string;
  setIdem: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function OAuth2SetupForm({
  orgId,
  setOrgId,
  projectId,
  setProjectId,
  walletId,
  setWalletId,
  idem,
  setIdem,
  onSubmit,
  isLoading
}: OAuth2SetupFormProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", width: "100%" }}>
      <div>
        <label htmlFor="orgId">Organization ID:</label>
        <input
          id="orgId"
          type="text"
          value={orgId}
          onChange={(e) => setOrgId(e.target.value)}
          placeholder="your-org-id"
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
        />
      </div>

      <div>
        <label htmlFor="projectId">Project ID:</label>
        <input
          id="projectId"
          type="text"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          placeholder="your-project-id"
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
        />
      </div>

      <div>
        <label htmlFor="walletId">Wallet ID:</label>
        <input
          id="walletId"
          type="text"
          value={walletId}
          onChange={(e) => setWalletId(e.target.value)}
          placeholder="unique-wallet-id"
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
        />
      </div>

      <div>
        <label htmlFor="idem">Idem (Flow ID):</label>
        <input
          id="idem"
          type="text"
          value={idem}
          onChange={(e) => setIdem(e.target.value)}
          placeholder="unique-flow-id"
          style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={isLoading}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: isLoading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: "0.25rem",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontSize: "1rem",
        }}
      >
        {isLoading ? "Loading..." : "Test OAuth2 Window"}
      </button>
    </div>
  );
}