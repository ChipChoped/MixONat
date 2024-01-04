package com.backend.mixonat.dto;

import com.backend.mixonat.model.RmnNoFile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RmnListDTO implements JsonResponse {
    List<RmnNoFile> rmnList;
}
