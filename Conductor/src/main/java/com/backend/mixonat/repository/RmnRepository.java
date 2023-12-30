package com.backend.mixonat.repository;

import com.backend.mixonat.model.RmnNoFile;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.mixonat.model.Rmn;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface RmnRepository extends JpaRepository<Rmn, UUID> {
    @Query(value="SELECT r.id, r.name, r.author, r.added_by, r.added_at, " +
            "CONCAT(u.first_name, ' ', u.last_name) AS added_by_name " +
            "FROM rmn r " +
            "INNER JOIN users u ON r.added_by = u.id", nativeQuery = true)
    List<RmnNoFile> findAllWithoutFile();

    Optional<Rmn> findRmnById(UUID id);

    @Modifying
    @Transactional
    @Query(value = "insert into rmn (name, file, author, added_by)" +
            "values (:#{#name}, :#{#file}, :#{#author}, :#{#added_by});", nativeQuery = true)
    void save(@Param("name") String name, @Param("file") String file, @Param("author") String author, @Param("added_by") UUID added_by);
}
