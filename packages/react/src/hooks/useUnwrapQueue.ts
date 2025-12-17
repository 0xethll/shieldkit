/**
 * useUnwrapQueue Hook
 *
 * React hook for fetching pending unwrap requests from the indexer
 */

import { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { type Address } from 'viem'
import { GraphQLClient } from 'graphql-request'
import type { UnwrapRequest } from '@z-payment/core'

/**
 * GraphQL query to fetch unwrap requests for a specific recipient
 */
export const UNWRAP_REQUESTS_QUERY = `
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
 * Unwrap queue parameters
 */
export interface UseUnwrapQueueParams {
  /** Address of the confidential token */
  tokenAddress?: Address
  /** GraphQL endpoint URL (defaults to NEXT_PUBLIC_ENVIO_GRAPHQL_URL or localhost) */
  graphqlUrl?: string
  /** Whether to fetch finalized or pending requests (default: false - pending only) */
  includeFinalized?: boolean
  /** Auto-refetch interval in milliseconds (default: 10000ms) */
  refetchInterval?: number
  /** Whether to enable auto-refetch (default: false) */
  enableAutoRefetch?: boolean
}

/**
 * Unwrap queue return type
 */
export interface UseUnwrapQueueReturn {
  /** Array of unwrap requests */
  unwrapRequests: UnwrapRequest[]
  /** Whether the query is loading */
  isLoading: boolean
  /** Error message if query failed */
  error: string | undefined
  /** Manually refetch unwrap requests */
  refetch: () => Promise<void>
}

/**
 * Hook for fetching pending unwrap requests from the indexer
 *
 * This hook queries a GraphQL endpoint (typically Envio indexer) to fetch
 * unwrap requests for the connected wallet.
 *
 * @param params - Unwrap queue parameters
 * @returns Unwrap requests and query state
 *
 * @example
 * ```tsx
 * const { unwrapRequests, isLoading, refetch } = useUnwrapQueue({
 *   tokenAddress: '0x...',
 *   graphqlUrl: 'https://indexer.example.com/v1/graphql',
 *   enableAutoRefetch: true,
 *   refetchInterval: 15000
 * })
 *
 * // Display pending unwrap requests
 * unwrapRequests.map(req => (
 *   <div key={req.id}>
 *     Amount: {req.burntAmount}
 *     <button onClick={() => finalizeUnwrap(req.id)}>Finalize</button>
 *   </div>
 * ))
 * ```
 */
export function useUnwrapQueue(
  params: UseUnwrapQueueParams = {},
): UseUnwrapQueueReturn {
  const {
    tokenAddress,
    graphqlUrl = typeof process !== 'undefined'
      ? process.env.NEXT_PUBLIC_ENVIO_GRAPHQL_URL ||
        'http://localhost:8080/v1/graphql'
      : 'http://localhost:8080/v1/graphql',
    includeFinalized = false,
    refetchInterval = 10000,
    enableAutoRefetch = false,
  } = params

  const { address: userAddress } = useAccount()

  const [unwrapRequests, setUnwrapRequests] = useState<UnwrapRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  // Create GraphQL client
  const graphqlClient = useCallback(() => {
    return new GraphQLClient(graphqlUrl, {
      headers: {
        'content-type': 'application/json',
      },
    })
  }, [graphqlUrl])

  /**
   * Fetch unwrap requests from the indexer
   */
  const fetchRequests = useCallback(async () => {
    if (!userAddress || !tokenAddress) {
      setUnwrapRequests([])
      return
    }

    setIsLoading(true)
    setError(undefined)

    try {
      const client = graphqlClient()
      const data = await client.request<{
        ConfidentialERC20Wrapper_UnwrapRequest: UnwrapRequest[]
      }>(UNWRAP_REQUESTS_QUERY, {
        recipient: userAddress,
        isFinalized: includeFinalized,
        tokenAddress: tokenAddress,
      })

      setUnwrapRequests(data.ConfidentialERC20Wrapper_UnwrapRequest || [])
    } catch (err: unknown) {
      console.error('GraphQL Error:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to fetch unwrap requests',
      )
    } finally {
      setIsLoading(false)
    }
  }, [userAddress, tokenAddress, includeFinalized, graphqlClient])

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // Auto-refetch if enabled
  useEffect(() => {
    if (!enableAutoRefetch) return

    const interval = setInterval(() => {
      fetchRequests()
    }, refetchInterval)

    return () => clearInterval(interval)
  }, [enableAutoRefetch, refetchInterval, fetchRequests])

  return {
    unwrapRequests,
    isLoading,
    error,
    refetch: fetchRequests,
  }
}
