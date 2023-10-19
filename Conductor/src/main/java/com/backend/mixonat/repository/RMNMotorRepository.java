package com.backend.mixonat.repository;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import com.backend.mixonat.configuration.CustomProperties;
import com.backend.mixonat.model.Molecules;
import com.backend.mixonat.model.checkRequest;
import com.backend.mixonat.model.checkResponse;
import com.backend.mixonat.model.FrontRequest;

@Repository
public class RMNMotorRepository
{
    @Autowired
	private CustomProperties props;

	
	// Function to request response from the python motor for the data 
    public Molecules getMolecules(FrontRequest request)
	{
		String url = "http://" + props.getRmnMotorHost() + ":" + props.getRmnMotorPort() + "/motor";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.set("Content-Type","application/json");
        
		try {
			
			ResponseEntity<Molecules> response = restTemplate.exchange(
				url, 
				HttpMethod.POST, 
				new HttpEntity<>(request,requestHeaders),
				Molecules.class
			);
	
			return response.getBody();
		}
		catch (Exception e)
		{
			// if there is an error to cast http packet in Molecules, return Molecules with no record
			System.out.println("Exception in getMolecules");
			e.printStackTrace();
			return new Molecules();
		}

	}

	// Function to request response from the python motor for the file checking 
	public checkResponse getCheck(checkRequest request)
    {
		String url = "http://" + props.getRmnMotorHost() + ":" + props.getRmnMotorPort() + "/checkFile";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders requestHeaders = new HttpHeaders();
        requestHeaders.set("Content-Type","application/json");
        
		try {
			ResponseEntity<checkResponse> response = restTemplate.exchange(
				url, 
				HttpMethod.POST, 
				new HttpEntity<>(request,requestHeaders),
				checkResponse.class
			);
	
			return response.getBody();
		}
		catch (Exception e)
		{
			e.printStackTrace();
			return new checkResponse();
		}

    }
}
