package com.project.safe.repository;

import java.util.List;
import com.project.safe.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, String> {
    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByUserKey(String userKey);

    List<Post> findByIsDeletedOrderByCreatedAtDesc(Integer isDeleted);
}
