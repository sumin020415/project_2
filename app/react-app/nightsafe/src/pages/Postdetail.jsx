import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentSection from "../components/CommentSection";
import ReactionButtons from "../components/ReactionButtons";
import MoreMenu from "../components/MoreMenu";
import styles from "./PostDetail.module.css";

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const token = localStorage.getItem("accessToken");
    const userKey = localStorage.getItem("userKey");

    const fetchPost = async () => {
        try {
            const res = await axios.get(`/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPost(res.data);
        } catch (err) {
            alert("게시글을 불러오는 데 실패했습니다.");
        }
    };

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const handleDelete = async () => {
        if (!window.confirm("게시글을 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`/api/posts/${post.postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            window.location.href = "/post"; // 제보 페이지로 이동
        } catch {
            alert("삭제에 실패했습니다.");
        }
    };

    if (!post) return <p>로딩 중...</p>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.postCard}>
                <div className={styles.header}>
                    <span className={styles.nickname}>{post.nickname}</span>
                    <div className={styles.rightHeader}>
                        <span className={styles.time}>
                            {new Date(post.createdAt).toLocaleString("ko-KR")}
                        </span>
                        {post.userKey === userKey && <MoreMenu onDelete={handleDelete} />}
                    </div>
                </div>
                <div className={styles.address}>{post.address}</div>
                <div className={styles.content}>{post.content}</div>
                {post.imageUrl && (
                    <img src={post.imageUrl} alt="게시글 이미지" className={styles.image} />
                )}
                <ReactionButtons
                    postId={post.postId}
                    initialLike={post.likeCount}
                    initialDislike={post.dislikeCount}
                    initialUserReaction={post.userReactionType}
                />
                <div className={styles.separator}></div>
            </div>

            <CommentSection postId={postId} onAfterDelete={fetchPost} />
        </div>
    );
};

export default PostDetail;