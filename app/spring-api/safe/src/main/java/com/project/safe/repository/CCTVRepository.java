package com.project.safe.repository;

import com.project.safe.domain.CCTV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CCTVRepository extends JpaRepository<CCTV, String> {
}
