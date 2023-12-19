package com.backend.mixonat.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class FrontRequest implements Serializable
{
    private static final long serialVersionUID = 1L;
    String sdf;
    String spectrum;
    String dept135;
    String dept90;
    Parametres params;
    Boolean useSdfDatabase;
    Boolean useRmnDatabase;
}
