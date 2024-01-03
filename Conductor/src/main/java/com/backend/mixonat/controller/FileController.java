package com.backend.mixonat.controller;

import com.backend.mixonat.dto.*;
import com.backend.mixonat.model.File;
import com.backend.mixonat.model.Type;
import com.backend.mixonat.repository.UserRepository;
import com.backend.mixonat.service.FileService;
import com.backend.mixonat.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class FileController {
    @Autowired
    private FileService fileService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @CrossOrigin(origins="http://localhost:3000")
    @GetMapping("/file/list")
    public ResponseEntity<JsonResponse> getFileList()
    {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type","application/json");
        responseHeaders.set("Access-Control-Allow-Origin","*");

        FileListDTO fileListDTO = FileListDTO.builder()
                .fileList(fileService.getAllFilesInfoOnly())
                .build();

        return ResponseEntity.ok().headers(responseHeaders).body(fileListDTO);
    }
    @CrossOrigin(origins="http://localhost:3000")
    @GetMapping("/file/list/user/{id}")
    public ResponseEntity<JsonResponse> getFileListByUserId(@PathVariable("id") UUID id)
    {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type","application/json");
        responseHeaders.set("Access-Control-Allow-Origin","*");

        try {
            userRepository.findUserById(id)
                    .orElseThrow(() -> new IllegalArgumentException("The user doesn't exist"));

            FileListDTO fileListDTO = FileListDTO.builder()
                    .fileList(fileService.getAllFilesInfoOnlyByUserId(id))
                    .build();

            return ResponseEntity.ok().headers(responseHeaders).body(fileListDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The user doesn't exist"));
        } catch (Exception e) {
            return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
        }
    }

    @CrossOrigin(origins="http://localhost:3000")
    @GetMapping("/file/{id}")
    public ResponseEntity<JsonResponse> getFileById(@PathVariable("id") UUID id)
    {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type","application/json");
        responseHeaders.set("Access-Control-Allow-Origin","*");

        try {
            var file = fileService.findFileById(id)
                    .orElseThrow(() -> new IllegalArgumentException("The file doesn't exist"));

            var addedBy = userRepository.findUserById(file.getAddedBy())
                    .orElseThrow(() -> new IllegalArgumentException("The user doesn't exist"));

            FileDTO sdfDTO = FileDTO.builder()
                    .id(file.getId())
                    .name(file.getName())
                    .type(file.getType())
                    .file(file.getFile())
                    .author(file.getAuthor())
                    .added_by(file.getAddedBy())
                    .added_by_name(addedBy.getFirstName() + " " + addedBy.getLastName())
                    .added_at(file.getAddedAt())
                    .build();

            return ResponseEntity.ok().headers(responseHeaders).body(sdfDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
        }
    }

    @CrossOrigin(origins="http://localhost:3000")
    @PostMapping("/file")
    public ResponseEntity<JsonResponse> saveFile(@RequestHeader("Authorization") String token, @RequestBody @Valid NewFileDTO newFile)
    {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type","application/json");

        if(newFile.getName().isEmpty())
        {
            return ResponseEntity.badRequest().body(new ExceptionDTO("File name cannot be empty"));
        }
        else
        {
            try {
                UUID id = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));
                var user = userRepository.findUserById(id)
                        .orElseThrow(IllegalArgumentException::new);

                if (newFile.getAuthor().isEmpty())
                {
                    newFile.setAuthor(user.getFirstName() + " " + user.getLastName());
                }

                var file = File.builder()
                        .name(newFile.getName())
                        .type(Type.valueOf(newFile.getType()))
                        .file(newFile.getFile())
                        .author(newFile.getAuthor())
                        .addedBy(id)
                        .build();

                fileService.saveFile(file);

                return ResponseEntity.status(201).headers(responseHeaders).build();
            }
            catch (IllegalArgumentException e) {
                return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The user doesn't exist"));
            }
            catch (Exception e) {
                return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
            }
        }
    }

    @CrossOrigin(origins="http://localhost:3000")
    @DeleteMapping("/file")
    public ResponseEntity<JsonResponse> deleteFile(@RequestHeader("Authorization") String token, @RequestBody IdDTO id)
    {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.set("Content-Type","application/json");

        try {
            UUID userId = UUID.fromString(jwtService.extractUserName(token.split(" ")[1]));

            var file = fileService.findFileById(id.getId())
                    .orElseThrow(IllegalArgumentException::new);

            if (!file.getAddedBy().equals(userId)) {
                return ResponseEntity.status(403).headers(responseHeaders).body(new ExceptionDTO("You don't have permission to delete this file"));
            } else {
                fileService.deleteFile(file);
                return ResponseEntity.status(204).headers(responseHeaders).build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).headers(responseHeaders).body(new ExceptionDTO("The file doesn't exist"));
        } catch (Exception e) {
            return ResponseEntity.status(500).headers(responseHeaders).body(new ExceptionDTO("Internal server error"));
        }
    }
}
