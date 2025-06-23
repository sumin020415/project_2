import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/CommentSection';
import ReactionButtons from '../components/ReactionButtons';

const PostDetail = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);

    const token = localStorage.getItem("accessToken");
    const userKey = localStorage.getItem("userKey");

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/api/posts/${postId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("받아온 post:", res.data);
                console.log("내 userKey:", userKey);
                setPost(res.data);
            } catch (err) {
                console.error('게시글 불러오기 실패:', err);
                alert('게시글을 불러오는 데 실패했습니다.');
            }
        };

        fetchPost();
    }, [postId]);

    const handleDelete = async () => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/posts/${post.postId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("게시글이 삭제되었습니다.");
                navigate("/post");
            } catch (err) {
                console.error("삭제 실패:", err);
                alert("삭제에 실패했습니다.");
            }
        }
    };

    if (!post) return <p>로딩 중...</p>;

    const formattedDate = new Date(post.createdAt).toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div style={{ padding: '20px' }}>
            <h2>게시글 상세</h2>
            <p><strong>내용:</strong> {post.content}</p>
            <p><strong>카테고리:</strong> {post.category}</p>         {/* 추가 */}
            <p><strong>주소:</strong> {post.address}</p>
            <p><strong>작성 시간:</strong> {formattedDate}</p>
            <p><strong>위치:</strong> 위도 {post.latitude}, 경도 {post.longitude}</p>
            {post.imageUrl && (
                <img src={post.imageUrl} alt="게시글 이미지" style={{ maxWidth: '400px' }} />
            )}

            <ReactionButtons
                postId={post.postId}
                initialLike={post.likeCount}
                initialDislike={post.dislikeCount}
                initialUserReaction={post.userReactionType}
            />

            {post.userKey === userKey && (
                <button onClick={handleDelete} style={{ marginTop: '10px', color: 'red' }}>
                    게시글 삭제
                </button>
            )}

            <hr />
            <CommentSection postId={postId} />
        </div>
    );
};

export default PostDetail;
