package com.project.safe.dto;

public class ReactionDTO {
    private String postId;
    private String userKey;
    private int reactionType; // 1: 좋아요, -1: 싫어요 등

    public ReactionDTO() {
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

    public int getReactionType() {
        return reactionType;
    }

    public void setReactionType(int reactionType) {
        this.reactionType = reactionType;
    }
}
