'use server'

import { createClient } from '../../../../../index'

export async function getWalletById(walletId: string) {
  try {
    const client = createClient({
      orgId: process.env.BLUVO_ORG_ID || '',
      projectId: process.env.BLUVO_PROJECT_ID || '',
      apiKey: process.env.BLUVO_API_KEY || '',
    });

    const wallet = await client
        .wallet
        .withdrawals
        .getWithdrawableBalance(walletId);

    // Convert class instances to plain objects to avoid serialization issues
    const plainBalances = wallet.balances?.map(balance => ({
      asset: balance.asset,
      amount: balance.amount,
      networks: balance.networks?.map((network:any) => ({
        id: network.id,
        code: network.code,
        name: network.name,
        displayName: network.displayName,
        minWithdrawal: network.minWithdrawal,
        maxWithdrawal: network.maxWithdrawal,
        assetName: network.assetName,
        addressRegex: network.addressRegex,
      })) || []
    })) || [];

    return {
      success: true,
      data: {
        id: walletId,
        lastSyncAt: wallet.lastSyncAt,
        balances: plainBalances,
      }
    }
  } catch (error) {
    console.error('Error fetching wallet:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch wallet'
    }
  }
}