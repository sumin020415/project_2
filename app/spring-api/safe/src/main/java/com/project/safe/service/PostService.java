package com.project.safe.service;

import com.project.safe.domain.Post;
import com.project.safe.domain.Reaction;
import com.project.safe.domain.Member;
import com.project.safe.dto.PostDTO;
import com.project.safe.repository.CommentRepository;
import com.project.safe.repository.PostRepository;
import com.project.safe.repository.ReactionRepository;
import com.project.safe.repository.MemberRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final MemberRepository memberRepository; // 닉네임 조회용

    public PostService(PostRepository postRepository,
            CommentRepository commentRepository,
            ReactionRepository reactionRepository,
            MemberRepository memberRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.reactionRepository = reactionRepository;
        this.memberRepository = memberRepository;
    }

    public void createPost(PostDTO dto, String userKey) {
        Post post = new Post();
        post.setUserKey(userKey);
        post.setContent(dto.getContent());
        post.setLatitude(dto.getLatitude());
        post.setLongitude(dto.getLongitude());
        post.setImageUrl(dto.getImageUrl());
        post.setCategory(dto.getCategory());
        post.setAddress(dto.getAddress());
        post.setCreatedAt(LocalDateTime.now(ZoneId.of("Asia/Seoul")));

        postRepository.save(post);
    }

    public List<PostDTO> getAllPosts(String userKey) {
        return postRepository.findByIsDeletedOrderByCreatedAtDesc(0).stream()
                .map(post -> convertToDTO(post, userKey))
                .collect(Collectors.toList());
    }

    public List<PostDTO> getPostsByUser(String userKey) {
        return postRepository.findByUserKey(userKey).stream()
                .map(post -> convertToDTO(post, userKey))
                .collect(Collectors.toList());
    }

    public PostDTO getPostById(String postId, String userKey) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        return convertToDTO(post, userKey);
    }

    private PostDTO convertToDTO(Post post, String userKey) {
        PostDTO dto = new PostDTO();
        dto.setPostId(post.getPostId());
        dto.setContent(post.getContent());
        dto.setLatitude(post.getLatitude());
        dto.setLongitude(post.getLongitude());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setCategory(post.getCategory());
        dto.setAddress(post.getAddress());
        dto.setUserKey(post.getUserKey());

        // 닉네임 직접 조회 (Optional 없이)
        Member member = memberRepository.findByUserKey(post.getUserKey());
        if (member != null) {
            dto.setNickname(member.getNickname());
        } else {
            dto.setNickname("알 수 없음");
        }

        dto.setCommentCount(commentRepository.findByPostIdOrderByCreatedAtAsc(post.getPostId()).size());
        dto.setLikeCount(reactionRepository.countByPostIdAndReactionType(post.getPostId(), 1).intValue());
        dto.setDislikeCount(reactionRepository.countByPostIdAndReactionType(post.getPostId(), -1).intValue());
        dto.setUserReactionType(
                reactionRepository.findByPostIdAndUserKey(post.getPostId(), userKey)
                        .map(Reaction::getReactionType)
                        .orElse(0));

        return dto;
    }

    public void deletePost(String postId, String userKey) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        if (!post.getUserKey().equals(userKey)) {
            throw new RuntimeException("게시글 삭제 권한이 없습니다.");
        }

        reactionRepository.deleteByPostId(postId);
        commentRepository.deleteByPostId(postId);
        postRepository.deleteById(postId);
    }
}
