package com.backend.mixonat.controller;

import com.backend.mixonat.dto.JsonResponse;
import com.backend.mixonat.dto.TokenDTO;
import com.backend.mixonat.dto.UserDTO;
import com.backend.mixonat.dto.LoginsDTO;
import com.backend.mixonat.service.AuthenticationService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import java.util.*;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    @Autowired
    private final AuthenticationService authenticationService;

    @CrossOrigin(origins="http://localhost:3000")
    @PutMapping("/sign-up")
    public ResponseEntity<JsonResponse> signUp(@RequestBody @Valid UserDTO request) {
        return authenticationService.signUp(request);
    }

    @CrossOrigin(origins="http://localhost:3000")
    @PostMapping("/sign-in")
    public ResponseEntity<JsonResponse> signIn(@RequestBody LoginsDTO request) {
        return authenticationService.signIn(request);
    }
}