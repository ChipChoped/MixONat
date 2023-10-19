package com.backend.mixonat.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties
public class CustomProperties
{
    private String rmnMotorHost;
    private String rmnMotorPort;
    private String frontendHost;
    private String frontendPort;
}
