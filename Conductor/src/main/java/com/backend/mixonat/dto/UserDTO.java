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
public class UserDTO implements JsonResponse {
    UUID id;
    String first_name;
    String last_name;
    String email;
    LocalDateTime created_at;
    LocalDateTime updated_at;
}
