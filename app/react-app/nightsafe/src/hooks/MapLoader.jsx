import { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import lampIcon from '../assets/icon/lamp.png'
import cctvIcon from '../assets/icon/cctv.png'
import reportIcon from '../assets/icon/report.png'
import { map } from 'lodash';

const KakaoMap = ({ className, selectedType, showMarkers = false, getLatLng = false, onCenterChange, selectedLocation }) => {
  const navigate = useNavigate()

  const mapContainer = useRef(null) // 카카오맵 정보 저장
  const overlayRef = useRef(null) // 오버레이 정보 저장
  const mapRef = useRef(null) // 현 지도 뷰포트 정보 저장

  const [lampData, setLampData] = useState([])
  const [CCTVData, setCCTVData] = useState([])
  const [reportData, setReportData] = useState([])

  // LampData api
  const fetchLampData = async () => {
    try {
      const res = await axios.get('/api/lamps')
      setLampData([...res.data])
    }
    catch (err) {
      console.log(err)
    }
  }

  // CCTVData api
  const fetchCCTVData = async () => {
    try {
      const res = await axios.get('/api/cctvs')
      setCCTVData([...res.data])
    }
    catch (err) {
      console.log(err)
    }
  }

  // PostData api
  const fetchReportData = async () => {
    try {
      const res = await axios.get('/api/posts/public')
      setReportData([...res.data])
    }
    catch (err) {
      console.log(err)
    }
  }

  // 탭 선택하면 데이터 불러오기
  useEffect(() => {
    if (!showMarkers) return
    if (selectedType === '보안등') fetchLampData()
    if (selectedType === 'CCTV') fetchCCTVData()
    if (selectedType === '제보') fetchReportData()
  }, [selectedType, showMarkers])


  // 지도 마커 커스텀
  const getMarkerImage = (type) => {
    const imageSrcMap = {
      '보안등': lampIcon,
      'CCTV': cctvIcon,
      '제보': reportIcon,
    }

    return new window.kakao.maps.MarkerImage(
      imageSrcMap[type],
      new window.kakao.maps.Size(22, 32)
    )
  }

  // 지도 최초 1회 생성
  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !kakao.maps) return

    // 카카오 맵 생성
    kakao.maps.load(() => {
      const center = new kakao.maps.LatLng(35.11668491278423, 129.08965512429194)
      if (!mapRef.current) {
        mapRef.current = new kakao.maps.Map(mapContainer.current, {
          center,
          level: 3
        })
      }
    })
  }, [location])

  // 데이터 변경 시 마커 생성
  useEffect(() => {
    const { kakao } = window
    const map = mapRef.current
    if (!map || !kakao || !kakao.maps) return

    let data = []
    if (selectedType === '보안등') data = lampData
    if (selectedType === 'CCTV') data = CCTVData
    if (selectedType === '제보') data = reportData

    // 클러스터러 객체 생성
    const clusterer = new kakao.maps.MarkerClusterer({
      map: map,
      averageCenter: true,
      minLevel: 5,
      disableClickZoom: false
    })

    // 마커 배열 생성
    const markers = data.
      filter(point => point.latitude && point.longitude)
      .map(point => {
        const position = new kakao.maps.LatLng(point.latitude, point.longitude)
        const marker = new kakao.maps.Marker({
          position,
          image: getMarkerImage(selectedType)
        })
        return marker
      })

    // 마커 오버레이 생성
    markers.forEach((marker, i) => {
      const point = data[i]
      const position = marker.getPosition()
      const container = document.createElement('div')
      container.className = 'marker_info overlay'

      const p = document.createElement('p')
      p.className = 'marker_content'

      if (selectedType === '제보') {
        const nickname = document.createElement('p')
        nickname.className = 'marker_nickname'
        nickname.textContent = point.nickname

        p.textContent = point.content

        const btn = document.createElement('button')
        btn.className = 'btn_navigate'
        btn.textContent = '게시글 보기'
        btn.dataset.id = point.postId
        btn.addEventListener('click', (e) => {
          e.stopPropagation()
          navigate(`/posts/${btn.dataset.id}`)
        })

        container.appendChild(nickname)
        container.appendChild(p)
        container.appendChild(btn)
      } else {
        p.textContent = point.address ?? '해당 정보가 없습니다.'
        container.appendChild(p)
      }

      // 해당 마커에 해당하는 오버레이 설정
      const overlay = new kakao.maps.CustomOverlay({
        content: container,
        position,
        yAnchor: 1.3
      })

      // 클릭 이벤트로 오버레이 토글
      kakao.maps.event.addListener(marker, 'click', () => {
        // 클릭한 마커 위치로 지도 중심 이동
        map.panTo(position)

        // 기존 오버레이 제거
        if (overlayRef.current) {
          overlayRef.current.setMap(null)
          if (overlayRef.current._closeHandler) {
            document.removeEventListener('click', overlayRef.current._closeHandler)
          }
        }

        // 새로운 오버레이 설정
        overlay.setMap(map)
        overlayRef.current = overlay

        // 외부 클릭 시 닫기
        const handleDocumentClick = (e) => {
          const isInside = e.target.closest('.overlay')
          if (!isInside) {
            overlay.setMap(null)
            document.removeEventListener('click', handleDocumentClick)
            overlayRef.current = null
          }
        }

        // 핸들러 저장해서 나중에 제거할 수 있도록
        overlay._closeHandler = handleDocumentClick
        setTimeout(() => {
          document.addEventListener('click', handleDocumentClick)
        }, 0)
      })
    })

    clusterer.addMarkers(markers)

    return () => {
      // 초기화
      clusterer.clear()
      if (overlayRef.current) {
        overlayRef.current.setMap(null)
        overlayRef.current = null
      }
    }
  }, [lampData, CCTVData, reportData, selectedType])

  // 클릭 주소 좌표 추출
  useEffect(() => {
    const { kakao } = window
    const map = mapRef.current

    if (!map || !kakao || !kakao.maps) return

    if (!getLatLng) return

    let clickMarker = null

    const handleMapClick = (mouseEvent) => {
      const latlng = mouseEvent.latLng

      // 마커가 없으면 새로 생성
      if (!clickMarker) {
        clickMarker = new kakao.maps.Marker({
          position: latlng,
          map: map
        })
      } else {
        clickMarker.setPosition(latlng)
      }

      // 위도 경도 전달
      if (onCenterChange) {
        onCenterChange({
          lat: latlng.getLat(),
          lng: latlng.getLng()
        })
      }
    }

    kakao.maps.event.addListener(map, 'click', handleMapClick)

    return () => {
      kakao.maps.event.removeListener(map, 'click', handleMapClick)
    }
  }, [getLatLng, onCenterChange, location])

  // 검색 시 위치 이동
  useEffect(() => {
    const { kakao } = window
    const map = mapRef.current

    if(!map || !kakao || !kakao.maps || !selectedLocation) return

    const moveLatLng = new kakao.maps.LatLng(selectedLocation.lat, selectedLocation.lng)
    map.panTo(moveLatLng)
  }, [selectedLocation])

  return (<div ref={mapContainer} className={className}></div>)
}


export default KakaoMap