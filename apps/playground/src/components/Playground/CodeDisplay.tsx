import { useState } from 'react'
import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { ChevronUp, ChevronDown, Copy, Check } from 'lucide-react'

export default function CodeDisplay() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const { generateCode } = usePlaygroundConfig()

  const code = generateCode()

  const copyCode = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
            {'<>'} Installation & Usage
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
          {/* Installation */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">
              Install Package
            </h4>
            <div className="relative">
              <pre className="bg-background border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto">
                npm install @shieldkit/react
              </pre>
            </div>
          </div>

          {/* Usage Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-muted-foreground">
                Component Code
              </h4>
              <button
                onClick={copyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
              >
                {copied ? (
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
              <pre className="bg-background border border-border rounded-lg p-4 text-sm font-mono overflow-x-auto">
                {code}
              </pre>
            </div>
          </div>

          {/* Note */}
          <p className="text-xs text-muted-foreground">
            💡 Tip: Customize the configuration on the left to generate different code snippets
          </p>
        </div>
      )}
    </div>
  )
}
