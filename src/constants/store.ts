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
  set: ({ set, get }) => {
    const list = get(objectListState)
    const newObject = {
      id: list.length,
      $x_position: Math.random() * length + length,
      $y_position: Math.random() * length + length,
      $angle: Math.random() * 360,
      $img_number: 'obj' + (Math.floor(Math.random() * 10) + 1),
      x_delta: Math.random() * 2 - 1,
      y_delta: Math.random() * 2 - 1,
      angle_delta: Math.random() * 2 - 1,
    }
    set(objectListState, [...list, newObject])
  },
})
