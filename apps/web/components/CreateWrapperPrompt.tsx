// Component prompting user to create a confidential wrapper for an ERC20 token

'use client'

import { AlertCircle, Shield, CheckCircle, Loader2 } from 'lucide-react'
import { useCreateWrappedToken } from '@/hooks/useFactoryContract'
import type { TokenPair } from '@/hooks/useTokenList'

interface CreateWrapperPromptProps {
  tokenPair: TokenPair
  onSuccess?: () => void
}

export function CreateWrapperPrompt({
  tokenPair,
  onSuccess,
}: CreateWrapperPromptProps) {
  const {
    createWrapper,
    isLoading,
    isConfirmed,
    error,
    txHash,
  } = useCreateWrappedToken()

  const handleCreate = async () => {
    try {
      await createWrapper(tokenPair.erc20Address)
      // Wait a bit for the transaction to be confirmed
      // then trigger the parent component to refetch token list
      setTimeout(() => {
        onSuccess?.()
      }, 3000)
    } catch (err) {
      console.error('Failed to create wrapper:', err)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-8">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        {/* Icon and title */}
        <div className="flex justify-center">
          <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-full">
            <AlertCircle className="h-12 w-12 text-amber-600 dark:text-amber-400" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">
            Wrapped Token Not Created Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            This ERC20 token doesn&apos;t have a confidential wrapper yet.
          </p>
        </div>

        {/* Token info */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                Token Name:
              </span>
              <span className="font-semibold">{tokenPair.erc20Name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Symbol:</span>
              <span className="font-semibold">{tokenPair.erc20Symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">
                ERC20 Address:
              </span>
              <span className="font-mono text-xs">
                {tokenPair.erc20Address.slice(0, 6)}...
                {tokenPair.erc20Address.slice(-4)}
              </span>
            </div>
          </div>
        </div>

        {/* Benefits info */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Why Create a Confidential Wrapper?
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>
                  • Enable fully private transfers with encrypted amounts
                </li>
                <li>• Only you can see your confidential token balance</li>
                <li>• Convert between ERC20 and confidential tokens anytime</li>
                <li>
                  • One wrapper per ERC20 token - shared by all users on the
                  network
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div>
          <button
            onClick={handleCreate}
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Creating Wrapper...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5" />
                Create Confidential Wrapper
              </>
            )}
          </button>
        </div>

        {/* Status messages */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {isConfirmed && (
          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="h-5 w-5" />
              <div className="text-left flex-1">
                <p className="text-sm font-semibold mb-1">
                  Wrapper created successfully!
                </p>
                {txHash && (
                  <a
                    href={`https://sepolia.etherscan.io/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline hover:no-underline"
                  >
                    View transaction
                  </a>
                )}
                <p className="text-xs mt-2">
                  Refreshing token list in a moment...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Additional info */}
        <p className="text-xs text-gray-500 dark:text-gray-500">
          Creating a wrapper will deploy a new smart contract on the network.
          This is a one-time operation per token.
        </p>
      </div>
    </div>
  )
}
