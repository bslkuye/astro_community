import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { length } from '../constants/mapInfo'
import { useRecoilState } from 'recoil'
import { scoreState } from '../constants/store'

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
let touchCheckArrA: string[] = []
let touchCheckArrB: string[] = []

const Object: React.FC = () => {
  const [angle, setAngle] = useState(0)
  const [character, setCharacter] = useState<ObjectInfo>()
  const [objects, setObjects] = useState<ObjectInfo[]>([])
  const [score, setScore] = useRecoilState(scoreState)
  const [astroImage, setAstroImage] = useState('astro_img')
  const characterObject = () => {
    if (objects[0]) {
      setCharacter(objects[0])
    }
  }

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

  const addNewObject = () => {
    setObjects((prev) => [
      ...prev,
      {
        id: prev.length,
        $x_position: Math.random() * length + length,
        $y_position: Math.random() * length + length,
        $angle: Math.random() * 360,
        $img_number: 'obj' + (Math.floor(Math.random() * 10) + 1),
        x_delta: Math.random() * 2 - 1,
        y_delta: Math.random() * 2 - 1,
        angle_delta: Math.random() * 2 - 1,
      },
    ])
    console.log('object : ', objects.length)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const touchCheck = () => {
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        if (
          Math.min(
            (objects[i].$x_position - objects[j].$x_position) ** 2,
            (objects[i].$x_position - objects[j].$x_position - length) ** 2,
            (objects[i].$x_position - objects[j].$x_position + length) ** 2,
          ) +
            Math.min(
              (objects[i].$y_position - objects[j].$y_position) ** 2,
              (objects[i].$y_position - objects[j].$y_position - length) ** 2,
              (objects[i].$y_position - objects[j].$y_position + length) ** 2,
            ) <
          30 ** 2
        ) {
          touchCheckArrB.push(i + '-' + j)
          if (!touchCheckArrA.includes(i + '-' + j)) {
            if (i == 0) setScore((score) => score + 9)
            setScore((score) => score + 1)
            console.log(i + '-' + j + ' : ' + score)
          } else if (objects[i].$x_position > objects[j].$x_position) {
            objects[i].$x_position += 1
          } else {
            objects[i].$x_position -= 1
          }
          const x = [
            objects[i].$x_position,
            objects[i].$y_position,
            objects[i].x_delta,
            objects[i].y_delta,
          ]
          const y = [
            objects[j].$x_position,
            objects[j].$y_position,
            objects[j].x_delta,
            objects[j].y_delta,
          ]

          objects[i].x_delta =
            (x[2] * (x[1] - y[1]) ** 2 +
              y[2] * (x[0] - y[0]) ** 2 +
              (-1 * x[3] + y[3]) * (x[0] - y[0]) * (x[1] - y[1])) /
            ((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)
          objects[i].y_delta =
            (y[3] * (x[1] - y[1]) ** 2 +
              x[3] * (x[0] - y[0]) ** 2 +
              (-1 * x[2] + y[2]) * (x[0] - y[0]) * (x[1] - y[1])) /
            ((x[0] - y[0]) ** 2 + (x[1] - y[1]) ** 2)
          objects[j].x_delta =
            (y[2] * (y[1] - x[1]) ** 2 +
              x[2] * (y[0] - x[0]) ** 2 +
              (-1 * y[3] + x[3]) * (y[0] - x[0]) * (y[1] - x[1])) /
            ((y[0] - x[0]) ** 2 + (y[1] - x[1]) ** 2)
          objects[j].y_delta =
            (x[3] * (y[1] - x[1]) ** 2 +
              y[3] * (y[0] - x[0]) ** 2 +
              (-1 * y[2] + x[2]) * (y[0] - x[0]) * (y[1] - x[1])) /
            ((y[0] - x[0]) ** 2 + (y[1] - x[1]) ** 2)
        }
      }
    }
    touchCheckArrA = touchCheckArrB
    touchCheckArrB = []
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
      if (objects[0]) {
        window.scrollTo({
          top: objects[0].$x_position - screenHeight + 15,
          left: objects[0].$y_position - screenWidth + 15,
        })
      }
      setObjects((prevObjects) =>
        prevObjects.map((obj) => ({
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
        })),
      )
      touchCheck()
    }, 1000 / 60)

    return () => clearInterval(interval)
  }, [angle, screenWidth, screenHeight, character, touchCheck, objects])

  return (
    <>
      <AddButton onClick={addNewObject}>Add New Object</AddButton>
      <ScoreInfo>{score}</ScoreInfo>

      <Character $angle={angle} />

      {objects.map((obj) =>
        [-1, 0, 1].map((x) =>
          [-1, 0, 1].map((y) => {
            if (x === 0 && y === 0 && obj.id === 0) return
            if (obj.id === 0) {
              return (
                <Objects
                  key={`${obj.id}-${x}-${y}`}
                  className={`${obj.id}-${x}-${y}`}
                  $x_position={obj.$x_position + x * length}
                  $y_position={obj.$y_position + y * length}
                  $angle={obj.$angle}
                  $img_number={astroImage}
                />
              )
            } else {
              return (
                <Objects
                  key={`${obj.id}-${x}-${y}`}
                  className={`${obj.id}-${x}-${y}`}
                  $x_position={obj.$x_position + x * length}
                  $y_position={obj.$y_position + y * length}
                  $angle={obj.$angle}
                  $img_number={obj.$img_number}
                />
              )
            }
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

const AddButton = styled.button`
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 1000;
`

const ScoreInfo = styled.span`
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 1000;
  color: white;
`
