import {get} from "../../utils";

// Bluvo API credentials - Replace with your own from https://docs.bluvo.co/docs/quickstart
const BLUVO_ORG_ID = '<your-bluvo-organization-id>';
const BLUVO_PROJECT_ID = '<your-bluvo-project-id>';
const BLUVO_API_KEY = '<your-bluvo-api-key>';

// Base URL for Bluvo API
const BASE_URL = 'https://api-bluvo.com';

// Wallet ID to list transactions for
const WALLET_ID = '99a01408-4ef4-47da-935a-848618c11aro';

// Set up request headers
const headers = {
  'X-BLUVO-ORG-ID': BLUVO_ORG_ID,
  'X-BLUVO-PROJECT-ID': BLUVO_PROJECT_ID,
  'X-BLUVO-API-KEY': BLUVO_API_KEY,
  'Content-Type': 'application/json'
};

// Make the API request to list transactions
async function listTransactions() {
  try {
    const transactions = await get(
      `${BASE_URL}/v0/cex/cex/wallet/${WALLET_ID}/transactions`,
      headers
    );
    
    console.log('Transactions retrieved successfully:');
    console.log(transactions);
    return transactions;
  } catch (error) {
    console.error('Failed to retrieve transactions:', error);
    throw error;
  }
}

// Execute the function
listTransactions();