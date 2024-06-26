import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  addObjectSelector,
  scoreState,
  objectListState,
  messageList,
  encyclopediaState,
  ObjectInfo,
} from '../constants/store'
import styled from 'styled-components'
import { useState, useRef, useEffect } from 'react'
import { length } from '../constants/mapInfo'

const Menu: React.FC = () => {
  const [score, setScore] = useRecoilState(scoreState)
  const [objects] = useRecoilState(objectListState)
  const addObject = useSetRecoilState(addObjectSelector)
  const [isMenuVisible, setIsMenuVisible] = useState('false')
  const [chatInput, setChatInput] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message] = useRecoilState(messageList)
  const [encyclopedia] = useRecoilState<string[]>(encyclopediaState)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.font = '30px Arial' // 폰트 설정 (원하는 폰트와 크기로 변경)
        setContext(ctx)
      }
    }
  }, [canvasRef])

  const toggleMenu = () => {
    setIsMenuVisible(isMenuVisible === 'false' ? 'true' : 'false')
  }

  const decreaseScore = () => {
    setScore(score - 1)
  }

  const addScore = () => {
    setScore(score + 1)
  }

  const handleAddObjectClick = () => {
    const newObject: ObjectInfo = {
      id: Date.now(),
      $x_position: Math.random() * length,
      $y_position: Math.random() * length,
      $angle: Math.random() * 360,
      $img_number: `obj${Math.floor(Math.random() * 10) + 1}`,
      x_delta: Math.random() * 2 - 1,
      y_delta: Math.random() * 2 - 1,
      angle_delta: Math.random() * 2 - 1,
    }
    addObject([newObject])
  }

  const handleAddChatObject = (message: string) => {
    const mainCharacter = objects[0]
    if (!mainCharacter) return
    setScore(score - 10)
    const newObject: ObjectInfo = {
      id: Date.now(),
      $x_position: mainCharacter.$x_position + (Math.random() * 50 - 25),
      $y_position: mainCharacter.$y_position + (Math.random() * 50 - 25),
      $angle: Math.random() * 360,
      x_delta: Math.random() * 2 - 1,
      y_delta: Math.random() * 2 - 1,
      angle_delta: Math.random() * 2 - 1,
      $img_number: 'letter',
      message: message,
    }
    addObject([newObject])
  }

  const calculateTextWidth = (text: string) => {
    if (context) {
      return context.measureText(text).width
    }
    console.log('Canvas context is not available')
    return 0
  }

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value
    const textWidth = calculateTextWidth(inputText)
    if (textWidth <= 350) {
      setChatInput(inputText)
    }
  }

  const handleChatInputKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddChatObject(chatInput)
      setChatInput('')
    }
  }

  return (
    <>
      <MenuButton onClick={toggleMenu}>Menu</MenuButton>
      <MenuBox $visible={isMenuVisible}>
        <p>Score: {score}</p>
        <button onClick={decreaseScore}>Decrease Score</button>
        <button onClick={addScore}>Add Score</button>
        <button onClick={handleAddObjectClick}>Add New Object</button>
        <form>
          <ChatInput
            value={chatInput}
            onChange={handleChatInputChange}
            onKeyPress={handleChatInputKeyPress}
            placeholder='Type message and press Enter (score cost : 10)'
          />
        </form>

        <EncyclopediaBox>
          {encyclopedia.map((num, index) => (
            <Encyclopedia key={index} $backgroundimg={num}></Encyclopedia>
          ))}
        </EncyclopediaBox>
        {message.map((text, index) => (
          <TextBox key={index}>
            <TextLeft></TextLeft>
            <Text>{text.message}</Text>
            <TextRight></TextRight>
          </TextBox>
        ))}
      </MenuBox>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  )
}

const TextBox = styled.div`
  display: flex;
  height: 60px;
`

const TextLeft = styled.div`
  height: 80px;
  width: 50px;
  background-image: url('/textLeft.png');
  background-size: cover;
`

const Text = styled.div`
  position: relative;
  top: 22px;
  flex-grow: 1;
  height: 58px;
  font-size: 30px;
  font-family: Arial, sans-serif;
  display: flex;
  align-items: center;
  background-image: url('/text.png');
  background-size: 100% 100%;
  padding: 0 10px;
  white-space: nowrap;
`

const TextRight = styled.div`
  height: 80px;
  width: 40px;
  background-image: url('/textRight.png');
  background-size: cover;
`

const EncyclopediaBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`

interface EncyclopediaDomProp {
  $backgroundimg: string
}

const Encyclopedia = styled.div.attrs<EncyclopediaDomProp>(
  ({ $backgroundimg }) => ({
    style: {
      backgroundImage: `url('/${$backgroundimg}.png')`,
    },
  }),
)`
  height: 40px;
  width: 40px;
  background-size: cover;
  margin: 8px;
  border: 1px solid black;
  position: relative;

  &:hover::after {
    content: '';
    position: absolute;
    top: -30px;
    left: -30px;
    width: 100px;
    height: 100px;
    background-size: cover;
    background-repeat: no-repeat;
    background-image: url(${({ $backgroundimg }) =>
      `'/${$backgroundimg}.png'`});
    background-color: white;
    border: 1px solid black;
    border-radius: 10px;
    opacity: 1;
    transition: opacity 0.3s;
    z-index: 10;
  }
`

const MenuButton = styled.button`
  z-index: 99999;
  position: fixed;
  bottom: 20px;
  right: 20px;
`

const MenuBox = styled.div<{ $visible: string }>`
  z-index: 9999;
  position: fixed;
  top: 0px;
  right: ${(props) => (props.$visible === 'true' ? '0' : '-40vw')};
  height: 100vh;
  width: 20vw;
  min-width: 465px;
  background-color: white;
  border: 1px solid gray;
  padding: 20px;
  transition: right 0.5s ease-in-out;
`

const ChatInput = styled.input`
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
`

export default Menu
