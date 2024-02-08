package com.backend.mixonat.dto;

import com.backend.mixonat.model.FileInfoOnly;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileListDTO implements JsonResponse {
    List<FileInfoOnly> fileList;
}
