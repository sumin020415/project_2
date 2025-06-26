import { useEffect, useState } from "react";
import axios from "axios";
import MoreMenu from "./MoreMenu";
import styles from "./CommentSection.module.css";

const CommentSection = ({ postId, onAfterDelete }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const token = localStorage.getItem("accessToken");
    const userKey = localStorage.getItem("userKey");
    // 수정 추가
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedContent, setEditedContent] = useState("");

    const fetchComments = () => {
        axios.get(`/api/comments/${postId}`)
            .then(res => setComments(res.data))
            .catch(() => console.error("댓글 불러오기 실패"));
    };

    useEffect(fetchComments, [postId]);

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

    const startEditing = (commentId, currentContent) => {
        setEditingCommentId(commentId);
        setEditedContent(currentContent);
    };

    const cancelEditing = () => {
        setEditingCommentId(null);
        setEditedContent("");
    };

    const saveEditedComment = (commentId) => {
        if (!editedContent.trim()) return;
        axios.put(`/api/comments/${commentId}`, { content: editedContent }, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                cancelEditing();
                fetchComments();
            })
            .catch(() => alert("댓글 수정 실패"));
    };


    // useEffect(fetchComments, [postId]);

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
                    const isOwner = c.userKey === userKey;
                    const isEditing = editingCommentId === c.commentId;
                    const isEdited = c.updatedAt && c.updatedAt !== c.createdAt;

                    return (
                        <li key={c.commentId} className={styles.commentItem}>
                            <div className={styles.commentHeader}>
                                <span className={styles.nickname}>{c.nickname}</span>
                                <div className={styles.rightHeader}>
                                    <span className={styles.time}>
                                        {time} {isEdited && <span className={styles.editedTag}>(수정됨)</span>}
                                    </span>
                                    {isOwner && (
                                        <MoreMenu
                                            onDelete={() => handleDelete(c.commentId)}
                                            onEdit={() => startEditing(c.commentId, c.content)}
                                        />
                                    )}
                                </div>
                            </div>

                            {isEditing ? (
                                <div>
                                    <textarea
                                        className={styles.editInput}
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                    />
                                    <div className={styles.editButtons}>
                                        <button onClick={() => saveEditedComment(c.commentId)}>저장</button>
                                        <button onClick={cancelEditing}>취소</button>
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.commentContent}>{c.content}</div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default CommentSection;