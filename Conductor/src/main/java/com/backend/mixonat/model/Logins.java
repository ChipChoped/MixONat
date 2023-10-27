package com.backend.mixonat.model;

import lombok.Data;

import java.io.Serializable;

@Data
public class Logins implements Serializable {
    private static final long serialVersionUID = 1L;

    String email;
    String password;
}
