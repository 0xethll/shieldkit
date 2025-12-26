// Modal for adding custom ERC20 tokens

'use client'

import { useState } from 'react'
import { X, Plus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useCustomTokens } from '@/contexts/CustomTokensContext'
import { useTokenValidator } from '@/hooks/useTokenList'

interface AddTokenModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddTokenModal({
  isOpen,
  onClose,
}: AddTokenModalProps) {
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenInfo, setTokenInfo] = useState<{
    name: string
    symbol: string
    decimals: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { addToken } = useCustomTokens()
  const { validateToken, isValidating } = useTokenValidator()

  if (!isOpen) return null

  const handleValidate = async () => {
    setError(null)
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

  const handleAdd = async () => {
    if (!tokenInfo) return

    try {
      addToken(tokenAddress.trim())
      setSuccess(true)
      // Don't call onTokenAdded here - let React's dependency chain handle the update
      // when customTokens state changes, useTokenList will automatically refetch
      // Close modal after showing success message
      setTimeout(() => {
        handleClose()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add token')
    }
  }

  const handleClose = () => {
    setTokenAddress('')
    setTokenInfo(null)
    setError(null)
    setSuccess(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plus className="h-6 w-6 text-blue-600" />
            Add Custom Token
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Info message */}
          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200">
            <p>
              Enter the contract address of an ERC20 token on Sepolia testnet.
              The token will be validated and added to your list.
            </p>
          </div>

          {/* Input field */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Token Contract Address
            </label>
            <input
              type="text"
              value={tokenAddress}
              onChange={(e) => setTokenAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isValidating || success}
            />
          </div>

          {/* Token info display */}
          {tokenInfo && !success && (
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Token Validated
                  </h4>
                  <div className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <div>
                      <span className="font-medium">Name:</span> {tokenInfo.name}
                    </div>
                    <div>
                      <span className="font-medium">Symbol:</span>{' '}
                      {tokenInfo.symbol}
                    </div>
                    <div>
                      <span className="font-medium">Decimals:</span>{' '}
                      {tokenInfo.decimals}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">
                  Token added successfully! Closing...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleClose}
            disabled={isValidating || success}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          {!tokenInfo ? (
            <button
              onClick={handleValidate}
              disabled={!tokenAddress.trim() || isValidating || success}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isValidating && <Loader2 className="h-4 w-4 animate-spin" />}
              {isValidating ? 'Validating...' : 'Validate Token'}
            </button>
          ) : (
            <button
              onClick={handleAdd}
              disabled={success}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Token
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
