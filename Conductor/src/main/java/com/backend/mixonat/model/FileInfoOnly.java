package com.backend.mixonat.model;

import java.time.LocalDateTime;
import java.util.UUID;

public interface FileInfoOnly {
    UUID getId();
    String getName();
    Type getType();
    String getAuthor();
    UUID getAdded_by();
    String getAdded_by_name();
    LocalDateTime getAdded_at();
}
