package com.backend.mixonat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.backend.mixonat.model.Molecules;
import com.backend.mixonat.dto.CheckFileInDTO;
import com.backend.mixonat.dto.CheckFileOutDTO;
import com.backend.mixonat.dto.MotorDTO;
import com.backend.mixonat.repository.MotorRepository;

@Service
public class MotorService
{
    @Autowired
    private MotorRepository rmnMotorRepository;

    // Cache data for 2 days with 500MBS 
    @Cacheable(value = "moleculesCache")
    public Molecules getMolecules(MotorDTO request)
    {
        return rmnMotorRepository.getMolecules(request);
    }

    public CheckFileOutDTO getCheck(CheckFileInDTO request)
    {
        return rmnMotorRepository.getCheck(request);
    }
}
