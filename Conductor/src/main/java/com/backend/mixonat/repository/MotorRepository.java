package com.backend.mixonat.repository;

import com.backend.mixonat.configuration.CustomProperties;
import com.backend.mixonat.dto.MotorDTO;
import com.backend.mixonat.model.Molecules;
import com.backend.mixonat.model.checkRequest;
import com.backend.mixonat.model.checkResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestClient;

import static org.springframework.http.MediaType.APPLICATION_JSON;

@Repository
public class MotorRepository
{
    @Autowired
	private CustomProperties props;

	// Function to request response from the python motor for the data 
    public Molecules getMolecules(MotorDTO request)
	{
		RestClient restClient = RestClient.create();

        return restClient.post()
				.uri("http://" + props.getRmnMotorHost() + ":" + props.getRmnMotorPort() + "/motor")
				.contentType(APPLICATION_JSON)
				.body(request)
				.accept(APPLICATION_JSON)
				.exchange((request_, response) -> {
					Molecules molecules;

					if (response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError()) {
						System.out.println("Exception in getMolecules");
						molecules = new Molecules();
					}
					else {
						ObjectMapper mapper = new ObjectMapper();
						molecules = mapper.readValue(response.getBody(), Molecules.class);
					}

					return molecules;
				});
	}

	// Function to request response from the python motor for the file checking 
	public checkResponse getCheck(checkRequest request)
    {
		RestClient restClient = RestClient.create();

		return restClient.post()
				.uri("http://" + props.getRmnMotorHost() + ":" + props.getRmnMotorPort() + "/checkFile")
				.contentType(APPLICATION_JSON)
				.body(request)
				.accept(APPLICATION_JSON)
				.exchange((request_, response) -> {
					checkResponse checkResponse;

					if (response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError()) {
						System.out.println("Exception in getCheck");
						checkResponse = new checkResponse();
					}
					else {
						ObjectMapper mapper = new ObjectMapper();
						checkResponse = mapper.readValue(response.getBody(), checkResponse.class);
					}

					return checkResponse;
				});
    }
}
