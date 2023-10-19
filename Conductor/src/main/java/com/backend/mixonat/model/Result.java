package com.backend.mixonat.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class Result  implements Serializable{
    private String sdf;
    private String spectrum_file;
    private String dept_135_file;
    private String dept_90_file;
    private Double allowed_margin;
    private Double alignment_accuracy_135;
    private Double alignment_accuracy_90;
    private Integer number_of_results;
    private String equivalent_carbons;
}
