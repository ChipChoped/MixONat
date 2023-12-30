package com.backend.mixonat.model;

import lombok.*;
import jakarta.persistence.*;

import java.time.LocalDateTime;
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
    @Column(name = "id", unique = true)
    UUID id;

    String name;

    @Column(name = "file")
    String file;

    String author;

    @Column(name = "added_by")
    UUID addedBy;

    @Column(name = "added_at")
    LocalDateTime addedAt;
}
