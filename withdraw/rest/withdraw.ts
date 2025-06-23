import {put} from "../../utils";

// Bluvo API credentials - Replace with your own from https://docs.bluvo.co/docs/quickstart
const BLUVO_ORG_ID = '<your-bluvo-organization-id>';
const BLUVO_PROJECT_ID = '<your-bluvo-project-id>';
const BLUVO_API_KEY = '<your-bluvo-api-key>';

// Base URL for Bluvo API
const BASE_URL = 'https://api-bluvo.com';

// Wallet ID to withdraw from
const WALLET_ID = 'e873e41f-d6c9-44b1-9182-f519cd2e6e03';

// Set up request headers
const headers = {
  'x-bluvo-org-id': BLUVO_ORG_ID,
  'x-bluvo-api-key': BLUVO_API_KEY,
  'x-bluvo-project-id': BLUVO_PROJECT_ID,
  'x-bluvo-wallet-id': WALLET_ID, // Optional: specify wallet ID
  'Content-Type': 'application/json'
};

// Withdrawal request data
const withdrawalData = {
  asset: 'LTC',
  amount: 0.02,
  address: '<your-destination-address>',
  // network: undefined, // Optional: Specify network if needed.
  // tag: '',  // Optional: Only needed for certain cryptocurrencies
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