/**
 * Bluvo API - Connect Binance Wallet Example
 * 
 * This example demonstrates how to connect a Binance wallet to Bluvo
 * and retrieve wallet information once connected.
 */

import { get, post } from '../../utils';
import {pollWorkflow} from "./utils";

// Base URL for Bluvo API
const BASE_URL = 'https://api-bluvo.com';

// Bluvo API credentials - Replace with your own from https://docs.bluvo.co/docs/quickstart
const BLUVO_ORG_ID = '<your-bluvo-organization-id>';
const BLUVO_PROJECT_ID = '<your-bluvo-project-id>';
const BLUVO_API_KEY = '<your-bluvo-api-key>';

// Binance API credentials - Replace with your own
const BINANCE_API_KEY = '<your-binance-account-api-key>';
const BINANCE_API_SECRET = '<your-binance-account-api-secret>';

// See full list here -> https://docs.bluvo.co/supported-exchanges
const EXCHANGE = 'binance';

/**
 * Connect a Binance wallet to Bluvo
 */
async function connectBinanceWallet() {
  try {
    const walletId = crypto.randomUUID();

    // Create API headers
    const headers = {
      'x-bluvo-org-id': BLUVO_ORG_ID,
      'x-bluvo-api-key': BLUVO_API_KEY,
      'x-bluvo-project-id': BLUVO_PROJECT_ID,
      'x-bluvo-wallet-id': walletId, // Optional: specify wallet ID
      'Content-Type': 'application/json'
    };

    // Generate a unique wallet ID
    console.log('🔑 Creating wallet with ID:', walletId);
    
    // Add Binance wallet
    const addWalletResponse = await post(
      `${BASE_URL}/v0/cex/connect/${EXCHANGE}`,
      headers,
      {
        projectId: BLUVO_PROJECT_ID,
        walletId,
        apiKey: BINANCE_API_KEY,
        apiSecret: BINANCE_API_SECRET,
        ips: ['216.173.96.160']                         // Optional: whitelist IPs (required for withdrawals)
      }
    );
    
    const { workflowRunId } = addWalletResponse;
    console.log('🚀 Add wallet request initiated:', workflowRunId);
    
    // Poll for workflow completion
    await pollWorkflow(workflowRunId, headers);
    
    // Retrieve wallet information
    const walletData = await get(
      `${BASE_URL}/v0/cex/wallet/${walletId}`,
      headers
    );
    
    console.log('✅ Wallet connected successfully!');
    console.log('📊 Wallet details:');
    console.log(JSON.stringify(walletData, null, 2));
    
    return walletData;
  } catch (error) {
    console.error('❌ Failed to connect wallet:', error);
    throw error;
  }
}

// Execute the example
connectBinanceWallet()
  .then(() => console.log('🎉 Example completed successfully'))
  .catch(error => console.error('💥 Example failed:', error));