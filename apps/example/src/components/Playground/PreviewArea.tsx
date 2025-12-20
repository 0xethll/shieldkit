import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import ScenarioApp from '../ScenarioApp/ScenarioApp'
import WalletModal from '../Widget/WalletModal'

export default function PreviewArea() {
  const { isWidgetOpen } = usePlaygroundConfig()

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-background via-background to-background/95">
      {/* Preview Frame */}
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="w-full max-w-4xl h-full max-h-[800px] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
          <ScenarioApp />
        </div>
      </div>

      {/* Wallet Widget Modal Overlay */}
      {isWidgetOpen && <WalletModal />}
    </div>
  )
}
