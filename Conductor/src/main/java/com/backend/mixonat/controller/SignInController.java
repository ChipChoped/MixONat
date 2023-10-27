package com.backend.mixonat.controller;

import java.util.List;

import com.backend.mixonat.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
	public ResponseEntity<Integer> signIn(@RequestBody Logins logins)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");

		System.out.printf(logins.getEmail());
		System.out.printf(logins.getPassword());

		if(logins.getEmail().isEmpty() || logins.getPassword().isEmpty())
		{
			return ResponseEntity.noContent().build();
		}
		else
		{
			List<Integer> userIDs = userService.findUserIDByLogins(logins);
			System.out.printf(userIDs.toString());

            if (userIDs.isEmpty())
                return ResponseEntity.badRequest().body(null);
			else
			    return ResponseEntity.ok().headers(responseHeaders).body(userIDs.get(0));
		}
	}
}
