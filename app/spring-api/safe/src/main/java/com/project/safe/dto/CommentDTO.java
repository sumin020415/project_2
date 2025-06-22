package com.project.safe.dto;

import java.time.LocalDateTime;

public class CommentDTO {
    private String commentId;
    private String postId;
    private String userKey;
    private String content;
    private String nickname;
    private LocalDateTime createdAt;
    private String parentId;

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

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    // @Override
    // public String toString() {
    // return "CommentDTO{" +
    // "commentId='" + commentId + '\'' +
    // ", postId='" + postId + '\'' +
    // ", userKey='" + userKey + '\'' +
    // ", content='" + content + '\'' +
    // ", createdAt=" + createdAt +
    // ", parentId='" + parentId + '\'' +
    // '}';
    // }
}