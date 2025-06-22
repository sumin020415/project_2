import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CommentSection from '../components/CommentSection';

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/api/posts/${postId}`);
                setPost(res.data);
            } catch (err) {
                console.error('게시글 불러오기 실패:', err);
                alert('게시글을 불러오는 데 실패했습니다.');
            }
        };

        fetchPost();
    }, [postId]);

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
            <p><strong>작성 시간:</strong> {formattedDate}</p>
            <p><strong>위치:</strong> 위도 {post.latitude}, 경도 {post.longitude}</p>
            {post.imageUrl && (
                <img src={post.imageUrl} alt="게시글 이미지" style={{ maxWidth: '400px' }} />
            )}
            <hr />
            <CommentSection postId={postId} />
        </div>
    );
};

export default PostDetail;
