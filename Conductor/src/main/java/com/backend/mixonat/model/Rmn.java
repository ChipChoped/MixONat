package com.backend.mixonat.model;

import lombok.*;
import jakarta.persistence.*;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@ToString
@Table(name = "rmn")
public class Rmn
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @Column(unique = true)
    UUID uuid;

    String name;

    @Column(name = "file")
    String file;

    String author;

    @Column(name = "added_by")
    UUID addedBy;

    @Column(name = "added_at")
    String createdAt;
}
