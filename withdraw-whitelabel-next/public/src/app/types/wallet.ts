// Type definitions for wallet balance response
// These match the structure from the API response

export interface Network {
  id: string;
  code: string;
  name: string;
  displayName: string;
  minWithdrawal: string;
  maxWithdrawal: string;
  assetName: string;
  addressRegex?: string;
}

export interface Balance {
  asset: string;
  amount: number;
  networks: Network[];
}

export interface WalletResponse {
  balances: Balance[];
}