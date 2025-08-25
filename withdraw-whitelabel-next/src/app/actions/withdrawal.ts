'use server'

import {createClient} from '@bluvo/sdk-ts'

interface WithdrawalQuoteRequest {
    walletId: string
    asset: string
    amount: number
    destinationAddress: string
    network?: string
    tag?: string
    includeFee?: boolean
}

export async function getWithdrawalQuote(request: WithdrawalQuoteRequest) {
    try {
        const client = createClient({
            orgId: process.env.BLUVO_ORG_ID || '',
            projectId: process.env.BLUVO_PROJECT_ID || '',
            apiKey: process.env.BLUVO_API_KEY || '',
        });

        const quote = await client
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

        return {
            success: true,
            data: {
                quoteId: quote.id,
                asset: quote.asset,
                amount: quote.amountNoFee,
                estimatedFee: quote.estimatedFee,
                estimatedTotal: quote.estimatedTotal,
                expiresAt: quote.expiresAt,
            }
        }
    } catch (error) {
        console.error('Error getting withdrawal quote:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get withdrawal quote'
        }
    }
}

interface TransactFundsRequest {
    quoteId: string
    twoFactorCode: string
}

export async function transactFunds(request: TransactFundsRequest) {
    try {
        // TODO: Implement the actual SDK call to transact funds
        // For now, returning a placeholder response

        console.log('Transacting funds with:', request)

        // Simulate 2FA validation
        if (request.twoFactorCode.length < 6) {
            return {
                success: false,
                error: 'Invalid 2FA code'
            }
        }

        return {
            success: true,
            data: {
                workflowRunId: `workflow-${Date.now()}`,
                quoteId: request.quoteId,
                status: 'processing'
            }
        }
    } catch (error) {
        console.error('Error transacting funds:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to transact funds'
        }
    }
}