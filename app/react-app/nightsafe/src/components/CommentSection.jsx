import { useEffect, useState } from "react";
import axios from "axios";
import MoreMenu from "./MoreMenu";
import styles from "./CommentSection.module.css";

const CommentSection = ({ postId, onAfterDelete }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const token = localStorage.getItem("accessToken");
    const userKey = localStorage.getItem("userKey");

    const fetchComments = () => {
        axios.get(`/api/comments/${postId}`)
            .then(res => setComments(res.data))
            .catch(() => console.error("댓글 불러오기 실패"));
    };

    const handleSubmit = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!newComment.trim()) return;
            axios.post("/api/comments", { postId, content: newComment }, { headers: { Authorization: `Bearer ${token}` } })
                .then(() => { setNewComment(""); fetchComments(); })
                .catch(() => alert("댓글 작성 실패"));
        }
    };

    const handleClickSubmit = () => {
        if (!newComment.trim()) return;
        axios.post("/api/comments", { postId, content: newComment }, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => { setNewComment(""); fetchComments(); })
            .catch(() => alert("댓글 작성 실패"));
    };

    const handleDelete = (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
        axios.delete(`/api/comments/${commentId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => { fetchComments(); if (onAfterDelete) onAfterDelete(); })
            .catch(() => alert("댓글 삭제 실패"));
    };

    useEffect(fetchComments, [postId]);

    return (
        <div className={styles.commentSection}>
            <div className={styles.commentForm}>
                <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    onKeyDown={handleSubmit}
                    placeholder="댓글을 작성해주세요."
                    className={styles.input}
                />
                <button type="button" className={styles.button} onClick={handleClickSubmit}>
                    글쓰기
                </button>
            </div>
            <ul className={styles.commentList}>
                {comments.map(c => {
                    const time = new Date(c.createdAt).toLocaleString("ko-KR");
                    return (
                        <li key={c.commentId} className={styles.commentItem}>
                            <div className={styles.commentHeader}>
                                <span className={styles.nickname}>{c.nickname}</span>
                                <div className={styles.rightHeader}>
                                    <span className={styles.time}>{time}</span>
                                    {c.userKey === userKey && <MoreMenu onDelete={() => handleDelete(c.commentId)} />}
                                </div>
                            </div>
                            <div className={styles.commentContent}>{c.content}</div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CommentSection;