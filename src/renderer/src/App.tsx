import { SplitPane } from '@toshusai/cmpui'
import '@toshusai/cmpui/dist/index.css'
import { Panel } from './components/Panel'

function App() {
  return (
    <SplitPane type="vertical" sizes={['60%', '40%']}>
      <Panel />
      <Panel />
    </SplitPane>
  )
}

export default App
