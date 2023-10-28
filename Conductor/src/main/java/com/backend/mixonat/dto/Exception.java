package com.backend.mixonat.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class Exception implements Serializable, JsonResponse {
    private static final long serialVersionUID = 1L;

    String message;

    public Exception(String message) {
        this.message = message;
    }
}
