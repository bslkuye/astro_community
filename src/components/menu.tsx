import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  addObjectSelector,
  scoreState,
  objectListState,
  messageList,
  encyclopediaState,
  ObjectInfo,
  uiVisibleState,
} from '../constants/store'
import styled from 'styled-components'
import { useState, useRef, useEffect } from 'react'
// import { length } from '../constants/mapInfo'

const Menu: React.FC = () => {
  const [score, setScore] = useRecoilState(scoreState)
  const [objects] = useRecoilState(objectListState)
  const addObject = useSetRecoilState(addObjectSelector)
  const [isMenuVisible, setIsMenuVisible] = useState('false')
  const [chatInput, setChatInput] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useRecoilState(messageList)
  const [encyclopedia] = useRecoilState<string[]>(encyclopediaState)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const messageBoxRef = useRef<HTMLDivElement>(null)
  const [messageBoxHeight, setMessageBoxHeight] = useState<string>('200px')
  const scoreRef = useRef<HTMLParagraphElement>(null)
  // const buttonsRef = useRef<HTMLDivElement>(null)
  const encyclopediaRef = useRef<HTMLDivElement>(null)
  const [isUIVisible] = useRecoilState(uiVisibleState)
  const [messages] = useRecoilState(messageList)

  useEffect(() => {
    const updateHeight = () => {
      if (
        messageBoxRef.current &&
        scoreRef.current &&
        // buttonsRef.current &&
        encyclopediaRef.current
      ) {
        const bottomOffset = 170
        const viewportHeight = window.innerHeight
        const scoreHeight = scoreRef.current.offsetHeight
        // const buttonsHeight = buttonsRef.current.offsetHeight
        const encyclopediaHeight = encyclopediaRef.current.offsetHeight
        const totalHeight = scoreHeight + encyclopediaHeight
        const newHeight = `${viewportHeight - bottomOffset - totalHeight}px`
        setMessageBoxHeight(newHeight)
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      if (ctx) {
        ctx.font = '25px Arial'
        setContext(ctx)
      }
    }
  }, [canvasRef])

  const toggleMenu = () => {
    setIsMenuVisible(isMenuVisible === 'false' ? 'true' : 'false')
  }

  // const decreaseScore = () => {
  //   setScore(score - 1)
  // }

  // const addScore = () => {
  //   setScore(score + 1)
  // }

  // const handleAddObjectClick = () => {
  //   const newObject: ObjectInfo = {
  //     id: Date.now(),
  //     $x_position: Math.random() * length,
  //     $y_position: Math.random() * length,
  //     $angle: Math.random() * 360,
  //     $img_number: `obj${Math.floor(Math.random() * 10) + 1}`,
  //     x_delta: Math.random() * 2 - 1,
  //     y_delta: Math.random() * 2 - 1,
  //     angle_delta: Math.random() * 2 - 1,
  //   }
  //   addObject([newObject])
  // }

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
    if (textWidth <= 340) {
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

  const handleDeleteMessage = (index: number) => {
    setMessage((prevMessages) => prevMessages.filter((_, i) => i !== index))
  }

  return (
    <>
      {isUIVisible && (
        <>
          <MenuButton onClick={toggleMenu}>Menu</MenuButton>
          <MenuBox $visible={isMenuVisible}>
            <p ref={scoreRef}>Score: {score}</p>
            {/* <ButtonsContainer ref={buttonsRef}>
              <Buttons onClick={decreaseScore}>Decrease Score</Buttons>
              <Buttons onClick={addScore}>Add Score</Buttons>
              <Buttons onClick={handleAddObjectClick}>Add New Object</Buttons>
            </ButtonsContainer> */}
            <form>
              <ChatInput
                value={chatInput}
                onChange={handleChatInputChange}
                onKeyPress={handleChatInputKeyPress}
                placeholder='Type message and press Enter (score cost : 10)'
              />
            </form>

            <EncyclopediaBox ref={encyclopediaRef}>
              {Array.from({ length: 37 }, (_, index) => {
                const num = index + 1
                const imgName = encyclopedia.includes(`obj${num}`)
                  ? `obj${num}`
                  : `objDark${num}`
                return (
                  <Encyclopedia
                    key={num}
                    $backgroundimg={imgName}
                  ></Encyclopedia>
                )
              })}
            </EncyclopediaBox>
            <MessageBox ref={messageBoxRef} height={messageBoxHeight}>
              {message.map((text, index) => (
                <TextBox key={index}>
                  <TextLeft></TextLeft>
                  <Text>{text.message}</Text>
                  <DeleteButton
                    onClick={() => handleDeleteMessage(index)}
                  ></DeleteButton>
                  <TextRight></TextRight>
                </TextBox>
              ))}
            </MessageBox>
          </MenuBox>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  )
}

const MessageBox = styled.div<{ height: string }>`
  height: ${({ height }) => height};
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  border-radius: 5px;
`

const TextBox = styled.div`
  display: flex;
  height: 60px;
  &:hover button {
    display: block;
  }
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
  font-size: 25px;
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

const DeleteButton = styled.button`
  height: 20px;
  width: 20px;
  display: none;
  position: absolute;
  margin-left: 10px;
  background-color: none;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &::after {
    content: '⨉';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    font-weight: bold;
    color: black;
  }

  &:hover {
    background-color: gray;
  }
`

const EncyclopediaBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
`

// const Buttons = styled.button`
//   height: 20px;
//   width: 100px;
// `

// const ButtonsContainer = styled.div`
//   display: flex;
//   gap: 10px;
// `

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
