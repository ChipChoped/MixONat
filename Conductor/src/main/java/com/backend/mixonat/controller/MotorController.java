package com.backend.mixonat.controller;

import com.backend.mixonat.dto.*;
import com.backend.mixonat.model.Type;
import com.backend.mixonat.dto.CheckFileInDTO;
import com.backend.mixonat.dto.CheckFileOutDTO;
import com.backend.mixonat.service.FileService;
import com.backend.mixonat.service.MotorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class MotorController
{
    @Autowired
    private MotorService motorService;

	@Autowired
	private FileService fileService;

	// Function to handle motor requests from React
	@CrossOrigin(origins="http://localhost:3000")
	@PostMapping("/motor")
	public ResponseEntity<JsonResponse> getMolecules(@RequestBody MotorDTO motorDTO)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");

		try {
			if (motorDTO.getUseSdfDatabase() || motorDTO.getUseSpectrumDatabase()) {
				try {
					if (motorDTO.getUseSdfDatabase()) {
						var sdf = fileService.findFileById(UUID.fromString(motorDTO.getSdf()))
								.orElseThrow(IllegalArgumentException::new);

						if (sdf.getType() != Type.SDF) {
							return ResponseEntity.status(400).headers(responseHeaders).body(new ExceptionDTO("The file is not of type SDF"));
						}

						motorDTO.setSdf(sdf.getFile());
					}
				}
				catch (IllegalArgumentException e) {
					return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The SDF file doesn't exist"));
				}

				try {
					if (motorDTO.getUseSpectrumDatabase()) {
						var spectrum = fileService.findFileById(UUID.fromString(motorDTO.getSpectrum()))
								.orElseThrow(IllegalArgumentException::new);

						if (spectrum.getType() != Type.SPECTRUM) {
							return ResponseEntity.status(400).headers(responseHeaders).body(new ExceptionDTO("The file is not of type SPECTRUM"));
						}

						motorDTO.setSpectrum(spectrum.getFile());
					}
				}
				catch (IllegalArgumentException e) {
					return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The SPECTRUM file doesn't exist"));
				}

				try {
					if (motorDTO.getUseDept135Database()) {
						var dept135 = fileService.findFileById(UUID.fromString(motorDTO.getDept135()))
								.orElseThrow(IllegalArgumentException::new);

						if (dept135.getType() != Type.DEPT135) {
							return ResponseEntity.status(400).headers(responseHeaders).body(new ExceptionDTO("The file is not of type DEPT135"));
						}

						motorDTO.setDept135(dept135.getFile());
					}
				}
				catch (IllegalArgumentException e) {
					return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The DEPT135 file doesn't exist"));
				}

				try {
					if (motorDTO.getUseDept90Database()) {
						var dept90 = fileService.findFileById(UUID.fromString(motorDTO.getDept90()))
								.orElseThrow(IllegalArgumentException::new);

						if (dept90.getType() != Type.DEPT90) {
							return ResponseEntity.status(400).headers(responseHeaders).body(new ExceptionDTO("The file is not of type DEPT90"));
						}

						motorDTO.setDept90(dept90.getFile());
					}
				}
				catch (IllegalArgumentException e) {
					return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The DEPT90 file doesn't exist"));
				}
			}

			return ResponseEntity.ok().headers(responseHeaders).body(motorService.getMolecules(motorDTO));
		} catch (Exception e) {
			return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
		}
    }

	// Function to handle checkFile requests from React
	@CrossOrigin(origins="http://localhost:3000")
	@PostMapping("/checkFile")
	public ResponseEntity <CheckFileOutDTO> checkFile (@RequestBody CheckFileInDTO request)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");
		return ResponseEntity.ok().headers(responseHeaders).body(motorService.getCheck(request));
	}
}
