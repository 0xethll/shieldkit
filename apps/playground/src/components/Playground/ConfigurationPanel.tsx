import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import { scenarios, type ScenarioId, TOKENS, type TokenConfig } from '../../config/scenarios'
import {
  Target,
  Coins,
  Settings,
  Palette,
  Eye,
  Lock,
  Send,
  Download,
  Zap
} from 'lucide-react'

export default function ConfigurationPanel() {
  const {
    currentScenario,
    customTokens,
    defaultTab,
    features,
    theme,
    setScenario,
    setTokens,
    setDefaultTab,
    toggleFeature,
    setThemeType,
    setAccentColor,
    setRadiusSize,
    generateCode,
  } = usePlaygroundConfig()

  const toggleToken = (token: TokenConfig) => {
    const exists = customTokens.some((t) => t.address === token.address)

    if (exists) {
      setTokens(customTokens.filter((t) => t.address !== token.address))
    } else {
      setTokens([...customTokens, token])
    }
  }

  const copyCode = () => {
    const code = generateCode()
    navigator.clipboard.writeText(code)
    // TODO: Add toast notification
    console.log('Code copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      {/* Scenario Selection */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Choose Scenario</h3>
        </div>
        <select
          value={currentScenario.id}
          onChange={(e) => setScenario(e.target.value as ScenarioId)}
          className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        >
          {Object.values(scenarios).map((scenario) => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground mt-2">
          {currentScenario.description}
        </p>
      </section>

      {/* Token Configuration */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Coins className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Token Configuration</h3>
        </div>
        <div className="space-y-2">
          {TOKENS.map((token) => {
            const isSelected = customTokens.some(t => t.address === token.address)

            return (
            <label
              key={token.address}
              className="flex items-center gap-3 p-3 bg-secondary border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleToken(token)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-medium">{token.symbol}</span>
            </label>
          
          )})}
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Features</h3>
        </div>
        <div className="space-y-2">
          <FeatureToggle
            icon={<Lock className="w-4 h-4" />}
            label="Wrap"
            enabled={features.wrap}
            onToggle={() => toggleFeature('wrap')}
          />
          <FeatureToggle
            icon={<Send className="w-4 h-4" />}
            label="Transfer"
            enabled={features.transfer}
            onToggle={() => toggleFeature('transfer')}
          />
          <FeatureToggle
            icon={<Download className="w-4 h-4" />}
            label="Unwrap"
            enabled={features.unwrap}
            onToggle={() => toggleFeature('unwrap')}
          />
        </div>
      </section>

      {/* Appearance */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Appearance</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              Theme
            </label>
            <select
              value={theme.type}
              onChange={(e) => setThemeType(e.target.value as 'dark' | 'light')}
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              Accent Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['purple', 'blue', 'green', 'orange'] as const).map((color) => (
                <button
                  key={color}
                  onClick={() => setAccentColor(color)}
                  className={`h-8 rounded-lg border-2 transition-all ${
                    theme.accent === color
                      ? 'border-white scale-105'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  style={{
                    background:
                      color === 'purple'
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : color === 'blue'
                        ? 'linear-gradient(135deg, #4f46e5 0%, #2563eb 100%)'
                        : color === 'green'
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              Border Radius
            </label>
            <select
              value={theme.radius}
              onChange={(e) =>
                setRadiusSize(e.target.value as 'none' | 'small' | 'medium' | 'large')
              }
              className="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="none">None</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </section>

      {/* Default View */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Default View</h3>
        </div>
        <div className="space-y-2">
          {(['wrap', 'transfer', 'unwrap'] as const).map((tab) => (
            <label
              key={tab}
              className="flex items-center gap-3 p-3 bg-secondary border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
            >
              <input
                type="radio"
                name="defaultTab"
                checked={defaultTab === tab}
                onChange={() => setDefaultTab(tab)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-medium capitalize">{tab}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Copy Code Button */}
      <button
        onClick={copyCode}
        className="w-full px-4 py-3 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-lg font-medium text-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        Copy Code
      </button>
    </div>
  )
}

interface FeatureToggleProps {
  icon: React.ReactNode
  label: string
  enabled: boolean
  onToggle: () => void
}

function FeatureToggle({ icon, label, enabled, onToggle }: FeatureToggleProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-secondary border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <div className={enabled ? 'text-primary' : 'text-muted-foreground'}>
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? 'bg-primary' : 'bg-muted'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}
