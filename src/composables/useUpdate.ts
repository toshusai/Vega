import { Ref } from 'nuxt/dist/app/compat/capi'
type Uf = (delta: number) => void;

interface UpdateState {
  funcs: Uf[];
  prev: number;
}
function addUpdate (update: Ref<UpdateState>) {
  return (f: Uf) => {
    update.value.funcs.push(f)
  }
}

function update (update: Ref<UpdateState>) {
  return (delta: number) => {
    for (const f of update.value.funcs) {
      f(delta)
    }
    update.value.prev = Date.now()
  }
}

export function useUpdate () {
  const updateFuncs = useState<UpdateState>('update', () => {
    return {
      funcs: [],
      prev: Date.now()
    }
  })

  return {
    update: update(updateFuncs),
    addUpdate: addUpdate(updateFuncs)
  }
}
