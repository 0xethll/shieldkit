import { CheckCircle2, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import type { TransactionState } from '@shieldkit/react'

interface Transaction {
  label: string
  state: TransactionState
}

interface TransactionHistoryProps {
  transactions: Transaction[]
  blockExplorerUrl?: string
}

export default function TransactionHistory({
  transactions,
  blockExplorerUrl = 'https://sepolia.etherscan.io/tx',
}: TransactionHistoryProps) {
  const visibleTransactions = transactions.filter(
    (tx) => tx.state.hash || tx.state.isLoading || tx.state.error,
  )

  if (visibleTransactions.length === 0) {
    return null
  }

  return (
    <div className="space-y-2">
      {visibleTransactions.map((tx, index) => (
        <div
          key={index}
          className="px-4 py-3 bg-secondary/30 border border-border rounded-dynamic-lg"
        >
          <div className="flex items-start gap-2">
            {/* Icon */}
            <div className="mt-0.5 flex-shrink-0">
              {tx.state.isLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              )}
              {tx.state.isSuccess && (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              )}
              {tx.state.error && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Label */}
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`text-sm font-medium ${
                    tx.state.isSuccess
                      ? 'text-green-600 dark:text-green-400'
                      : tx.state.error
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-foreground'
                  }`}
                >
                  {tx.label}
                </span>
              </div>

              {/* Status message */}
              {tx.state.isLoading && (
                <p className="text-xs text-muted-foreground mt-1">
                  Waiting for confirmation...
                </p>
              )}

              {tx.state.error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {formatErrorMessage(tx.state.error)}
                </p>
              )}

              {/* Transaction hash */}
              {tx.state.hash && (
                <div className="flex items-center gap-1 mt-1">
                  <a
                    href={`${blockExplorerUrl}/${tx.state.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline font-mono flex items-center gap-1"
                  >
                    {tx.state.hash.slice(0, 10)}...{tx.state.hash.slice(-8)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


/**
 * Formats verbose blockchain error messages into user-friendly text
 * @param error - Raw error message from wagmi/viem
 * @returns Shortened, user-friendly error message
 */
export function formatErrorMessage(error: string | null | undefined): string | null {
  if (!error) return null

  // Extract the main error message before technical details
  const lines = error.split('\n')

  const firstLine = lines[0]?.trim()
  if (!firstLine) return error

  const mainMessage = firstLine

  // Common error patterns to simplify
  if (mainMessage.includes('User rejected')) {
    return 'User rejected the request'
  }
  if (mainMessage.includes('insufficient funds')) {
    return 'Insufficient funds for transaction'
  }
  if (mainMessage.includes('gas required exceeds')) {
    return 'Gas estimation failed - insufficient balance or invalid transaction'
  }
  if (mainMessage.includes('execution reverted')) {
    return 'Transaction failed - please check token balance and try again'
  }

  // For other errors, return just the first sentence or line
  const firstSentence = mainMessage.split('.')[0] + '.'
  return firstSentence.length < mainMessage.length
    ? firstSentence
    : mainMessage
}