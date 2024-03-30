import { useRecoilState } from 'recoil'
import { scoreState } from '../constants/store'
import styled, { css } from 'styled-components'
import { useState } from 'react'

const Menu: React.FC = () => {
  const [score, setScore] = useRecoilState(scoreState)
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible)
  }

  const decreaseScore = () => {
    setScore(score - 1)
  }

  const addScore = () => {
    setScore(score + 1)
  }

  return (
    <>
      <MenuButton onClick={toggleMenu}>Menu</MenuButton>
      <MenuBox visible={isMenuVisible}>
        <p>Score: {score}</p>
        <button onClick={decreaseScore}>Decrease Score</button>
        <button onClick={addScore}>Add Score</button>
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

const slideIn = css`
  right: 0;
  transition: right 0.3s ease-out;
`

const slideOut = css`
  right: -23vw;
  transition: right 0.3s ease-in;
`

const MenuBox = styled.div<{ visible: boolean }>`
  z-index: 9999;
  position: fixed;
  top: 0px;
  height: 100vh;
  width: 20vw;
  background-color: white;
  border: 1px solid gray;
  padding: 20px;
  ${({ visible }) => (visible ? slideIn : slideOut)};
`

export default Menu
