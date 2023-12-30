package com.backend.mixonat.repository;

import com.backend.mixonat.model.Sdf;
import com.backend.mixonat.model.SdfNoFile;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SdfRepository extends JpaRepository<Sdf, UUID> {
    @Query(value="SELECT s.id, s.name, s.author, s.added_by, s.added_at, " +
            "CONCAT(u.first_name, ' ', u.last_name) AS added_by_name " +
            "FROM sdf s " +
            "INNER JOIN users u ON s.added_by = u.id", nativeQuery = true)
    List<SdfNoFile> findAllWithoutFile();

    Optional<Sdf> findSdfById(UUID id);

    @Modifying
    @Transactional
    @Query(value = "insert into sdf (name, file, author, added_by) " +
            "values (:#{#name}, :#{#file}, :#{#author}, :#{#added_by});", nativeQuery = true)
    void save(@Param("name") String name, @Param("file") String file, @Param("author") String author, @Param("added_by") UUID added_by);
}
