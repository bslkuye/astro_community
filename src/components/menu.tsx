import { useRecoilState, useSetRecoilState } from 'recoil'
import {
  addObjectSelector,
  scoreState,
  objectListState,
  messageList,
} from '../constants/store'
import styled from 'styled-components'
import { useState } from 'react'
import { length } from '../constants/mapInfo'
/**
 * 오리 구경하는 게임처럼 진행되면 좋을 것 같음
 * 라디오 음성 추가
 * 배경 별들 시간에 따라 추가되도록 변경
 * 오브젝트 시간에 따라 추가
 * 오브젝트 종류 추가
 *
 */
const Menu: React.FC = () => {
  const [score, setScore] = useRecoilState(scoreState)
  const [objects] = useRecoilState(objectListState) // Add this line to get the objects state
  const addObject = useSetRecoilState(addObjectSelector)
  const [isMenuVisible, setIsMenuVisible] = useState('false')
  const [chatInput, setChatInput] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useRecoilState(messageList)

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
    const newObject = {
      id: Date.now(), // Ensure unique id for each object
      $x_position: Math.random() * length,
      $y_position: Math.random() * length,
      $angle: Math.random() * 360,
      $img_number: `obj${Math.floor(Math.random() * 10) + 1}`,
      x_delta: Math.random() * 2 - 1,
      y_delta: Math.random() * 2 - 1,
      angle_delta: Math.random() * 2 - 1,
    }
    addObject(newObject)
  }

  const handleAddChatObject = (message: string) => {
    const mainCharacter = objects[0]
    if (!mainCharacter) return

    const newObject = {
      id: Date.now(),
      $x_position: mainCharacter.$x_position + (Math.random() * 50 - 25),
      $y_position: mainCharacter.$y_position + (Math.random() * 50 - 25),
      $angle: Math.random() * 360,
      $img_number: 'letter',
      x_delta: Math.random() * 2 - 1,
      y_delta: Math.random() * 2 - 1,
      angle_delta: Math.random() * 2 - 1,
      message: message,
    }
    addObject(newObject)
  }

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value)
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
            placeholder='Type message and press Enter'
          />
        </form>
        {message.map((text, index) => (
          <MessageList key={index}>{text.message}</MessageList>
        ))}
      </MenuBox>
    </>
  )
}

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

const MessageList = styled.div`
  color: black;
  height: 20px;
`

export default Menu
