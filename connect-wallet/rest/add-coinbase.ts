/**
 * Bluvo API - Connect coinbase Wallet Example
 *
 * This example demonstrates how to connect a coinbase wallet to Bluvo
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

// coinbase API credentials - Replace with your own
// Both Ed25519 or ECDSA API keys are supported
const COINBASE_API_KEY = '<your-coinbase-account-api-key>';
const COINBASE_API_SECRET = '<your-coinbase-account-api-secret>';

// See full list here -> https://docs.bluvo.co/supported-exchanges
const EXCHANGE = 'coinbase';

/**
 * Connect a coinbase wallet to Bluvo
 */
async function connectWallet() {
  try {
    // Create API headers
    const headers = {
      'x-bluvo-org-id': BLUVO_ORG_ID,
      'x-bluvo-api-key': BLUVO_API_KEY,
      'Content-Type': 'application/json'
    };

    // Generate a unique wallet ID
    const walletId = crypto.randomUUID();
    console.log('🔑 Creating wallet with ID:', walletId);

    // Add coinbase wallet
    const addWalletResponse = await post(
        `${BASE_URL}/v0/cex/connect/${EXCHANGE}`,
        headers,
        {
          projectId: BLUVO_PROJECT_ID,
          walletId,
          apiKey: COINBASE_API_KEY,
          apiSecret: COINBASE_API_SECRET
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
connectWallet()
    .then(() => console.log('🎉 Example completed successfully'))
    .catch(error => console.error('💥 Example failed:', error));
