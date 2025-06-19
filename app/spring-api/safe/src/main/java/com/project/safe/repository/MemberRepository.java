package com.project.safe.repository;

import com.project.safe.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, String> {
    boolean existsByUserId(String userId);

    Member findByUserId(String userId);
}