package com.backend.mixonat.dto;

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
public class NewFileDTO implements JsonRequest {
    @NotBlank(message = "Name cannot be blank")
    String name;

    @NotBlank(message = "Type cannot be blank")
    @Pattern(regexp = "SDF|SPECTRUM|DEPT90|DEPT135", message = "Type must be SDF, SPECTRUM, DEPT90 or DEPT135")
    String type;

    @NotBlank(message = "File cannot be blank")
    String file;

    String author;
}
