package com.backend.mixonat.repository;

import org.springframework.stereotype.Repository;

import com.backend.mixonat.model.Sdf;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface SdfRepository extends JpaRepository<Sdf, Integer> {

    @Query(value="SELECT s.name FROM sdf s", nativeQuery = true)
    List<String> findAllWithoutFile();

    @Query(value="SELECT s.id FROM sdf s WHERE s.name = ?1",nativeQuery = true)
    List<Integer> findSdfIdByName(String name);

    Sdf findOneByName(String name);
}
