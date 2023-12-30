package com.backend.mixonat.service;


import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.backend.mixonat.model.RmnNoFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.mixonat.model.Rmn;
import com.backend.mixonat.repository.RmnRepository;

@Service
public class RmnService {
    @Autowired
    RmnRepository rmnRepository;

    public List<RmnNoFile> getRmnWithoutFile()
    {
        return rmnRepository.findAllWithoutFile();
    }

    public Optional<Rmn> findRmnById(UUID id)
    {
        return rmnRepository.findRmnById(id);
    }

    public void saveRmn(Rmn newRmn)
    {
        rmnRepository.save(newRmn.getName(), newRmn.getFile(), newRmn.getAuthor(), newRmn.getAddedBy());
    }

    public void deleteRmn(Rmn deleteRmn)
    {
        rmnRepository.delete(deleteRmn);

    }
}
