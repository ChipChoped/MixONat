package com.backend.mixonat;

import com.backend.mixonat.dto.MotorDTO;
import com.backend.mixonat.model.Parametres;
import io.restassured.RestAssured;
import io.restassured.filter.log.RequestLoggingFilter;
import io.restassured.filter.log.ResponseLoggingFilter;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@Lazy
@Testcontainers
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Sql(scripts={"classpath:postgres/motor_test_init.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@SpringBootTest(classes = {MotorTest.class, MixonatApplication.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class MotorTest {
    @LocalServerPort
    private Integer port;

    private static Parametres parameters;

    @Container
    public static PostgreSQLContainer container = new PostgreSQLContainer("postgres:15.1-alpine")
            .withDatabaseName("mixonat")
            .withUsername("mixo")
            .withPassword("mixo");

    @Container
    public static GenericContainer<?> redis =
            new GenericContainer<>(DockerImageName.parse("redis:6.2-alpine")).withExposedPorts(6379);


    @BeforeAll
    public static void setUp() {
        container.withReuse(true);
        container.start();
        redis.start();

        RestAssured.filters(new RequestLoggingFilter(), new ResponseLoggingFilter());

        parameters = new Parametres();
        parameters.setLooseness_factor("1.3");
        parameters.setLooseness_incr(true);
        parameters.setHeuristic_sorting(false);
        parameters.setMinimal_score("0.0");
        parameters.setDept135_alignment("0.02");
        parameters.setDept90_alignment("0.02");
        parameters.setCarbon_equivalent(false);
        parameters.setMolecular_weight("");
        parameters.setNumber_results("50");
        parameters.setNumber_results_page("25");
    }

    @AfterAll
    public static void tearDown() {
        container.stop();
        redis.stop();
    }

    @BeforeEach
    public void beforeEach() {
        RestAssured.baseURI = "http://localhost:" + port;
    }

    @DynamicPropertySource
    public static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", container::getJdbcUrl);
        registry.add("spring.datasource.username", container::getUsername);
        registry.add("spring.datasource.password", container::getPassword);
        registry.add("spring.datasource.driver-class-name", container::getDriverClassName);
    }

    @Autowired
    private ResourceLoader resourceLoader;

    @Test
    @Order(1)
    public void getMotorResultFilesNotInDB200() throws IOException {
        Resource sdfResource = resourceLoader.getResource("classpath:data/Lamiaceae test.SDF");
        Resource spectrumResource = resourceLoader.getResource("classpath:data/Peppermint essential oil 13C.csv");
        Resource dept135Resource = resourceLoader.getResource("classpath:data/Peppermint essential oil DEPT 135.csv");
        Resource dept90Resource = resourceLoader.getResource("classpath:data/Peppermint essential oil DEPT 90.csv");

        String sdfFile = Files.readString(Path.of(sdfResource.getURI()), StandardCharsets.UTF_8);
        String spectrumFile = Files.readString(Path.of(spectrumResource.getURI()), StandardCharsets.UTF_8);
        String dept135File = Files.readString(Path.of(dept135Resource.getURI()), StandardCharsets.UTF_8);
        String dept90File = Files.readString(Path.of(dept90Resource.getURI()), StandardCharsets.UTF_8);

        given()
                .contentType(ContentType.JSON)
                .body(new MotorDTO(
                        sdfFile, spectrumFile, dept135File, dept90File,
                        parameters,
                        false, false, false, false))
                .when()
                .post("/motor")
                .then()
                .statusCode(200)
                .body("$", hasKey("ranking"))
                .body("$", hasKey("result"));
    }

    @Test
    @Order(2)
    public void getMotorResultFilesInDB200() {
        given()
                .contentType(ContentType.JSON)
                .body(new MotorDTO(
                        "3aa1c8f4-14dc-499b-a876-0c6c2c497ec8",
                        "1b8c7f80-559f-4c33-9c65-86bab55e4ada",
                        "71764318-4565-4c74-bb97-0985b7a0e497",
                        "e4c4696e-e024-4a90-a975-bac150343b22",
                        parameters,
                        true, true, true, true))
                .when()
                .post("/motor")
                .then()
                .statusCode(200)
                .body("$", hasKey("ranking"))
                .body("$", hasKey("result"));
    }

    @Test
    @Order(3)
    public void getMotorResultFilesInDBIncorrectSdfFile400() {
        given()
                .contentType(ContentType.JSON)
                .body(new MotorDTO(
                        "1b8c7f80-559f-4c33-9c65-86bab55e4ada",
                        "1b8c7f80-559f-4c33-9c65-86bab55e4ada",
                        "71764318-4565-4c74-bb97-0985b7a0e497",
                        "e4c4696e-e024-4a90-a975-bac150343b22",
                        parameters,
                        true, true, true, true))
                .when()
                .post("/motor")
                .then()
                .statusCode(400)
                .body("message", equalTo("The file is not of type SDF"));
    }

    @Test
    @Order(4)
    public void getMotorResultFilesInDBIncorrectSpectrumFile400() {
        given()
                .contentType(ContentType.JSON)
                .body(new MotorDTO(
                        "3aa1c8f4-14dc-499b-a876-0c6c2c497ec8",
                        "3aa1c8f4-14dc-499b-a876-0c6c2c497ec8",
                        "71764318-4565-4c74-bb97-0985b7a0e497",
                        "e4c4696e-e024-4a90-a975-bac150343b22",
                        parameters,
                        true, true, true, true))
                .when()
                .post("/motor")
                .then()
                .statusCode(400)
                .body("message", equalTo("The file is not of type SPECTRUM"));
    }

    @Test
    @Order(5)
    public void getMotorResultFilesInDBIncorrectDept135File400() {
        given()
                .contentType(ContentType.JSON)
                .body(new MotorDTO(
                        "3aa1c8f4-14dc-499b-a876-0c6c2c497ec8",
                        "1b8c7f80-559f-4c33-9c65-86bab55e4ada",
                        "1b8c7f80-559f-4c33-9c65-86bab55e4ada",
                        "e4c4696e-e024-4a90-a975-bac150343b22",
                        parameters,
                        true, true, true, true))
                .when()
                .post("/motor")
                .then()
                .statusCode(400)
                .body("message", equalTo("The file is not of type DEPT135"));
    }

    @Test
    @Order(6)
    public void getMotorResultFilesInDBIncorrectDept90File400() {
        given()
                .contentType(ContentType.JSON)
                .body(new MotorDTO(
                        "3aa1c8f4-14dc-499b-a876-0c6c2c497ec8",
                        "1b8c7f80-559f-4c33-9c65-86bab55e4ada",
                        "71764318-4565-4c74-bb97-0985b7a0e497",
                        "71764318-4565-4c74-bb97-0985b7a0e497",
                        parameters,
                        true, true, true, true))
                .when()
                .post("/motor")
                .then()
                .statusCode(400)
                .body("message", equalTo("The file is not of type DEPT90"));
    }

    @Test
    @Order(7)
    public void getMotorResultFilesInDBIncorrectSdfFile404() {
        given()
                .contentType(ContentType.JSON)
                .body(new MotorDTO(
                        "2cbe69ba-da06-47bd-98f8-0a0d0207d14f",
                        "1b8c7f80-559f-4c33-9c65-86bab55e4ada",
                        "71764318-4565-4c74-bb97-0985b7a0e497",
                        "e4c4696e-e024-4a90-a975-bac150343b22",
                        parameters,
                        true, true, true, true))
                .when()
                .post("/motor")
                .then()
                .statusCode(404)
                .body("message", equalTo("The SDF file doesn't exist"));
    }

    @Test
    @Order(8)
    public void getMotorResultFilesInDBIncorrectSpectrumFile404() {
        given()
                .contentType(ContentType.JSON)
                .body(new MotorDTO(
                        "3aa1c8f4-14dc-499b-a876-0c6c2c497ec8",
                        "2cbe69ba-da06-47bd-98f8-0a0d0207d14f",
                        "71764318-4565-4c74-bb97-0985b7a0e497",
                        "e4c4696e-e024-4a90-a975-bac150343b22",
                        parameters,
                        true, true, true, true))
                .when()
                .post("/motor")
                .then()
                .statusCode(404)
                .body("message", equalTo("The SPECTRUM file doesn't exist"));
    }

    @Test
    @Order(9)
    public void getMotorResultFilesInDBIncorrectDept135File404() {
        given()
                .contentType(ContentType.JSON)
                .body(new MotorDTO(
                        "3aa1c8f4-14dc-499b-a876-0c6c2c497ec8",
                        "1b8c7f80-559f-4c33-9c65-86bab55e4ada",
                        "2cbe69ba-da06-47bd-98f8-0a0d0207d14f",
                        "e4c4696e-e024-4a90-a975-bac150343b22",
                        parameters,
                        true, true, true, true))
                .when()
                .post("/motor")
                .then()
                .statusCode(404)
                .body("message", equalTo("The DEPT135 file doesn't exist"));
    }

    @Test
    @Order(10)
    public void getMotorResultFilesInDBIncorrectDept90File404() {
        given()
                .contentType(ContentType.JSON)
                .body(new MotorDTO(
                        "3aa1c8f4-14dc-499b-a876-0c6c2c497ec8",
                        "1b8c7f80-559f-4c33-9c65-86bab55e4ada",
                        "71764318-4565-4c74-bb97-0985b7a0e497",
                        "2cbe69ba-da06-47bd-98f8-0a0d0207d14f",
                        parameters,
                        true, true, true, true))
                .when()
                .post("/motor")
                .then()
                .statusCode(404)
                .body("message", equalTo("The DEPT90 file doesn't exist"));
    }
}