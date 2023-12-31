package com.backend.mixonat.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.backend.mixonat.model.Molecules;
import com.backend.mixonat.model.checkRequest;
import com.backend.mixonat.model.checkResponse;
import com.backend.mixonat.model.Sdf;
import com.backend.mixonat.model.FrontRequest;
import com.backend.mixonat.service.RMNMotorService;
import com.backend.mixonat.service.SdfService;

@RestController
public class RMNMotorController
{
    @Autowired
    private RMNMotorService rmnMotorService;

	@Autowired
	private SdfService sdfService;

	@GetMapping("/rmn/sdf/names")
	public ResponseEntity<List<String>> getSdf()
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");
		responseHeaders.set("Access-Control-Allow-Origin","*");

		return ResponseEntity.ok().headers(responseHeaders).body(sdfService.getSdfWithoutFile());
	}

	@CrossOrigin(origins="http://localhost:3000")
	@PostMapping("/rmn/sdf")
	public ResponseEntity<Sdf> saveSdf(@RequestBody Sdf newSdf)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");

		if(newSdf.getName().equals(""))
		{
			return ResponseEntity.badRequest().body(null);
		}
		else
		{
			List<Integer> sdfId = sdfService.findSdfIdByName(newSdf.getName());

			if(sdfId.size() > 0)
			{
				newSdf.setId(sdfId.get(0));
			}

			return ResponseEntity.ok().headers(responseHeaders).body(sdfService.saveSdf(newSdf));
		}
	}

	@CrossOrigin(origins="http://localhost:3000")
	@DeleteMapping("/rmn/sdf")
	public ResponseEntity<Boolean> deleteSdf(@RequestBody Sdf deleteSdf)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");

			List<Integer> sdfId = sdfService.findSdfIdByName(deleteSdf.getName());

			if(sdfId.size() > 0)
			{
				deleteSdf.setId(sdfId.get(0));

				return ResponseEntity.ok().headers(responseHeaders).body(sdfService.deleteSdf(deleteSdf));
			}
			else
			{
				return ResponseEntity.badRequest().body(false);
			}
	}

	// Function to handle motor requests from React
	@CrossOrigin(origins="http://localhost:3000")
	@PostMapping("/rmn")
	public ResponseEntity<Molecules> getMolecules(@RequestBody FrontRequest request)
	{
		HttpHeaders responseHeaders = new HttpHeaders();
		responseHeaders.set("Content-Type","application/json");

		if(request.getUseDatabase())
		{
			request.setSdf(sdfService.findOneByName(request.getSdf()).getSdf_file());
			return ResponseEntity.ok().headers(responseHeaders).body(rmnMotorService.getMolecules(request));
		}
		else
		{
			return ResponseEntity.ok().headers(responseHeaders).body(rmnMotorService.getMolecules(request));
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

}
