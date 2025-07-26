import {createClient} from "@bluvo/sdk-ts";

// Bluvo API credentials - Replace with your own from https://docs.bluvo.co/docs/quickstart
createClient({
    orgId: '<your-bluvo-organization-id>',
    projectId: '<your-bluvo-project-id>',
    apiKey: '<your-bluvo-api-key>',
})
    .wallet
    .transaction
    .list('wallet-id')
    .then(console.log)