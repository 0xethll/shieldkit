// System status panel for decryption requirements

'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Activity } from 'lucide-react'
import { useConfidentialBalance } from '@/contexts/ConfidentialBalanceContext'
import { cn } from '@/lib/utils'

export function DecryptionStatusPanel() {
  const { getDecryptionRequirements } = useConfidentialBalance()
  const [isExpanded, setIsExpanded] = useState(false)

  const status = getDecryptionRequirements()

  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-200/30 dark:border-indigo-800/30 overflow-hidden">
      {/* Header - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            System Status
          </span>
        </div>
        <div className="flex items-center gap-2">
          {status.canDecrypt ? (
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              Ready
            </span>
          ) : (
            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
              Not Ready
            </span>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          )}
        </div>
      </button>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="px-4 pb-3 space-y-2 border-t border-indigo-200/20 dark:border-indigo-800/20 pt-3">
          {status.requirements.map((req) => (
            <div
              key={req.key}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                req.isMet
                  ? 'bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800/50'
                  : 'bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50'
              )}
            >
              {req.isMet ? (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
              )}
              <span
                className={cn(
                  'font-medium',
                  req.isMet
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-amber-700 dark:text-amber-300'
                )}
              >
                {req.label}
              </span>
            </div>
          ))}

          {/* Helper Text */}
          {!status.canDecrypt && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 px-3">
              Complete all requirements above to enable balance decryption.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
