import { useRecoilState } from 'recoil'
import { scoreState } from '../constants/store'
import styled from 'styled-components'
import { useState } from 'react'

const Menu: React.FC = () => {
  const [score, setScore] = useRecoilState(scoreState)
  const [isMenuVisible, setIsMenuVisible] = useState(false)

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible)
  }

  const decreaseScore = () => {
    setScore(score - 1) // 점수 감소 함수
  }
  const addScore = () => {
    setScore(score + 1) // 점수 감소 함수
  }
  return (
    <>
      <MenuButton onClick={toggleMenu}>Menu</MenuButton>
      {isMenuVisible && (
        <MenuBox>
          <p>Score: {score}</p>
          <button onClick={decreaseScore}>Decrease Score</button>
          <button onClick={addScore}>Add Score</button>
        </MenuBox>
      )}
    </>
  )
}

const MenuButton = styled.button`
  z-index: 99999;
  position: fixed;
  bottom: 20px;
  right: 20px;
`

const MenuBox = styled.div`
  z-index: 9999;
  position: fixed;
  top: 0px;
  right: 0px;
  height: 100vh; // 100vw에서 100vh로 변경
  width: 20vw;
  background-color: white;
  border: 1px solid gray;
  padding: 20px; // 컨텐츠와 경계 사이에 여백 추가
`

const DecreaseScoreButton = styled.button`
  /* 스타일링을 추가하세요. */
`

export default Menu
