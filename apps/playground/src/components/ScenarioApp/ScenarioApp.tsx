import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import DialogModeMock from './DialogModeMock'
import SidebarModeMock from './SidebarModeMock'

export default function ScenarioApp() {
  const { currentScenario } = usePlaygroundConfig()

  return (
    <div className="w-full h-full">
      {currentScenario.integrationMode === 'dialog' && <DialogModeMock />}
      {currentScenario.integrationMode === 'sidebar' && <SidebarModeMock />}
    </div>
  )
}
