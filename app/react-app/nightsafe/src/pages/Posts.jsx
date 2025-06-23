import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactionButtons from "../components/ReactionButtons";

const Posts = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("accessToken"); // 수정된 부분

        if (!token) {
            console.warn("토큰이 없습니다. 로그인한 사용자만 게시글을 볼 수 있습니다.");
            return;
        }

        axios.get("/api/posts", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
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
            {posts.length === 0 ? (
                <p>게시글이 없습니다.</p>
            ) : (
                posts.map((post) => (
                    <div
                        key={post.postId}
                        style={{
                            cursor: 'pointer',
                            borderBottom: '1px solid #ccc',
                            padding: '10px 0',
                        }}
                    >
                        <div onClick={() => handleClick(post.postId)}>
                            <p><strong>내용:</strong> {post.content}</p>
                            <p><strong>작성 시간:</strong> {new Date(post.createdAt).toLocaleString()}</p>
                            <p><strong>댓글 수:</strong> {post.commentCount}</p>
                        </div>

                        {isLoggedIn && (
                            <ReactionButtons
                                postId={post.postId}
                                initialLike={post.likeCount}
                                initialDislike={post.dislikeCount}
                                initialUserReaction={post.userReactionType}
                            />
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default Posts;
