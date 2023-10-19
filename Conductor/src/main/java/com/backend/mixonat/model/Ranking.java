package com.backend.mixonat.model;


import java.io.Serializable;

import lombok.Data;

@Data
public class Ranking implements Serializable {
    private Integer rank;
    private Integer id;
    private String name;
    private String cas;
    private Double mw;
    private String smile;
    private String score;

    private String  base64;
    
    private Double error;
    private String spectrum_shifts_left;
    private int all_shifts_sdf;
    private double[] matched_no_dept_shifts_spectrum;
    private double[] not_matched_no_dept_shifts_spectrum;
    private double[] matched_sdf_shifts;
    private double[] matched_spectrum_intensities;
    private double[] not_matched_sdf_shifts;

    private int[] matched_sdf_atoms_idx;
    private int[] matched_quat_atoms_sdf;
    private int[] matched_ter_prim_atoms_sdf;
    private int[] matched_ter_atoms_sdf;
    private int[] matched_sec_atoms_sdf;
    private int[] matched_prim_atoms_sdf;
    private int[] matched_no_dept_atoms_sdf;
    
    private int[] not_matched_quat_atoms_sdf;
    private int[] not_matched_ter_prim_atoms_sdf;
    private int[] not_matched_ter_atoms_sdf;
    private int[] not_matched_sec_atoms_sdf;
    private int[] not_matched_prim_atoms_sdf;
    private int[] not_matched_no_dept_atoms_sdf;

    
    private double[] matched_spectrum_quaternary_shifts;
    private double[] not_matched_spectrum_quaternary_shifts;
    private double[] matched_quat_sdf;
    private double[] not_matched_quat_sdf;
    private double[] matched_quaternary_intensities;
    private double[] not_matched_quaternary_intensities;

    private double[] matched_spectrum_tertiary_and_primary_shifts;
    private double[] not_matched_spectrum_tertiary_and_primary_shifts;
    private double[] matched_ter_prim_sdf;
    private double[] not_matched_ter_prim_sdf;
    private double[] matched_tertiary_and_primary_intensities;
    private double[] not_matched_tertiary_and_primary_intensities;

    private double[] matched_spectrum_tertiary_shifts;
    private double[] not_matched_spectrum_tertiary_shifts;
    private double[] matched_ter_sdf;
    private double[] not_matched_ter_sdf;
    private double[] matched_tertiary_intensities;
    private double[] not_matched_tertiary_intensities;

    private double[] matched_spectrum_secondary_shifts;
    private double[] not_matched_spectrum_secondary_shifts;
    private double[] matched_sec_sdf;
    private double[] not_matched_sec_sdf;
    private double[] matched_secondary_intensities;
    private double[] not_matched_secondary_intensities;

    private double[] matched_spectrum_primary_shifts;
    private double[] not_matched_spectrum_primary_shifts;
    private double[] matched_prim_sdf;
    private double[] not_matched_prim_sdf;
    private double[] matched_primary_intensities;
    private double[] not_matched_primary_intensities;

    private double[] matched_no_dept_sdf;
    private double[] not_matched_no_dept_sdf;
    private double[] matched_no_dept_intensities;
    private double[] not_matched_no_dept_intensities;


    private double[] user_deleted_spectrum_shifts;
    private double[] user_deleted_spectrum_intensities;

    private double[] user_deleted_quaternary_spectrum_shifts;
    private double[] user_deleted_quaternary_spectrum_intensities;

    private double[] user_deleted_tertiary_and_primary_spectrum_shifts;
    private double[] user_deleted_tertiary_and_primary_spectrum_intensities;

    private double[] user_deleted_tertiary_spectrum_shifts;
    private double[] user_deleted_tertiary_spectrum_intensities;

    private double[] user_deleted_secondary_spectrum_shifts;
    private double[] user_deleted_secondary_spectrum_intensities;

    private double[] user_deleted_primary_spectrum_shifts;
    private double[] user_deleted_primary_spectrum_intensities;


}
