import Map from '../components/space_background'
import Object from '../components/object'
import { useState, useEffect } from 'react'
import LoadingScreen from '../components/loading_screen'
import Menu from '../components/menu'

const Space = () => {
  const [isLoading, setIsLoading] = useState(true)

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
