package com.backend.mixonat.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginsDTO implements JsonResponse {
    @Email(message = "Email is malformed")
    @NotBlank(message = "Email cannot be blank")
    String email;

    @Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^*-]).{8,16}$",
            message = "Invalid characters in password")
    @NotBlank(message = "Password cannot be blank")
    String password;
}
