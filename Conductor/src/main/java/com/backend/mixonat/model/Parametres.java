package com.backend.mixonat.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class Parametres implements Serializable {
    String looseness_factor;
    boolean looseness_incr;
    boolean heuristic_sorting;
    String minimal_score;
    String dept135_alignment;
    String dept90_alignment;
    boolean carbon_equivalent;
    String molecular_weight;
    String number_results;
    String number_results_page;
    String results_directory_path;
}

