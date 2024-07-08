import Map from '../components/space_background'
import Object from '../components/object'
import { useEffect } from 'react'
import LoadingScreen from '../components/loading_screen'
import Menu from '../components/menu'
import { useRecoilState } from 'recoil'
import { loading } from '../constants/store'

const Space = () => {
  const [isLoading, setIsLoading] = useRecoilState(loading)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Object />
      <Map />
      <Menu />
    </>
  )
}

export default Space
