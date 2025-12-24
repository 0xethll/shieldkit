import { useState, useEffect, useMemo } from 'react'
import { useUnwrap, useUnwrapQueue, useConfidentialBalanceFor, useFHEContext } from '@shieldkit/react'
import { useConfidentialBalance } from '../../contexts/ConfidentialBalanceContext'
import { SEPOLIA_TEST_TOKENS } from '../../config'
import { env } from '../../lib/env'
import {
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { Address } from 'viem'
import type { TokenConfig } from '../../config/scenarios'
import TokenSelector from './TokenSelector'
import QueueItem from './QueueItem'
import QueueItemSkeleton from './QueueItemSkeleton'
import { getTokenPrefix, formatErrorMessage } from './utils'
import { useDecryptedAmounts } from '../../hooks/useDecryptedAmounts'
import { AnimatePresence } from 'framer-motion'

interface UnwrapPanelProps {
  tokens: TokenConfig[]
  getBalance?: (token: string) => string | null
  onUnwrapSuccess?: (token: string) => void
}

export default function UnwrapPanel({ tokens, getBalance, onUnwrapSuccess }: UnwrapPanelProps) {
  const { getDecryptedBalance, cacheDecryptedBalance, clearBalance } = useConfidentialBalance()
  const { fheInstance } = useFHEContext()

  const [selectedToken, setSelectedToken] = useState(tokens[0]?.symbol || 'USDC')
  const [amount, setAmount] = useState('')
  const [isQueueExpanded, setIsQueueExpanded] = useState(true)

  // Get selected token config
  const selectedTokenConfig = tokens.find((t) => t.symbol === selectedToken)
  const erc20Address = selectedTokenConfig?.address as Address

  // Use new hook from @shieldkit/react
  const {
    wrappedAddress,
    isLoadingWrapped,
    encryptedBalance,
    decryptedBalance,
    decrypt,
    isDecrypting,
  } = useConfidentialBalanceFor({
    erc20Address,
    autoDecrypt: false,
  })

  const tokenAddress = wrappedAddress || (SEPOLIA_TEST_TOKENS.wrapper as Address)

  const { unwrap, isLoading, isSuccess, error, txHash } = useUnwrap({
    tokenAddress,
    onSuccess: () => {
      console.log('Unwrap request successful!')
      // Clear cached balance
      clearBalance(erc20Address)

      setAmount('')
      // Refetch queue after successful unwrap request
      refetch()
    },
  })

  const { unwrapRequests, isLoading: isQueueLoading, refetch } = useUnwrapQueue({
    tokenAddress,
    graphqlUrl: env.graphqlUrl,
    enableAutoRefetch: true,
    refetchInterval: 15000, // Auto-refetch every 15s
  })

  // Asynchronously decrypt amounts for pending unwrap requests
  const decryptedCache = useDecryptedAmounts(unwrapRequests || [], fheInstance)

  // Cache decrypted balance when it becomes available
  useEffect(() => {
    if (decryptedBalance !== null && erc20Address) {
      cacheDecryptedBalance(erc20Address, decryptedBalance)
    }
  }, [decryptedBalance, erc20Address, cacheDecryptedBalance])

  // Get cached balance to display
  const cachedBalance = getDecryptedBalance(erc20Address)
  const displayBalance = cachedBalance

  // Calculate current balance in human-readable format
  const currentBalance = useMemo(() => {
    if (displayBalance === null) return 0
    const decimals = selectedTokenConfig?.decimals || 6
    return Number(displayBalance) / 10 ** decimals
  }, [displayBalance, selectedTokenConfig?.decimals])

  // Check if amount exceeds balance
  const amountExceedsBalance = useMemo(() => {
    if (!amount || displayBalance === null) return false
    const amountNum = parseFloat(amount)
    return amountNum > currentBalance
  }, [amount, currentBalance, displayBalance])

  const handleUnwrap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return
    }

    try {
      await unwrap(amount)
    } catch (err) {
      console.error('Unwrap error:', err)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-6">
      {/* Request Unwrap Section */}
      <div className="space-y-4">
        {/* Token Selector */}
        <TokenSelector
          tokens={tokens.map(t => t.symbol)}
          tokenType="wrapped"
          selectedToken={selectedToken}
          onTokenSelect={setSelectedToken}
          getBalance={(token) => {
            // Get cached decrypted balance from context
            const config = tokens.find((t) => t.symbol === token)
            if (!config) return null

            const cachedBalance = getDecryptedBalance(config.address as Address)
            if (cachedBalance !== null) {
              return (Number(cachedBalance) / 10 ** config.decimals).toFixed(4)
            }
            return null // Not decrypted yet
          }}
          disabled={isLoading}
        />

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-2">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-dynamic-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              step="0.000001"
              min="0"
            />
            <button
              onClick={() => setAmount(currentBalance.toString())}
              disabled={isLoading || currentBalance === 0 || displayBalance === null}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-dynamic transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              MAX
            </button>
          </div>
          {/* Insufficient Balance Error */}
          {amountExceedsBalance && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Insufficient balance. Available: {currentBalance.toFixed(4)} {getTokenPrefix('wrapped')}{selectedToken}
            </p>
          )}
        </div>

        {/* Private Balance */}
        <div className="px-4 py-3 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-dynamic-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Private Balance</span>
            <Lock className="w-3 h-3 text-primary" />
          </div>
          {isLoadingWrapped ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Checking wrapper...</span>
            </div>
          ) : wrappedAddress ? (
            <>
              {displayBalance !== null ? (
                <div className="text-lg font-bold font-mono">
                  {(Number(displayBalance) / 10 ** (selectedTokenConfig?.decimals || 6)).toFixed(4)} {getTokenPrefix('wrapped')}{selectedToken}
                </div>
              ) : (
                <div className="text-lg font-bold font-mono">░░░.░░ {getTokenPrefix('wrapped')}{selectedToken}</div>
              )}
              <button
                onClick={decrypt}
                disabled={isDecrypting || !encryptedBalance || displayBalance !== null}
                className="text-xs text-primary hover:underline mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDecrypting ? '⏳ Decrypting...' : '🔓 Decrypt to view'}
              </button>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              Wrapper not deployed yet
            </div>
          )}
        </div>

        {/* Request Button */}
        <button
          onClick={handleUnwrap}
          disabled={isLoading || !amount || parseFloat(amount) <= 0 || amountExceedsBalance || displayBalance === null}
          className="w-full px-4 py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:from-muted disabled:to-muted text-primary-foreground rounded-dynamic-xl font-semibold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Requesting...
            </>
          ) : displayBalance === null ? (
            <>
              <Lock className="w-4 h-4" />
              Decrypt Balance First
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Request Unwrap
            </>
          )}
        </button>

        {/* Success State */}
        {isSuccess && txHash && (
          <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-dynamic-xl">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Unwrap request submitted!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-dynamic-xl">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Error: {formatErrorMessage(error)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pending Unwraps Queue */}
      <div className="space-y-4 md:border-l md:border-border/50">
        {/* Header - clickable on mobile */}
        <button
          onClick={() => setIsQueueExpanded(!isQueueExpanded)}
          className="flex items-center justify-between w-full md:cursor-default"
        >
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">Pending Unwraps</h3>
            {unwrapRequests && unwrapRequests.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {unwrapRequests.length}
              </span>
            )}
          </div>
          <div className="md:hidden">
            {isQueueExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </button>

        {/* ERC20 Balance Display */}
        <div className="px-3 py-2 bg-secondary/30 rounded-dynamic-lg border border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground">
              {selectedToken} Balance
            </span>
            <span className="text-xs font-semibold font-mono">
              {getBalance?.(selectedToken) || '--'}
            </span>
          </div>
        </div>

        {/* Queue Content - collapsible on mobile, always visible on desktop */}
        <div className={`${isQueueExpanded ? 'block' : 'hidden'} md:block`}>
          {isQueueLoading && (!unwrapRequests || unwrapRequests.length === 0) ? (
            <div className="space-y-3">
              <QueueItemSkeleton />
              <QueueItemSkeleton />
              <QueueItemSkeleton />
            </div>
          ) : unwrapRequests && unwrapRequests.length > 0 ? (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
              <AnimatePresence mode="popLayout">
                {unwrapRequests.map((item) => (
                  <QueueItem
                    key={item.id || item.burntAmount}
                    item={item}
                    decryptionResult={decryptedCache.get(item.burntAmount)}
                    onFinalizeSuccess={(token) => {
                      // Update ERC20 balance after finalization
                      onUnwrapSuccess?.(selectedToken)
                      // Refetch the queue after finalization
                      setTimeout(() => refetch(), 1500)
                    }}
                    decimals={selectedTokenConfig?.decimals || 6}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="py-8 text-center">
              <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No pending unwraps</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

