package com.backend.mixonat.service;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.mixonat.model.Rmn;
import com.backend.mixonat.repository.RmnRepository;

@Service
public class RmnService {
    @Autowired
    RmnRepository rmnRepository;

    public List<String> getRmnWithoutFile()
    {
        return rmnRepository.findAllWithoutFile();
    }

    public List<Integer> findRmnIdByName(String name)
    {
        return rmnRepository.findRmnIdByName(name);
    }

    public Rmn findOneByName(String name)
    {
        return rmnRepository.findOneByName(name);
    }

    public Rmn saveRmn(Rmn newRmn)
    {
        return rmnRepository.save(newRmn);
    }

    public Boolean deleteRmn(Rmn deleteRmn)
    {
        rmnRepository.delete(deleteRmn);

        return true;
    }
}
