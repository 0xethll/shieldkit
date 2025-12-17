// Token icon component with lock indicator for confidential tokens

'use client'

import { Lock } from 'lucide-react'

interface TokenIconProps {
  symbol: string
  isConfidential?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Get background gradient based on token symbol
 */
function getTokenGradient(symbol: string): string {
  const gradients: Record<string, string> = {
    USD: 'from-green-400 to-green-600',
    USDC: 'from-blue-400 to-blue-600',
    USDT: 'from-teal-400 to-teal-600',
    DAI: 'from-yellow-400 to-yellow-600',
    WETH: 'from-purple-400 to-purple-600',
    ETH: 'from-purple-400 to-purple-600',
  }

  return gradients[symbol.toUpperCase()] || 'from-gray-400 to-gray-600'
}

/**
 * Get token symbol initial (first 2 letters)
 */
function getTokenInitial(symbol: string): string {
  return symbol.slice(0, 2).toUpperCase()
}

export function TokenIcon({
  symbol,
  isConfidential = false,
  size = 'md',
  className = '',
}: TokenIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  const lockSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  }

  const gradient = getTokenGradient(symbol)
  const initial = getTokenInitial(symbol)

  return (
    <div className={`relative ${className}`}>
      {/* Main token icon */}
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-bold text-white shadow-lg`}
      >
        {initial}
      </div>

      {/* Lock indicator for confidential tokens */}
      {isConfidential && (
        <div className="absolute -bottom-0.5 -right-0.5 bg-gray-900 dark:bg-gray-100 rounded-full p-0.5 border-2 border-white dark:border-gray-900 shadow-lg">
          <Lock className={`${lockSizeClasses[size]} text-yellow-400 dark:text-yellow-500`} />
        </div>
      )}
    </div>
  )
}

/**
 * Token pair icon - shows both ERC20 and confidential token icons side by side
 */
interface TokenPairIconProps {
  symbol: string
  hasConfidential?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function TokenPairIcon({
  symbol,
  hasConfidential = false,
  size = 'md',
  className = '',
}: TokenPairIconProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* ERC20 token */}
      <TokenIcon symbol={symbol} size={size} />

      {/* Arrow or indicator */}
      {hasConfidential && (
        <>
          <div className="text-gray-400 dark:text-gray-600 text-xs">→</div>
          {/* Confidential token */}
          <TokenIcon symbol={symbol} isConfidential size={size} />
        </>
      )}
    </div>
  )
}
