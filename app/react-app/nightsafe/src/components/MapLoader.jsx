import { useEffect, useState } from 'react'
import map from '../pages/home.module.css'
import KakaoMap from './KakaoMapLoad'

const MapLoader = () => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={map.map_wrap}>
      {ready ? (
        <KakaoMap className={map.map} />
      ) : (<div className='map_loading'>지도 준비중</div>)}
    </div>
  )
}

export default MapLoader