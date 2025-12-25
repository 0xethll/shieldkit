import { Panel, Group, Separator } from 'react-resizable-panels'
import ConfigurationPanel from './ConfigurationPanel'
import PreviewArea from './PreviewArea'
import CodeDisplay from './CodeDisplay'
import { GripVertical } from 'lucide-react'

export default function PlaygroundLayout() {
  return (
    <div className="w-full h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex-shrink-0">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          ShieldKit Playground
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive demo for @shieldkit/react confidential balance features
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Group id="playground-panels" orientation="horizontal" style={{ display: 'flex', height: '100%' }}>
          {/* Left Panel - Configuration */}
          <Panel id="config-panel" defaultSize={35} minSize={30} maxSize={260}>
            <div className="h-full overflow-y-auto overflow-x-hidden scrollbar-thin p-6">
              <ConfigurationPanel />
            </div>
          </Panel>

          {/* Resize Handle */}
          <Separator style={{ width: '1px' }} className="bg-border hover:bg-primary/50 transition-colors relative group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-6 h-12 rounded bg-background border border-border opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </div>
          </Separator>

          {/* Right Panel - Preview */}
          <Panel id="preview-panel" defaultSize={65} minSize={55}>
            <div className="h-full overflow-hidden">
              <PreviewArea />
            </div>
          </Panel>
        </Group>
      </div>

      {/* Bottom Code Display */}
      <CodeDisplay />
    </div>
  )
}
