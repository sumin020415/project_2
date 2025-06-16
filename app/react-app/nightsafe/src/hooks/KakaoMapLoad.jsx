import { useEffect } from 'react'

const loadKakaoScript = (callback) => {
    if (document.getElementById('kakao-map-script')) {
        callback()
        return
    }
    const script = document.createElement('script')
    script.id = 'kakao-map-script'
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_MAP_API_KEY}&autoload=false`
    script.onload = callback
    document.head.appendChild(script)
}

const KakaoMap = ({ className }) => {
    useEffect(() => {
        loadKakaoScript(() => {
            window.kakao.maps.load(() => {
                const container = document.getElementById('map')
                const options = {
                    center: new window.kakao.maps.LatLng(33.450701, 126.570667),
                    level: 3,
                }
                new window.kakao.maps.Map(container, options)
            })
        })
    }, [])

    return <div id='map' className={className}></div>
}

export default KakaoMap