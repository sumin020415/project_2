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
    const [isEditing, setIsEditing] = useState(false);
    const [isEdited, setIsEdited] = useState(false)
    const [editedContent, setEditedContent] = useState("");
    const token = localStorage.getItem("accessToken");
    const userKey = localStorage.getItem("userKey");

    const fetchPost = async () => {
        try {
            const res = await axios.get(`/api/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setPost(res.data);
            setEditedContent(res.data.content); // 초기화
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

    const handleSaveEdit = async () => {
        // console.log("accessToken", token);
        try {
            await axios.put(`/api/posts/${post.postId}`, {
                content: editedContent,
                latitude: post.latitude,
                longitude: post.longitude,
                imageUrl: post.imageUrl,
                category: post.category,
                address: post.address
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setIsEditing(false);
            fetchPost(); // 새로고침
            setIsEdited(true);
        } catch {
            alert("수정에 실패했습니다.");
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
                            {post.updatedAt !== post.createdAt && (
                                <span className={styles.editedTag}> {isEdited && "(수정됨)"}</span>
                            )}
                        </span>
                        {post.userKey === userKey && (
                            <MoreMenu
                                onDelete={handleDelete}
                                onEdit={() => setIsEditing(true)}
                            />
                        )}
                    </div>
                </div>
                <div className={styles.address}>{post.address}</div>
                {isEditing ? (
                    <div>
                        <textarea
                            className={styles.editInput}
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className={styles.editButtons}>
                            <button onClick={handleSaveEdit}>저장</button>
                            <button onClick={() => setIsEditing(false)}>취소</button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.content}>{post.content}</div>
                )}
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