package com.backend.mixonat.model;
import java.io.Serializable;

import lombok.Data;

@Data
public class checkRequest implements Serializable {
    String fileType;
    String file;
}
