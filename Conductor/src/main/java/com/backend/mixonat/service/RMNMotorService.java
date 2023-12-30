package com.backend.mixonat.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.backend.mixonat.model.Molecules;
import com.backend.mixonat.model.checkRequest;
import com.backend.mixonat.model.checkResponse;
import com.backend.mixonat.dto.MotorDTO;
import com.backend.mixonat.repository.RMNMotorRepository;

@Service
public class RMNMotorService
{
    @Autowired
    private RMNMotorRepository rmnMotorRepository;

    // Cache data for 2 days with 500MBS 
    @Cacheable(value = "moleculesCache")
    public Molecules getMolecules(MotorDTO request)
    {
        return rmnMotorRepository.getMolecules(request);
    }

    public checkResponse getCheck(checkRequest request)
    {
        return rmnMotorRepository.getCheck(request);
    }
}
