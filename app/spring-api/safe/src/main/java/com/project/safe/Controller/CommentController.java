package com.project.safe.Controller;

import com.project.safe.dto.CommentDTO;
import com.project.safe.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.safe.config.JwtUtil;
import com.project.safe.domain.Member;
import com.project.safe.repository.MemberRepository;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;
    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    public CommentController(CommentService commentService, JwtUtil jwtUtil, MemberRepository memberRepository) {
        this.commentService = commentService;
        this.jwtUtil = jwtUtil;
        this.memberRepository = memberRepository;
    }

    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentDTO dto,
            @RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.getUserIdFromToken(authHeader);
        Member member = memberRepository.findByUserId(userId);

        if (member == null) {
            return ResponseEntity.status(401).body("유효하지 않은 사용자입니다.");
        }

        dto.setUserKey(member.getUserKey());
        commentService.createComment(dto);

        return ResponseEntity.ok("댓글이 등록되었습니다.");
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getComments(@PathVariable String postId) {
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    @GetMapping("/my-comments")
    public ResponseEntity<?> getMyComments(@RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.getUserIdFromToken(authHeader);
        Member member = memberRepository.findByUserId(userId);

        if (member == null) {
            return ResponseEntity.status(401).body("유효하지 않은 사용자입니다.");
        }

        List<CommentDTO> myComments = commentService.getCommentsByUserKey(member.getUserKey());
        return ResponseEntity.ok(myComments);
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId,
            @RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.getUserIdFromToken(authHeader);
        Member member = memberRepository.findByUserId(userId);

        if (member == null) {
            return ResponseEntity.status(401).body("인증 실패");
        }

        boolean deleted = commentService.deleteComment(commentId, member.getUserKey());
        if (deleted) {
            return ResponseEntity.ok("댓글이 삭제되었습니다.");
        } else {
            return ResponseEntity.status(403).body("삭제 권한이 없습니다.");
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable String commentId,
            @RequestBody CommentDTO dto,
            @RequestHeader("Authorization") String authHeader) {

        String userId = jwtUtil.getUserIdFromToken(authHeader);
        Member member = memberRepository.findByUserId(userId);

        if (member == null) {
            return ResponseEntity.status(401).body("인증 실패");
        }

        boolean updated = commentService.updateComment(commentId, dto.getContent(), member.getUserKey());

        if (updated) {
            return ResponseEntity.ok("댓글이 수정되었습니다.");
        } else {
            return ResponseEntity.status(403).body("수정 권한이 없습니다.");
        }
    }

}