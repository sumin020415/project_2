import { useEffect, useState } from 'react';
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('/api/posts');
                setPosts(res.data);
            } catch (err) {
                console.error('게시글 목록 불러오기 실패:', err);
                alert('게시글을 불러오는 데 실패했습니다.');
            }
        };

        fetchPosts();
    }, []);

    return (
        <section>
            <h2>제보 목록</h2>
            {posts.length === 0 ? (
                <p>게시글이 없습니다.</p>
            ) : (
                <ul>
                    {posts.map((post, index) => (
                        <li key={index} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
                            <p><strong>내용:</strong> {post.content}</p>
                            <p><strong>위도:</strong> {post.latitude}</p>
                            <p><strong>경도:</strong> {post.longitude}</p>
                            {post.imageUrl && <img src={post.imageUrl} alt="제보 이미지" style={{ maxWidth: '100%' }} />}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default Posts;
