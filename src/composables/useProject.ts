import { getEmptyProject } from '@/core'

/**
 * Do not use, use useTimeline
 * @returns
 */
export function useProject () {
  const project = useState('project', () => getEmptyProject())
  return {
    project
  }
}

/**
 *
 * @param json jsonString
 * @returns
 */
export function useSetProject (json: string) {
  const { setContainer } = useContainer()
  const { setTimeline } = useTimeline()
  const { setAssets } = useAssets()
  const project = JSON.parse(json)
  setContainer(project.container)
  setTimeline(project.timeline)
  setAssets(project.assets)
  return project
}
