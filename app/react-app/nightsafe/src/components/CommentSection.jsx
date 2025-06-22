import { useEffect, useState } from "react";
import axios from "axios";

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
                {
                    postId,
                    content: newComment,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNewComment("");
            fetchComments(); // 댓글 목록 새로고침
        } catch (err) {
            console.error("댓글 작성 실패:", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    return (
        <div style={{ marginTop: "20px" }}>
            <h4>댓글</h4>
            <form onSubmit={handleSubmit} style={{ marginBottom: "15px" }}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    required
                    rows={3}
                    style={{ width: "100%", padding: "8px" }}
                />
                <button type="submit" style={{ marginTop: "5px" }}>등록</button>
            </form>

            <ul style={{ listStyleType: "none", padding: 0 }}>
                {comments.map((c) => (
                    <li key={c.commentId} style={{ marginBottom: '12px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
                        <p style={{ marginBottom: "4px" }}><strong>{c.nickname || "알 수 없음"}</strong> 님</p>
                        <p style={{ marginBottom: "4px" }}>{c.content}</p>
                        <small style={{ color: "#666" }}>{new Date(c.createdAt).toLocaleString("ko-KR")}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentSection;
