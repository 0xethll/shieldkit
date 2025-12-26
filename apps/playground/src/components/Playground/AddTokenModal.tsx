import { useState } from 'react'
import { X, AlertCircle, CheckCircle, Loader2, Plus } from 'lucide-react'
import type { TokenConfig } from '../../config/scenarios'
import { useTokenValidator, type TokenInfo } from '../../hooks/useTokenValidator'

interface AddTokenModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (token: TokenConfig) => void
}

export default function AddTokenModal({ isOpen, onClose, onAdd }: AddTokenModalProps) {
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { validateToken, isValidating } = useTokenValidator()

  if (!isOpen) return null

  const handleValidate = async () => {
    setError('')
    setTokenInfo(null)
    setSuccess(false)

    if (!tokenAddress.trim()) {
      setError('Please enter a token address')
      return
    }

    try {
      const info = await validateToken(tokenAddress.trim())
      setTokenInfo(info)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate token')
    }
  }

  const handleAdd = () => {
    if (!tokenInfo) return

    try {
      const token: TokenConfig = {
        address: tokenInfo.address,
        symbol: tokenInfo.symbol,
        name: tokenInfo.name,
        decimals: tokenInfo.decimals,
      }

      onAdd(token)
      setSuccess(true)

      // Close modal after showing success
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      // Show error in modal for better UX
      const errorMessage = err instanceof Error ? err.message : 'Failed to add token'
      setError(errorMessage)
      setSuccess(false)
      // Reset tokenInfo so user can validate again or enter a different address
      setTokenInfo(null)
    }
  }

  const handleClose = () => {
    setTokenAddress('')
    setTokenInfo(null)
    setError('')
    setSuccess(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background border border-border rounded-xl shadow-lg p-6 m-4 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Add Custom Token</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input field */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Token Contract Address
          </label>
          <input
            type="text"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="0x..."
            disabled={isValidating || success}
            className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Token info display */}
        {tokenInfo && !success && (
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-green-900 dark:text-green-100 text-sm mb-2">
                  Token Validated
                </h4>
                <div className="text-xs text-green-800 dark:text-green-200 space-y-1">
                  <div>
                    <span className="font-medium">Name:</span> {tokenInfo.name}
                  </div>
                  <div>
                    <span className="font-medium">Symbol:</span> {tokenInfo.symbol}
                  </div>
                  <div>
                    <span className="font-medium">Decimals:</span> {tokenInfo.decimals}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Token added successfully! Closing...</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isValidating || success}
            className="flex-1 px-4 py-2 bg-secondary hover:bg-accent border border-border rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          {!tokenInfo ? (
            <button
              type="button"
              onClick={handleValidate}
              disabled={!tokenAddress.trim() || isValidating || success}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isValidating && <Loader2 className="w-4 h-4 animate-spin" />}
              {isValidating ? 'Validating...' : 'Validate Token'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={success}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Token
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
