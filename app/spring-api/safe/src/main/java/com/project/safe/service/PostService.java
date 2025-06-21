package com.project.safe.service;

import com.project.safe.domain.Post;
import com.project.safe.dto.PostDTO;
import com.project.safe.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public void createPost(PostDTO dto, String userKey) {
        Post post = new Post();
        post.setUserKey(userKey);
        post.setContent(dto.getContent());
        post.setLatitude(dto.getLatitude());
        post.setLongitude(dto.getLongitude());
        post.setImageUrl(dto.getImageUrl());

        postRepository.save(post);
    }

    public List<PostDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(post -> {
                    PostDTO dto = new PostDTO();
                    dto.setContent(post.getContent());
                    dto.setLatitude(post.getLatitude());
                    dto.setLongitude(post.getLongitude());
                    dto.setImageUrl(post.getImageUrl());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
