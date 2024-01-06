package com.backend.mixonat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.GroupSequence;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
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
public class PasswordDTO implements JsonRequest {
    @JsonProperty("current-password")
    @NotBlank(message = "Password cannot be blank")
    private String currentPassword;

    @JsonProperty("new-password")
    @NotBlank(message = "New password cannot be blank")
    @Pattern(regexp = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^*-]).{8,16}$",
            message = "The password must be between 8 and 16 characters long and " +
                    "contain at least one uppercase letter, one lowercase letter, " +
                    "one number and one special character")
    private String newPassword;

    @JsonProperty("new-password-confirmation")
    @NotBlank(message = "Password confirmation cannot be blank")
    private String newPasswordConfirmation;

    @AssertTrue(message = "The new password cannot be the same as the old one")
    private boolean isDifferentPassword() {
        return !Objects.equals(currentPassword, newPassword);
    }

    @AssertTrue(message = "Passwords don't match")
    private boolean isSamePassword() {
        return Objects.equals(newPassword, newPasswordConfirmation);
    }
}