package com.backend.mixonat.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class ExceptionDTO implements Serializable, JsonResponse {
    private static final long serialVersionUID = 1L;

    String message;

    public ExceptionDTO(String message) {
        this.message = message;
    }
}
