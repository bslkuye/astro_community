import React, { useEffect, useReducer, useState } from 'react'
import styled from 'styled-components'
import { length } from '../constants/mapInfo'
import { useRecoilState } from 'recoil'
import {
  ObjectInfo,
  encyclopediaState,
  messageList,
  objectListState,
  scoreState,
  uiVisibleState,
  firstState,
} from '../constants/store'

interface MessageInfo {
  id: number
  message: string
}

let touchCheckArrA: string[] = []
let touchCheckArrB: string[] = []
const initialObjects: ObjectInfo[] = []

const objectReducer = (
  state: ObjectInfo[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: { type: string; payload?: any },
) => {
  switch (action.type) {
    case 'SET_OBJECTS':
      return action.payload
    case 'MOVE_OBJECTS':
      return state.map((obj) => ({
        ...obj,
        $x_position:
          Math.floor((obj.$x_position + obj.x_delta) / length) === 1
            ? obj.$x_position + obj.x_delta
            : ((obj.$x_position + obj.x_delta) % length) + length,
        $y_position:
          Math.floor((obj.$y_position + obj.y_delta) / length) === 1
            ? obj.$y_position + obj.y_delta
            : ((obj.$y_position + obj.y_delta) % length) + length,
        $angle: obj.$angle + obj.angle_delta,
      }))
    case 'HANDLE_COLLISION': {
      const updatedObjects = [...state]
      const { i, j } = action.payload
      if (!updatedObjects[i] || !updatedObjects[j]) return state

      const obj1 = updatedObjects[i]
      const obj2 = updatedObjects[j]

      const x = [obj1.$x_position, obj1.$y_position, obj1.x_delta, obj1.y_delta]
      const y = [obj2.$x_position, obj2.$y_position, obj2.x_delta, obj2.y_delta]

      obj1.x_delta =
        (x[2] * (x[1] - y[1]) ** 2 +
          y[2] * (x[0] - y[0]) ** 2 +
          (-1 * x[3] + y[3]) * (x[0] - y[0]) * (x[1] - y[1])) /
        ((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)
      obj1.y_delta =
        (y[3] * (x[1] - y[1]) ** 2 +
          x[3] * (x[0] - y[0]) ** 2 +
          (-1 * x[2] + y[2]) * (x[0] - y[0]) * (x[1] - y[1])) /
        ((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)
      obj2.x_delta =
        (y[2] * (y[1] - x[1]) ** 2 +
          x[2] * (y[0] - x[0]) ** 2 +
          (-1 * y[3] + x[3]) * (y[0] - x[0]) * (y[1] - x[1])) /
        ((y[0] - x[0]) ** 2 + (y[1] - x[1]) ** 2)
      obj2.y_delta =
        (x[3] * (y[1] - x[1]) ** 2 +
          y[3] * (y[0] - x[0]) ** 2 +
          (-1 * y[2] + x[2]) * (y[0] - x[0]) * (y[1] - x[1])) /
        ((y[0] - x[0]) ** 2 + (y[1] - x[1]) ** 2)

      return updatedObjects
    }
    case 'REMOVE_OBJECT': {
      return state.filter((obj) => obj.id !== action.payload.id)
    }
    default:
      return state
  }
}

const ObjectComponent: React.FC = () => {
  const [angle, setAngle] = useState(0)
  const [character, setCharacter] = useState<ObjectInfo>()
  const [objects, setObjects] = useRecoilState(objectListState)
  const [score, setScore] = useRecoilState(scoreState)
  const [astroImage, setAstroImage] = useState('astro_img')
  const [, dispatch] = useReducer(objectReducer, initialObjects)
  const [message, setMessage] = useRecoilState<MessageInfo[]>(messageList)
  const [, setEncyclopedia] = useRecoilState<string[]>(encyclopediaState)
  const [isUIVisible, setIsUIVisible] = useRecoilState(uiVisibleState)
  const [first, setFirst] = useRecoilState(firstState)

  const clearLocalStorage = () => {
    localStorage.clear()
    window.location.reload() // 페이지를 새로고침하여 변경사항을 반영합니다.
  }

  useEffect(() => {
    dispatch({ type: 'SET_OBJECTS', payload: objects })
  }, [objects])

  useEffect(() => {
    setAstroImage('astro_img')
    if (first === false) {
      setObjects((prev) => [
        ...prev,
        {
          id: Date.now(),
          $x_position: Math.random() * length,
          $y_position: Math.random() * length,
          $angle: Math.random() * 360,
          x_delta: Math.random() * 2 - 1,
          y_delta: Math.random() * 2 - 1,
          angle_delta: Math.random() * 2 - 1,
          $img_number: 'letter',
          message: '전체화면 권장 (f11)',
        },
        {
          id: Date.now() + 1,
          $x_position: Math.random() * length,
          $y_position: Math.random() * length,
          $angle: Math.random() * 360,
          x_delta: Math.random() * 2 - 1,
          y_delta: Math.random() * 2 - 1,
          angle_delta: Math.random() * 2 - 1,
          $img_number: 'letter',
          message: '소행성을 클릭해 보세요',
        },
        {
          id: Date.now() + 2,
          $x_position: Math.random() * length,
          $y_position: Math.random() * length,
          $angle: Math.random() * 360,
          x_delta: Math.random() * 2 - 1,
          y_delta: Math.random() * 2 - 1,
          angle_delta: Math.random() * 2 - 1,
          $img_number: 'letter',
          message: '시간에 따라 뭔가 추가됩니다.',
        },
        {
          id: Date.now() + 3,
          $x_position: Math.random() * length,
          $y_position: Math.random() * length,
          $angle: Math.random() * 360,
          x_delta: Math.random() * 2 - 1,
          y_delta: Math.random() * 2 - 1,
          angle_delta: Math.random() * 2 - 1,
          $img_number: 'letter',
          message: 'ui감추기는 u키입니다',
        },
      ])
      setFirst(true)
    }

    characterObject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    characterObject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objects[0]])

  useEffect(() => {
    localStorage.setItem('score', JSON.stringify(score))
  }, [score])

  useEffect(() => {
    const addObjInterval = setInterval(() => {
      const randomNum = Math.floor(Math.random() * 37 + 1)
      const newImgNum = 'obj' + randomNum
      const storedObjects = JSON.parse(
        localStorage.getItem('objectList') || '[]',
      )
      const imgNumbers = storedObjects.map((obj: ObjectInfo) => obj.$img_number)
      const imgSet = imgNumbers.filter((imgNum: string) => imgNum !== 'letter')
      console.log(imgSet)
      if (!imgNumbers.includes(newImgNum)) {
        addNewObject(randomNum)
      }
      if (imgSet.length == 37) {
        console.log('obj create stop')
        clearInterval(addObjInterval)
      }
    }, 300000)

    return () => clearInterval(addObjInterval)
  }, [])

  const characterObject = () => {
    if (objects[0]) {
      setCharacter(objects[0])
    }
  }

  const addNewObject = (imgNum: string | number) => {
    const objnum = 'obj' + imgNum
    const newObject = {
      id: Date.now(),
      $x_position: Math.random() * length + length,
      $y_position: Math.random() * length + length,
      $angle: Math.random() * 360,
      $img_number: objnum,
      x_delta: Math.random() * 2 - 1,
      y_delta: Math.random() * 2 - 1,
      angle_delta: Math.random() * 2 - 1,
    }
    setObjects((prev) => [...prev, newObject])
  }

  const touchCheck = () => {
    const objinfo = objects.map((obj) => ({ ...obj }))

    // obj 이동
    const movedObjects = objinfo.map((obj) => ({
      ...obj,
      $x_position:
        Math.floor((obj.$x_position + obj.x_delta) / length) === 1
          ? obj.$x_position + obj.x_delta
          : ((obj.$x_position + obj.x_delta) % length) + length,
      $y_position:
        Math.floor((obj.$y_position + obj.y_delta) / length) === 1
          ? obj.$y_position + obj.y_delta
          : ((obj.$y_position + obj.y_delta) % length) + length,
      $angle: obj.$angle + obj.angle_delta,
    }))
    setObjects(movedObjects)

    // 충돌 체크
    for (let i = 0; i < objinfo.length; i++) {
      for (let j = i + 1; j < objinfo.length; j++) {
        if (
          Math.min(
            (objinfo[i].$x_position - objinfo[j].$x_position) ** 2,
            (objinfo[i].$x_position - objinfo[j].$x_position - length) ** 2,
            (objinfo[i].$x_position - objinfo[j].$x_position + length) ** 2,
          ) +
            Math.min(
              (objinfo[i].$y_position - objinfo[j].$y_position) ** 2,
              (objinfo[i].$y_position - objinfo[j].$y_position - length) ** 2,
              (objinfo[i].$y_position - objinfo[j].$y_position + length) ** 2,
            ) <
          30 ** 2
        ) {
          //중복 터치 체크
          touchCheckArrB.push(i + '-' + j)

          if (
            !touchCheckArrA.includes(i + '-' + j) &&
            objinfo[i].$img_number != 'letter' &&
            objinfo[j].$img_number != 'letter'
          ) {
            if (i === 0) setScore((score) => score + 9)
            setScore((score) => score + 1)
          }
          if (objinfo[i].$x_position >= objinfo[j].$x_position) {
            objinfo[i].$x_position += 1
            objinfo[j].$x_position -= 1
          } else {
            objinfo[i].$x_position -= 1
            objinfo[j].$x_position += 1
          }
          if (objinfo[i].$y_position >= objinfo[j].$y_position) {
            objinfo[i].$y_position += 1
            objinfo[j].$y_position -= 1
          } else {
            objinfo[i].$y_position -= 1
            objinfo[j].$y_position += 1
          }
          if (i === 0 && objinfo[j].$img_number !== 'letter') {
            setEncyclopedia((prev) =>
              Array.from(new Set([...prev, objinfo[j].$img_number])),
            )
          }
          const x = [
            objinfo[i].$x_position,
            objinfo[i].$y_position,
            objinfo[i].x_delta,
            objinfo[i].y_delta,
          ]
          const y = [
            objinfo[j].$x_position,
            objinfo[j].$y_position,
            objinfo[j].x_delta,
            objinfo[j].y_delta,
          ]

          objinfo[i].x_delta =
            (x[2] * (x[1] - y[1]) ** 2 +
              y[2] * (x[0] - y[0]) ** 2 +
              (-1 * x[3] + y[3]) * (x[0] - y[0]) * (x[1] - y[1])) /
            ((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)
          objinfo[i].y_delta =
            (y[3] * (x[1] - y[1]) ** 2 +
              x[3] * (x[0] - y[0]) ** 2 +
              (-1 * x[2] + y[2]) * (x[0] - y[0]) * (x[1] - y[1])) /
            ((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)
          objinfo[j].x_delta =
            (y[2] * (y[1] - x[1]) ** 2 +
              x[2] * (y[0] - x[0]) ** 2 +
              (-1 * y[3] + x[3]) * (y[0] - x[0]) * (y[1] - x[1])) /
            ((y[0] - x[0]) ** 2 + (y[1] - x[1]) ** 2)
          objinfo[j].y_delta =
            (x[3] * (y[1] - x[1]) ** 2 +
              y[3] * (y[0] - x[0]) ** 2 +
              (-1 * y[2] + x[2]) * (y[0] - x[0]) * (y[1] - x[1])) /
            ((y[0] - x[0]) ** 2 + (y[1] - x[1]) ** 2)
          setObjects(objinfo)
        }
      }
    }
    touchCheckArrA = [...touchCheckArrB]
    touchCheckArrB = []
  }

  const handleObjectClick = (obj: ObjectInfo) => {
    if (obj.message) {
      const text: MessageInfo = {
        id: message.length,
        message: obj.message,
      }
      setMessage((prevMessages) => [...prevMessages, text])
      setObjects((prev) => prev.filter((o) => o.id !== obj.id))
    } else if (obj.$img_number) {
      setEncyclopedia((prev) => Array.from(new Set([...prev, obj.$img_number])))
    }
  }

  const screenWidth = window.innerWidth / 2
  const screenHeight = window.innerHeight / 2

  useEffect(() => {
    const interval = setInterval(() => {
      const nextAngle = character?.angle_delta
        ? character.$angle + character.angle_delta
        : character?.$angle
      if (nextAngle) {
        setAngle(nextAngle)
      }
      window.scrollTo({
        top: objects[0].$x_position - screenHeight + 15,
        left: objects[0].$y_position - screenWidth + 15,
      })
      touchCheck()
    }, 1000 / 60)
    /**
     * clearinterval을 주기적으로 반복하게 해줘서 메모리 누수를 막아보자. 재귀함수나 for문을 사용하는 방식으로 setinterval이 상단에 위치하지 않게
     * clearinterval 하고 setinterval 하고 시간 저장해서 시간 비교 후 10분이 지나면 다시 clearintervla하는 방식으로
     *
     * interval 과 가비지 컬렉션을 공부해 봐야 할 것 같다.
     */
    return () => clearInterval(interval)
  }, [character, objects])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'u') {
        setIsUIVisible((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [setIsUIVisible])

  return (
    <>
      {isUIVisible && (
        <ScoreInfo>
          {score}
          <button onClick={clearLocalStorage}>Clear Local Storage</button>
        </ScoreInfo>
      )}
      {/* <ScoreInfo>{score}</ScoreInfo> */}

      <Character $angle={angle} />

      {objects.map((obj, index) =>
        [-1, 0, 1].map((x) =>
          [-1, 0, 1].map((y) => {
            if (index === 0) return null
            return (
              <Objects
                key={`${obj.id}-${x}-${y}`}
                className={`${obj.id}-${x}-${y}`}
                $x_position={obj.$x_position + x * length}
                $y_position={obj.$y_position + y * length}
                $angle={obj.$angle}
                $img_number={obj.id === 0 ? astroImage : obj.$img_number}
                onClick={() => handleObjectClick(obj)}
              />
            )
          }),
        ),
      )}
    </>
  )
}

export default ObjectComponent

interface CharacterDomProp {
  $angle: number
}

const Character = styled.div.attrs<CharacterDomProp>(({ $angle }) => ({
  style: {
    transform: `rotate(${$angle}deg)`,
  },
}))<CharacterDomProp>`
  z-index: 9999;
  position: fixed;
  top: calc(50% - 15px);
  right: calc(50% - 15px);
  background-image: url('/astro_img.png');
  background-size: cover;
  border-radius: 50%;
  border: 1px solid white;
  height: 30px;
  width: 30px;
`

interface ObjectDomProp {
  $x_position: number
  $y_position: number
  $angle: number
  $img_number: string
}

const Objects = styled.div.attrs<ObjectDomProp>(
  ({ $x_position, $y_position, $angle, $img_number }) => ({
    style: {
      top: `${$x_position}px`,
      left: `${$y_position}px`,
      transform: `rotate(${$angle}deg)`,
      backgroundImage: `url('/${$img_number}.png')`,
    },
  }),
)<ObjectDomProp>`
  z-index: 999;
  position: absolute;
  background-size: cover;
  border-radius: 50%;
  height: 30px;
  width: 30px;
`

const ScoreInfo = styled.span`
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 1000;
  color: white;
`
