import styled from 'styled-components'

const LoadingScreen: React.FC = () => {
  return (
    <LoadingContainer>
      <LoadingText>Loading...</LoadingText>
    </LoadingContainer>
  )
}

export default LoadingScreen

const LoadingContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  background-image: url('/obj33.png');
  background-size: cover;
  width: 100px;
  height: 100px;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const LoadingText = styled.div`
  position: fixed;
  top: 130px;
  color: black;
  margin-top: 20px;
  font-size: 1.5em;
`
