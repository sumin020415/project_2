import { useEffect, useRef, useState } from 'react'
import { MapContext } from '../hooks/MapContext'

const KakaoMap = ({ className, children }) => {   
    const mapRef = useRef(null)
    const [map, setMap] = useState(null)

    useEffect(() => {
        const container = document.getElementById('map')
        const options = {
            center : new window.kakao.maps.LatLng(37.5665, 126.978),
            level: 3,
        }
        const kakaoMap = new window.kakao.maps.Map(container, options)
        mapRef.current = kakaoMap
        setMap(kakaoMap)
    }, [])

    return (
    <MapContext.Provider value={map}>
        <div id='map' className={className} />
        {map && children}
    </MapContext.Provider>
    )
}

export default KakaoMap