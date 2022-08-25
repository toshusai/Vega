import { getEmptyProject } from '../core/Project'

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
