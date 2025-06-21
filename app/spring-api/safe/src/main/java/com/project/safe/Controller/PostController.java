package com.project.safe.controller;

import com.project.safe.config.JwtUtil;
import com.project.safe.domain.Member;
import com.project.safe.dto.PostDTO;
import com.project.safe.repository.MemberRepository;
import com.project.safe.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService; // DB 저장 로직
    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository; // userId로 member 조회해서 userKey 얻기

    public PostController(PostService postService, JwtUtil jwtUtil, MemberRepository memberRepository) {
        this.postService = postService;
        this.jwtUtil = jwtUtil;
        this.memberRepository = memberRepository;
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostDTO postDTO,
            @RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.getUserIdFromToken(authHeader); // JWT에서 userId 추출
        // DB에서 Member 조회
        Member member = memberRepository.findByUserId(userId);

        // 사용자 검증
        if (member == null) {
            return ResponseEntity.status(401).body("유효하지 않은 사용자입니다.");
        }

        // 게시글 저장
        postService.createPost(postDTO, member.getUserKey());

        // 응답 반환
        Map<String, String> response = new HashMap<>();
        response.put("message", "게시글이 등록되었습니다.");

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts() {
        List<PostDTO> posts = postService.getAllPosts();
        return ResponseEntity.ok(posts);
    }
}
