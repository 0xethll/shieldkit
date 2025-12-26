import type { Address } from 'viem'
import type { ThemeConfig } from '../themes/types'

export interface TokenConfig {
  symbol: string
  address: Address
  decimals: number
  name: string
}

export interface WidgetFeatures {
  wrap?: boolean
  transfer?: boolean
  unwrap?: boolean
}

export interface ConfidentialWidgetProps {
  /**
   * List of supported tokens
   * Can be token symbols or full TokenConfig objects
   */
  tokens?: TokenConfig[]

  /**
   * Default tab to show when widget opens
   * @default 'wrap'
   */
  defaultTab?: 'wrap' | 'transfer' | 'unwrap'

  /**
   * Feature toggles - control which tabs are available
   * @default { wrap: true, transfer: true, unwrap: true }
   */
  features?: WidgetFeatures

  /**
   * Theme configuration
   * @default { type: 'dark', accent: 'purple', radius: 'medium' }
   */
  theme?: ThemeConfig

  /**
   * Additional className for the widget container
   */
  className?: string

  /**
   * Additional inline styles for the widget container
   */
  style?: React.CSSProperties

  /**
   * Optional callback when wrap operation succeeds
   */
  onWrapSuccess?: (token: Address, amount: bigint) => void

  /**
   * Optional callback when transfer operation succeeds
   */
  onTransferSuccess?: (token: Address, recipient: Address, amount: bigint) => void

  /**
   * Optional callback when unwrap operation succeeds
   */
  onUnwrapSuccess?: (token: Address, amount: bigint) => void

  /**
   * GraphQL endpoint URL for unwrap queue indexer
   * @default process.env.NEXT_PUBLIC_ENVIO_GRAPHQL_URL || 'http://localhost:8080/v1/graphql'
   */
  graphqlUrl: string
}
