package com.project.safe.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.safe.config.JwtUtil;
import com.project.safe.domain.Member;
import com.project.safe.dto.PostDTO;
import com.project.safe.repository.MemberRepository;
import com.project.safe.service.PostService;

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

    @PutMapping("/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable String postId,
            @RequestBody PostDTO postDTO,
            @RequestHeader("Authorization") String authHeader) {
        String userId = jwtUtil.getUserIdFromToken(authHeader);
        Member member = memberRepository.findByUserId(userId);

        if (member == null) {
            return ResponseEntity.status(401).body("유효하지 않은 사용자입니다.");
        }

        try {
            postService.updatePost(postId, member.getUserKey(), postDTO);
            return ResponseEntity.ok().body("게시글이 수정되었습니다.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/public")
    public ResponseEntity<List<PostDTO>> getPublicPosts() {
        List<PostDTO> posts = postService.getAllPosts(null); // userKey 없이 조회
        return ResponseEntity.ok(posts);
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
