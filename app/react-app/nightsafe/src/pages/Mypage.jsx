import { useEffect, useState } from 'react';
import axios from 'axios';


const Mypage = () => {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const res = await axios.get('/api/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserInfo(res.data);
            } catch (err) {
                console.error('사용자 정보 가져오기 실패:', err);
            }
        };

        fetchUserInfo();
    }, []);

    if (!userInfo) return <p>로딩 중...</p>;

    return (
        <div>
            <h2>마이페이지</h2>
            <p><strong>아이디:</strong> {userInfo.userId}</p>
            <p><strong>닉네임:</strong> {userInfo.nickname}</p>
            <p><strong>이메일:</strong> {userInfo.email}</p>
        </div>
    );
};

export default Mypage;