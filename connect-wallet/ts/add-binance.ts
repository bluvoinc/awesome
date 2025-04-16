import {createClient} from "@bluvo/sdk-ts";

// Binance API credentials - Replace with your own
createClient({
    orgId: '<your-bluvo-organization-id>',
    projectId: '<your-bluvo-project-id>',
    apiKey: '<your-bluvo-api-key>',
})
    .wallet
    .connect(
        'binance', // See full list here -> https://docs.bluvo.co/supported-exchanges
        'i decide my own wallet id',
        '<your-binance-account-api-key>',
        '<your-binance-account-api-secret>')
    .then(console.log);