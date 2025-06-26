package com.project.safe.repository;

import com.project.safe.domain.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, String> {

    // 특정 게시글에 대해 특정 유저가 남긴 리액션 조회
    Optional<Reaction> findByPostIdAndUserKey(String postId, String userKey);

    // 특정 게시글의 좋아요 수
    Long countByPostIdAndReactionType(String postId, int reactionType);

    void deleteByPostId(String postId);
}