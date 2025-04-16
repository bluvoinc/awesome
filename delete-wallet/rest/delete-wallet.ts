// Deletes a Binance wallet by ID

const API_KEY = '<api-key>';
const ORG_ID = '<api-key>';
const WALLET_ID = '<wallet-id>';

const options = {
  method: 'DELETE',
  headers: {
    'x-bluvo-api-key': API_KEY, 
    'x-bluvo-org-id': ORG_ID
  }
};

fetch(`https://api-bluvo.com/v0/cex/wallet/${WALLET_ID}`, options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));