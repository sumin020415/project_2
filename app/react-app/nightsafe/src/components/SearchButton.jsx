import { useEffect, useMemo, useState } from "react"
import mapStyle from "../pages/home.module.css"
import { debounce } from 'lodash'

const SearchButton = ({ setSelectedLocation, clickSearch, setClickSearch, className }) => {
    const [searchPlace, setSearchPlace] = useState('')
    const [searchResult, setSearchResult] = useState([])

    // 위치 검색하면 리스트 뜨게
    const searchPlaces = (keyword) => {
        if (!keyword) {
            setSearchResult([])
            return
        }

        const ps = new window.kakao.maps.services.Places()
        ps.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const sliced = data.slice(0, 10)
                setSearchResult(sliced)
                console.log(sliced)
            }
        })
    }

    const debouncedSearch = useMemo(() => debounce(searchPlaces, 500), []) // 디바운스

    useEffect(() => {
        debouncedSearch(searchPlace)
    }, [searchPlace])

    return (
        <button className={className} onMouseDown={(e) => {
            e.stopPropagation()
            setClickSearch(!clickSearch)
        }}>
            <svg fill="#333d4b" width="20" height="20" viewBox="-2.5 -2.5 24 24" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin"><path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12m6.32-1.094 3.58 3.58a1 1 0 1 1-1.415 1.413l-3.58-3.58a8 8 0 1 1 1.414-1.414z" /></svg>
            <input type="text" onChange={(e) => setSearchPlace(e.target.value)} onMouseDown={(e) => e.stopPropagation()} className={`${mapStyle.inp_search} ${clickSearch ? mapStyle.inp_search_active : ''}`} placeholder="위치 검색" />
            {searchResult.length !== 0 && clickSearch === true && <ul className={mapStyle.result_box} onMouseDown={(e) => e.stopPropagation()}>
                {searchResult.map((v, i) => {
                    return (
                        <li key={i} className={mapStyle.li_result} onMouseDown={() => setSelectedLocation({ lat: Number(v.y), lng: Number(v.x) })}>
                            <p className={mapStyle.result_placename}>{v.place_name}</p>
                            <p className={mapStyle.result_address}>{v.address_name}</p>
                        </li>
                    )
                })}
            </ul>}
        </button>
    )
}

export default SearchButton