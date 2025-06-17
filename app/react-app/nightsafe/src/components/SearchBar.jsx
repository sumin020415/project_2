import { useContext, useEffect, useState } from "react"
import { MapContext } from "../hooks/MapContext"

let debounceTimer = null

const SearchBar = () => {
    const [keyword, setKeyword] = useState('')
    const [searchPlaces, setSearchPlaces] = useState([])
    const map = useContext(MapContext)

    useEffect(() => {
        if (!keyword.trim()) {
            setSearchPlaces([])
            return
        }

        if (debounceTimer) clearTimeout(debounceTimer)

        debounceTimer = setTimeout(() => {
            const places = new window.kakao.maps.services.Places()
            places.keywordSearch(keyword, (data, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                    const results = data.slice(0,10).map((place) => ({
                        name : place.place_name,
                        lat : parseFloat(place.y),
                        lng : parseFloat(place.x),
                    }))
                setSearchPlaces(results)
            }
            })
        }, 500)

        return () => clearTimeout(debounceTimer)
    }, [keyword])

    const handleMovePlace = (lat, lng) => {
        if (!map) {
            console.log("초기화x")
            return
        }
        const move = new window.kakao.maps.LatLng(lat, lng)
        map.panTo(move)
    }

    return (
        <li className="li_search">
            <input type="text" value={keyword} className="inp_search" placeholder="주소나 장소를 검색하세요." onChange={(e) => setKeyword(e.target.value)} />
            <button className="btn_search"><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z" fill="#333D4B"/></svg></button>
            {keyword.length === 0 ? null : (searchPlaces.length > 0 ? (<ul className="search_result">
                {searchPlaces.map((place, index) => (
                    <li key = {index} className="li_result" onClick={() => handleMovePlace(place.lat, place.lng)}>{place.name}</li>
                ))}
            </ul>) : (<ul className="search_result">
                    <li className="li_nosearch">주소를 찾을 수 없습니다.</li>
                </ul>))}
        </li>
    )
}

export default SearchBar



