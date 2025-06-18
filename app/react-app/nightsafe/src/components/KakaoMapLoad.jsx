import { useEffect, useRef, useState } from 'react'
import map from '../pages/home.module.css'
// import { MapContext } from '../hooks/MapContext'

const KakaoMap = ({ className, selectedType }) => {
    const mapRef = useRef(null)
    const mapContainerRef = useRef(null)
    const overlayRef = useRef(null)
    // const [map, setMap] = useState(null)
    const [lightData, setLightData] = useState([{ address: "부경대학교 대연캠퍼스", lat: 35.133990687598214, lng: 129.1055866490509 }, { address: "부경대학교 용당캠퍼스", lat: 35.116714582535984, lng: 129.08950233811953 }])
    const [CCTVData, setCCTVData] = useState([{ address: "부경대학교 대연캠퍼스", lat: 35.133990687598214, lng: 129.1055866490509 }, { address: "부경대학교 용당캠퍼스", lat: 35.116714582535984, lng: 129.08950233811953 }])
    const [reportData, setReportData] = useState([{ address: "부경대학교 대연캠퍼스", lat: 35.133990687598214, lng: 129.1055866490509 }, { address: "부경대학교 용당캠퍼스", lat: 35.116714582535984, lng: 129.08950233811953 }])
    const [selectedMarkerInfo, setSelectedMarkerInfo] = useState(null)

    // restapi 예시
    // const fetchLightData = async () => {
    //     const res = await axios.get('/api/markers/light')
    //     setLightData(res.data)
    // }

    // const fetchCCTVData = async () => {
    //     const res = await axios.get('/api/markers/cctv')
    //     setCctvData(res.data)
    // }

    // const fetchReportData = async () => {
    //     const res = await axios.get('/api/markers/report')
    //     setReportData(res.data)
    // }

    // useEffect(() => {
    //     if (selectedType === '보안등' && lightData.length === 0) fetchLightData()
    //     if (selectedType === 'CCTV' && cctvData.length === 0) fetchCCTVData()
    //     if (selectedType === '제보' && reportData.length === 0) fetchReportData()
    // }, [selectedType])

    const getMarkerImage = (type) => {
        const imageSrcMap = {
            '보안등': './src/assets/icon/light.png',
            'CCTV': './src/assets/icon/cctv.png',
            '제보': './src/assets/icon/report.png',
        }

        return new window.kakao.maps.MarkerImage(
            imageSrcMap[type],
            new window.kakao.maps.Size(22, 32)
        )
    }

    useEffect(() => {
        if (!mapContainerRef.current) return

        const options = {
            center: new window.kakao.maps.LatLng(35.133990687598214, 129.1055866490509),
            level: 3
        }
        const map = new window.kakao.maps.Map(mapContainerRef.current, options)
        mapRef.current = map
    }, [])

    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        const handleClick = () => {
            if (overlayRef.current) {
                overlayRef.current.setMap(null)
                overlayRef.current = null
            }
        }

        window.kakao.maps.event.addListener(map, 'click', handleClick)

        return () => {
            window.kakao.maps.event.removeListener(map, 'click', handleClick)
        }
    }, [mapRef])

    useEffect(() => {
        if (!mapRef.current) return

        let currentData = []
        if (selectedType === '보안등') currentData = lightData
        else if (selectedType === 'CCTV') currentData = CCTVData
        else if (selectedType === '제보') currentData = reportData

        const markers = currentData.map((point) => {
            const marker = new window.kakao.maps.Marker({
                map: mapRef.current,
                position: new kakao.maps.LatLng(point.lat, point.lng),
                image: getMarkerImage(selectedType),
            })

            window.kakao.maps.event.addListener(marker, 'click', () => {
                if (overlayRef.current) {
                    const isSamePosition = overlayRef.current.getPosition().getLat() === marker.getPosition().getLat() &&
                        overlayRef.current.getPosition().getLng() === marker.getPosition().getLng()

                    overlayRef.current.setMap(null)
                    overlayRef.current = null

                    if (isSamePosition) return
                }

                const overlay = new window.kakao.maps.CustomOverlay({
                    position: marker.getPosition(),
                    content: `<div class="marker_info">${point.address}</div>`,
                    yAnchor: 1.9
                })

                overlay.setMap(mapRef.current)
                overlayRef.current = overlay
            })

            return marker
        })


        return () => {
            markers.forEach((m) => m.setMap(null))
            if (overlayRef.current) {
                overlayRef.current.setMap(null)
                overlayRef.current = null
            }
        }
    }, [selectedType, lightData, CCTVData, reportData])

    return (
        // <MapContext.Provider value={map}>
        <div ref={mapContainerRef} id='map' className={className} />
        // {map && children}
        // </MapContext.Provider>
    )
}

export default KakaoMap