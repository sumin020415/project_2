import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; // 로그인 context
import { useEffect, useState } from "react";
import axios from "axios";

const Posts = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get("/api/posts")
            .then(res => setPosts(res.data))
            .catch(err => console.error("게시글 불러오기 실패:", err));
    }, []);

    const handleClick = (postId) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/login");
        } else {
            navigate(`/posts/${postId}`);
        }
    };

    return (
        <div>
            <h2>제보 목록</h2>
            {posts.map((post) => (
                <div key={post.postId} onClick={() => handleClick(post.postId)} style={{ cursor: 'pointer', borderBottom: '1px solid #ccc', padding: '10px 0' }}>
                    <p><strong>내용:</strong> {post.content}</p>
                    <p><strong>작성 시간:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                    <p><strong>댓글 수:</strong> {post.commentCount}</p>
                </div>
            ))}
        </div>
    );
};

export default Posts;
