import { useState } from 'react'
import { useTransfer } from '@shieldkit/react'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { SEPOLIA_TEST_TOKENS } from '../../config'
import { Send, Loader2, CheckCircle2, AlertCircle, Lock } from 'lucide-react'
import type { Address } from 'viem'

export default function TransferPanel() {
  const { customTokens } = usePlaygroundConfig()
  const [selectedToken, setSelectedToken] = useState(customTokens[0] || 'USDC')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  const tokenAddress = SEPOLIA_TEST_TOKENS.wrapper as Address

  const { transfer, isLoading, isSuccess, error, txHash, reset } = useTransfer({
    tokenAddress,
    decimals: 6,
    onSuccess: () => {
      console.log('Transfer successful!')
      setRecipient('')
      setAmount('')
    },
  })

  const handleTransfer = async () => {
    if (!recipient || !amount || parseFloat(amount) <= 0) {
      return
    }

    try {
      await transfer(recipient as Address, amount)
    } catch (err) {
      console.error('Transfer error:', err)
    }
  }

  return (
    <div className="space-y-4">
      {/* Recipient Address */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">
          To Address
        </label>
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
          disabled={isLoading}
          className="w-full px-4 py-3 bg-secondary border border-border rounded-dynamic-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        />
      </div>

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
            onClick={() => setAmount('50')}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-dynamic transition-colors"
          >
            MAX
          </button>
        </div>
      </div>

      {/* Encrypted Balance */}
      <div className="px-4 py-3 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-dynamic-xl">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Encrypted Balance</span>
          <Lock className="w-3 h-3 text-primary" />
        </div>
        <div className="text-lg font-bold font-mono">░░░.░░ {selectedToken}</div>
        <button className="text-xs text-primary hover:underline mt-1">
          🔓 Decrypt to view
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="px-3 py-2 bg-purple-500/10 border border-purple-500/20 rounded-dynamic-lg">
        <p className="text-xs text-purple-600 dark:text-purple-400">
          🔒 Amount will be encrypted on-chain
        </p>
      </div>

      {/* Transfer Button */}
      <button
        onClick={handleTransfer}
        disabled={isLoading || !recipient || !amount || parseFloat(amount) <= 0}
        className="w-full px-4 py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:from-muted disabled:to-muted text-primary-foreground rounded-dynamic-xl font-semibold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Send Private
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
                Transfer successful!
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </p>
              <button
                onClick={reset}
                className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1"
              >
                Send another
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
  )
}
