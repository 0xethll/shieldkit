'use client'

import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { Loader2, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFHEContext } from '@/contexts/FHEContext'

export function TokenBalance() {
    const { address, connector } = useAccount()
    const {
        isFHEReady,
        fheInstance,
        fheError,
        retryFHE,
        signer,
    } = useFHEContext()

    // Calculate progress state locally (moved from FHEContext for performance)
    const progress = useMemo(() => {
        const steps = [
            { key: 'wallet', label: 'Connect wallet', complete: !!address },
            {
                key: 'connector',
                label: 'Initialize connector',
                complete: !!connector,
            },
            {
                key: 'fhe',
                label: 'Load FHE system',
                complete: isFHEReady && !!fheInstance,
            },
            { key: 'signer', label: 'Initialize signer', complete: !!signer },
        ]

        const completedCount = steps.filter((step) => step.complete).length
        const currentStep = steps.find((step) => !step.complete)

        return {
            steps,
            completedCount,
            totalCount: steps.length,
            currentStep,
            isComplete: completedCount === steps.length,
        }
    }, [address, connector, isFHEReady, fheInstance, signer])

    // Don't show if not connected
    if (!address) {
        return null
    }

    return (
        <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                System Status
            </div>

            {fheError && (
                <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-red-800 dark:text-red-200">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">FHE Initialization Failed</span>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300">
                        {fheError}
                    </p>
                    <button
                        onClick={retryFHE}
                        className="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition-colors"
                    >
                        Retry Initialization
                    </button>
                </div>
            )}

            {!progress.isComplete && !fheError && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                            Initializing ({progress.completedCount}/
                            {progress.totalCount})
                        </span>
                        <span className="text-gray-500">
                            {Math.round(
                                (progress.completedCount /
                                    progress.totalCount) *
                                    100,
                            )}
                            %
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                            style={{
                                width: `${
                                    (progress.completedCount /
                                        progress.totalCount) *
                                    100
                                }%`,
                            }}
                        />
                    </div>

                    {progress.currentStep && (
                        <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>{progress.currentStep.label}...</span>
                        </div>
                    )}

                    <div className="space-y-1">
                        {progress.steps.map((step) => (
                            <div
                                key={step.key}
                                className="flex items-center gap-2 text-xs"
                            >
                                <div
                                    className={cn(
                                        'w-1.5 h-1.5 rounded-full transition-colors',
                                        step.complete
                                            ? 'bg-green-500'
                                            : step === progress.currentStep
                                            ? 'bg-amber-500 animate-pulse'
                                            : 'bg-gray-300 dark:bg-gray-600',
                                    )}
                                />
                                <span
                                    className={cn(
                                        'transition-colors',
                                        step.complete
                                            ? 'text-green-600 dark:text-green-400'
                                            : step === progress.currentStep
                                            ? 'text-amber-600 dark:text-amber-400'
                                            : 'text-gray-500 dark:text-gray-400',
                                    )}
                                >
                                    {step.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {progress.isComplete && !fheError && (
                <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">System Ready</span>
                    </div>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        All components initialized successfully
                    </p>
                </div>
            )}
        </div>
    )
}
