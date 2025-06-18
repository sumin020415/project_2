package com.project.safe.repository;

import com.project.safe.domain.Lamp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LampRepository extends JpaRepository<Lamp, String> {
}