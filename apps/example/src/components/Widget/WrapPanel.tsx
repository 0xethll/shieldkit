import { useState } from 'react'
import { useWrap } from '@z-payment/react'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { SEPOLIA_TEST_TOKENS } from '../../config'
import { ChevronDown, Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import type { Address } from 'viem'

export default function WrapPanel() {
  const { customTokens, features } = usePlaygroundConfig()
  const [selectedToken, setSelectedToken] = useState(customTokens[0] || 'USDC')
  const [amount, setAmount] = useState('')
  const [isTokenSelectorOpen, setIsTokenSelectorOpen] = useState(false)

  // Get token address - in real app, you'd have a mapping
  const tokenAddress = SEPOLIA_TEST_TOKENS.wrapper as Address

  const { wrap, isLoading, isSuccess, error, txHash, reset } = useWrap({
    tokenAddress,
    decimals: 6,
    onSuccess: () => {
      console.log('Wrap successful!')
      setAmount('')
    },
  })

  const handleWrap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return
    }

    try {
      await wrap(amount)
    } catch (err) {
      console.error('Wrap error:', err)
    }
  }

  return (
    <div className="space-y-4">
      {/* Token Selector */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-2">
          Select Token
        </label>
        <div className="relative">
          <button
            onClick={() => setIsTokenSelectorOpen(!isTokenSelectorOpen)}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-xl flex items-center justify-between hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xs font-bold">
                {selectedToken[0]}
              </div>
              <div className="text-left">
                <div className="font-semibold text-sm">{selectedToken}</div>
                <div className="text-xs text-muted-foreground">Balance: 1,000.00</div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isTokenSelectorOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {isTokenSelectorOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-background border border-border rounded-xl shadow-lg z-10">
              {customTokens.map((token) => (
                <button
                  key={token}
                  onClick={() => {
                    setSelectedToken(token)
                    setIsTokenSelectorOpen(false)
                  }}
                  className="w-full px-3 py-2.5 hover:bg-secondary rounded-lg flex items-center gap-3 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xs font-bold">
                    {token[0]}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">{token}</div>
                    <div className="text-xs text-muted-foreground">1,000.00</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
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

      {/* Private Balance Display */}
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

      {/* Auto-Deploy Info */}
      {features.autoDeploy && (
        <div className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            💡 Wrapper will be auto-deployed if needed
          </p>
        </div>
      )}

      {/* Wrap Button */}
      <button
        onClick={handleWrap}
        disabled={isLoading || !amount || parseFloat(amount) <= 0}
        className="w-full px-4 py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:from-muted disabled:to-muted text-primary-foreground rounded-xl font-semibold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Wrapping...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Wrap to Private
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
                Wrap successful!
              </p>
              <p className="text-xs text-muted-foreground font-mono mt-1">
                {txHash.slice(0, 10)}...{txHash.slice(-8)}
              </p>
              <button
                onClick={reset}
                className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1"
              >
                Wrap more
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
  )
}
