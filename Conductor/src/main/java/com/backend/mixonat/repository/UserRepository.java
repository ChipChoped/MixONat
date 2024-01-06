package com.backend.mixonat.repository;

import com.backend.mixonat.model.Role;
import com.backend.mixonat.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    @Query(value="SELECT id FROM users WHERE email = ?1", nativeQuery = true)
    UUID findIdByEmail(String email);

    Optional<User> findUserById(UUID id);
    Optional<User> findUserByEmail(String email);
    Optional<User> findUserByIdAndPassword(UUID id, String password);

    @Modifying
    @Transactional
    @Query(value = "insert into users (first_name, last_name, email, password, role)" +
            "values (:#{#first_name}, :#{#last_name}, :#{#email}, :#{#password}, :#{#role});", nativeQuery = true)
    void save(@Param("first_name") String first_name, @Param("last_name") String last_name, @Param("email") String email, @Param("password") String password, @Param("role") String role);

    @Modifying
    @Transactional
    @Query(value = "update users set first_name = :#{#first_name}, last_name = :#{#last_name} where id = :#{#id}", nativeQuery = true)
    void updateIdentity(@Param("id") UUID id, @Param("first_name") String first_name, @Param("last_name") String last_name);

    @Modifying
    @Transactional
    @Query(value = "update users set email = :#{#email} where id = :#{#id}", nativeQuery = true)
    void updateEmail(@Param("id") UUID id, @Param("email") String email);

    @Modifying
    @Transactional
    @Query(value = "update users set password = :#{#password} where id = :#{#id}", nativeQuery = true)
    void updatePassword(@Param("id") UUID id, @Param("password") String password);
}

