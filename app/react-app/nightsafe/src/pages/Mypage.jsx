import { useEffect, useState } from 'react';
import axios from 'axios';

const Mypage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [myPosts, setMyPosts] = useState([]);
    const [myComments, setMyComments] = useState([]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('accessToken');

                const [userRes, postRes, commentRes] = await Promise.all([
                    axios.get('/api/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('/api/posts/my', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get('/api/comments/my-comments', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setUserInfo(userRes.data);
                setMyPosts(postRes.data);
                setMyComments(commentRes.data);
            } catch (err) {
                console.error('데이터 불러오기 실패:', err);
            }
        };

        fetchUserInfo();
    }, []);

    if (!userInfo) return <p>로딩 중...</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>마이페이지</h2>
            <p><strong>아이디:</strong> {userInfo.userId}</p>
            <p><strong>닉네임:</strong> {userInfo.nickname}</p>
            <p><strong>이메일:</strong> {userInfo.email}</p>

            <h3>내가 쓴 글 목록</h3>
            {myPosts.length === 0 ? (
                <p>작성한 글이 없습니다.</p>
            ) : (
                <ul>
                    {myPosts.map((post, index) => (
                        <li key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ddd' }}>
                            <p><strong>내용:</strong> {post.content}</p>
                            <p><strong>작성일:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                            <p><strong>위치:</strong> 위도 {post.latitude}, 경도 {post.longitude}</p>
                            {post.imageUrl && (
                                <img src={post.imageUrl} alt="이미지" style={{ maxWidth: '200px' }} />
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <h3 style={{ marginTop: '30px' }}>내가 쓴 댓글 목록</h3>
            {myComments.length === 0 ? (
                <p>작성한 댓글이 없습니다.</p>
            ) : (
                <ul>
                    {myComments.map((comment, index) => (
                        <li key={index} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc' }}>
                            <p><strong>댓글 내용:</strong> {comment.content}</p>
                            <p><strong>작성일:</strong> {new Date(comment.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Mypage;
