import { useState } from "react"
import KakaoMap from "../hooks/MapLoader"
import mapStyle from "../pages/home.module.css"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import lampIcon from '../assets/icon/lamp.png'
import cctvIcon from '../assets/icon/cctv.png'
import reportIcon from '../assets/icon/report.png'


const HomeMap = () => {
  const [selectedType, setSelectedType] = useState('보안등')

  const iconMap = {
    '보안등': lampIcon,
    'CCTV': cctvIcon,
    '제보': reportIcon,
  }

  const WriteBtn = () => {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleClick = () => {
      if (!isLoggedIn) {
        alert("로그인이 필요합니다.");
        navigate("/login");
      } else {
        navigate("/write");
      }
    };

    return (
      <button className={mapStyle.btn_write} onClick={handleClick}>
        제보글 쓰기
      </button>
    );
  };
  return (
    <div className={mapStyle.map_wrap}>
      <div className={mapStyle.tab_wrap}>
        {['보안등', 'CCTV', '제보'].map((type) => {
          const isActive = selectedType === type

          return (
            <button
              key={type}
              className={`${mapStyle.btn_tab} ${isActive ? mapStyle.tab_active : ''}`}
              onClick={() => setSelectedType(type)}>
              <img className={mapStyle.tab_icon} src={iconMap[type]} alt={type} />{type}
            </button>)
        })}
      </div>
      <WriteBtn />
      <KakaoMap className={mapStyle.map} selectedType={selectedType} showMarkers={true}></KakaoMap>
    </div>
  )
}

export default HomeMap
