/**
 * Demonstrates how to initiate an on-chain withdrawal from a connected wallet using the Bluvo SDK.
 *
 * Note: When you originally connected this wallet via the `.connect` method,
 * you must have whitelisted any client IPs that will be used to submit withdrawal requests.
 * If withdrawals are enabled on your Binance (or other exchange) API key,
 * ensure that those IPs were included in the `ips` array during connection.
 *
 * Prerequisites:
 * 1. A wallet has already been connected and its workflow completed (state 'RUN_SUCCESS').
 * 2. The wallet’s API key has withdrawal permissions.
 * 3. All client IPs used for withdrawals were whitelisted at connect time.
 *
 * Replace the placeholders below with your own values.
 */

import { createClient } from "@bluvo/sdk-ts";
import { pollWorkflowStatus } from "../../utils";

const BLUVO_ORG_ID = '<your-bluvo-organization-id>';
const BLUVO_PROJECT_ID = '<your-bluvo-project-id>';
const BLUVO_API_KEY = '<your-bluvo-api-key>';

// The ID of the wallet previously created via `.wallet.connect(...)`
const WALLET_ID = 'your previously created wallet id';
const RECEPIENT_ADDRESS = '0x9C9980F05276b75b08956919dL1899140E10c340'; // Replace with the recipient's on-chain address

// @ts-ignore
(async () => {
    const client = createClient({
        // Bluvo API credentials — obtain yours at https://portal.bluvo.co
        orgId:     BLUVO_ORG_ID,
        projectId: BLUVO_PROJECT_ID,
        apiKey:    BLUVO_API_KEY,
    });

    // Initiate the withdrawal
    const { workflowRunId } = await client.wallet.transaction.withdraw({
        walletId:           WALLET_ID,             // Your connected wallet’s ID
        amount:             15,                    // Amount to withdraw
        asset:              'USDT',                // Asset symbol (e.g., 'BTC', 'LTC')
        destinationAddress: RECEPIENT_ADDRESS,     // Recipient on-chain address
        network:            undefined,             // Optional: specify network if needed
        tag:                undefined,             // Optional: for assets requiring a tag (e.g., XRP, XLM)
    });

    console.log('🚀 Withdrawal request initiated:', workflowRunId);

    // Poll for workflow completion (server-side implementation)
    await pollWorkflowStatus(client, workflowRunId, "withdraw");

    console.log('✅ Withdrawal request processed successfully!');

    const transactions = await client
        .wallet
        .transaction
        .list(WALLET_ID);

    console.log('📊 Transactions:', JSON.stringify(transactions, null, 2));
})();

