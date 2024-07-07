import { atom, selector, DefaultValue } from 'recoil'

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
  get: ({ get }) => get(objectListState),
  set: ({ set, get }, newObject: ObjectInfo | ObjectInfo[] | DefaultValue) => {
    const prevObjects = get(objectListState)
    if (newObject instanceof DefaultValue) {
      set(objectListState, newObject)
    } else {
      set(objectListState, [
        ...prevObjects,
        ...(Array.isArray(newObject) ? newObject : [newObject]),
      ])
    }
  },
})

export const scoreState = atom<number>({
  key: 'scoreState',
  default: 0,
})

export const uiVisibleState = atom({
  key: 'uiVisibleState',
  default: true,
})

export const messageList = atom<{ id: number; message: string }[]>({
  key: 'messageList',
  default: [
    { id: 1, message: '전체화면을 권장합니다 (f11)' },
    { id: 2, message: '소행성을 클릭해 보세요' },
    { id: 2, message: 'u키로 ui를 숨길 수 있습니다' },
  ],
})

export const encyclopediaState = atom<string[]>({
  key: 'encyclopediaState',
  default: [
    // 'obj1',
    // 'obj2',
    // 'obj3',
    // 'obj4',
    // 'obj5',
    // 'obj6',
    // 'obj7',
    // 'obj8',
    // 'obj9',
    // 'obj10',
    // 'obj11',
    // 'obj12',
    // 'obj13',
    // 'obj14',
    // 'obj15',
    // 'obj16',
    // 'obj17',
    // 'obj18',
    // 'obj19',
    // 'obj20',
    // 'obj21',
    // 'obj22',
    // 'obj23',
    // 'obj24',
    // 'obj25',
    // 'obj26',
    // 'obj27',
    // 'obj28',
    // 'obj29',
    // 'obj30',
    // 'obj31',
    // 'obj32',
    // 'obj33',
    // 'obj34',
    // 'obj35',
    // 'obj36',
    // 'obj37',
    // 'obj38',
  ],
})
