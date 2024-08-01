import './tailwind.css'
import '@toshusai/cmpui/dist/index.css'

import { SplitPane } from '@toshusai/cmpui'
import { Panel } from './components/Panel'
import { Timeline } from './components/Timeline'
import { Preview } from './components/Preview'
import { Inspector } from './components/Inspector'

function App() {
  return (
    <SplitPane type="vertical" sizes={['60%', '40%']}>
      <SplitPane type="horizontal" sizes={['30%', '70%']}>
        <Panel>
          <Inspector />
        </Panel>
        <Panel>
          <Preview />
        </Panel>
      </SplitPane>
      <Panel>
        <Timeline />
      </Panel>
    </SplitPane>
  )
}

export default App
