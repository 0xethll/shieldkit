import { useState } from 'react'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { ChevronUp, ChevronDown, Copy, Check } from 'lucide-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodeDisplay() {
  const [isExpanded, setIsExpanded] = useState(false) // Default expanded
  const [activeStep, setActiveStep] = useState(0)
  const [copiedStep, setCopiedStep] = useState<number | null>(null)
  const { generateCode } = usePlaygroundConfig()

  const codeSteps = generateCode()

  const copyCode = async (code: string, stepIndex: number) => {
    await navigator.clipboard.writeText(code)
    setCopiedStep(stepIndex)
    setTimeout(() => setCopiedStep(null), 2000)
  }

  return (
    <div className="border-t border-border bg-secondary/50 flex-shrink-0">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-3 flex items-center justify-between hover:bg-secondary/70 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-semibold">
            {'<>'} Integration Guide
          </span>
          <span className="text-xs text-muted-foreground">
            ({codeSteps.length} steps)
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4">
          {/* Step Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {codeSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeStep === index
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary hover:bg-secondary/80 text-foreground'
                }`}
              >
                <span className="mr-2">Step {index + 1}</span>
                {step.title}
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          {codeSteps.map((step, index) => (
            <div
              key={index}
              className={index === activeStep ? 'block' : 'hidden'}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-semibold mb-1">{step.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                <button
                  onClick={() => copyCode(step.code, index)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                >
                  {copiedStep === index ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <SyntaxHighlighter
                  language={step.language === 'tsx' ? 'tsx' : step.language === 'bash' ? 'bash' : 'typescript'}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    maxHeight: '400px',
                    border: '1px solid hsl(var(--border))',
                  }}
                  showLineNumbers
                >
                  {step.code}
                </SyntaxHighlighter>
              </div>
            </div>
          ))}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="px-4 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <span className="text-xs text-muted-foreground">
              Step {activeStep + 1} of {codeSteps.length}
            </span>
            <button
              onClick={() => setActiveStep(Math.min(codeSteps.length - 1, activeStep + 1))}
              disabled={activeStep === codeSteps.length - 1}
              className="px-4 py-2 text-sm font-medium bg-secondary hover:bg-secondary/80 text-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Note */}
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400">
              💡 Tip: Customize tokens, features, and theme in the left panel to update the generated code
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
