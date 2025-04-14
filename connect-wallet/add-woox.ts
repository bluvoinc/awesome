/**
 * Bluvo API - Connect Binance Wallet Example
 * 
 * This example demonstrates how to connect a Binance wallet to Bluvo
 * and retrieve wallet information once connected.
 */

import { get, post, sleep } from '../utils';

// Base URL for Bluvo API
const BASE_URL = 'https://api-bluvo.com';

// Bluvo API credentials - Replace with your own from https://docs.bluvo.co/docs/quickstart
const BLUVO_ORG_ID = '<your-bluvo-organization-id>';
const BLUVO_PROJECT_ID = '<your-bluvo-project-id>';
const BLUVO_API_KEY = '<your-bluvo-api-key>';

// Binance API credentials - Replace with your own
const WOOX_API_KEY = '<your-woox-account-api-key>';
const WOOX_API_SECRET = '<your-woox-account-api-secret>';

// See full list here -> https://docs.bluvo.co/supported-exchanges
const EXCHANGE = 'woo';

/**
 * Connect a Binance wallet to Bluvo
 */
async function connectBinanceWallet() {
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
    
    // Add Binance wallet
    const addWalletResponse = await post(
      `${BASE_URL}/v0/cex/connect/${EXCHANGE}`,
      headers,
      {
        projectId: BLUVO_PROJECT_ID,
        walletId,
        apiKey: WOOX_API_KEY,
        apiSecret: WOOX_API_SECRET
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

/**
 * Poll workflow status until completion or failure
 */
async function pollWorkflow(workflowRunId: string, headers: Record<string, string>) {
  const MAX_ATTEMPTS = 10;
  const POLLING_INTERVAL = 3000; // 3 seconds
  
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    console.log(`⏳ Polling workflow (attempt ${attempt + 1}/${MAX_ATTEMPTS})...`);
    
    const response = await get(
      `${BASE_URL}/v0/workflow/runs/${workflowRunId}`,
      headers
    );
    
    const { steps } = response;
    
    // Check if workflow is complete
    if (!steps || steps.length >= 3) {
      console.log('✓ Workflow completed successfully');
      return;
    }
    
    // Check for workflow failure
    if (steps.length > 0 && steps[steps.length - 1].state === 'RUN_FAILED') {
      const errorDetails = steps[steps.length - 1];
      console.error('✗ Workflow failed:', errorDetails);
      throw new Error(`Workflow execution failed: ${JSON.stringify(errorDetails)}`);
    }
    
    // Wait before next polling attempt
    await sleep(POLLING_INTERVAL);
  }
  
  console.warn('⚠️ Polling timed out - workflow may still be running');
}

// Execute the example
connectBinanceWallet()
  .then(() => console.log('🎉 Example completed successfully'))
  .catch(error => console.error('💥 Example failed:', error));