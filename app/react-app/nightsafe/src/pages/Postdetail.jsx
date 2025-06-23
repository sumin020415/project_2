import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/CommentSection';
import ReactionButtons from '../components/ReactionButtons';
import styles from './PostDetail.module.css';

const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const token = localStorage.getItem("accessToken");
    const userKey = localStorage.getItem("userKey");

    useEffect(() => {
        axios.get(`/api/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setPost(res.data))
            .catch(err => { console.error('실패:', err); alert('불러오기 실패'); });
    }, [postId]);

    if (!post) return <p className={styles.loading}>로딩 중...</p>;

    return (
        <div className={styles.wrapper}>
            <div className={styles.postCard}>
                <div className={styles.header}>
                    <span className={styles.nickname}>{post.nickname}</span>
                    <span className={styles.time}>{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
                </div>
                <div className={styles.address}>{post.address}</div>
                <div className={styles.content}>{post.content}</div>
                {post.imageUrl && <img className={styles.image} src={post.imageUrl} alt="첨부" />}
                <ReactionButtons
                    postId={post.postId}
                    initialLike={post.likeCount}
                    initialDislike={post.dislikeCount}
                    initialUserReaction={post.userReactionType}
                />
                <div className={styles.separator}></div>
            </div>

            <CommentSection postId={postId} />
        </div>
    );
};

export default PostDetail;