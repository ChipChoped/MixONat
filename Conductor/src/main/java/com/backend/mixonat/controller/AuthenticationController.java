package com.backend.mixonat.controller;

import com.backend.mixonat.dto.JsonResponse;
import com.backend.mixonat.dto.LoginsDTO;
import com.backend.mixonat.dto.UserDTO;
import com.backend.mixonat.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthenticationController {
    @Autowired
    private final AuthenticationService authenticationService;

    @CrossOrigin(origins="http://localhost:3000")
    @PutMapping("/user/sign-up")
    public ResponseEntity<JsonResponse> signUp(@RequestBody @Valid UserDTO request) {
        return authenticationService.signUp(request);
    }

    @CrossOrigin(origins="http://localhost:3000")
    @PostMapping("/user/sign-in")
    public ResponseEntity<JsonResponse> signIn(@RequestBody LoginsDTO request) {
        return authenticationService.signIn(request);
    }
}