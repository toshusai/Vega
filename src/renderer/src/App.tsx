import { SplitPane } from '@toshusai/cmpui'
import '@toshusai/cmpui/dist/index.css'
import { Panel } from './components/Panel'
import { Timeline } from './components/Timeline'

function App() {
  return (
    <SplitPane type="vertical" sizes={['60%', '40%']}>
      <Panel />
      <Panel>
        <Timeline />
      </Panel>
    </SplitPane>
  )
}

export default App
