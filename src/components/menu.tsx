import { useRecoilState, useSetRecoilState } from 'recoil'
import { addObjectSelector, scoreState } from '../constants/store'
import styled from 'styled-components'
import { useState } from 'react'
import { length } from '../constants/mapInfo'

const Menu: React.FC = () => {
  const [score, setScore] = useRecoilState(scoreState)
  const addObject = useSetRecoilState(addObjectSelector)
  const [isMenuVisible, setIsMenuVisible] = useState('false')

  const toggleMenu = () => {
    isMenuVisible === 'false'
      ? setIsMenuVisible('true')
      : setIsMenuVisible('false')
  }

  const decreaseScore = () => {
    setScore(score - 1)
  }

  const addScore = () => {
    setScore(score + 1)
  }

  const handleAddObjectClick = () => {
    addObject((oldObjects) => [
      ...oldObjects,
      {
        id: oldObjects.length,
        $x_position: Math.random() * length,
        $y_position: Math.random() * length,
        $angle: Math.random() * 360,
        $img_number: `obj${Math.floor(Math.random() * 10) + 1}`,
        x_delta: Math.random() * 2 - 1,
        y_delta: Math.random() * 2 - 1,
        angle_delta: Math.random() * 2 - 1,
      },
    ])
  }

  return (
    <>
      <MenuButton onClick={toggleMenu}>Menu</MenuButton>
      <MenuBox $visible={isMenuVisible}>
        <p>Score: {score}</p>
        <button onClick={decreaseScore}>Decrease Score</button>
        <button onClick={addScore}>Add Score</button>
        <button onClick={handleAddObjectClick}>Add New Object</button>
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

export default Menu
