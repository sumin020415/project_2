package com.project.safe.dto;

public class PostDTO {
    // private String userKey;
    private String content;
    private Double latitude;
    private Double longitude;
    private String imageUrl;

    // public String getUserKey() {
    // return userKey;
    // }

    // public void setUserKey(String userKey) {
    // this.userKey = userKey;
    // }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}