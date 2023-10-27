package com.backend.mixonat.service;

import java.util.List;

import com.backend.mixonat.model.Logins;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.mixonat.model.User;
import com.backend.mixonat.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    UserRepository UserRepository;

    public List<Integer> findUserIDByLogins(Logins logins)
    {
        return UserRepository.findUserIDByLogins(logins.getEmail(), logins.getPassword());
    }

    public List<User> findUserByID(int id)
    {
        return UserRepository.findUserByID(id);
    }
}
