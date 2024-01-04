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
    @Query(value="SELECT uuid FROM users WHERE email = ?1", nativeQuery = true)
    UUID findUuidByEmail(String email);

    Optional<User> findUserByUuid(UUID uuid);
    Optional<User> findUserByEmail(String email);

    @Modifying
    @Transactional
    @Query(value = "insert into users (first_name, last_name, email, password, role)" +
            "values (:#{#first_name}, :#{#last_name}, :#{#email}, :#{#password}, :#{#role});", nativeQuery = true)
    User save(@Param("first_name") String first_name, @Param("last_name") String last_name, @Param("email") String email, @Param("password") String password, @Param("role") Role role);
}

