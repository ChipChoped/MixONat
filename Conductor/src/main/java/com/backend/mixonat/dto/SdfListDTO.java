package com.backend.mixonat.dto;

import com.backend.mixonat.model.SdfNoFile;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SdfListDTO implements JsonResponse {
    List<SdfNoFile> sdfList;
}
