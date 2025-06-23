import { useEffect, useState } from "react"
import WriteMap from "../components/WriteMap"
import writeStyle from "./write.module.css"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Write = () => {
    const [clickPopup, setClickPopup] = useState(false);
    const [address, setAddress] = useState('제보할 위치를 선택해주세요.');
    const [coords, setCoords] = useState(null); // 좌표값
    const [content, setContent] = useState("");

    const navigate = useNavigate();
    // 전역에서 관리 중인 로그인 정보 가져오기
    const { userKey, isLoggedIn } = useAuth();

    // 좌표를 주소로 변환
    const convertCoordsToAddress = (lat, lng) => {
        if (!window.kakao || !window.kakao.maps) return;

        const geocoder = new window.kakao.maps.services.Geocoder();
        const coord = new window.kakao.maps.LatLng(lat, lng);

        geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
                const newAddress = result[0].road_address?.address_name || result[0].address.address_name;
                setAddress(newAddress);
            } else {
                setAddress('주소를 가져올 수 없습니다.');
            }
        });
    };

    // 위치 선택
    const handleLocationSelect = ({ lat, lng }) => {
        setCoords({ lat, lng }); // 좌표값
        convertCoordsToAddress(lat, lng); // 주소 변환 및 상태 업데이트
        setClickPopup(false); // 팝업 닫기
    };

    // 글 등록
    const handleSubmit = async () => {
        // 로그인 안된 경우 리다이렉트
        if (!isLoggedIn || !userKey) {
            alert("로그인이 필요합니다. 먼저 로그인 해주세요.");
            navigate('/login');
            return;
        }

        if (!coords) {
            alert("위치를 먼저 선택해주세요.");
            return;
        }

        if (!content.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }

        try {
            // 글쓰기 제출
            const res = await axios.post("/api/posts", {
                content: content,
                latitude: coords.lat,
                longitude: coords.lng,
                imageUrl: null,
                address: address,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            // 제출 후 이동
            alert(res.data.message || "게시글이 등록되었습니다.");
            navigate("/post");
        } catch (err) {
            console.error("게시글 등록 실패:", err);
            alert("글 등록에 실패했습니다.");
        }
    };

    return (
        <>
            {clickPopup && (
                <WriteMap onClose={() => setClickPopup(false)} onSelectLocation={handleLocationSelect} />
            )}
            <section id="write" data-page="write">
                <div className={writeStyle.con_write}>
                    <button className={writeStyle.btn_search} onClick={() => setClickPopup(true)}>
                        {address}
                    </button>
                    <textarea
                        name="ta_write"
                        id="ta_write"
                        className={writeStyle.ta_write}
                        placeholder="거짓 정보를 게시할 시 제재 당할 수 있습니다."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                    <button className={writeStyle.btn_submit} onClick={handleSubmit}>
                        글쓰기
                    </button>
                </div>
            </section>
        </>
    );
};

export default Write;