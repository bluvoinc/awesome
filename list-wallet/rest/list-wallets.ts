// Bluvo API credentials - Replace with your own from https://docs.bluvo.co/docs/quickstart
const BLUVO_ORG_ID = '<your-bluvo-organization-id>';
const BLUVO_PROJECT_ID = '<your-bluvo-project-id>';
const BLUVO_API_KEY = '<your-bluvo-api-key>';

async function listBinanceWallets() {
  try {
    const response = await fetch("https://api-bluvo.com/v0/cex/wallets", {
      method: "GET",
      headers: {
        'x-bluvo-org-id': BLUVO_ORG_ID,
        'x-bluvo-api-key': BLUVO_API_KEY,
        'x-bluvo-project-id': BLUVO_PROJECT_ID,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Wallets retrieved successfully:");
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error("Error listing Binance wallets:", error);
    throw error;
  }
}

// Execute the function
listBinanceWallets();