import { useCallback, useState } from "react"
import KakaoMap from "../hooks/MapLoader"
import mapStyle from "../pages/write.module.css"
import SearchButton from "./SearchButton"

const WriteMap = ({ onClose, onSelectLocation }) => {
  const [currentLatLng, setCurrentLatLng] = useState({ lat: null, lng: null })
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [clickSearch, setClickSearch] = useState(false)

  // 카카오맵에서 지도 중심 변경시 좌표 받기
  const handleCenterChanged = useCallback(({ lat, lng }) => {
    setCurrentLatLng({ lat, lng })
  }, [])

  // 장소 선택 버튼 클릭 시
  const handleSelectClick = () => {
    if (currentLatLng.lat && currentLatLng.lng) {
      onSelectLocation(currentLatLng) // 부모 컴포넌트에 좌표 전달
      onClose() // 팝업 닫기
    } else {
      alert("지도 중심 좌표를 가져올 수 없습니다.")
    }
  }

  return (
    <div className={mapStyle.popup_map}>
      <div className={mapStyle.map_wrap} onMouseDown={() => setClickSearch(false)}>
        <div className={mapStyle.searchbutton_wrap}>
          <SearchButton className={mapStyle.btn_searchplace} setSelectedLocation={setSelectedLocation} clickSearch={clickSearch} setClickSearch={setClickSearch} />
        </div>
        <button className={mapStyle.btn_mapclose} onClick={onClose}><svg width="20" height="20" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs></defs><g id="cancel"><path className="cls-1" d="M28 29a1 1 0 0 1-.71-.29l-24-24a1 1 0 0 1 1.42-1.42l24 24a1 1 0 0 1 0 1.42A1 1 0 0 1 28 29" /><path className="cls-1" d="M4 29a1 1 0 0 1-.71-.29 1 1 0 0 1 0-1.42l24-24a1 1 0 1 1 1.42 1.42l-24 24A1 1 0 0 1 4 29" /></g></svg></button>
        <button className={mapStyle.btn_select} onClick={handleSelectClick}>장소 선택</button>
        <KakaoMap className={mapStyle.map} showMarkers={false} getLatLng={true} onCenterChange={handleCenterChanged} selectedLocation={selectedLocation}></KakaoMap>
      </div>
    </div>
  )
}

export default WriteMap