package com.backend.mixonat.dto;

import com.backend.mixonat.validator.UniqueEmail;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailDTO implements JsonRequest {
    @Email(message = "Email is malformed")
    @NotBlank(message = "Email cannot be blank")
    @UniqueEmail
    private String email;

    @JsonProperty("email-confirmation")
    @NotBlank(message = "Email confirmation cannot be blank")
    private String emailConfirmation;

    @AssertTrue(message = "Emails don't match")
    private boolean isSameEmail() {
        return Objects.equals(email, emailConfirmation);
    }
}
