package com.backend.mixonat.controller;

import com.backend.mixonat.dto.*;
import com.backend.mixonat.repository.UserRepository;
import com.backend.mixonat.service.AuthenticationService;
import com.backend.mixonat.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Role;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @CrossOrigin(origins="http://localhost:3000")
    @GetMapping("/user/{uuid}")
    public ResponseEntity<JsonResponse> getUser(@PathVariable UUID uuid) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type","application/json");

        try {
            var user = userRepository.findUserByUuid(uuid)
                    .orElseThrow(IllegalArgumentException::new);

            UserDTO userDTO = UserDTO.builder()
                .uuid(user.getUuid())
                .first_name(user.getFirstName())
                .last_name(user.getLastName())
                .email(user.getEmail())
                .created_at(user.getCreatedAt())
                .updated_at(user.getUpdatedAt())
                .build();

            return ResponseEntity.status(200).headers(responseHeaders).body(userDTO);
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The user doesn't exist"));
        }
    }

    @CrossOrigin(origins="http://localhost:3000")
    @DeleteMapping("/user/delete-account")
    public ResponseEntity<JsonResponse> deleteAccount(@RequestBody LoginsDTO request) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type","application/json");

        try {
            var user = userRepository.findUserByEmail(request.getEmail())
                    .orElseThrow(IllegalArgumentException::new);

            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                userRepository.delete(user);
                return ResponseEntity.status(204).headers(responseHeaders).build();
            }
            else
                return ResponseEntity.status(403).headers(responseHeaders).body(new ExceptionDTO("Incorrect password"));
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).headers(responseHeaders).body(new ExceptionDTO("The email doesn't match the current account"));
        }
    }
}
