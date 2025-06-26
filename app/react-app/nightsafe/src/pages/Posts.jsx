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

    const navigateWrite = () => {
        if (isLoggedIn){
            navigate("/write")
        } else {
            alert("로그인이 필요합니다.")
            navigate("/login")
        }
    }

    const MoveTopBtn = () => {
        const [isVisible, setIsVisible] = useState(false)

        useEffect(() => {
            const handleScroll = () => {
                const scrollY = window.scrollY
                setIsVisible(scrollY > 200)
            }

            window.addEventListener('scroll', handleScroll)
            return () => window.removeEventListener('scroll', handleScroll)
        }, [])

        const moveToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        }

        return (isVisible && (<button onClick={moveToTop} className={postStyle.btn_scrolltop}><svg width="18" height="18" viewBox="0 0 0.36 0.36" xmlns="http://www.w3.org/2000/svg" fill="none"><path d="M.056.056a.017.017 0 0 1 0-.034h.236a.017.017 0 0 1 0 .034zM.067.22A.02.02 0 0 0 .091.219l.067-.07V.32a.017.017 0 0 0 .034 0V.149l.066.07A.017.017 0 0 0 .283.196L.187.095a.017.017 0 0 0-.025 0L.066.196A.02.02 0 0 0 .067.22" fill="#333D4B"/></svg></button>))
    }

    console.log(posts)

    const likeSorted = [...posts].sort((a, b) => Number(b.likeCount) - Number(a.likeCount)).splice(0,5)

    console.log(likeSorted)

    return (
        <div className={postStyle.container}>
            <MoveTopBtn />
            <div className={postStyle.fixed_write} onClick={navigateWrite}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 0.45 0.45" xmlSpace="preserve"><path d="M.405.45h-.36Q.025.449.023.428C.021.407.032.406.045.406h.36q.02.001.022.022C.429.449.418.45.405.45M.158.36h-.09A.02.02 0 0 1 .046.338v-.09q0-.01.007-.016L.278.007q.015-.013.032 0l.09.09Q.414.112.4.129L.175.354a.02.02 0 0 1-.016.007M.091.316h.058L.351.114.292.054.09.256z" /></svg>
            </div>
            <h2 className={postStyle.title}>제보합니다</h2>
            <p className={postStyle.subtitle}>주변 위험한 요소가 있다면 제보글을 적어 사람들에게 알려주세요</p>
            <div className={postStyle.list_wrap}>
                <div className={postStyle.wrap}>
                    {posts.length === 0 ? (
                        <p>게시글이 없습니다.</p>
                    ) : (
                        posts.map((post) => (
                            <div key={post.postId} className={postStyle.list}>
                                <div onClick={() => handleClick(post.postId)} >
                                    <div className={postStyle.top_wrap}>
                                        <p className={postStyle.nickname}>{post.nickname}</p>
                                        <p>{new Date(post.createdAt).toLocaleString()}</p>
                                    </div>
                                    <p className={postStyle.content}>{post.content}</p>
                                    <div className={postStyle.bottom_wrap} onClick={(e) => e.stopPropagation()}>
                                            <ReactionButtons
                                                postId={post.postId}
                                                initialLike={post.likeCount}
                                                initialDislike={post.dislikeCount}
                                                initialUserReaction={post.userReactionType}
                                            />
                                        <div className={postStyle.comment_wrap}>
                                            <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#a)"><path d="M25.92 27H8c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1h22c.55 0 1 .45 1 1v22c0 1-.45 1.61-2.06 0-.52-.52-1.86-1.84-3.02-3" fill="#FFC44D" /><path d="M25 2v5H8c-.55 0-1 .45-1 1v13H2c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h22c.6 0 1 .44 1 1" fill="#FFE6EA" /><path d="M23.875 25s4.062 4 5.062 5C30.547 31.609 31 31 31 30V8a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h14m-9-12h12m-12 4h5m7-15V2c0-.563-.396-1-1-1H2a1 1 0 0 0-1 1v18a1 1 0 0 0 1 1h5" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h32v32H0z" /></clipPath></defs></svg>
                                            <p>{post.commentCount}</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ))
                    )}
                </div>
                <div className={postStyle.side_box}>
                    <div className={postStyle.side_wrap}>
                        <h2 className={postStyle.side_title}>인기 게시글</h2>
                        <ul>
                            {likeSorted.map((ls, index) => (
                                <li className={postStyle.side_list} key={index} onClick={() => handleClick(ls.postId)}>
                                    <div className={postStyle.rank}>
                                        <p>{index + 1}</p>
                                    </div>
                                    <div className={postStyle.side_contentwrap}>
                                        <div className={postStyle.side_top}>
                                            <p className={postStyle.side_nickname}>{ls.nickname}</p>
                                            <p className={postStyle.side_date}>{new Date(ls.createdAt).toLocaleString()}</p>
                                        </div>
                                        <p className={postStyle.side_content}>
                                            {ls.content}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Posts;
