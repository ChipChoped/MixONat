package com.backend.mixonat.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.io.Serializable;

@Data
public class UserID implements Serializable, JsonResponse {
    private static final long serialVersionUID = 1L;

    @JsonProperty("user-id")
    Integer id;

    public UserID(Integer id) {
        this.id = id;
    }
}
