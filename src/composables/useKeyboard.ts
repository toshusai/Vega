import { Ref } from 'nuxt/dist/app/compat/capi'

interface Keyboard {
  shift: boolean;
  ctrl: boolean;
}

export function useKeyboard () {
  const keyboard = useState('keyboard', () => {
    return {
      shift: false,
      ctrl: false
    }
  })

  function keydown (e: KeyboardEvent) {
    if (e.key === 'Shift') {
      keyboard.value.shift = true
    }
    if (e.key === 'Control') {
      keyboard.value.ctrl = true
    }
  }

  function keyup (e: KeyboardEvent) {
    if (e.key === 'Shift') {
      keyboard.value.shift = false
    }
    if (e.key === 'Control') {
      keyboard.value.ctrl = false
    }
  }

  return {
    keyboard: readonly(keyboard),
    init: ((_: Ref<Keyboard>) => {
      return () => {
        window.addEventListener('keydown', keydown)
        window.addEventListener('keyup', keyup)
      }
    })(keyboard),
    destroy: ((_: Ref<Keyboard>) => {
      return () => {
        window.removeEventListener('keydown', keydown)
        window.removeEventListener('keyup', keyup)
      }
    })(keyboard)
  }
}
