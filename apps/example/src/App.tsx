import { FHEProvider } from '@z-payment/react'
import PlaygroundLayout from './components/Playground/PlaygroundLayout'

function App() {
  return (
    <FHEProvider>
      <PlaygroundLayout />
    </FHEProvider>
  )
}

export default App
