import { FHEProvider } from '@shieldkit/react'
import PlaygroundLayout from './components/Playground/PlaygroundLayout'
import { ConfidentialBalanceProvider } from './contexts/ConfidentialBalanceContext'


function App() {
  return (
    <FHEProvider>
      <ConfidentialBalanceProvider>
        <PlaygroundLayout />
      </ConfidentialBalanceProvider>
    </FHEProvider>
  )
}

export default App
