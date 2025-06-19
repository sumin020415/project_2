import { useEffect, useState } from "react"
import WriteMap from "../components/WriteMap"
import writeStyle from "./write.module.css"

const Write = () => {
    const [clickPopup, setClickPopup] = useState(false)
    const [address, setAddress] = useState('제보할 위치를 선택해주세요.')
    const [coords, setCoords] = useState(null) // 좌표값

    // 좌표를 주소로 변환
    const convertCoordsToAddress = (lat, lng) => {
        if (!window.kakao || !window.kakao.maps) return

        const geocoder = new window.kakao.maps.services.Geocoder()
        const coord = new window.kakao.maps.LatLng(lat, lng)

        geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) =>{
            if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
                const newAddress = result[0].road_address?.address_name || result[0].address.address_name
                setAddress(newAddress)
            } else {
                setAddress('주소를 가져올 수 없습니다.')
            }
        })
    }

    // 주소 못가져오면 재렌더링됨

    const handleLocationSelect = ({lat,lng}) => {
        setCoords({lat, lng}) // 좌표값
        convertCoordsToAddress(lat, lng) // 주소 변환 및 상태 업데이트
        setClickPopup(false) // 팝업 닫기
    }

    return (
        <>
        {clickPopup && <WriteMap onClose={() => setClickPopup(false)} onSelectLocation={handleLocationSelect}/> }
        <section id="write" data-page="write">
            <div className={writeStyle.con_write}>
                <button className={writeStyle.btn_search} onClick={() => setClickPopup(true)}>
                    {address}
                </button>
                <textarea name="ta_write" id="ta_write" className={writeStyle.ta_write} placeholder="거짓 정보를 게시할 시 제제 당할 수 있습니다."></textarea>
                <button className={writeStyle.btn_submit}>글쓰기</button>
            </div>
        </section>
        </>
    )
}

export default Write