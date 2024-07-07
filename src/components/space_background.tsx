import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { ImageInfo, imageInfo } from '../constants/imageData'
import { length } from '../constants/mapInfo'
import { progressTime } from '../constants/store'
import { useRecoilState } from 'recoil'

const Map: React.FC = () => {
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>(
    new Array(9).fill(null),
  )
  const [elapsedTime, setElapsedTime] = useRecoilState(progressTime)

  useEffect(() => {
    canvasRefs.current.forEach((canvas) => {
      if (canvas) {
        canvas.width = length
        canvas.height = length

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.fillStyle = 'black'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }
      }
    })

    const images: ImageInfo[] = imageInfo()
    images.forEach(([url, x, y, angle]) => {
      drawImageOnCanvases(url, x, y, angle)
    })

    // 초기 로딩 시 progressTime에 따른 별 그리기
    // for (let i = 0; i < 27000; i++) {
    //   drawStarsOnCanvas(
    //     Math.floor(Math.random() * length),
    //     Math.floor(Math.random() * length),
    //     randomRGB(),
    //   )
    // }
    // for (let i = 0; i < 5400; i++) {
    //   drawStarsOnCanvasMiddle(
    //     Math.floor(Math.random() * length),
    //     Math.floor(Math.random() * length),
    //     randomRGB(),
    //   )
    // }
    // for (let i = 0; i < 540; i++) {
    //   drawStarsOnCanvasLarge(
    //     Math.floor(Math.random() * length),
    //     Math.floor(Math.random() * length),
    //     randomRGB(),
    //   )
    // }

    const drawStar1 = setInterval(() => {
      drawStarsOnCanvas(
        Math.floor(Math.random() * length),
        Math.floor(Math.random() * length),
        randomRGB(),
      )
      // images.forEach(([url, x, y, angle]) => {
      //   drawImageOnCanvases(url, x, y, angle)
      // })

      setElapsedTime((prevTime) => {
        const newTime = prevTime + 1
        localStorage.setItem('progressTime', newTime.toString())
        if (newTime >= 27000) {
          clearInterval(drawStar1)
          clearInterval(drawStar2)
          clearInterval(drawStar3)
          console.log('stop bg star drawing')
        }
        return newTime
      })
    }, 10000 / 150)

    const drawStar2 = setInterval(() => {
      drawStarsOnCanvasMiddle(
        Math.floor(Math.random() * length),
        Math.floor(Math.random() * length),
        randomRGB(),
      )
      // images.forEach(([url, x, y, angle]) => {
      //   drawImageOnCanvases(url, x, y, angle)
      // })
    }, 10000 / 30)

    const drawStar3 = setInterval(() => {
      drawStarsOnCanvasLarge(
        Math.floor(Math.random() * length),
        Math.floor(Math.random() * length),
        randomRGB(),
      )
      // images.forEach(([url, x, y, angle]) => {
      //   drawImageOnCanvases(url, x, y, angle)
      // })
    }, 10000 / 3)

    const preventZoom = (e: {
      ctrlKey: unknown
      metaKey: unknown
      preventDefault: () => void
    }) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
      }
    }

    window.addEventListener('wheel', preventZoom, { passive: false })
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && (e.key === '+' || e.key === '-' || e.key === '0')) {
        e.preventDefault()
      }
    })

    return () => {
      clearInterval(drawStar1)
      clearInterval(drawStar2)
      clearInterval(drawStar3)
      window.removeEventListener('wheel', preventZoom)
      window.removeEventListener('keydown', preventZoom)
    }
  }, [])

  const randomRGB = () => {
    const a_color = Math.floor(Math.random() * 100) + 156
    const b_color = Math.floor(Math.random() * 100)
    if (Math.random() < 0.9) {
      return 'rgb(' + a_color + ',' + b_color + ',' + b_color + ')'
    } else if (Math.random() > 0.1) {
      return 'rgb(' + a_color + ',' + a_color + ',' + 0 + ')'
    } else if (Math.random() > 0.5) {
      return 'rgb(' + 0 + ',' + 0 + ',' + a_color + ')'
    } else {
      return 'rgb(' + 255 + ',' + 255 + ',' + 255 + ')'
    }
  }

  const drawImageOnCanvases = (
    Url: string,
    x: number,
    y: number,
    angle: number,
  ) => {
    const imageUrl = '/' + Url + '.png'
    const image = new Image()
    image.src = imageUrl
    image.onload = () => {
      canvasRefs.current.forEach((canvas) => {
        const ctx = canvas?.getContext('2d')
        if (ctx) {
          for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
              ctx.translate(x + i * length, y + j * length)
              ctx.rotate((angle * Math.PI) / 180)
              ctx.drawImage(image, -image.width / 2, -image.height / 2)
              ctx.rotate((-angle * Math.PI) / 180)
              ctx.translate(-(x + i * length), -(y + j * length))
            }
          }
        }
      })
    }
  }

  const drawStarsOnCanvas = (x: number, y: number, color: string) => {
    canvasRefs.current.forEach((canvas) => {
      const ctx = canvas?.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.rect(x, y, 1, 1)
        ctx.fill()
      }
    })
  }

  const drawStarsOnCanvasMiddle = (x: number, y: number, color: string) => {
    canvasRefs.current.forEach((canvas) => {
      const ctx = canvas?.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.rect(x - 1, y, 3, 1)
        ctx.fill()
        ctx.rect(x, y - 1, 1, 3)
        ctx.fill()
      }
    })
  }

  const drawStarsOnCanvasLarge = (x: number, y: number, color: string) => {
    canvasRefs.current.forEach((canvas) => {
      const ctx = canvas?.getContext('2d')
      if (ctx) {
        ctx.beginPath()
        ctx.fillStyle = color
        ctx.rect(x - 2, y, 5, 1)
        ctx.fill()
        ctx.rect(x, y - 2, 1, 5)
        ctx.fill()
      }
    })
  }

  return (
    <CanvasContainer>
      {canvasRefs.current.map((_canvas, index) => (
        <Canvas
          key={index}
          ref={(el) => (canvasRefs.current[index] = el)}
          className={index + 'map'}
          width={length}
          height={length}
        />
      ))}
    </CanvasContainer>
  )
}

export default Map

const Canvas = styled.canvas`
  // border: 1px solid white;
`

const CanvasContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
`
