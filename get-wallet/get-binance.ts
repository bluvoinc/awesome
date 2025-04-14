/**
 * Bluvo API - Get Binance Wallet Example
 * 
 * This example demonstrates how to retrieve a Binance wallet from Bluvo
 * using a wallet ID.
 */

import { get } from '../utils';

// Base URL for Bluvo API
const BASE_URL = 'https://api-bluvo.com';

// Bluvo API credentials - Replace with your own from https://docs.bluvo.co/docs/quickstart
const BLUVO_ORG_ID = '<your-bluvo-organization-id>';
const BLUVO_PROJECT_ID = '<your-bluvo-project-id>';
const BLUVO_API_KEY = '<your-bluvo-api-key>';

/**
 * Get a Binance wallet from Bluvo by wallet ID
 */
async function getBinanceWallet(walletId: string) {
  try {
    // Create API headers
    const headers = {
      'x-bluvo-org-id': BLUVO_ORG_ID,
      'x-bluvo-api-key': BLUVO_API_KEY,
      'Content-Type': 'application/json'
    };
    
    console.log('🔍 Retrieving wallet with ID:', walletId);
    
    // Retrieve wallet information
    const walletData = await get(
      `${BASE_URL}/v0/cex/wallet/${walletId}`,
      headers
    );
    
    console.log('✅ Wallet retrieved successfully!');
    console.log('📊 Wallet details:');
    console.log(JSON.stringify(walletData, null, 2));
    
    return walletData;
  } catch (error) {
    console.error('❌ Failed to retrieve wallet:', error);
    throw error;
  }
}

// Execute the example with a sample wallet ID
// You should replace this with an actual wallet ID from your Bluvo account
const SAMPLE_WALLET_ID = '<your-wallet-id>';

getBinanceWallet(SAMPLE_WALLET_ID)
  .then(() => console.log('🎉 Example completed successfully'))
  .catch(error => console.error('💥 Example failed:', error));