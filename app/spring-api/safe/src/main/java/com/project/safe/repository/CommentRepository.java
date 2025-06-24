package com.project.safe.repository;

import com.project.safe.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);

    List<Comment> findByUserKeyOrderByCreatedAtDesc(String userKey);

    void deleteByPostId(String postId);

    List<Comment> findByUserKey(String userKey);
}