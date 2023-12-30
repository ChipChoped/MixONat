package com.backend.mixonat.service;

import com.backend.mixonat.model.User;
import com.backend.mixonat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    public UserDetailsService userDetailsService() {
        return uuid -> userRepository.findUserById(UUID.fromString(uuid))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public User save(User user) {
        return userRepository.save(user.getFirstName(), user.getLastName(), user.getEmail(), user.getPassword(), user.getRole());
    }
}
