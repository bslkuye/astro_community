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

const getLocalStorageBoolean = (
  key: string,
  defaultValue: boolean,
): boolean => {
  const storedValue = localStorage.getItem(key)
  return storedValue !== null ? JSON.parse(storedValue) : defaultValue
}

const getLocalStorageNumber = (key: string, defaultValue: number): number => {
  const storedValue = localStorage.getItem(key)
  if (storedValue === null) return defaultValue
  const parsedValue = parseFloat(storedValue)
  return isNaN(parsedValue) ? defaultValue : parsedValue
}

const getLocalStorageArray = <T>(key: string, defaultValue: T[]): T[] => {
  const storedValue = localStorage.getItem(key)
  return storedValue ? JSON.parse(storedValue) : defaultValue
}

// 기본 오브젝트 리스트
const defaultObjectList: ObjectInfo[] = []

export const objectListState = atom<ObjectInfo[]>({
  key: 'objectListState',
  default: getLocalStorageArray<ObjectInfo>('objectList', defaultObjectList),
  effects: [
    ({ onSet }) => {
      onSet((newObjectList) => {
        localStorage.setItem('objectList', JSON.stringify(newObjectList))
      })
    },
  ],
})

export const addObjectSelector = selector({
  key: 'addObjectSelector',
  get: ({ get }) => get(objectListState),
  set: ({ set, get }, newObject: ObjectInfo | ObjectInfo[] | DefaultValue) => {
    const prevObjects = get(objectListState)
    if (newObject instanceof DefaultValue) {
      set(objectListState, newObject)
    } else {
      const newObjectsArray = Array.isArray(newObject) ? newObject : [newObject]

      set(objectListState, [...prevObjects, ...newObjectsArray])
    }
  },
})

export const scoreState = atom<number>({
  key: 'score',
  default: getLocalStorageNumber('score', 0),
})

export const uiVisibleState = atom({
  key: 'uiVisibleState',
  default: true,
})

export const messageList = atom<{ id: number; message: string }[]>({
  key: 'messageList',
  default: JSON.parse(localStorage.getItem('messages') || '[]'),
})

export const progressTime = atom({
  key: 'progressTime',
  default: getLocalStorageNumber('progressTime', 0),
})

export const encyclopediaState = atom<string[]>({
  key: 'encyclopediaState',
  default: [],
})

export const firstState = atom<boolean>({
  key: 'firstState',
  default: getLocalStorageBoolean('first', false),
  effects: [
    ({ onSet }) => {
      onSet((newFirst) => {
        localStorage.setItem('first', JSON.stringify(newFirst))
      })
    },
  ],
})
