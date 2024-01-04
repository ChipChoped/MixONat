package com.backend.mixonat.repository;

import com.backend.mixonat.model.File;
import com.backend.mixonat.model.FileInfoOnly;
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
public interface FileRepository extends JpaRepository<File, UUID> {
    @Query(value="SELECT s.id, s.name, s.type, s.author, s.added_by, s.added_at, " +
            "CONCAT(u.first_name, ' ', u.last_name) AS added_by_name " +
            "FROM files s " +
            "INNER JOIN users u ON s.added_by = u.id", nativeQuery = true)
    List<FileInfoOnly> findAllInfoOnly();

    @Query(value="SELECT s.id, s.name, s.type, s.author, s.added_by, s.added_at, " +
            "CONCAT(u.first_name, ' ', u.last_name) AS added_by_name " +
            "FROM files s " +
            "INNER JOIN users u ON s.added_by = u.id " +
            "WHERE s.added_by = :#{#id}", nativeQuery = true)
    List<FileInfoOnly> findAllInfoOnlyByUserId(@Param("id") UUID id);

    Optional<File> findFileById(UUID id);

    @Modifying
    @Transactional
    @Query(value = "insert into files (name, type, file, author, added_by) " +
            "values (:#{#name}, :#{#type}, :#{#file}, :#{#author}, :#{#added_by});", nativeQuery = true)
    void save(@Param("name") String name, @Param("type") String type, @Param("file") String file, @Param("author") String author, @Param("added_by") UUID added_by);
}
