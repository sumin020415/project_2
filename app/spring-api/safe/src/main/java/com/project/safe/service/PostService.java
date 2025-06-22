package com.project.safe.service;

import com.project.safe.domain.Post;
import com.project.safe.dto.PostDTO;
import com.project.safe.repository.CommentRepository;
import com.project.safe.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    public PostService(PostRepository postRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
    }

    public void createPost(PostDTO dto, String userKey) {
        Post post = new Post();
        post.setUserKey(userKey);
        post.setContent(dto.getContent());
        post.setLatitude(dto.getLatitude());
        post.setLongitude(dto.getLongitude());
        post.setImageUrl(dto.getImageUrl());
        post.setCreatedAt(LocalDateTime.now(ZoneId.of("Asia/Seoul")));

        postRepository.save(post);
    }

    public List<PostDTO> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::convertToDTOWithCommentCount)
                .collect(Collectors.toList());
    }

    public List<PostDTO> getPostsByUser(String userKey) {
        List<Post> posts = postRepository.findByUserKey(userKey);
        return posts.stream().map(this::convertToDTOWithCommentCount).collect(Collectors.toList());
    }

    public PostDTO getPostById(String postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        return convertToDTOWithCommentCount(post);
    }

    private PostDTO convertToDTOWithCommentCount(Post post) {
        PostDTO dto = new PostDTO();
        dto.setPostId(post.getPostId());
        dto.setContent(post.getContent());
        dto.setLatitude(post.getLatitude());
        dto.setLongitude(post.getLongitude());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());

        int commentCount = commentRepository.findByPostIdOrderByCreatedAtAsc(post.getPostId()).size();
        dto.setCommentCount(commentCount);

        return dto;
    }
}
