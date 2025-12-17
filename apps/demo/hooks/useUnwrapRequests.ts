import { useAccount } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'
import { graphqlClient } from '@/lib/graphql-client'
import { type Address } from 'viem'


/**
 * GraphQL query to fetch unwrap requests for a specific recipient
 * Note: Envio/Hasura uses camelCase field names
 */
const UNWRAP_REQUESTS_QUERY = `
  query UnwrapRequests($recipient: String!, $isFinalized: Boolean!, $tokenAddress: String!) {
    ConfidentialERC20Wrapper_UnwrapRequest(
      where: {
        recipient: { _eq: $recipient }
        isFinalized: { _eq: $isFinalized }
        tokenAddress: { _eq: $tokenAddress }
      }
      order_by: { requestTimestamp: desc }
    ) {
      id
      burntAmount
      recipient
      requestBlockNumber
      requestTransactionHash
      requestTimestamp
      isFinalized
      cleartextAmount
      finalizedBlockNumber
      finalizedTransactionHash
      finalizedTimestamp
      tokenAddress
      tokenName
      tokenSymbol
    }
  }
`

/**
 * Unwrap request entity from Envio indexer
 */
export interface UnwrapRequest {
    id: string
    burntAmount: string
    recipient: string
    requestBlockNumber: string
    requestTransactionHash: string
    requestTimestamp: string
    isFinalized: boolean
    cleartextAmount?: string
    finalizedBlockNumber?: string
    finalizedTransactionHash?: string
    finalizedTimestamp?: string
    tokenAddress: string
    tokenName: string
    tokenSymbol: string
}

/**
 * Hook to fetch unwrap requests for the connected wallet
 * @returns {Object} requests, loading state, error, and refetch function
 */
export function useUnwrapRequests(wrappedTokenAddress: Address) {
    const { address } = useAccount()
    const [unwrapRequests, setUnwrapRequests] = useState<UnwrapRequest[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | undefined>()

    const fetchRequests = useCallback(async () => {
        if (!address || !wrappedTokenAddress) {
            setUnwrapRequests([])
            return
        }

        setIsLoading(true)
        setError(undefined)

        try {
            const data = await graphqlClient.request<{
                ConfidentialERC20Wrapper_UnwrapRequest: UnwrapRequest[]
            }>(UNWRAP_REQUESTS_QUERY, {
                recipient: address,
                isFinalized: false,
                tokenAddress: wrappedTokenAddress
            })

            setUnwrapRequests(data.ConfidentialERC20Wrapper_UnwrapRequest || [])
        } catch (err: unknown) {
            console.error('GraphQL Error:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch unwrap requests')
        } finally {
            setIsLoading(false)
        }
    }, [address, wrappedTokenAddress])

    useEffect(() => {
        fetchRequests()
    }, [fetchRequests])

    return {
        unwrapRequests,
        isLoading,
        error,
        refetch: fetchRequests,
    }
}
