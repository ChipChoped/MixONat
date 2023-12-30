package com.backend.mixonat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RmnDTO implements JsonResponse {
    private UUID id;
    private String name;
    private String file;
    private String author;
    private UUID added_by;
    private String added_by_name;
    private LocalDateTime added_at;
}
