import { FHEProvider } from '@shieldkit/react'
import PlaygroundLayout from './components/Playground/PlaygroundLayout'

function App() {
  return (
    <FHEProvider>
      <PlaygroundLayout />
    </FHEProvider>
  )
}

export default App
