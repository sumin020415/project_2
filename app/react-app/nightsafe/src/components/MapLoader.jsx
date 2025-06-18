import { useEffect, useState } from 'react'
import map from '../pages/home.module.css'
import KakaoMap from './KakaoMapLoad'

const MapLoader = () => {
  const [ready, setReady] = useState(false)
  const [selectedType, setSelectedType] = useState('보안등')

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={map.map_wrap}>
      {ready ? (
        <>
          <div className={map.tab_wrap}>
            <button className={`${map.btn_tab} ${selectedType === '보안등' ? map.tab_active : ''}`} onClick={() => setSelectedType('보안등')}><img className={map.tab_icon} src="./src/assets/icon/light.png" alt="보안등" />보안등</button>
            <button className={`${map.btn_tab} ${selectedType === 'CCTV' ? map.tab_active : ''}`} onClick={() => setSelectedType('CCTV')}><img className={map.tab_icon} src="./src/assets/icon/cctv.png" alt="cctv" />CCTV</button>
            <button className={`${map.btn_tab} ${selectedType === '제보' ? map.tab_active : ''}`} onClick={() => setSelectedType('제보')}><img className={map.tab_icon} src="./src/assets/icon/report.png" alt="제보" />제보</button>
          </div>
          <KakaoMap className={map.map} selectedType={selectedType} />
        </>
      ) : (<div className='map_loading'>지도 준비중</div>)}
    </div>
  )
}

export default MapLoader