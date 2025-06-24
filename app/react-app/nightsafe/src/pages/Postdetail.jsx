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
    const [mypost, setMypost] = useState(false)

    useEffect(() => {
        axios.get(`/api/posts/${postId}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setPost(res.data))
            .catch(err => { console.error('실패:', err); alert('불러오기 실패'); });
    }, [postId]);

    useEffect(() => {
        if (!post) return
        setMypost(post.userKey === userKey)
    }, [post, userKey])

    const deletePost = async (postID) => {
        alert('정말 삭제하시겠습니까?')
        try{
            const res = await axios.delete(`/api/posts/${postID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            alert('게시글이 삭제되었습니다.')
            navigate('/post')
        } catch (err) {
            alert('게시글 삭제 중 오류가 발생했습니다.')
            console.log(err)
        }
    }

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
                <div className={styles.like_wrap}>
                    <ReactionButtons
                        postId={post.postId}
                        initialLike={post.likeCount}
                        initialDislike={post.dislikeCount}
                        initialUserReaction={post.userReactionType}
                    />
                    {mypost && <button className={styles.btn_delete} onClick={() => deletePost(postId)}>게시글 삭제하기</button>}
                </div>

                <div className={styles.separator}></div>
            </div>

            <CommentSection postId={postId} />
        </div>
    );
};

export default PostDetail;