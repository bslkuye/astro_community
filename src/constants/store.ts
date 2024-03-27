import { atom, selector } from 'recoil'

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
  default: 0, // 초기값 0
})

// totalCountSelector selector 정의
export const totalCountSelector = selector({
  key: 'totalCountSelector',
  get: ({ get }) => {
    const list = get(objectListState) // objectListState에서 리스트를 가져옴
    return list.length // 리스트의 길이를 반환
  },
})
