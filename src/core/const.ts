import { Container } from './Container'
import { Timeline } from './Timeline'

export const initialContaerState: Container = {
  id: 'root',
  children: [
    {
      id: 'panel1',
      children: [
        {
          id: 'panel1-1',
          children: [
            {
              id: 'panel1-1-1',
              children: [],
              rect: {
                top: 0,
                left: 0,
                width: 100,
                height: 50
              },
              align: '',
              panel: {
                type: 'Inspector'
              }
            },
            {
              id: 'panel1-1-2',
              children: [],
              rect: {
                top: 0,
                left: 0,
                width: 100,
                height: 50
              },
              align: '',
              panel: {
                type: 'Keyframe'
              }
            }
          ],
          align: 'vertical',
          rect: {
            top: 0,
            left: 0,
            width: 30,
            height: 100
          },
          panel: null
        },
        {
          id: 'panel1-2',
          children: [],
          rect: {
            top: 0,
            left: 0,
            width: 70,
            height: 100
          },
          align: '',
          panel: {
            type: 'Preview'
          }
        }
      ],
      rect: {
        top: 0,
        left: 0,
        width: 100,
        height: 50
      },
      align: 'horizontal',
      panel: null
    },
    {
      id: 'panel2',
      children: [
        {
          id: 'panel2-1',
          children: [],
          rect: {
            top: 0,
            left: 0,
            width: 80,
            height: 100
          },
          align: '',
          panel: {
            type: 'Timeline'
          }
        },
        {
          id: 'panel2-2',
          children: [],
          rect: {
            top: 50,
            left: 0,
            width: 20,
            height: 100
          },
          align: '',
          panel: {
            type: 'Asset'
          }
        }
      ],
      rect: {
        top: 0,
        left: 0,
        width: 100,
        height: 50
      },
      align: 'horizontal',
      panel: null
    }
  ],
  rect: {
    top: 0,
    left: 0,
    width: 100,
    height: 100
  },
  align: 'vertical',
  panel: null
}

export const initialTimelineState: Timeline = {
  isRecording: false,
  selectedStrips: [],
  selectedKeyframes: [],
  focusStripId: '',
  previewTool: 'cursor',
  timelineTool: 'cursor',
  isPlay: false,
  width: 1920,
  height: 1080,
  length: 15,
  curent: 3,
  end: 15,
  scale: 20,
  start: 0,
  strips: []
}
