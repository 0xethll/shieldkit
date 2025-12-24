import { useFinalizeUnwrap, type UnwrapRequest } from '@shieldkit/react'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import type { DecryptionResult } from '../../hooks/useDecryptedAmounts'
import { motion } from 'framer-motion'

interface QueueItemProps {
  item: UnwrapRequest
  decryptionResult?: DecryptionResult
  onFinalizeSuccess?: (token: string) => void
  decimals?: number
}

export default function QueueItem({
  item,
  decryptionResult,
  onFinalizeSuccess,
  decimals = 6,
}: QueueItemProps) {
  const { finalizeUnwrap, isSuccess, isFinalizing, pendingTx, error } = useFinalizeUnwrap({
    tokenAddress: item.tokenAddress,
    onSuccess: () => {
      console.log('Unwrap finalized successfully!')
      onFinalizeSuccess?.(item.tokenAddress)
    },
  })

  const handleFinalize = async () => {
    try {
      await finalizeUnwrap(item.burntAmount as `0x${string}`)
    } catch (err) {
      console.error('Finalize error:', err)
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

  // Determine amount display based on decryption result
  const getAmountDisplay = () => {
    if (decryptionResult) {
      if (decryptionResult.status === 'loading') {
        return (
          <div className="flex items-center">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Decrypting...</span>
          </div>
        )
      }

      if (decryptionResult.status === 'error') {
        return (
          <div className="flex items-center">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            <span className="text-xs text-red-500">Failed</span>
          </div>
        )
      }

      if (decryptionResult.status === 'success') {
        const amount = Number(decryptionResult.cleartextAmount) / 10 ** decimals
        return (
          <div className="font-semibold text-sm">
            {amount.toFixed(4)}
          </div>
        )
      }
    }

    // Fallback - show placeholder
    return (
      <div className="font-semibold text-sm text-muted-foreground">
        ░░░.░░
      </div>
    )
  }

  const isThisPending = pendingTx === item.burntAmount
  const canFinalize =
    !item.isFinalized &&
    !isFinalizing &&
    decryptionResult?.status === 'success'

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.3 }}
      className="p-3 bg-secondary/50 border border-border rounded-dynamic-xl"
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0 space-y-0.5">
            {/* Amount */}
            {getAmountDisplay()}
            {/* Time */}
            <div className="text-[10px] text-muted-foreground">
              {timeAgo(item.requestTimestamp)}
            </div>
          </div>

          {/* Finalize Button */}
          <button
            onClick={handleFinalize}
            disabled={!canFinalize || item.isFinalized || isSuccess}
            className="px-1 py-1.5 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground rounded-dynamic text-[11px] font-medium transition-all disabled:cursor-not-allowed flex items-center justify-center gap-1 shrink-0"
          >
            {isThisPending || (isFinalizing && !item.isFinalized) ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Finalizing</span>
              </>
            ) : item.isFinalized || isSuccess ? (
              <>
                <CheckCircle2 className="w-3 h-3" />
                <span>Done</span>
              </>
            ) : (
              <span>Finalize</span>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && !isSuccess && (
          <div className="flex items-start gap-1.5 px-2 py-1.5 bg-red-500/10 border border-red-500/20 rounded-dynamic">
            <AlertCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-red-600 dark:text-red-400 leading-tight">
              {error.includes('rejected') || error.includes('User rejected')
                ? 'Transaction rejected'
                : 'Failed to finalize'}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
