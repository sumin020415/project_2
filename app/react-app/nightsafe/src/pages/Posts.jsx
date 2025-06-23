import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import ReactionButtons from "../components/ReactionButtons";
import postStyle from "./post.module.css"

const Posts = () => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // 로그인 여부 상관없이 public API 사용
        axios.get("/api/posts/public")
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
        <div className={postStyle.container}>
            <h2 className={postStyle.title}>제보합니다</h2>
            <p className={postStyle.subtitle}>주변 위험한 요소가 있다면 제보글을 적어 사람들에게 알려주세요</p>
            <div className={postStyle.wrap}>
                {posts.length === 0 ? (
                    <p>게시글이 없습니다.</p>
                ) : (
                    posts.map((post) => (
                        <div key={post.postId} className={postStyle.list_wrap}>
                            <div onClick={() => handleClick(post.postId)} >
                                <div className={postStyle.top_wrap}>
                                    <p className={postStyle.nickname}>{post.nickname}</p>
                                    <p>{new Date(post.createdAt).toLocaleString()}</p>
                                </div>
                                <p className={postStyle.content}>{post.content}</p>
                                <div className={postStyle.bottom_wrap}>
                                    {isLoggedIn && (
                                        <ReactionButtons
                                            postId={post.postId}
                                            initialLike={post.likeCount}
                                            initialDislike={post.dislikeCount}
                                            initialUserReaction={post.userReactionType}
                                        />
                                    )}
                                    <div className={postStyle.comment_wrap}>
                                        <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)"><path d="M25.92 27H8c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h22c.55 0 1 .45 1 1v22c0 1-.45 1.61-2.06 0-.52-.52-1.86-1.84-3.02-3" fill="#FFC44D"/><path d="M25 2v5H8c-.55 0-1 .45-1 1v13H2c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h22c.6 0 1 .44 1 1" fill="#FFE6EA"/><path d="M23.875 25s4.062 4 5.062 5C30.547 31.609 31 31 31 30V8a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14m-9-12h12m-12 4h5m7-15V2c0-.563-.396-1-1-1H2a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h32v32H0z"/></clipPath></defs></svg>
                                        <p>{post.commentCount}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Posts;
