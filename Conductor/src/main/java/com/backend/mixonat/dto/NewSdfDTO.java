package com.backend.mixonat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewSdfDTO implements JsonRequest {
    String name;
    String file;
    String author;
}
