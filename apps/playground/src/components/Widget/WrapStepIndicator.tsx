import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import type { WrapFlowStep } from '@shieldkit/react'

interface StepConfig {
  id: WrapFlowStep
  label: string
  order: number
}

const STEPS: StepConfig[] = [
  { id: 'deploy', label: 'Deploy Wrapper', order: 1 },
  { id: 'approve', label: 'Approve Tokens', order: 2 },
  { id: 'wrap', label: 'Wrap to Private', order: 3 },
]

interface WrapStepIndicatorProps {
  currentStep: WrapFlowStep
  hasWrapper: boolean
  deploySuccess?: boolean
  approveSuccess?: boolean
  wrapSuccess?: boolean
  isDeployLoading?: boolean
  isApproveLoading?: boolean
  isWrapLoading?: boolean
}

export default function WrapStepIndicator({
  currentStep,
  hasWrapper,
  deploySuccess = false,
  approveSuccess = false,
  wrapSuccess = false,
  isDeployLoading = false,
  isApproveLoading = false,
  isWrapLoading = false,
}: WrapStepIndicatorProps) {
  // Skip deploy step if wrapper already exists
  const visibleSteps = hasWrapper
    ? STEPS.filter((s) => s.id !== 'deploy')
    : STEPS

  const getStepState = (stepId: WrapFlowStep) => {
    // Completed states
    if (stepId === 'deploy' && (hasWrapper || deploySuccess)) return 'completed'
    if (stepId === 'approve' && approveSuccess) return 'completed'
    if (stepId === 'wrap' && wrapSuccess) return 'completed'

    // Loading states
    if (stepId === 'deploy' && isDeployLoading) return 'loading'
    if (stepId === 'approve' && isApproveLoading) return 'loading'
    if (stepId === 'wrap' && isWrapLoading) return 'loading'

    // Current step
    if (stepId === currentStep) return 'current'

    // Pending
    return 'pending'
  }

  const getStepIcon = (stepId: WrapFlowStep) => {
    const state = getStepState(stepId)

    if (state === 'completed') {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />
    }
    if (state === 'loading') {
      return <Loader2 className="w-5 h-5 animate-spin text-primary" />
    }
    if (state === 'current') {
      return <Circle className="w-5 h-5 text-primary fill-primary" />
    }
    return <Circle className="w-5 h-5 text-muted-foreground" />
  }

  const getStepColor = (stepId: WrapFlowStep) => {
    const state = getStepState(stepId)
    if (state === 'completed') return 'text-green-600 dark:text-green-400'
    if (state === 'loading' || state === 'current') return 'text-primary'
    return 'text-muted-foreground'
  }

  if (visibleSteps.length === 0 || currentStep === 'idle' || currentStep === 'complete') {
    return null
  }

  return (
    <div className="px-4 py-3 bg-secondary/50 border border-border rounded-dynamic-xl">
      <div className="flex items-center justify-between gap-2">
        {visibleSteps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-2 flex-1">
            {/* Step */}
            <div className="flex items-center gap-2">
              {getStepIcon(step.id)}
              <span className={`text-sm font-medium ${getStepColor(step.id)}`}>
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < visibleSteps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 bg-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
