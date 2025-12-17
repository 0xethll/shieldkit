import type { TokenPair } from '@/hooks/useTokenList'
import type { Address } from 'viem'

export type TabType = 'wrap' | 'unwrap' | 'transfer'

export interface TokenOperationsTabsProps {
  tokenPair: TokenPair
  onOperationComplete?: () => void
  onTokenBalanceUpdate?: (tokenAddress: Address) => void
}

export interface TabComponentProps {
  tokenPair: TokenPair
  onComplete?: () => void
  onTokenBalanceUpdate?: (tokenAddress: Address) => void
}
