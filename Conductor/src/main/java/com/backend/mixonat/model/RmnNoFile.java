package com.backend.mixonat.model;

import java.time.LocalDateTime;
import java.util.UUID;

public interface RmnNoFile {
    UUID getUuid();
    String getName();
    String getAuthor();
    UUID getAdded_by();
    String getAdded_by_name();
    LocalDateTime getAdded_at();
}
