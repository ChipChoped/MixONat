package com.backend.mixonat.controller;

import com.backend.mixonat.dto.*;
import com.backend.mixonat.service.JwtService;
import com.backend.mixonat.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class UserController {
    @Autowired
    private final UserService userService;

    @Autowired
    private final JwtService jwtService;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private final AuthenticationManager authenticationManager;

    @CrossOrigin(origins="http://localhost:3000")
    @GetMapping("/user/id")
    public ResponseEntity<JsonResponse> getUserById(@RequestHeader("Authorization") String token) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json");

        try {
            UUID id = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));

            return ResponseEntity.status(200).headers(responseHeaders).body(IdDTO.builder().id(id).build());
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The user doesn't exist"));
        }
    }

    @CrossOrigin(origins="http://localhost:3000")
    @GetMapping("/user/{id}")
    public ResponseEntity<JsonResponse> getUserById(@PathVariable UUID id) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json");

        try {
            var user = userService.findUserById(id)
                    .orElseThrow(IllegalArgumentException::new);

            UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
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
    @GetMapping("/user")
    public ResponseEntity<JsonResponse> getUserByToken(@RequestHeader("Authorization") String token) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json");

        try {
            UUID id = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));

            var user = userService.findUserById(id)
                    .orElseThrow(IllegalArgumentException::new);

            UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
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
    @PutMapping("/user/update/identity")
    public ResponseEntity<JsonResponse> updateIdentity(@RequestBody @Valid IdentityDTO identityDTO, @RequestHeader("Authorization") String token) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json");

        try {
            System.out.println(identityDTO.getFirstName() + " " + identityDTO.getLastName());
            UUID id = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));
            userService.updateIdentity(id, identityDTO.getFirstName(), identityDTO.getLastName());

            return ResponseEntity.status(204).headers(responseHeaders).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
        }
    }

    @CrossOrigin(origins="http://localhost:3000")
    @PutMapping("/user/update/email")
    public ResponseEntity<JsonResponse> updateEmail(@RequestBody @Valid EmailDTO emailDTO, @RequestHeader("Authorization") String token) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json");

        try {
            UUID id = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));
            userService.updateEmail(id, emailDTO.getEmail());

            return ResponseEntity.status(204).headers(responseHeaders).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
        }
    }

    @CrossOrigin(origins="http://localhost:3000")
    @PutMapping("/user/update/password")
    public ResponseEntity<JsonResponse> updatePassword(@RequestBody @Valid PasswordDTO passwordDTO, @RequestHeader("Authorization") String token) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json");

        try {
            System.out.println(passwordDTO.getCurrentPassword() + " " + passwordDTO.getNewPassword());
            System.out.println(passwordEncoder.encode(passwordDTO.getCurrentPassword()) + " " + passwordEncoder.encode(passwordDTO.getNewPassword()));

            UUID id = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));

            if (userService.findUserById(id).isPresent()) {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(id, passwordDTO.getCurrentPassword()));
                userService.updatePassword(id, passwordEncoder.encode(passwordDTO.getNewPassword()));
            } else {
                throw new IllegalArgumentException("The user doesn't exist");
            }

            return ResponseEntity.status(204).headers(responseHeaders).build();
        } catch (AuthenticationException e) {
            return ResponseEntity.status(403).headers(responseHeaders).body(new ExceptionDTO("Password is incorrect"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO(e.getMessage()));
        } /*catch (Exception e) {
            return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
        }*/
    }

    @CrossOrigin(origins="http://localhost:3000")
    @DeleteMapping("/user")
    public ResponseEntity<JsonResponse> deleteAccount(@RequestHeader("Authorization") String token) {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type", "application/json");

        try {
            UUID id = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));
            userService.deleteById(id);

            return ResponseEntity.status(204).headers(responseHeaders).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
        }
    }
}
