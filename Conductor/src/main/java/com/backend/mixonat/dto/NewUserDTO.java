package com.backend.mixonat.dto;

import com.backend.mixonat.validator.UniqueEmail;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewUserDTO implements JsonRequest {
    @JsonProperty("first-name")
    @Pattern(regexp = "[A-ZÉÈÀÎÏÂË][a-zéèàâêîïäë]{1,29}",
            message = "The first name must start with an uppercase letter and with no special characters")
    @NotBlank(message = "First name cannot be blank")
    String firstName;

    @JsonProperty("last-name")
    @Pattern(regexp = "[A-ZÉÈÀÎÏÂË][a-zéèàêîïäë]{1,29}",
            message = "The first name must start with an uppercase letter and with no special characters")
    @NotBlank(message = "Last name cannot be blank")
    String lastName;

    @Email(message = "Email is malformed")
    @NotBlank(message = "Email cannot be blank")
    @UniqueEmail
    String email;

    @JsonProperty("email-confirmation")
    @NotBlank(message = "Email confirmation cannot be blank")
    String emailConfirmation;

    @Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^*-]).{8,16}$",
            message = "The password must be between 8 and 16 characters long and " +
                    "contain at least one uppercase letter, one lowercase letter, " +
                    "one number and one special character")
    @NotBlank(message = "Password cannot be blank")
    String password;

    @JsonProperty("password-confirmation")
    @NotBlank(message = "Password confirmation cannot be blank")
    String passwordConfirmation;

    @AssertTrue(message = "You must accept the terms and conditions to sign up")
    Boolean consent;

    @AssertTrue(message = "Emails don't match")
    private boolean isSameEmail() {
        return Objects.equals(email, emailConfirmation);
    }

    @AssertTrue(message = "Passwords don't match")
    private boolean isSamePassword() {
        return Objects.equals(password, passwordConfirmation);
    }
}
