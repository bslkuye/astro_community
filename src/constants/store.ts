import { atom, selector } from 'recoil'
import { length } from './mapInfo'

export const scoreState = atom({
  key: 'scoreState',
  default: 0,
})

export interface ObjectInfo {
  id: number
  $x_position: number
  $y_position: number
  $angle: number
  x_delta: number
  y_delta: number
  angle_delta: number
  $img_number: string
  message?: string // Optional message property
}

export const objectListState = atom<ObjectInfo[]>({
  key: 'objectListState',
  default: [],
})

export const addObjectSelector = selector({
  key: 'addObjectSelector',
  get: ({ get }) => {
    const list = get(objectListState)
    return list
  },
  set: ({ set, get }, newObject) => {
    const list = get(objectListState)
    set(objectListState, [...list, newObject])
  },
})
