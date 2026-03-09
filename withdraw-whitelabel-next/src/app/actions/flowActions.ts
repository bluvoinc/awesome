'use server'

import {createClient, createDevClient, createSandboxClient, StatusEnum} from "@bluvo/sdk-ts";

function loadBluvoClient() {
    if (!process.env.BLUVO_ORG_ID || !process.env.BLUVO_PROJECT_ID || !process.env.BLUVO_API_KEY) {
        console.error("Missing Bluvo environment variables:");
        throw new Error('Missing Bluvo environment variables: BLUVO_ORG_ID, BLUVO_PROJECT_ID, BLUVO_API_KEY');
    }

    return createClient({
        orgId: process.env.BLUVO_ORG_ID || '',
        projectId: process.env.BLUVO_PROJECT_ID || '',
        apiKey: process.env.BLUVO_API_KEY || '',
    });
}


export async function fetchWithdrawableBalances(walletId: string) {
    return toPlain(await loadBluvoClient()
        .wallet
        .withdrawals
        .getWithdrawableBalance(walletId));
}

export async function listExchanges(status?: StatusEnum) {
    return [
        {
            id: 'coinbase',
            name: 'Coinbase',
            logoUrl: 'https://www.bluvo.co/logos/coinbase.png',
            status: 'live' as const,
        },
        {
            id: 'kraken',
            name: 'Kraken',
            logoUrl: 'https://www.bluvo.co/logos/kraken.pngg',
            status: 'live' as const,
        }
    ]
    // return toPlain((await loadBluvoClient().oauth2.listExchanges(status)))
}

export async function requestQuotation(walletId: string, params: {
    asset: string;
    amount: string;
    address: string;
    network?: string;
    tag?: string;
    includeFee?: boolean;
}) {
    return toPlain(await loadBluvoClient()
        .wallet
        .withdrawals
        .requestQuotation(
            walletId,
            {
                address: params.address,
                asset: params.asset,
                amount: params.amount,
                network: params.network,
                tag: params.tag,
                includeFee: params.includeFee ?? true,
            }
        ));
}

export async function executeWithdrawal(
    walletId: string,
    idem: string,
    quoteId: string,
    params?: {
        twofa?: string;
        emailCode?: string;
        smsCode?: string;
        bizNo?: string;
        tag?: string;
        params?: {
            [key: string]: any;
            dryRun?: boolean;
        } | null;
    }
) {
    // executeWithdrawal error Error: Only plain objects, and a few built-ins, can be passed to Client Components from Server Components. Classes or null prototypes are not supported.
    return toPlain(
        await loadBluvoClient()
            .wallet
            .withdrawals
            .executeWithdrawal(
                walletId,
                idem,
                quoteId,
                {
                    twofa: params?.twofa,
                    tag: params?.tag,

                    // only beta not released yet for latest sdk version, need to wait for next release
                    // emailCode: params?.emailCode,
                    // smsCode: params?.smsCode,
                    // bizNo: params?.bizNo,
                    //params: params?.params,
                }
            )
    );
}

// Workaround for -> Only plain objects, and a few built-ins, can be passed to Client Components from Server Components.
function toPlain<T extends object>(o: T): T {
    return JSON.parse(JSON.stringify(o)) as T;
    // return Array.isArray(o) ? (o.map(toPlain) as any) : {...o};
}

export async function getWalletById(walletId: string) {
    return toPlain(await loadBluvoClient()
        .wallet
        .get(walletId));
}

export async function pingWalletById(walletId: string) {
    return toPlain(await loadBluvoClient()
            .wallet
            .ping(walletId));
}