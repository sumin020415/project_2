import { useState } from "react"

const SearchBar = ({ onSearch }) => {
    const [keyword, setKeyword] = useState('');

    const handleSearch = () => {
        const places = new window.kakao.maps.services.Places();

        places.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                const results = data.slice(0,10).map((place) => ({
                    name : place.place_name,
                    lat : place.y,
                    lng : place.x,
                }))
                onSearch(results)
            }
        })
    }
    return (
        <li>
            <input type="text" value={keyword} placeholder="주소나 장소를 검색하세요." onChange={(e) => setKeyword(e.target.value)} />
            <button onClick={handleSearch}><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z" fill="#0D0D0D"/></svg></button>
        </li>
    )
}

export default SearchBar