import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Mypage.module.css';
import ReactionButtons from '../components/ReactionButtons';
import MoreMenu from '../components/MoreMenu';

const Mypage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [myPosts, setMyPosts] = useState([]);
    const [myComments, setMyComments] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const token = localStorage.getItem('accessToken');
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/me', { headers: { Authorization: `Bearer ${token}` } }).then(res => setUserInfo(res.data));
        axios.get('/api/posts/my', { headers: { Authorization: `Bearer ${token}` } }).then(res => setMyPosts(res.data));
        axios.get('/api/comments/my-comments', { headers: { Authorization: `Bearer ${token}` } }).then(res => setMyComments(res.data));
    }, []);

    if (!userInfo) return <p>로딩 중...</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.nickname}>{userInfo.nickname}</div>
                <div className={styles.email}>{userInfo.email}</div>
            </div>

            <div className={styles.tabWrapper}>
                <div
                    className={`${styles.tabItem} ${activeTab === 'posts' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    게시글
                    <span className={styles.count}>{myPosts.length}</span>
                </div>
                <div
                    className={`${styles.tabItem} ${activeTab === 'comments' ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab('comments')}
                >
                    댓글
                    <span className={styles.count}>{myComments.length}</span>
                </div>
            </div>

            <div className={styles.section}>
                {activeTab === 'posts' && myPosts.map(post => (
                    <div key={post.postId} className={styles.card} onClick={() => navigate(`/posts/${post.postId}`)}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardNickname}>{userInfo.nickname}</span>
                            <div className={styles.rightHeader}>
                                <span className={styles.cardTime}>{new Date(post.createdAt).toLocaleString('ko-KR')}</span>
                                <MoreMenu onClick={(e) => e.stopPropagation()} onDelete={() => {
                                    if (window.confirm("게시글을 삭제하시겠습니까?")) {
                                        axios.delete(`/api/posts/${post.postId}`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        }).then(() => {
                                            setMyPosts(prev => prev.filter(p => p.postId !== post.postId));
                                        });
                                    }
                                }} />
                            </div>
                        </div>
                        <div className={styles.cardContent}>{post.content}</div>
                        <ReactionButtons
                            postId={post.postId}
                            initialLike={post.likeCount}
                            initialDislike={post.dislikeCount}
                            initialUserReaction={post.userReactionType}
                        />
                    </div>
                ))}
                {activeTab === 'comments' && myComments.map(comment => (
                    <div key={comment.commentId} className={styles.card} onClick={() => navigate(`/posts/${comment.postId}`)}>
                        <div className={styles.cardHeader}>
                            <span className={styles.cardNickname}>{userInfo.nickname}</span>
                            <div className={styles.rightHeader}>
                                <span className={styles.cardTime}>{new Date(comment.createdAt).toLocaleString('ko-KR')}</span>
                                <MoreMenu onClick={(e) => e.stopPropagation()} onDelete={() => {
                                    if (window.confirm("댓글을 삭제하시겠습니까?")) {
                                        axios.delete(`/api/comments/${comment.commentId}`, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        }).then(() => {
                                            setMyComments(prev => prev.filter(c => c.commentId !== comment.commentId));
                                        });
                                    }
                                }} />
                            </div>
                        </div>
                        <div className={styles.cardContent}>{comment.content}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Mypage;