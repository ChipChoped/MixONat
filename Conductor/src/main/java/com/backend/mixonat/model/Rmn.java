package com.backend.mixonat.model;

import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@Table(name = "rmn")
public class Rmn
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String name;
    String rmn_file;
}
