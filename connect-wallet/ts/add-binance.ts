/**
 * Demonstrates how to connect a Binance CEX account using the Bluvo SDK.
 * Requires valid server-side Bluvo API credentials.
 *
 * Generate the apiKey and apiSecret from a Binance test account,
 * and verify that the API key has the appropriate permissions.
 * If withdrawals or trading permissions are enabled, whitelist the
 * test IP address: 216.173.96.160.
 *
 * The connect method returns an object with a workflowRunId property,
 * which can be used to monitor the connection status.
 *
 * You may choose between polling the workflow status via REST or
 * subscribing to real-time updates via a socket stream:
 *  - REST API: https://docs.bluvo.co/api-reference/workflow/get-workflow
 *  - Socket stream: contact help@bluvo.co
 *
 * For client-side applications, we recommend using the socket stream
 * for real-time notifications. For server-side implementations, you
 * can poll the workflow status using the REST API.
 *
 * When the workflow step returns with state 'RUN_SUCCESS' and isEnd true,
 * the wallet is successfully connected and recorded in the organization’s
 * tenant database.
 */

import { createClient } from "@bluvo/sdk-ts";
import { pollWorkflowStatus } from "../../utils";

const BLUVO_ORG_ID= '<your-bluvo-organization-id>';
const BLUVO_PROJECT_ID = '<your-bluvo-project-id>';
const BLUVO_API_KEY = '<your-bluvo-api-key>'; // Bluvo API credentials - Replace with your own from https://portal.bluvo.co

const BINANCE_API_KEY = '<your-binance-account-api-key>';
const BINANCE_API_SECRET = '<your-binance-account-api-secret>';


// @ts-ignore
(async ()=>{


    const client = createClient({
        // Bluvo API credentials — obtain yours at https://portal.bluvo.co
        orgId: BLUVO_ORG_ID,//'<your-bluvo-organization-id>',
        projectId: BLUVO_PROJECT_ID,//'<your-bluvo-project-id>',
        apiKey: BLUVO_API_KEY,//'<your-bluvo-api-key>',
    });

    const walletId = crypto.randomUUID(); // Pick a unique wallet ID

    const {workflowRunId} = await client
            .wallet
            .connect(
                'binance', // See full list of supported exchanges: https://docs.bluvo.co/supported-exchanges
                walletId,
                {
                    apiKey: BINANCE_API_KEY,//'<your-binance-account-api-key>',     // Your Binance API key
                    apiSecret: BINANCE_API_SECRET,//'<your-binance-account-api-secret>', // Your Binance API secret
                    ips: ['216.173.96.160']                         // Optional: whitelist IPs (required for withdrawals)
                }
            );

    console.log('🚀 Add wallet request initiated:', workflowRunId);

    // Poll for workflow completion (server-side implementation) - for client-side applications, we recommend using the socket stream for real-time notifications.
    await pollWorkflowStatus(client, workflowRunId);

    console.log('✅ Wallet connected successfully!');

    // Retrieve wallet information

    const wallet = await client
        .wallet
        .get(walletId);

    console.log('Wallet details:', wallet);

    // We're now ready to place trades, withdraw funds, etc.
    // All the future operations can be performed using the walletId and Bluvo will be responsible for maintaining in sync wallet's data with the exchange.
    // e.g.: client.wallet.withdraw(walletId, { ... });

})();
