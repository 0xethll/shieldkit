import { useState, useEffect } from 'react'
import { useUnwrap, useUnwrapQueue, useConfidentialBalanceFor } from '@shieldkit/react'
import { useConfidentialBalance } from '../../contexts/ConfidentialBalanceContext'
import { SEPOLIA_TEST_TOKENS } from '../../config'
import {
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
} from 'lucide-react'
import type { Address } from 'viem'
import type { TokenConfig } from '../../config/scenarios'
import TokenSelector from './TokenSelector'
import QueueItem from './QueueItem'

interface UnwrapPanelProps {
  tokens: TokenConfig[]
  onUnwrapSuccess?: (token: string) => void
}

export default function UnwrapPanel({ tokens, onUnwrapSuccess }: UnwrapPanelProps) {
  const { getDecryptedBalance, cacheDecryptedBalance, clearBalance } = useConfidentialBalance()

  const [selectedToken, setSelectedToken] = useState(tokens[0]?.symbol || 'USDC')
  const [amount, setAmount] = useState('')

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

  const { unwrap, isLoading, isSuccess, error, txHash, reset } = useUnwrap({
    tokenAddress,
    onSuccess: () => {
      console.log('Unwrap request successful!')
      // Clear cached balance
      clearBalance(erc20Address)

      setAmount('')
    },
  })

  const { unwrapRequests, isLoading: isQueueLoading } = useUnwrapQueue({
    tokenAddress, graphqlUrl: ''
  })

  // Cache decrypted balance when it becomes available
  useEffect(() => {
    if (decryptedBalance !== null && erc20Address) {
      cacheDecryptedBalance(erc20Address, decryptedBalance)
    }
  }, [decryptedBalance, erc20Address, cacheDecryptedBalance])

  // Get cached balance to display
  const cachedBalance = getDecryptedBalance(erc20Address)
  const displayBalance = decryptedBalance !== null ? decryptedBalance : cachedBalance

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
    <div className="space-y-6">
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
              onClick={() => setAmount('100')}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-dynamic transition-colors"
            >
              MAX
            </button>
          </div>
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
                  {(Number(displayBalance) / 10 ** (selectedTokenConfig?.decimals || 6)).toFixed(4)} {selectedToken}
                </div>
              ) : (
                <div className="text-lg font-bold font-mono">░░░.░░ {selectedToken}</div>
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
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
          className="w-full px-4 py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:from-muted disabled:to-muted text-primary-foreground rounded-dynamic-xl font-semibold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Requesting...
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
                <p className="text-xs text-muted-foreground mt-1">
                  Check pending unwraps below
                </p>
                <button
                  onClick={reset}
                  className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1"
                >
                  Request another
                </button>
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
                  Error: {error}
                </p>
                <button
                  onClick={reset}
                  className="text-xs text-red-600 dark:text-red-400 hover:underline mt-1"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border/50" />

      {/* Pending Unwraps Queue */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Pending Unwraps</h3>
          {unwrapRequests && unwrapRequests.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {unwrapRequests.length} pending
            </span>
          )}
        </div>

        {isQueueLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : unwrapRequests && unwrapRequests.length > 0 ? (
          <div className="space-y-3">
            {unwrapRequests.map((item, index) => (
              <QueueItem key={index} item={item} onFinalizeSuccess={onUnwrapSuccess} />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm text-muted-foreground">No pending unwraps</p>
          </div>
        )}
      </div>
    </div>
  )
}

