// Progress indicator for multi-step wrap operations

'use client'

import { CheckCircle, Loader2, Circle } from 'lucide-react'

export type WrapStep = 'create' | 'approve' | 'wrap'

interface WrapProgressIndicatorProps {
  currentStep: WrapStep | null
  completedSteps: WrapStep[]
  needsWrapperCreation: boolean
}

export function WrapProgressIndicator({
  currentStep,
  completedSteps,
  needsWrapperCreation,
}: WrapProgressIndicatorProps) {
  const steps = [
    ...(needsWrapperCreation ? [{ id: 'create' as WrapStep, label: 'Create Wrapper' }] : []),
    { id: 'approve' as WrapStep, label: 'Approve Tokens' },
    { id: 'wrap' as WrapStep, label: 'Wrap Tokens' },
  ]

  const getStepStatus = (stepId: WrapStep) => {
    if (completedSteps.includes(stepId)) return 'completed'
    if (currentStep === stepId) return 'active'
    return 'pending'
  }

  if (!currentStep && completedSteps.length === 0) return null

  return (
    <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
      <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3">
        Wrap Progress
      </h4>
      <div className="space-y-3">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id)
          return (
            <div key={step.id} className="flex items-center gap-3">
              {/* Step indicator */}
              <div className="flex-shrink-0">
                {status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : status === 'active' ? (
                  <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-300 dark:text-gray-600" />
                )}
              </div>

              {/* Step label */}
              <div className="flex-1">
                <div
                  className={`text-sm font-medium ${
                    status === 'completed'
                      ? 'text-green-700 dark:text-green-300'
                      : status === 'active'
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {step.label}
                </div>
                {status === 'active' && (
                  <div className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                    Processing...
                  </div>
                )}
                {status === 'completed' && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                    Completed
                  </div>
                )}
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[10px] top-[28px] w-px h-6 bg-gray-200 dark:bg-gray-700" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
