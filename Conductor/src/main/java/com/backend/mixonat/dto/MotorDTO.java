package com.backend.mixonat.dto;

import java.io.Serializable;

import com.backend.mixonat.model.Parametres;
import lombok.Data;

@Data
public class MotorDTO implements Serializable
{
    private static final long serialVersionUID = 1L;
    String sdf;
    String spectrum;
    String dept135;
    String dept90;
    Parametres params;
    Boolean useSdfDatabase;
    Boolean useSpectrumDatabase;
    Boolean useDept135Database;
    Boolean useDept90Database;
}
