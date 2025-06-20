// 서영 0620
package com.project.safe.controller;

import com.project.safe.dto.PostDTO;
import com.project.safe.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody PostDTO postDTO) {
        postService.createPost(postDTO, postDTO.getUserKey());

        Map<String, String> response = new HashMap<>();
        response.put("message", "게시글이 등록되었습니다.");

        return ResponseEntity.ok(response);
    }
}