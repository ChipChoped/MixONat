package com.backend.mixonat.service;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.backend.mixonat.model.SdfNoFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.mixonat.model.Sdf;
import com.backend.mixonat.repository.SdfRepository;

@Service
public class SdfService {
    @Autowired
    SdfRepository sdfRepository;

    public List<SdfNoFile> getSdfWithoutFile()
    {
        return sdfRepository.findAllWithoutFile();
    }

    public Optional<Sdf> findSdfByUuid(UUID uuid)
    {
        return sdfRepository.findSdfByUuid(uuid);
    }

    public void saveSdf(Sdf newSdf)
    {
        sdfRepository.save(newSdf.getName(), newSdf.getFile(), newSdf.getAuthor(), newSdf.getAddedBy());
    }

    public void deleteSdf(Sdf deleteSdf)
    {
        sdfRepository.delete(deleteSdf);
    }
}
