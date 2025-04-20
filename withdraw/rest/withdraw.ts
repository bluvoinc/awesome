import {put} from "../../utils";

// Bluvo API credentials - Replace with your own from https://docs.bluvo.co/docs/quickstart
const BLUVO_ORG_ID = '<your-bluvo-organization-id>';
const BLUVO_PROJECT_ID = '<your-bluvo-project-id>';
const BLUVO_API_KEY = '<your-bluvo-api-key>';

// Base URL for Bluvo API
const BASE_URL = 'https://api-bluvo.com';

// Wallet ID to withdraw from
const WALLET_ID = '<your-bluvo-wallet-id>';

// Set up request headers
const headers = {
  'X-BLUVO-ORG-ID': BLUVO_ORG_ID,
  'X-BLUVO-PROJECT-ID': BLUVO_PROJECT_ID,
  'X-BLUVO-API-KEY': BLUVO_API_KEY,
  'Content-Type': 'application/json'
};

// Withdrawal request data
const withdrawalData = {
  asset: 'LTC',
  amount: 0.01,
  address: '<your-destination-address>',
  tag: '',  // Optional: Only needed for certain cryptocurrencies
  params: {} // Optional: Additional parameters if needed
};

// Make the API request to perform withdrawal
async function withdrawFunds() {
  try {
    const result = await put(
      `${BASE_URL}/v0/cex/cex/wallet/${WALLET_ID}/transact/out`,
      headers,
      withdrawalData
    );
    
    console.log('Withdrawal initiated successfully:');
    console.log(result);
    return result;
  } catch (error) {
    console.error('Failed to initiate withdrawal:', error);
    throw error;
  }
}

// Execute the function
withdrawFunds();