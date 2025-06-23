import { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import lampIcon from '../assets/icon/lamp.png'
import cctvIcon from '../assets/icon/cctv.png'
import reportIcon from '../assets/icon/report.png'

const KakaoMap = ({ className, selectedType, showMarkers = false, getLatLng = false, onCenterChange }) => {
  const navigate = useNavigate()

  const mapContainer = useRef(null) // 카카오맵 정보 저장
  const overlayRef = useRef(null) // 오버레이 정보 저장
  const mapRef = useRef(null) // 현 지도 뷰포트 정보 저장
  const markersRef = useRef([]) // 기존 마커들 저장

  const [lampData, setLampData] = useState([])
  const [CCTVData, setCCTVData] = useState([])
  const [reportData, setReportData] = useState([])
  const [location, setLocation] = useState({ lat: null, lng: null })

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

  // 현재 위치를 기준으로 카카오맵 위치 설정
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("이 브라우저는 위치 정보가 지원되지 않습니다.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setLocation({ lat, lng })

        const { kakao } = window
        if (kakao && kakao.maps && mapRef.current) {
          const moveLatLng = new kakao.maps.LatLng(lat, lng)
          mapRef.current.setCenter(moveLatLng)
        }
      },
      (err) => {
        alert("위치 정보를 가져오지 못했습니다" + err)
      }
    )
  }, [])

  // 지도 최초 1회 생성
  useEffect(() => {
    const { kakao } = window;
    if (!kakao || !kakao.maps) return
    if (!location.lat || !location.lng) return

    // 카카오 맵 생성
    kakao.maps.load(() => {
      const center = new kakao.maps.LatLng(location.lat, location.lng)
      if (!mapRef.current) {
        mapRef.current = new kakao.maps.Map(mapContainer.current, {
          center,
          level: 3
        })
      } else {
        mapRef.current.setCenter(center)
      }
    })
  }, [location])

  // 뷰포트 설정
  const isInBounds = (map, lat, lng) => {
    const bounds = map.getBounds()
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()
    return (
      lat >= sw.getLat() && lat <= ne.getLat() &&
      lng >= sw.getLng() && lng <= ne.getLng()
    )
  }

  // 데이터 변경 시 마커 생성
  useEffect(() => {
    const { kakao } = window
    const map = mapRef.current
    if (!map || !kakao || !kakao.maps) return

    let data = []
    if (selectedType === '보안등') data = lampData
    if (selectedType === 'CCTV') data = CCTVData
    if (selectedType === '제보') data = reportData

    const updateMarkers = () => {
      // 기존 마커 초기화
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []

      // 해당 뷰포트의 데이터 필터
      const filtered = data.filter(point =>
        isInBounds(map, point.latitude, point.longitude)
      )

      // 필터된 데이터 마커 찍기
      filtered.forEach(point => {
        const position = new kakao.maps.LatLng(point.latitude, point.longitude)
        const marker = new kakao.maps.Marker({
          map,
          position,
          image: getMarkerImage(selectedType)
        })

        console.log(point)

        // 마커 오버레이 생성
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
          yAnchor: 1.5
        })

        // 클릭 이벤트로 오버레이 토글
        kakao.maps.event.addListener(marker, 'click', () => {
          // 기존 오버레이 제거
          if (overlayRef.current) {
            overlayRef.current.setMap(null)
            if (overlayRef.current._closeHandler) {
              document.removeEventListener('click', overlayRef.current._closeHandler)
            }
            overlayRef.current = null
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
        }
        )
        markersRef.current.push(marker) // 마커 저장
      })
    }
    updateMarkers() // 최초 실행

    // 지도 이동,줌 변경 될 때마다 마커 갱신
    kakao.maps.event.addListener(map, 'idle', updateMarkers)
    return () => {
      // 초기화
      kakao.maps.event.removeListener(map, 'idle', updateMarkers)
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

  return (
    <div ref={mapContainer} className={className}></div>
  )
}

export default KakaoMap;