import { useState, useEffect, useMemo } from 'react'
import { useTransfer } from '../hooks/useTransfer'
import { useConfidentialBalanceFor } from '../hooks/useConfidentialBalance'
import { Send, Loader2, CheckCircle2, AlertCircle, Lock } from 'lucide-react'
import type { Address } from 'viem'
import type { TokenConfig } from './types'
import TokenSelector from './TokenSelector'
import { getTokenPrefix, formatErrorMessage } from '../utils/helpers'

interface TransferPanelProps {
  tokens: TokenConfig[]
  onTransferSuccess?: (token: Address, recipient: Address, amount: bigint) => void
}

export default function TransferPanel({ tokens, onTransferSuccess }: TransferPanelProps) {
  const [cachedBalances, setCachedBalances] = useState<Record<string, bigint>>({})
  const [selectedToken, setSelectedToken] = useState(tokens[0]?.symbol || '')
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')

  // Get selected token config
  const selectedTokenConfig = useMemo(() => {
    return tokens.find((t) => t.symbol === selectedToken)
  }, [tokens, selectedToken])

  const erc20Address = selectedTokenConfig?.address as Address

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

  const tokenAddress = wrappedAddress as Address

  const { transfer, isLoading, isSuccess, error, txHash } = useTransfer({
    tokenAddress,
    decimals: selectedTokenConfig?.decimals || 6,
    onSuccess: () => {
      console.log('Transfer successful!')
      // Clear cached balance for this token
      setCachedBalances((prev) => {
        const newBalances = { ...prev }
        delete newBalances[erc20Address.toLowerCase()]
        return newBalances
      })

      // Call parent callback
      if (onTransferSuccess && recipient && amount) {
        const amountBigInt = BigInt(
          Math.floor(parseFloat(amount) * 10 ** (selectedTokenConfig?.decimals || 6))
        )
        onTransferSuccess(erc20Address, recipient as Address, amountBigInt)
      }

      setRecipient('')
      setAmount('')
    },
  })

  // Cache decrypted balance when it becomes available
  useEffect(() => {
    if (decryptedBalance !== null && erc20Address) {
      setCachedBalances((prev) => ({
        ...prev,
        [erc20Address.toLowerCase()]: decryptedBalance,
      }))
    }
  }, [decryptedBalance, erc20Address])

  // Get cached balance to display
  const displayBalance = cachedBalances[erc20Address?.toLowerCase()] ?? null

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

  // Helper to get balance for TokenSelector
  const getBalanceForSelector = (symbol: string) => {
    const config = tokens.find((t) => t.symbol === symbol)
    if (!config) return null

    const cached = cachedBalances[config.address.toLowerCase()]
    if (cached !== undefined && cached !== null) {
      return (Number(cached) / 10 ** config.decimals).toFixed(4)
    }
    return null // Not decrypted yet
  }

  return (
    <div className="space-y-4">
      {/* Token Selector */}
      <TokenSelector
        tokens={tokens.map((t) => t.symbol)}
        tokenType="wrapped"
        selectedToken={selectedToken}
        onTokenSelect={setSelectedToken}
        getBalance={getBalanceForSelector}
        disabled={isLoading}
      />

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
            Insufficient balance. Available: {currentBalance.toFixed(4)}{' '}
            {getTokenPrefix('wrapped')}
            {selectedToken}
          </p>
        )}
      </div>

      {/* Encrypted Balance */}
      <div className="px-4 py-3 bg-gradient-to-br from-primary/5 to-transparent border border-primary/10 rounded-dynamic-xl">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Encrypted Balance</span>
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
                {(Number(displayBalance) / 10 ** (selectedTokenConfig?.decimals || 6)).toFixed(4)}{' '}
                {getTokenPrefix('wrapped')}
                {selectedToken}
              </div>
            ) : (
              <div className="text-lg font-bold font-mono">
                ░░░.░░ {getTokenPrefix('wrapped')}
                {selectedToken}
              </div>
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
          <div className="text-sm text-muted-foreground">Wrapper not deployed yet</div>
        )}
      </div>

      {/* Transfer Button */}
      <button
        onClick={handleTransfer}
        disabled={
          isLoading ||
          !recipient ||
          !amount ||
          parseFloat(amount) <= 0 ||
          amountExceedsBalance ||
          displayBalance === null
        }
        className="w-full px-4 py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:from-muted disabled:to-muted text-primary-foreground rounded-dynamic-xl font-semibold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : displayBalance === null ? (
          <>
            <Lock className="w-4 h-4" />
            Decrypt Balance First
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
  )
}
