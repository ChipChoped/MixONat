package com.backend.mixonat.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class checkResponse implements Serializable
{
    String checkResult;
    String type;
}
