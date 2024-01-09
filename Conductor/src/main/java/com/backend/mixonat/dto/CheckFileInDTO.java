package com.backend.mixonat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckFileInDTO implements JsonRequest {
    String fileType;
    String file;
}
