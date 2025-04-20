import {createClient} from "@bluvo/sdk-ts";

// Bluvo API credentials - Replace with your own from https://docs.bluvo.co/docs/quickstart
createClient({
    orgId: '<your-bluvo-organization-id>',
    projectId: '<your-bluvo-project-id>',
    apiKey: '<your-bluvo-api-key>',
})
    .wallet
    .transaction
    .withdraw({
        sourceWalletId: '<your-bluvo-wallet-id>',
        amount: 0.01,
        asset: 'LTC',
        destinationAddress: '<your-litecoin-address>',
        network: undefined,
        tag: undefined,
    })
    .then(console.log)