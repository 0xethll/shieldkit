import { useState } from 'react'
import { useFinalizeUnwrap, type UnwrapRequest } from '@shieldkit/react'
import { Loader2, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface QueueItemProps {
  item: UnwrapRequest
  onFinalizeSuccess?: (token: string) => void
}

export default function QueueItem({ item, onFinalizeSuccess }: QueueItemProps) {
  const [showError, setShowError] = useState(false)

  const { finalizeUnwrap, isFinalizing, isSuccess, error } = useFinalizeUnwrap({
    tokenAddress: item.tokenAddress,
    onSuccess: () => {
      console.log('Unwrap finalized successfully!')
      onFinalizeSuccess?.(item.tokenAddress)
    },
  })

  const handleFinalize = async () => {
    setShowError(false)
    try {
      await finalizeUnwrap(item.burntAmount as `0x${string}`)
    } catch (err) {
      console.error('Finalize error:', err)
      setShowError(true)
    }
  }

  const timeAgo = (timestamp: string) => {
    const seconds = Math.floor((Date.now() - Number(timestamp) * 1000) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  // Format amount for display
  const displayAmount = item.isFinalized && item.cleartextAmount
    ? (Number(item.cleartextAmount) / 1e6).toFixed(4) // Assuming 6 decimals for USDC
    : '░░░.░░'

  return (
    <div className="p-4 bg-secondary/50 border border-border rounded-dynamic-xl space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-semibold">
            {displayAmount} {item.tokenSymbol}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">
            Requested {timeAgo(item.requestTimestamp)}
          </div>
        </div>
        {item.isFinalized ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Clock className="w-5 h-5 text-primary" />
        )}
      </div>

      {/* Show decryption status for non-finalized items */}
      {!item.isFinalized && (
        <div className="px-3 py-2 bg-primary/10 border border-primary/20 rounded-dynamic text-xs text-muted-foreground">
          Waiting for decryption to complete...
        </div>
      )}

      {/* Error message */}
      {showError && error && (
        <div className="px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-dynamic flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Success message */}
      {isSuccess && (
        <div className="px-3 py-2 bg-green-500/10 border border-green-500/20 rounded-dynamic flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-green-600 dark:text-green-400">
            Unwrap finalized successfully!
          </p>
        </div>
      )}

      <button
        onClick={handleFinalize}
        disabled={item.isFinalized || isFinalizing || isSuccess}
        className="w-full px-3 py-2 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-dynamic-lg text-sm font-medium transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isFinalizing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Finalizing...
          </>
        ) : item.isFinalized || isSuccess ? (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Finalized
          </>
        ) : (
          <>
            <Clock className="w-4 h-4" />
            Finalize Unwrap
          </>
        )}
      </button>
    </div>
  )
}
