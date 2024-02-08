package com.backend.mixonat;

import com.backend.mixonat.controller.AuthenticationController;
import com.backend.mixonat.controller.MotorController;
import com.backend.mixonat.controller.UserController;
import com.backend.mixonat.controller.FileController;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(classes = {SmokeTest.class, MixonatApplication.class})
class SmokeTest {
    @Container
    public static PostgreSQLContainer container = new PostgreSQLContainer("postgres:15.1-alpine")
            .withDatabaseName("mixonat_test")
            .withUsername("Test")
            .withPassword("Test");

    @Container
    public static GenericContainer<?> redis =
            new GenericContainer<>(DockerImageName.parse("redis:6.2-alpine")).withExposedPorts(6379);


    @BeforeAll
    public static void setUp(){
        container.withReuse(true);
        container.withInitScript("postgres/auth_test_init.sql");
        container.start();
        redis.start();
    }

    @DynamicPropertySource
    public static void overrideProperties(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url", container::getJdbcUrl);
        registry.add("spring.datasource.username", container::getUsername);
        registry.add("spring.datasource.password", container::getPassword);
        registry.add("spring.datasource.driver-class-name", container::getDriverClassName);
    }

    @Autowired
    private MotorController motorController;

    @Autowired
    private AuthenticationController authenticationController;

    @Autowired
    private UserController userController;

    @Autowired
    private FileController fileController;

    @Test
    void contextLoads() {
        assertThat(motorController).isNotNull();
        assertThat(authenticationController).isNotNull();
        assertThat(userController).isNotNull();
        assertThat(fileController).isNotNull();
    }
}