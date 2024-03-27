import { atom } from 'recoil'

interface ObjectInfo {
  id: number
  $x_position: number
  $y_position: number
  $angle: number
  x_delta: number
  y_delta: number
  angle_delta: number
  $img_number: string
}

export const objectListState = atom<ObjectInfo[]>({
  key: 'objectListState',
  default: [],
})

export const scoreState = atom({
  key: 'scoreState',
  default: 0,
})
