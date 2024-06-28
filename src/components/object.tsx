import React, { useEffect, useReducer, useState } from 'react'
import styled from 'styled-components'
import { length } from '../constants/mapInfo'
import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  ObjectInfo,
  addMessageSelector,
  messageList,
  objectListState,
  scoreState,
} from '../constants/store'

let touchCheckArrA: string[] = []
let touchCheckArrB: string[] = []
const initialObjects: ObjectInfo[] = []

const objectReducer = (
  state: ObjectInfo[],
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

const Object: React.FC = () => {
  const [angle, setAngle] = useState(0)
  const [character, setCharacter] = useState<ObjectInfo>()
  const [objects, setObjects] = useRecoilState(objectListState)
  const [score, setScore] = useRecoilState(scoreState)
  const [astroImage, setAstroImage] = useState('astro_img')
  const [objectsdemo, dispatch] = useReducer(objectReducer, initialObjects)
  const [message, setMessage] = useRecoilState(messageList)
  const addMessage = useSetRecoilState(addMessageSelector)
  const [encyclopedia, setEncyclopedia] = useState<string[]>([])

  useEffect(() => {
    dispatch({ type: 'SET_OBJECTS', payload: objects })
  }, [objects])

  useEffect(() => {
    setAstroImage('astro_img')
    addNewObject()
    for (let i = 0; i < 20; i++) addNewObject()
    characterObject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    characterObject()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [objects[0]])

  const characterObject = () => {
    if (objects[0]) {
      setCharacter(objects[0])
    }
  }

  const addNewObject = () => {
    const objnum = 'obj' + (Math.floor(Math.random() * 15) + 1)
    const newObject = {
      id: Date.now(), // Ensure unique id for each object
      $x_position: Math.random() * length + length,
      $y_position: Math.random() * length + length,
      $angle: Math.random() * 360,
      $img_number: objnum,
      x_delta: Math.random() * 2 - 1,
      y_delta: Math.random() * 2 - 1,
      angle_delta: Math.random() * 2 - 1,
    }
    setEncyclopedia((prev) => [...prev, objnum])
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

          if (!touchCheckArrA.includes(i + '-' + j)) {
            if (i === 0) setScore((score) => score + 9)
            setScore((score) => score + 1)
          }
          if (objinfo[i].$x_position >= objinfo[j].$x_position) {
            objinfo[i].$x_position += 1
          } else {
            objinfo[i].$x_position -= 1
          }
          if (objinfo[i].$y_position >= objinfo[j].$y_position) {
            objinfo[i].$y_position += 1
          } else {
            objinfo[i].$y_position -= 1
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
      console.log('Message:', obj.message)
      const text = {
        id: message.length,
        message: obj.message,
      }
      addMessage(text)
      console.log(text, message)
      setObjects((prev) => prev.filter((o) => o.id !== obj.id))
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

    return () => clearInterval(interval)
  }, [character, objects])

  return (
    <>
      <ScoreInfo>{score}</ScoreInfo>

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

export default Object

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
