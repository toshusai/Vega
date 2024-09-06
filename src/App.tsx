import '@toshusai/cmpui-css/dist/index.css'
import '@toshusai/cmpui/dist/index.css'

import { SplitPane, TooltipProvider } from '@toshusai/cmpui'
import { Panel } from './components/Panel'
import { Timeline } from './components/Timeline'
import { state } from './state'
import { Preview } from './components/Preview'
import { Inspector } from './components/Inspector'
import { Header } from './components/Header'
import { useSnapshot } from 'valtio'
import { KeyframeEditor } from './components/KeyframeEditor'
import { useUndoKeyboardShortcuts } from './useUndoKeyboardShortcuts'
import { AssetView } from './components/AssetView'
import { Recorder } from './encoding/Recorder'

function App() {
  const snap = useSnapshot(state)

  useUndoKeyboardShortcuts()

  if (snap.recordingState === 'recording') {
    return <Recorder />
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col w-full gap-4">
        <Header />
        <SplitPane type="vertical" sizes={['60%', '40%']}>
          <SplitPane type="horizontal" sizes={['30%', '70%']}>
            <SplitPane type="vertical" sizes={['60%', '40%']}>
              <Panel>
                <Inspector />
              </Panel>
              <Panel>
                <KeyframeEditor />
              </Panel>
            </SplitPane>
            <Panel>
              <Preview />
            </Panel>
          </SplitPane>
          <SplitPane type="horizontal" sizes={['70%', '30%']}>
            <Panel>
              <Timeline />
            </Panel>
            <AssetView />
          </SplitPane>
        </SplitPane>
      </div>
    </TooltipProvider>
  )
}

export default App
