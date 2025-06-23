import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CommentSection.module.css";

const CommentSection = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const fetchComments = async () => {
        try {
            const res = await axios.get(`/api/comments/${postId}`);
            setComments(res.data);
        } catch (err) {
            console.error("댓글 불러오기 실패:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");

        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            await axios.post(
                "/api/comments",
                { postId, content: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewComment("");
            fetchComments();
        } catch (err) {
            console.error("댓글 작성 실패:", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return (
        <div className={styles.commentSection}>
            <form onSubmit={handleSubmit} className={styles.commentForm}>
                <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 작성해주세요"
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>글쓰기</button>
            </form>

            <ul className={styles.commentList}>
                {comments.map((c) => (
                    <li key={c.commentId} className={styles.commentItem}>
                        <div className={styles.commentHeader}>
                            <span className={styles.nickname}>{c.nickname || "알 수 없음"}</span>
                            <span className={styles.time}>
                                {new Date(c.createdAt).toLocaleString("ko-KR")}
                            </span>
                        </div>
                        <div className={styles.commentContent}>{c.content}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentSection;
