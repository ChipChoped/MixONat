package com.backend.mixonat.service;

import com.backend.mixonat.dto.JsonResponse;
import com.backend.mixonat.dto.TokenDTO;
import com.backend.mixonat.dto.UserDTO;
import com.backend.mixonat.dto.LoginsDTO;
import com.backend.mixonat.dto.ExceptionDTO;
import com.backend.mixonat.model.Role;
import com.backend.mixonat.model.User;
import com.backend.mixonat.repository.UserRepository;
import jakarta.validation.ConstraintViolationException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final JwtService jwtService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public ResponseEntity<JsonResponse> signUp(UserDTO request) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type","application/json");

        var user = User
                .builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();

        try {
            user = userService.save(user);
            var jwt = jwtService.generateToken(user);
            return ResponseEntity.status(201).headers(responseHeaders).body(TokenDTO.builder().token(jwt).build());
        }
        catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .headers(responseHeaders).body(new ExceptionDTO(e.getMessage()));
        }
    }

    public ResponseEntity<JsonResponse> signIn(LoginsDTO request) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type","application/json");

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

            var user = userRepository.findUserByEmail(request.getEmail())
                    .orElseThrow(IllegalArgumentException::new);

            var jwt = jwtService.generateToken(user);

            return ResponseEntity.ok().headers(responseHeaders).body(TokenDTO.builder().token(jwt).build());
        }
        catch (AuthenticationException | IllegalArgumentException e) {
            return ResponseEntity.status(401).headers(responseHeaders).body(new ExceptionDTO("Incorrect email or password"));
        }
    }

    public ResponseEntity<JsonResponse> deleteAccount(LoginsDTO request) {
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
