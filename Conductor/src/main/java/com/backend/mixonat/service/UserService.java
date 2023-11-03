package com.backend.mixonat.service;

import java.time.LocalDateTime;
import java.util.List;

import com.backend.mixonat.dto.LoginsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.mixonat.model.User;
import com.backend.mixonat.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    public UserDetailsService userDetailsService() {
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) {
                return userRepository.findUserByEmail(username)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            }
        };
    }

    public User save(User user) {
        if (user.getId() == null)
            user.setCreatedAt(LocalDateTime.now());

        user.setUpdatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    public List<Integer> findUserIDByLogins(LoginsDTO loginsDTO) {
        return userRepository.findUserIDByLogins(loginsDTO.getEmail(), loginsDTO.getPassword());
    }

    public List<User> findUserByID(int id)
    {
        return userRepository.findUserByID(id);
    }
}
