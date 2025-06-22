package com.project.safe.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.UUID;

@Entity
@Table(name = "COMMENTS")
public class Comment {

    @Id
    @Column(name = "COMMENT_ID", nullable = false)
    private String commentId;

    @Column(name = "POST_ID", nullable = false)
    private String postId;

    @Column(name = "USER_KEY", nullable = false)
    private String userKey;

    @Lob
    @Column(name = "CONTENT", nullable = false, columnDefinition = "CLOB")
    private String content;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "PARENT_ID")
    private String parentId; // 대댓글용

    @PrePersist
    public void prePersist() {
        if (this.commentId == null) {
            this.commentId = UUID.randomUUID().toString().replace("-", "").toUpperCase();
        }

        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        }
    }

    // Getter/Setter
    public String getCommentId() {
        return commentId;
    }

    public void setCommentId(String commentId) {
        this.commentId = commentId;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getUserKey() {
        return userKey;
    }

    public void setUserKey(String userKey) {
        this.userKey = userKey;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }
}
