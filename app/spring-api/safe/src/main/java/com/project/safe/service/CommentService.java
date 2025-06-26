package com.project.safe.service;

import com.project.safe.domain.Comment;
import com.project.safe.dto.CommentDTO;
import com.project.safe.domain.Member;
import com.project.safe.repository.CommentRepository;
import com.project.safe.repository.MemberRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final MemberRepository memberRepository;

    public CommentService(CommentRepository commentRepository, MemberRepository memberRepository) {
        this.commentRepository = commentRepository;
        this.memberRepository = memberRepository;
    }

    public void createComment(CommentDTO dto) {
        Comment comment = new Comment();
        comment.setCommentId(UUID.randomUUID().toString());
        comment.setPostId(dto.getPostId());
        comment.setUserKey(dto.getUserKey());
        comment.setContent(dto.getContent());
        comment.setCreatedAt(LocalDateTime.now(ZoneId.of("Asia/Seoul")));
        comment.setParentId(dto.getParentId());

        commentRepository.save(comment);
    }

    public List<CommentDTO> getCommentsByPostId(String postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setCommentId(comment.getCommentId());
        dto.setPostId(comment.getPostId());
        dto.setUserKey(comment.getUserKey());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setParentId(comment.getParentId());
        dto.setUpdatedAt(comment.getUpdatedAt());

        // 닉네임 세팅 (member가 null일 수도 있으므로 안전하게 처리)
        Member member = memberRepository.findByUserKey(comment.getUserKey());
        if (member != null) {
            dto.setNickname(member.getNickname());
        } else {
            dto.setNickname("알 수 없음");
        }

        return dto;
    }

    public List<CommentDTO> getCommentsByUserKey(String userKey) {
        return commentRepository.findByUserKeyOrderByCreatedAtDesc(userKey)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean deleteComment(String commentId, String userKey) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            if (comment.getUserKey().equals(userKey)) {
                commentRepository.deleteById(commentId);
                return true;
            }
        }

        return false;
    }

    public List<CommentDTO> getCommentsByUser(String userKey) {
        return commentRepository.findByUserKey(userKey).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public boolean updateComment(String commentId, String newContent, String userKey) {
        Optional<Comment> commentOpt = commentRepository.findById(commentId);

        if (commentOpt.isPresent()) {
            Comment comment = commentOpt.get();
            if (comment.getUserKey().equals(userKey)) {
                comment.setContent(newContent);
                commentRepository.save(comment);
                return true;
            }
        }

        return false;
    }
}