import styled, { keyframes } from 'styled-components'

const LoadingScreen: React.FC = () => {
  return <LoadingText>Loading...</LoadingText>
}

export default LoadingScreen

const loadingAnimation = keyframes`
  0% { opacity: 0.5; }
  50% { opacity: 1; }
  100% { opacity: 0.5; }
`

const LoadingText = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  background-color: black;
  padding: 20px;
  border-radius: 10px;
  font-size: 1.5em;
  text-align: center;
  animation: ${loadingAnimation} 2s linear infinite;
`
