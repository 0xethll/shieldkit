import { usePlaygroundConfig } from '../../config/usePlaygroundConfig'
import LendingAppMock from './LendingAppMock'
import PaymentAppMock from './PaymentAppMock'
import DeFiAppMock from './DeFiAppMock'

export default function ScenarioApp() {
  const { currentScenario } = usePlaygroundConfig()

  return (
    <div className="w-full h-full">
      {currentScenario.mockApp.type === 'lending' && <LendingAppMock />}
      {currentScenario.mockApp.type === 'payment' && <PaymentAppMock />}
      {currentScenario.mockApp.type === 'defi' && <DeFiAppMock />}
    </div>
  )
}
