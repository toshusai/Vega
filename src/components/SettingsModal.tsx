import { state } from '@/state'
import { Button, Modal, SliderNumberField } from '@toshusai/cmpui'
import { useEffect, useState } from 'react'
import { useSnapshot } from 'valtio'

export function SettingsModal(props: { isOpen: boolean; onClose: () => void }) {
  const snap = useSnapshot(state)

  const [time, setTime] = useState(snap.length)

  useEffect(() => {
    if (props.isOpen) {
      setTime(snap.length)
    }
  }, [props.isOpen])

  return (
    <Modal open={props.isOpen} onClose={props.onClose} title="Settings">
      <div className="my-4">
        <div>
          <SliderNumberField
            label="video length"
            value={[time]}
            onChangeValue={(value) => {
              setTime(value[0])
            }}
            step={1}
            min={1}
            max={360}
          />
        </div>
        <div className="flex gap-8 justify-end mt-8">
          <Button size="S" variant="secondary" onClick={props.onClose}>
            Cancel
          </Button>
          <Button
            size="S"
            onClick={() => {
              state.length = time
              props.onClose()
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  )
}
