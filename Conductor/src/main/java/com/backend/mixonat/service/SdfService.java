package com.backend.mixonat.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.mixonat.model.Sdf;
import com.backend.mixonat.repository.SdfRepository;

@Service
public class SdfService {
    @Autowired
    SdfRepository sdfRepository;

    public List<String> getSdfWithoutFile()
    {
        return sdfRepository.findAllWithoutFile();
    }

    public List<Integer> findSdfIdByName(String name)
    {
        return sdfRepository.findSdfIdByName(name);
    }

    public Sdf findOneByName(String name)
    {
        return sdfRepository.findOneByName(name);
    }

    public Sdf saveSdf(Sdf newSdf)
    {
        return sdfRepository.save(newSdf);
    }

    public Boolean deleteSdf(Sdf deleteSdf)
    {
        sdfRepository.delete(deleteSdf);

        return true;
    }
}
