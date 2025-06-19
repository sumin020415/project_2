import { useState } from "react"
import KakaoMap from "../hooks/MapLoader"
import mapStyle from "../pages/home.module.css"
import { Link } from 'react-router-dom'

const HomeMap = () => {
  const [selectedType, setSelectedType] = useState('보안등')
  const WriteBtn = () => {
    return (
      <Link to ="/write">
        <button className={mapStyle.btn_write}>제보글 쓰기</button>
      </Link>
    )
  }
  return (
    <div className={mapStyle.map_wrap}>
      <div className={mapStyle.tab_wrap}>
        {['보안등', 'CCTV', '제보'].map((type) =>{
          const isActive = selectedType === type

          return(
          <button
           key={type}
           className={`${mapStyle.btn_tab} ${isActive ? mapStyle.tab_active : ''}`}
           onClick={() => setSelectedType(type)}>
            <img className={mapStyle.tab_icon} src={`./src/assets/icon/${type === '보안등' ? 'lamp' : type === 'CCTV' ? 'cctv' : 'report'}.png`} alt={type} />{type}
          </button>)
        })}
      </div>
      <WriteBtn />
      <KakaoMap className={mapStyle.map} selectedType={selectedType} showMarkers={true}></KakaoMap>
    </div>
  )
}

export default HomeMap

// import { useEffect, useState } from 'react'
// import map from '../pages/home.module.css'
// import KakaoMap from './KakaoMapLoad'
// import { Link } from 'react-router-dom'

// const MapLoader = () => {
//   const [ready, setReady] = useState(false)
//   const [selectedType, setSelectedType] = useState('보안등')



//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setReady(true)
//     }, 500)
//     return () => clearTimeout(timer)
//   }, [])

//   return (
//     <div className={map.map_wrap}>
//       {ready ? (
//         <>
//           <div className={map.tab_wrap}>
//             <button className={`${map.btn_tab} ${selectedType === '보안등' ? map.tab_active : ''}`} onClick={() => setSelectedType('보안등')}><img className={map.tab_icon} src="./src/assets/icon/light.png" alt="보안등" />보안등</button>
//             <button className={`${map.btn_tab} ${selectedType === 'CCTV' ? map.tab_active : ''}`} onClick={() => setSelectedType('CCTV')}><img className={map.tab_icon} src="./src/assets/icon/cctv.png" alt="cctv" />CCTV</button>
//             <button className={`${map.btn_tab} ${selectedType === '제보' ? map.tab_active : ''}`} onClick={() => setSelectedType('제보')}><img className={map.tab_icon} src="./src/assets/icon/report.png" alt="제보" />제보</button>
//           </div>
//           <WriteBtn />
//           <KakaoMap className={map.map} selectedType={selectedType} />
//         </>
//       ) : (<div className='map_loading'>지도 준비중</div>)}
//     </div>
//   )
// }

// export default MapLoader
