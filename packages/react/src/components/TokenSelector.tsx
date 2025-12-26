import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface TokenSelectorProps {
  tokens: string[]
  tokenType: 'erc20' | 'wrapped'
  selectedToken: string
  onTokenSelect: (token: string) => void
  getBalance?: (token: string) => string | null
  disabled?: boolean
}

export default function TokenSelector({
  tokens,
  tokenType,
  selectedToken,
  onTokenSelect,
  getBalance,
  disabled = false,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (token: string) => {
    onTokenSelect(token)
    setIsOpen(false)
  }

  const displayBalance = (token: string) => {
    if (getBalance) {
      const balance = getBalance(token)
      if (balance !== null && balance !== undefined) {
        return `Balance: ${balance}`
      }
      // For wrapped tokens, if not decrypted yet
      if (tokenType === 'wrapped') {
        return '🔒 Encrypted'
      }
    }
    // No wallet connected or no balance data
    return '--'
  }

  const tokenPrefix = tokenType === 'wrapped' ? 'c' : ''

  return (
    <div>
      <label className="block text-xs font-medium text-muted-foreground mb-2">
        Select Token
      </label>
      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="w-full px-4 py-3 bg-secondary border border-border rounded-dynamic-xl flex items-center justify-between hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xs font-bold">
              {selectedToken[0]}
            </div>
            <div className="text-left">
              <div className="font-semibold text-sm">
                {tokenPrefix}{selectedToken}
              </div>
              <div className="text-xs text-muted-foreground">
                {displayBalance(selectedToken)}
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-background border border-border rounded-dynamic-xl shadow-lg z-10">
            {tokens.map((token) => (
              <button
                key={token}
                onClick={() => handleSelect(token)}
                className="w-full px-3 py-2.5 hover:bg-secondary rounded-dynamic-lg flex items-center gap-3 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xs font-bold">
                  {token[0]}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">
                    {tokenPrefix}{token}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {displayBalance(token)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
