package com.backend.mixonat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckFileOutDTO implements JsonResponse {
    String checkResult;
    String type;
}
