package com.backend.mixonat.service;

import com.backend.mixonat.model.User;
import com.backend.mixonat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final FileService fileService;

    public Optional<User> findUserById(UUID id) {
        return userRepository.findUserById(id);
    }

    public UserDetailsService userDetailsService() {
        return uuid -> userRepository.findUserById(UUID.fromString(uuid))
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public void save(User user) {
        userRepository.save(user.getFirstName(), user.getLastName(), user.getEmail(), user.getPassword(), String.valueOf(user.getRole()));
    }

    public void updateIdentity(UUID id, String firstName, String lastName) {
        if (userRepository.findUserById(id).isPresent()) {
            userRepository.updateIdentity(id, firstName, lastName, LocalDateTime.now());
        } else {
            throw new IllegalArgumentException("The user doesn't exist");
        }
    }

    public void updateEmail(UUID id, String email) {
        if (userRepository.findUserById(id).isPresent()) {
            userRepository.updateEmail(id, email, LocalDateTime.now());
        } else {
            throw new IllegalArgumentException("The user doesn't exist");
        }
    }

    public void updatePassword(UUID id, String password) {
        userRepository.updatePassword(id, password, LocalDateTime.now());
    }

    public void deleteById(UUID id) {
        if (userRepository.findUserById(id).isPresent()) {
            fileService.deleteAllFilesByUserId(id);
            userRepository.deleteById(id);
        } else {
            throw new IllegalArgumentException("The user doesn't exist");
        }
    }
}
