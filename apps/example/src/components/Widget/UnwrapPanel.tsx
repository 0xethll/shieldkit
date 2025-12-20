import { useState } from 'react'
import { useUnwrap, useUnwrapQueue } from '@z-payment/react'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
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

export default function UnwrapPanel() {
  const { customTokens } = usePlaygroundConfig()
  const [selectedToken, setSelectedToken] = useState(customTokens[0] || 'USDC')
  const [amount, setAmount] = useState('')

  const tokenAddress = SEPOLIA_TEST_TOKENS.wrapper as Address

  const { unwrap, isLoading, isSuccess, error, txHash, reset } = useUnwrap({
    tokenAddress,
    decimals: 6,
    onSuccess: () => {
      console.log('Unwrap request successful!')
      setAmount('')
    },
  })

  const { queue, isLoading: isQueueLoading } = useUnwrapQueue({
    tokenAddress,
  })

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
        <h3 className="text-sm font-semibold">Request Unwrap</h3>

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
              className="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              step="0.000001"
              min="0"
            />
            <button
              onClick={() => setAmount('100')}
              className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded transition-colors"
            >
              MAX
            </button>
          </div>
        </div>

        {/* Private Balance */}
        <div className="px-4 py-3 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-xl">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Private Balance</span>
            <Lock className="w-3 h-3 text-primary" />
          </div>
          <div className="text-lg font-bold font-mono">░░░.░░ {selectedToken}</div>
          <button className="text-xs text-primary hover:underline mt-1">
            🔓 Decrypt to view
          </button>
        </div>

        {/* Request Button */}
        <button
          onClick={handleUnwrap}
          disabled={isLoading || !amount || parseFloat(amount) <= 0}
          className="w-full px-4 py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:from-muted disabled:to-muted text-primary-foreground rounded-xl font-semibold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
          <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl">
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
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">
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
          {queue && queue.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {queue.length} pending
            </span>
          )}
        </div>

        {isQueueLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : queue && queue.length > 0 ? (
          <div className="space-y-3">
            {queue.map((item, index) => (
              <QueueItem key={index} item={item} />
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

interface QueueItemProps {
  item: {
    amount: string
    status: 'decrypting' | 'ready'
    requestTime: number
    progress?: number
  }
}

function QueueItem({ item }: QueueItemProps) {
  const [isFinalizing, setIsFinalizing] = useState(false)

  const handleFinalize = async () => {
    setIsFinalizing(true)
    // TODO: Implement finalize unwrap logic
    setTimeout(() => setIsFinalizing(false), 2000)
  }

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <div className="p-4 bg-secondary/50 border border-border rounded-xl space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold">{item.amount} USDC</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Requested {timeAgo(item.requestTime)}
          </div>
        </div>
        {item.status === 'ready' ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
        )}
      </div>

      {item.status === 'decrypting' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Decrypting...</span>
            <span className="text-primary font-medium">{item.progress || 45}%</span>
          </div>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
              style={{ width: `${item.progress || 45}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleFinalize}
        disabled={item.status !== 'ready' || isFinalizing}
        className="w-full px-3 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isFinalizing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Finalizing...
          </>
        ) : item.status === 'ready' ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Finalize Unwrap
          </>
        ) : (
          <>
            <Clock className="w-4 h-4" />
            Pending
          </>
        )}
      </button>
    </div>
  )
}
