package com.backend.mixonat.controller;

import java.util.List;
import java.util.Objects;

import com.backend.mixonat.dto.JsonResponse;
import com.backend.mixonat.dto.Logins;
import com.backend.mixonat.dto.UserID;
import com.backend.mixonat.dto.Exception;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.backend.mixonat.service.UserService;

@RestController
public class SignInController
{
	@Autowired
	private UserService userService;

	@CrossOrigin(origins="http://localhost:3000")
	@PostMapping("/user/id")
	public ResponseEntity<JsonResponse> signIn(@RequestBody Logins logins)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");

		if(Objects.equals(logins.getEmail(), "") || Objects.equals(logins.getPassword(), ""))
			return ResponseEntity.badRequest().body(new Exception("You must provide an email and a password to sign in"));
		else
		{
			List<Integer> userIDs = userService.findUserIDByLogins(logins);
			System.out.printf(userIDs.toString());

            if (userIDs.isEmpty())
                return ResponseEntity.status(401).body(new Exception("Incorrect email or password"));
			else
				return ResponseEntity.ok().headers(responseHeaders).body(new UserID(userIDs.get(0)));
		}
	}
}

