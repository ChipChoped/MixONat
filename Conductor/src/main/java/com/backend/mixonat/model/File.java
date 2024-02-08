package com.backend.mixonat.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@ToString
@Table(name = "files")
public class File
{
    @Id
    @Column(name = "id", unique = true)
    UUID id;

    String name;

    @Enumerated(EnumType.STRING)
    Type type;

    @Column(name = "file")
    String file;

    String author;

    @Column(name = "added_by")
    UUID addedBy;

    @Column(name = "added_at")
    LocalDateTime addedAt;
}
