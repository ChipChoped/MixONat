package com.backend.mixonat.repository;

import org.springframework.stereotype.Repository;

import com.backend.mixonat.model.Rmn;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface RmnRepository extends JpaRepository<Rmn, Integer> {

    @Query(value="SELECT r.name FROM rmn r", nativeQuery = true)
    List<String> findAllWithoutFile();

    @Query(value="SELECT r.id FROM rmn r WHERE r.name = ?1",nativeQuery = true)
    List<Integer> findRmnIdByName(String name);

    Rmn findOneByName(String name);
}
