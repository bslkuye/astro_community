import styled from 'styled-components'

const LoadingScreen: React.FC = () => {
  return <LoadingContainer></LoadingContainer>
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
`
