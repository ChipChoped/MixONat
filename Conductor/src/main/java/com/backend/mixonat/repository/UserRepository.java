package com.backend.mixonat.repository;

import org.springframework.stereotype.Repository;

import com.backend.mixonat.model.User;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query(value="SELECT id FROM users WHERE email = ?1 AND password = ?2", nativeQuery = true)
    List<Integer> findUserIDByLogins(String email, String password);

    @Query(value="SELECT id, firstname, lastname, email, status FROM users WHERE id = ?1", nativeQuery = true)
    List<User> findUserByID(int id);
}
