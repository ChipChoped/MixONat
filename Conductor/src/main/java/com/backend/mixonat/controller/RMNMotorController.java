package com.backend.mixonat.controller;

import com.backend.mixonat.dto.*;
import com.backend.mixonat.model.*;
import com.backend.mixonat.repository.UserRepository;
import com.backend.mixonat.service.JwtService;
import com.backend.mixonat.service.RMNMotorService;
import com.backend.mixonat.service.RmnService;
import com.backend.mixonat.service.SdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class RMNMotorController
{
    @Autowired
    private RMNMotorService rmnMotorService;

	@Autowired
	private SdfService sdfService;

	@Autowired
	private RmnService rmnService;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private UserRepository userRepository;

	@CrossOrigin(origins="http://localhost:3000")
	@GetMapping("/sdf/list")
	public ResponseEntity<JsonResponse> getSdf()
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");
		responseHeaders.set("Access-Control-Allow-Origin","*");

		SdfListDTO sdfListDTO = SdfListDTO.builder()
				.sdfList(sdfService.getSdfWithoutFile())
				.build();

		return ResponseEntity.ok().headers(responseHeaders).body(sdfListDTO);
	}

	@CrossOrigin(origins="http://localhost:3000")
	@GetMapping("/sdf/{id}")
	public ResponseEntity<JsonResponse> getSdfById(@PathVariable("id") UUID id)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");
		responseHeaders.set("Access-Control-Allow-Origin","*");

		try {
			var sdf = sdfService.findSdfById(id)
					.orElseThrow(() -> new IllegalArgumentException("The sdf doesn't exist"));

			var addedBy = userRepository.findUserById(sdf.getAddedBy())
					.orElseThrow(() -> new IllegalArgumentException("The user doesn't exist"));

			SdfDTO sdfDTO = SdfDTO.builder()
					.id(sdf.getId())
					.name(sdf.getName())
					.file(sdf.getFile())
					.author(sdf.getAuthor())
					.added_by(sdf.getAddedBy())
					.added_by_name(addedBy.getFirstName() + " " + addedBy.getLastName())
					.added_at(sdf.getAddedAt())
					.build();

			return ResponseEntity.ok().headers(responseHeaders).body(sdfDTO);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The sdf doesn't exist"));
		} catch (Exception e) {
			return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
		}
	}

	@CrossOrigin(origins="http://localhost:3000")
	@PostMapping("/sdf")
	public ResponseEntity<JsonResponse> saveSdf(@RequestHeader("Authorization") String token, @RequestBody NewSdfDTO newSdf)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");

		if(newSdf.getName().isEmpty())
		{
			return ResponseEntity.badRequest().body(new ExceptionDTO("The name of the sdf cannot be empty"));
		}
		else
		{
			try {
				UUID id = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));
				var user = userRepository.findUserById(id)
						.orElseThrow(IllegalArgumentException::new);

				if (newSdf.getAuthor().isEmpty())
				{
					newSdf.setAuthor(user.getFirstName() + " " + user.getLastName());
				}

				var sdf = Sdf.builder()
						.name(newSdf.getName())
						.file(newSdf.getFile())
						.author(newSdf.getAuthor())
						.addedBy(id)
						.build();

				sdfService.saveSdf(sdf);

				return ResponseEntity.status(201).headers(responseHeaders).build();
			}
			catch (IllegalArgumentException e) {
				return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The user doesn't exist"));
			}
//			catch (Exception e) {
//				return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
//			}
		}
	}

	@CrossOrigin(origins="http://localhost:3000")
	@DeleteMapping("/sdf")
	public ResponseEntity<JsonResponse> deleteSdf(@RequestHeader("Authorization") String token, @RequestBody IdDTO id)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");

		try {
			UUID userId = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));

			var sdf = sdfService.findSdfById(id.getId())
					.orElseThrow(IllegalArgumentException::new);

			if (!sdf.getAddedBy().equals(userId)) {
				return ResponseEntity.status(403).headers(responseHeaders).body(new ExceptionDTO("You don't have permission to delete this sdf"));
			} else {
				sdfService.deleteSdf(sdf);
				return ResponseEntity.status(204).headers(responseHeaders).build();
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The sdf doesn't exist"));
		} catch (Exception e) {
			return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
		}
	}

	// Function to handle motor requests from React
	@CrossOrigin(origins="http://localhost:3000")
	@PostMapping("/motor")
	public ResponseEntity<JsonResponse> getMolecules(@RequestBody MotorDTO motorDTO)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");

		try {
			if (motorDTO.getUseSdfDatabase() || motorDTO.getUseRmnDatabase()) {
				try {
					if (motorDTO.getUseSdfDatabase()) {
						var sdf = sdfService.findSdfById(UUID.fromString(motorDTO.getSdf()))
								.orElseThrow(IllegalArgumentException::new);

						motorDTO.setSdf(sdf.getFile());
					}
				}
				catch (IllegalArgumentException e) {
					return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The sdf doesn't exist"));
				}

				try {
					if (motorDTO.getUseRmnDatabase()) {
						var rmn = rmnService.findRmnById(UUID.fromString(motorDTO.getSpectrum()))
								.orElseThrow(IllegalArgumentException::new);

						motorDTO.setSpectrum(rmn.getFile());
					}
				}
				catch (IllegalArgumentException e) {
					return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The rmn doesn't exist"));
				}
			}

			return ResponseEntity.ok().headers(responseHeaders).body(rmnMotorService.getMolecules(motorDTO));
		} catch (Exception e) {
			return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
		}
    }


	// Function to handle checkFile requests from React
	@CrossOrigin(origins="http://localhost:3000")
	@PostMapping("/checkFile")
	public ResponseEntity <checkResponse> checkFile (@RequestBody checkRequest request)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");
		return ResponseEntity.ok().headers(responseHeaders).body(rmnMotorService.getCheck(request));
	}


	@GetMapping("/rmn/list")
	public ResponseEntity<JsonResponse> getRmn()
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");
		responseHeaders.set("Access-Control-Allow-Origin","*");

		RmnListDTO rmnListDTO = RmnListDTO.builder()
				.rmnList(rmnService.getRmnWithoutFile())
				.build();

		return ResponseEntity.ok().headers(responseHeaders).body(rmnListDTO);
	}

	@CrossOrigin(origins="http://localhost:3000")
	@PostMapping("/rmn")
	public ResponseEntity<JsonResponse> saveRmn(@RequestHeader("Authorization") String token, @RequestBody NewRmnDTO newRmn)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");

		if(newRmn.getName().isEmpty())
		{
			return ResponseEntity.badRequest().body(new ExceptionDTO("The name of the rmn cannot be empty"));
		}
		else
		{
			try {
				UUID id = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));
				var user = userRepository.findUserById(id)
						.orElseThrow(IllegalArgumentException::new);

				if (newRmn.getAuthor().isEmpty())
				{
					newRmn.setAuthor(user.getFirstName() + " " + user.getLastName());
				}

				var rmn = Rmn.builder()
						.name(newRmn.getName())
						.file(newRmn.getFile())
						.author(newRmn.getAuthor())
						.addedBy(id)
						.build();

				rmnService.saveRmn(rmn);

				return ResponseEntity.status(201).headers(responseHeaders).build();
			}
			catch (IllegalArgumentException e) {
				return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The user doesn't exist"));
			}
//			catch (Exception e) {
//				return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
//			}
		}
	}

	@CrossOrigin(origins="http://localhost:3000")
	@GetMapping("/rmn/{id}")
	public ResponseEntity<JsonResponse> getRmnById(@PathVariable("id") UUID id)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");
		responseHeaders.set("Access-Control-Allow-Origin","*");

		try {
			var rmn = rmnService.findRmnById(id)
					.orElseThrow(() -> new IllegalArgumentException("The rmn doesn't exist"));

			var addedBy = userRepository.findUserById(rmn.getAddedBy())
					.orElseThrow(() -> new IllegalArgumentException("The user doesn't exist"));

			RmnDTO rmnDTO = RmnDTO.builder()
					.id(rmn.getId())
					.name(rmn.getName())
					.file(rmn.getFile())
					.author(rmn.getAuthor())
					.added_by(rmn.getAddedBy())
					.added_by_name(addedBy.getFirstName() + " " + addedBy.getLastName())
					.added_at(rmn.getAddedAt())
					.build();

			return ResponseEntity.ok().headers(responseHeaders).body(rmnDTO);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO(e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
		}
	}

	@CrossOrigin(origins="http://localhost:3000")
	@DeleteMapping("/rmn")
	public ResponseEntity<JsonResponse> deleteRmn(@RequestHeader("Authorization") String token, @RequestBody Rmn deleteRmn)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");

		try {
			UUID userId = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));

			var rmn = rmnService.findRmnById(deleteRmn.getId())
					.orElseThrow(IllegalArgumentException::new);

			if (!rmn.getAddedBy().equals(userId)) {
				return ResponseEntity.status(403).headers(responseHeaders).body(new ExceptionDTO("You don't have permission to delete this rmn"));
			} else {
				rmnService.deleteRmn(rmn);
				return ResponseEntity.status(204).headers(responseHeaders).build();
			}
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The rmn doesn't exist"));
		} catch (Exception e) {
			return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
		}
	}
}
