'use server'

import {createClient} from "@bluvo/sdk-ts";

export async function fetchWithdrawableBalances(walletId: string) {
    return await getWithdrawableBalanceById(walletId);
}

function loadBluvoClient() {

    if (!process.env.BLUVO_ORG_ID || !process.env.BLUVO_PROJECT_ID || !process.env.BLUVO_API_KEY) {
        throw new Error('Missing Bluvo environment variables: BLUVO_ORG_ID, BLUVO_PROJECT_ID, BLUVO_API_KEY');
    }

    // uses localhost dev server URL
    return createClient({
        orgId: process.env.BLUVO_ORG_ID,
        projectId: process.env.BLUVO_PROJECT_ID,
        apiKey: process.env.BLUVO_API_KEY,
    });
}

export async function requestQuotation(walletId: string, params: {
    asset: string;
    amount: string;
    address: string;
    network?: string;
    tag?: string;
    includeFee?: boolean;
}) {
    return toPlain(await requestWithdrawalQuotation({
        walletId,
        asset: params.asset,
        amount: parseFloat(params.amount),
        destinationAddress: params.address,
        network: params.network,
        // Add other params as needed
    }));
}

export async function executeWithdrawal(
    walletId: string,
    idem: string,
    quoteId: string,
    params?: { twofa?: string; smsCode?: string; }
) {
    // executeWithdrawal error Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
    return toPlain(await executeWithdrawalFromQuoteId({
        walletId,
        idem,
        quoteId,
        twoFactorCode: params?.twofa,
    }));
}

// Workaround for -> Only plain objects, and a few built-ins, can be passed to Client Components from Server Components.
function toPlain<T extends object>(o: T): T {
    return JSON.parse(JSON.stringify(o)) as T;
    // return Array.isArray(o) ? (o.map(toPlain) as any) : {...o};
}


async function getWithdrawableBalanceById(walletId: string) {
    return toPlain(await loadBluvoClient()
        .wallet
        .withdrawals
        .getWithdrawableBalance(walletId));
}

export async function requestWithdrawalQuotation(request: {
    walletId: string
    asset: string
    amount: number
    destinationAddress: string
    network?: string
    tag?: string
    includeFee?: boolean
}) {
    return await loadBluvoClient()
        .wallet
        .withdrawals
        .requestQuotation(
            request.walletId,
            {
                asset: request.asset,
                amount: String(request.amount),
                address: request.destinationAddress,
                network: request.network,
                tag: request.tag,
                includeFee: request.includeFee,
            }
        );

}

export async function executeWithdrawalFromQuoteId(request: {
    walletId: string
    idem: string
    quoteId: string

    // first time is optional so we know if we need to ask for 2FA or not
    twoFactorCode?: string
}) {

    console.log("shooting withdrawal for quoteId", request.quoteId, "on wallet", request.walletId, "with 2fa", request.twoFactorCode);

    return await loadBluvoClient()
        .wallet
        .withdrawals
        .executeWithdrawal(
            request.walletId, // <-- same of the owned wallet by the user
            request.idem, // <-- pick a random uuid
            request.quoteId,
            {
                twofa: request.twoFactorCode
            }
        );
}