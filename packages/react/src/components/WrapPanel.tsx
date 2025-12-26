import { useMemo, useState, useEffect } from 'react'
import { useWrapFlow } from '../hooks/useWrapFlow'
import { useConfidentialBalanceFor } from '../hooks/useConfidentialBalance'
import { useMultiTokenBalances } from '../hooks/useMultiTokenBalances'
import { Lock, Loader2, CheckCircle2, Rocket, AlertCircle } from 'lucide-react'
import type { Address } from 'viem'
import type { TokenConfig } from './types'
import TokenSelector from './TokenSelector'
import WrapStepIndicator from './WrapStepIndicator'
import { getTokenPrefix, formatErrorMessage } from '../utils/helpers'

interface WrapPanelProps {
  tokens: TokenConfig[]
  onWrapSuccess?: (token: Address, amount: bigint) => void
  cachedBalances: Record<string, bigint>
  setCachedBalances: React.Dispatch<React.SetStateAction<Record<string, bigint>>>
}

export default function WrapPanel({
  tokens,
  onWrapSuccess,
  cachedBalances,
  setCachedBalances,
}: WrapPanelProps) {
  const [selectedToken, setSelectedToken] = useState(tokens[0]?.symbol || '')
  const [amount, setAmount] = useState('')

  const selectedTokenConfig = useMemo(() => {
    return tokens.find((t) => t.symbol === selectedToken)
  }, [tokens, selectedToken])

  const tokenAddress = selectedTokenConfig?.address as Address

  // Fetch all token balances in batch
  const { balances } = useMultiTokenBalances(tokens)

  // Get current ERC20 balance for selected token
  const currentBalance = useMemo(() => {
    if (!selectedToken || !balances[selectedToken]) return 0
    const formatted = Number(balances[selectedToken].formatted)
    return isNaN(formatted) ? 0 : formatted
  }, [selectedToken, balances])

  // Check if amount exceeds balance
  const amountExceedsBalance = useMemo(() => {
    if (!amount) return false
    const amountNum = parseFloat(amount)
    return amountNum > currentBalance
  }, [amount, currentBalance])

  const {
    wrappedAddress,
    isLoadingWrapped,
    encryptedBalance,
    decryptedBalance,
    decrypt,
    isDecrypting,
  } = useConfidentialBalanceFor({
    erc20Address: tokenAddress,
    autoDecrypt: false, // Manual decrypt on button click
  })

  const {
    currentStep,
    hasWrapper,
    hasSufficientAllowance,
    executeNextStep,
    deployTx,
    approveTx,
    wrapTx,
    isLoading,
    reset,
  } = useWrapFlow({
    erc20Address: tokenAddress,
    decimals: selectedTokenConfig?.decimals || 6,
    onWrapSuccess: () => {
      console.log('Wrap successful!')
      // Clear cached balance for this token
      setCachedBalances((prev) => {
        const newBalances = { ...prev }
        delete newBalances[tokenAddress.toLowerCase()]
        return newBalances
      })

      // Call parent callback
      if (onWrapSuccess && amount) {
        const amountBigInt = BigInt(
          Math.floor(parseFloat(amount) * 10 ** (selectedTokenConfig?.decimals || 6))
        )
        onWrapSuccess(tokenAddress, amountBigInt)
      }
      setAmount('')
    },
  })

  // Combined success state
  const isSuccess = wrapTx.isSuccess
  const txHash = wrapTx.hash

  // Cache decrypted balance when it becomes available
  useEffect(() => {
    if (decryptedBalance !== null && tokenAddress) {
      setCachedBalances((prev) => ({
        ...prev,
        [tokenAddress.toLowerCase()]: decryptedBalance,
      }))
    }
  }, [decryptedBalance, tokenAddress])

  // Reset flow state when token changes
  useEffect(() => {
    reset()
    setAmount('')
  }, [selectedToken, reset])

  // Get cached balance to display
  const displayBalance = cachedBalances[tokenAddress?.toLowerCase()] ?? null

  const handleExecuteStep = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      return
    }

    try {
      await executeNextStep(amount)
    } catch (err) {
      console.error('Step execution error:', err)
    }
  }

  // Get button text based on current step
  const getButtonText = () => {
    if (isLoading) {
      if (deployTx.isLoading) return 'Deploying Wrapper...'
      if (approveTx.isLoading) return 'Approving...'
      if (wrapTx.isLoading) return 'Wrapping...'
      return 'Processing...'
    }

    if (!hasWrapper) return 'Deploy & Wrap'
    if (!hasSufficientAllowance(amount || '0')) return 'Approve & Wrap'
    return 'Wrap to Private'
  }

  // Get button icon
  const getButtonIcon = () => {
    if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />
    if (!hasWrapper) return <Rocket className="w-4 h-4" />
    return <Lock className="w-4 h-4" />
  }

  // Helper to get balance for TokenSelector
  const getBalanceForSelector = (symbol: string) => {
    const balance = balances[symbol]
    if (!balance) return null
    return parseFloat(balance.formatted).toFixed(4)
  }

  return (
    <div className="space-y-4">
      {/* Token Selector */}
      <TokenSelector
        tokens={tokens.map((t) => t.symbol)}
        tokenType="erc20"
        selectedToken={selectedToken}
        onTokenSelect={setSelectedToken}
        getBalance={getBalanceForSelector}
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
            disabled={isLoading || currentBalance === 0}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10 rounded-dynamic transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            MAX
          </button>
        </div>
        {/* Insufficient Balance Error */}
        {amountExceedsBalance && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            Insufficient balance. Available: {currentBalance.toFixed(4)} {selectedToken}
          </p>
        )}
      </div>

      {/* Private Balance Display */}
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

      {/* Step Indicator */}
      <WrapStepIndicator
        currentStep={currentStep}
        hasWrapper={hasWrapper}
        deploySuccess={deployTx.isSuccess}
        approveSuccess={approveTx.isSuccess}
        wrapSuccess={wrapTx.isSuccess}
        isDeployLoading={deployTx.isLoading}
        isApproveLoading={approveTx.isLoading}
        isWrapLoading={wrapTx.isLoading}
      />

      {/* Wrap Button */}
      <button
        onClick={handleExecuteStep}
        disabled={isLoading || !amount || parseFloat(amount) <= 0 || amountExceedsBalance}
        className="w-full px-4 py-3.5 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 disabled:from-muted disabled:to-muted text-primary-foreground rounded-dynamic-xl font-semibold text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {getButtonIcon()}
        {getButtonText()}
      </button>

      {/* Success State */}
      {isSuccess && txHash && (
        <div className="px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-dynamic-xl">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">
                Wrap successful!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {(deployTx.error || approveTx.error || wrapTx.error) && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-dynamic-xl">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Error: {formatErrorMessage(deployTx.error || approveTx.error || wrapTx.error)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
