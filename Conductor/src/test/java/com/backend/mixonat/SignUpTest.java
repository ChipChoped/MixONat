package com.backend.mixonat;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.backend.mixonat.dto.NewUserDTO;
import com.fasterxml.jackson.databind.json.JsonMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SignUpTest {

    @Autowired
    private MockMvc mockMvc;

    NewUserDTO newUser = NewUserDTO.builder()
            .firstName("Test")
            .lastName("Test")
            .email("test@test.com")
            .emailConfirmation("test@test.com")
            .password("1TestPassword!")
            .passwordConfirmation("1TestPassword!")
            .consent(true)
            .build();

    @Test
    @Order(1)
    void createNewAccount() throws Exception {
        this.mockMvc.perform(
                put("/user/sign-up").content(new JsonMapper().writeValueAsString(newUser))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("token").exists())
                .andDo(print());
    }

    @Test
    @Order(2)
    void createSameNewAccount() throws Exception {
        this.mockMvc.perform(
                put("/user/sign-up").content(new JsonMapper().writeValueAsString(newUser))
                .contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(MockMvcResultMatchers.jsonPath("email").value("Email already used by another user"))
                .andDo(print());
    }
}