package com.backend.mixonat.controller;

import com.backend.mixonat.dto.ExceptionDTO;
import com.backend.mixonat.dto.JsonResponse;
import com.backend.mixonat.dto.LoginsDTO;
import com.backend.mixonat.repository.UserRepository;
import com.backend.mixonat.service.AuthenticationService;
import com.backend.mixonat.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Role;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
