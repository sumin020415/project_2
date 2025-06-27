package com.project.safe.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.project.safe.domain.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByUserId(String userId);

    Member findByUserKey(String userKey);

    boolean existsByUserId(String userId);

    boolean existsByUserEmail(String userEmail);

    Member findByUserEmail(String email);

    boolean existsByNickname(String nickname);
}