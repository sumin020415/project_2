// 서영 0620
package com.project.safe.service;

import com.project.safe.domain.Post;
import com.project.safe.dto.PostDTO;
import com.project.safe.repository.PostRepository;
import org.springframework.stereotype.Service;

@Service
public class PostService {
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public void createPost(PostDTO dto, String userKey) {
        System.out.println(">> userKey = " + userKey);
        System.out.println(">> content = " + dto.getContent());
        System.out.println(">> lat = " + dto.getLatitude() + ", lng = " + dto.getLongitude());

        Post post = new Post();
        post.setUserKey(userKey);
        post.setContent(dto.getContent());
        post.setLatitude(dto.getLatitude());
        post.setLongitude(dto.getLongitude());
        post.setImageUrl(dto.getImageUrl());
        postRepository.save(post);
    }
}