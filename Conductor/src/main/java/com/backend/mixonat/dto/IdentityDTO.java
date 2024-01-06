package com.backend.mixonat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IdentityDTO implements JsonRequest {
    @JsonProperty("first-name")
    @NotBlank(message = "First name cannot be blank")
    @Pattern(regexp = "[A-ZÉÈÀÎÏÂË][a-zéèàâêîïäë]{1,29}",
            message = "The first name must start with an uppercase letter and with no special characters")
    private String firstName;

    @JsonProperty("last-name")
    @NotBlank(message = "Last name cannot be blank")
    @Pattern(regexp = "[A-ZÉÈÀÎÏÂË][a-zéèàêîïäë]{1,29}",
            message = "The first name must start with an uppercase letter and with no special characters")
    private String lastName;
}
