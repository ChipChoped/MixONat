package com.backend.mixonat.service;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.backend.mixonat.model.FileInfoOnly;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.mixonat.model.File;
import com.backend.mixonat.repository.FileRepository;

@Service
public class FileService {
    @Autowired
    FileRepository fileRepository;

    public List<FileInfoOnly> getAllFilesInfoOnly()
    {
        return fileRepository.findAllInfoOnly();
    }

    public List<FileInfoOnly> getAllFilesInfoOnlyByUserId(UUID id)
    {
        return fileRepository.findAllInfoOnlyByUserId(id);
    }

    public Optional<File> findFileById(UUID id)
    {
        return fileRepository.findFileById(id);
    }

    public void saveFile(File newFile)
    {
        fileRepository.save(newFile.getName(), String.valueOf(newFile.getType()), newFile.getFile(), newFile.getAuthor(), newFile.getAddedBy());
    }

    public void deleteFile(File deleteFile)
    {
        fileRepository.delete(deleteFile);
    }
}
