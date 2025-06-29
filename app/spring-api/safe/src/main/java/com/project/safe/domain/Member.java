package com.project.safe.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Date;

@Entity
@Table(name = "MEMBER")
public class Member {

    @Id
    @Column(name = "USER_KEY")
    private String userKey;

    @Column(name = "USER_ID", unique = true)
    private String userId;

    @Column(name = "USER_PW")
    private String userPw;

    @Column(name = "NICKNAME")
    private String nickname;

    @Column(name = "USER_EMAIL")
    private String userEmail;

    // @Column(name = "CREATED_AT", insertable = false, updatable = false)
    // @Temporal(TemporalType.TIMESTAMP)
    // private Date createdAt;

    @Column(name = "STATUS", insertable = false)
    private Integer status;

    @Column(name = "ROLE", insertable = false)
    private String role;

    public Member() {
    }

    @Column(name = "CREATED_AT", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
    }

    // @PrePersist
    // public void prePersist() {
    // this.createdAt =
    // Date.from(ZonedDateTime.now(ZoneId.of("Asia/Seoul")).toInstant());
    // }

    public String getUserKey() {
        return userKey;
    }

    public void setUserKey(String userKey) {
        this.userKey = userKey;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserPw() {
        return userPw;
    }

    public void setUserPw(String userPw) {
        this.userPw = userPw;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    // public Date getCreatedAt() {
    // return createdAt;
    // }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Integer getStatus() {
        return status;
    }

    public String getRole() {
        return role;
    }
}
