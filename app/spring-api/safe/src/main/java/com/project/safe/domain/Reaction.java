package com.project.safe.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "REACTION")
public class Reaction {

    @Id
    @Column(name = "REACTION_ID")
    private String reactionId;

    @Column(name = "USER_KEY", nullable = false)
    private String userKey;

    @Column(name = "POST_ID", nullable = false)
    private String postId;

    @Column(name = "REACTION_TYPE", nullable = false)
    private int reactionType; // 1: 좋아요, -1: 싫어요 등

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.reactionId == null) {
            this.reactionId = UUID.randomUUID().toString().replace("-", "").toUpperCase();
        }
        if (this.createdAt == null) {
            this.createdAt = ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toLocalDateTime();
        }
    }

    public Reaction() {
    }

    public String getReactionId() {
        return reactionId;
    }

    public void setReactionId(String reactionId) {
        this.reactionId = reactionId;
    }

    public String getUserKey() {
        return userKey;
    }

    public void setUserKey(String userKey) {
        this.userKey = userKey;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public int getReactionType() {
        return reactionType;
    }

    public void setReactionType(int reactionType) {
        this.reactionType = reactionType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
