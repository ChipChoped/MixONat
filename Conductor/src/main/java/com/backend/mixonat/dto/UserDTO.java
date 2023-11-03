package com.backend.mixonat.dto;

import com.backend.mixonat.validator.UniqueEmail;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    @JsonProperty("first-name")
    @NotNull
    @Pattern(regexp = "[A-ZÉÈÀÎÏÂË][a-zéèàêîïäë]{1,29}",
            message = "The first name must start with an uppercase letter and with no special characters")
    String firstName;

    @JsonProperty("last-name")
    @NotNull
    @Pattern(regexp = "[A-ZÉÈÀÎÏÂË][a-zéèàêîïäë]{1,29}",
            message = "The first name must start with an uppercase letter and with no special characters")
    String lastName;

    @NotNull
    @Email (message = "Email is malformed")
    @UniqueEmail
    String email;

    @JsonProperty("email-confirmation")
    @NotNull
    String emailConfirmation;

    @NotNull
    @Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^*-]).{8,16}$",
            message = "The password must be between 8 and 16 characters long and " +
                    "contain at least one uppercase letter, one lowercase letter, " +
                    "one number and one special character")
    String password;

    @JsonProperty("password-confirmation")
    @NotNull
    String passwordConfirmation;

    @AssertTrue(message = "Emails don't match")
    private boolean isSameEmail() {
        return Objects.equals(email, emailConfirmation);
    }

    @AssertTrue(message = "Passwords don't match")
    private boolean isSamePassword() {
        return Objects.equals(password, passwordConfirmation);
    }
}
