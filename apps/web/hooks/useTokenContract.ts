// React hooks for token operations

import { useAccount, useReadContract } from 'wagmi'
import { CONTRACTS } from '@/lib/contracts'

/**
 * Hook to get confidential balance (returns encrypted handle)
 */
export function useCUSDBalance() {
    const { address } = useAccount()

    const { data: encryptedBalance, refetch } = useReadContract({
        address: CONTRACTS.cUSD_ERC7984.address,
        abi: CONTRACTS.cUSD_ERC7984.abi,
        functionName: 'confidentialBalanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
        },
    })

    return {
        encryptedBalance,
        refetch,
    }
}

/**
 * Hook to get USD ERC20 balance
 */
export function useUsdBalance() {
    const { address } = useAccount()

    const { data: balance, refetch } = useReadContract({
        address: CONTRACTS.USD_ERC20.address,
        abi: CONTRACTS.USD_ERC20.abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: {
            enabled: !!address,
            refetchInterval: 5000,
        },
    })

    return {
        balance,
        refetch,
    }
}

