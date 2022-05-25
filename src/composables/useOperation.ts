import { Ref } from 'nuxt/dist/app/compat/capi'

interface Operation {
  text: string;
  time: number;
}

interface OperationState {
  history: Operation[];
}

const init: OperationState = {
  history: [
    {
      text: 'Welcome to the Vega!',
      time: Date.now()
    }
  ]
}

export function useOperation () {
  const operation = useState('operation', () => init)

  return {
    history: readonly(operation.value.history),
    pushHistory: ((state: Ref<OperationState>) => {
      return (text: string) => {
        state.value.history.push({
          text,
          time: Date.now()
        })
      }
    })(operation)
  }
}
