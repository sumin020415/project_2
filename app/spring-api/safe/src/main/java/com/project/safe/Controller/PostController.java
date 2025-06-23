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

    private final PostService postService;
    private final JwtUtil jwtUtil;
    private final MemberRepository memberRepository;

    public PostController(PostService postService, JwtUtil jwtUtil, MemberRepository memberRepository) {
        this.postService = postService;
        this.jwtUtil = jwtUtil;
        this.memberRepository = memberRepository;
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostDTO postDTO,
            @RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.getUserIdFromToken(authHeader);
        Member member = memberRepository.findByUserId(userId);

        if (member == null) {
            return ResponseEntity.status(401).body("유효하지 않은 사용자입니다.");
        }

        postService.createPost(postDTO, member.getUserKey());

        Map<String, String> response = new HashMap<>();
        response.put("message", "게시글이 등록되었습니다.");
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PostDTO>> getAllPosts(@RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.getUserIdFromToken(authHeader);
        Member member = memberRepository.findByUserId(userId);

        if (member == null) {
            return ResponseEntity.status(401).build();
        }

        List<PostDTO> posts = postService.getAllPosts(member.getUserKey());
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/user/{userKey}")
    public ResponseEntity<List<PostDTO>> getPostsByUser(@PathVariable String userKey) {
        List<PostDTO> posts = postService.getPostsByUser(userKey);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/my")
    public ResponseEntity<List<PostDTO>> getMyPosts(@RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.getUserIdFromToken(authHeader);
        Member member = memberRepository.findByUserId(userId);

        if (member == null) {
            return ResponseEntity.status(401).build();
        }

        List<PostDTO> myPosts = postService.getPostsByUser(member.getUserKey());
        return ResponseEntity.ok(myPosts);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable String postId,
            @RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.getUserIdFromToken(authHeader);
        Member member = memberRepository.findByUserId(userId);

        if (member == null) {
            return ResponseEntity.status(401).build();
        }

        PostDTO postDTO = postService.getPostById(postId, member.getUserKey());
        return ResponseEntity.ok(postDTO);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable String postId,
            @RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.getUserIdFromToken(authHeader);
        Member member = memberRepository.findByUserId(userId);

        if (member == null) {
            return ResponseEntity.status(401).body("인증 실패");
        }

        postService.deletePost(postId, member.getUserKey());
        return ResponseEntity.ok().body("게시글이 삭제되었습니다.");
    }

}
