package com.backend.mixonat;

import com.backend.mixonat.dto.IdDTO;
import com.backend.mixonat.dto.NewFileDTO;
import com.backend.mixonat.model.Role;
import com.backend.mixonat.model.User;
import com.backend.mixonat.service.JwtService;
import com.backend.mixonat.service.UserService;
import io.restassured.RestAssured;
import io.restassured.filter.log.RequestLoggingFilter;
import io.restassured.filter.log.ResponseLoggingFilter;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Lazy;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.jdbc.Sql;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.time.LocalDateTime;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasKey;

@Lazy
@Testcontainers
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Sql(scripts={"classpath:postgres/file_test_init.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@SpringBootTest(classes = {FileTest.class, MixonatApplication.class},
                webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class FileTest {
    @LocalServerPort
    private Integer port;

    @Autowired
    private UserService userService;
    @Autowired
    private JwtService jwtService;

    private String token;
    private String token403;
    private String token404;

    @Container
    public static PostgreSQLContainer container = new PostgreSQLContainer("postgres:15.1-alpine")
            .withDatabaseName("mixonat")
            .withUsername("mixo")
            .withPassword("mixo");

    @Container
    public static GenericContainer<?> redis =
            new GenericContainer<>(DockerImageName.parse("redis:6.2-alpine")).withExposedPorts(6379);


    @BeforeAll
    public static void setUp(){
        container.withReuse(false);
        container.start();
        redis.start();

        RestAssured.filters(new RequestLoggingFilter(), new ResponseLoggingFilter());
    }

    @AfterAll
    public static void tearDown(){
        container.stop();
        redis.stop();
    }

    @BeforeEach
    public void beforeEach(){
        RestAssured.baseURI = "http://localhost:" + port;

        var user = userService.findUserById(UUID.fromString("d287b4b3-16ac-4b83-800e-42a6d64d6df1"))
                .orElseThrow(IllegalArgumentException::new);
        var user403 = userService.findUserById(UUID.fromString("ad817079-a51b-458b-9608-1743e34d4591"))
                .orElseThrow(IllegalArgumentException::new);

        User user404 = User
                .builder()
                .id(UUID.fromString("88b6ebe2-2ec8-4b90-965b-4b753ab68f24"))
                .firstName("Test")
                .lastName("Test")
                .email("test404@test.fr")
                .password("1pwdTest?")
                .role(Role.ROLE_USER)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        token = jwtService.generateToken(user);
        token403 = jwtService.generateToken(user403);
        token404 = jwtService.generateToken(user404);
    }

    @DynamicPropertySource
    public static void overrideProperties(DynamicPropertyRegistry registry){
        registry.add("spring.datasource.url", container::getJdbcUrl);
        registry.add("spring.datasource.username", container::getUsername);
        registry.add("spring.datasource.password", container::getPassword);
        registry.add("spring.datasource.driver-class-name", container::getDriverClassName);
    }

    @Test
    @Order(1)
    public void getAllFiles() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/file/list")
                .then()
                .statusCode(200)
                .body("fileList.size()", org.hamcrest.Matchers.is(1));
    }

    @Test
    @Order(2)
    public void addSdfFiles201() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new NewFileDTO(
                        "An SDF file", "SDF",
                        "Content of the SDF file",
                        "Unknown"))
                .when()
                .post("/file")
                .then()
                .statusCode(201);
    }

    @Test
    @Order(3)
    public void addSpectrumFiles201() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new NewFileDTO(
                        "A spectrum file", "SPECTRUM",
                        "Content of the spectrum file",
                        "Unknown"))
                .when()
                .post("/file")
                .then()
                .statusCode(201);
    }

    @Test
    @Order(4)
    public void addDept90Files201() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new NewFileDTO(
                        "A dept90 file", "DEPT90",
                        "Content of the dept90 file",
                        "Unknown"))
                .when()
                .post("/file")
                .then()
                .statusCode(201);
    }

    @Test
    @Order(5)
    public void addDept135Files201() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new NewFileDTO(
                        "A dept135 file", "DEPT135",
                        "Content of the dept135 file",
                        "Unknown"))
                .when()
                .post("/file")
                .then()
                .statusCode(201);
    }

    @Test
    @Order(6)
    public void addSdfFiles400() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new NewFileDTO(
                        "", "SDF",
                        "Content of the SDF file",
                        "Unknown"))
                .when()
                .post("/file")
                .then()
                .statusCode(400);
    }

    @Test
    @Order(7)
    public void addSdfFiles401() {
        given()
                .header("Authorization", "Bearer " + "Invalid token")
                .contentType(ContentType.JSON)
                .body(new NewFileDTO(
                        "An SDF file", "SDF",
                        "Content of the SDF file",
                        "Unknown"))
                .when()
                .post("/file")
                .then()
                .statusCode(401);
    }

    @Test
    @Order(8)
    public void addSdfFiles403() {
        given()
                .contentType(ContentType.JSON)
                .body(new NewFileDTO(
                        "An SDF file", "SDF",
                        "Content of the SDF file",
                        "Unknown"))
                .when()
                .post("/file")
                .then()
                .statusCode(403);
    }

    @Test
    @Order(9)
    public void getAllFilesFilled() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/file/list")
                .then()
                .statusCode(200)
                .body("fileList.size()", org.hamcrest.Matchers.is(5));
    }

    @Test
    @Order(10)
    public void getAllFilesByUserId200() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/file/list/user/d287b4b3-16ac-4b83-800e-42a6d64d6df1")
                .then()
                .statusCode(200)
                .body("fileList.size()", org.hamcrest.Matchers.is(5));
    }

    @Test
    @Order(11)
    public void getAllFilesByOtherUserId200() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/file/list/user/ad817079-a51b-458b-9608-1743e34d4591")
                .then()
                .statusCode(200)
                .body("fileList.size()", org.hamcrest.Matchers.is(0));
    }

    @Test
    @Order(12)
    public void getAllFilesByUserId404() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/file/list/user/88b6ebe2-2ec8-4b90-965b-4b753ab68f24")
                .then()
                .statusCode(404);
    }

    @Test
    @Order(13)
    public void getFileById200() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/file/3aa1c8f4-14dc-499b-a876-0c6c2c497ec8")
                .then()
                .statusCode(200)
                .body("id", equalTo("3aa1c8f4-14dc-499b-a876-0c6c2c497ec8"))
                .body("name", equalTo("SDF Test"))
                .body("type", equalTo("SDF"))
                .body("file", equalTo("SDF test file content"))
                .body("author", equalTo("Test"))
                .body("added_by", equalTo("d287b4b3-16ac-4b83-800e-42a6d64d6df1"))
                .body("added_by_name", equalTo("Test Test"))
                .body("$", hasKey("added_at"));
    }

    @Test
    @Order(14)
    public void getFileById404() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/file/bf46853a-68ea-4eca-935a-9f8df5d095b8")
                .then()
                .statusCode(404);
    }

    @Test
    @Order(15)
    public void deleteFileById401() {
        given()
                .header("Authorization", "Bearer " + "Invalid.token")
                .contentType(ContentType.JSON)
                .body(new IdDTO(UUID.fromString("3aa1c8f4-14dc-499b-a876-0c6c2c497ec8")))
                .when()
                .delete("/file")
                .then()
                .statusCode(401);
    }

    @Test
    @Order(16)
    public void deleteFileNotAddedByUser403() {
        given()
                .header("Authorization", "Bearer " + token403)
                .contentType(ContentType.JSON)
                .body(new IdDTO(UUID.fromString("3aa1c8f4-14dc-499b-a876-0c6c2c497ec8")))
                .when()
                .delete("/file")
                .then()
                .statusCode(403);
    }

    @Test
    @Order(17)
    public void deleteFileById403() {
        given()
                .contentType(ContentType.JSON)
                .body(new IdDTO(UUID.fromString("3aa1c8f4-14dc-499b-a876-0c6c2c497ec8")))
                .when()
                .delete("/file")
                .then()
                .statusCode(403);
    }

    @Test
    @Order(18)
    public void deleteFileByIdUserNotFound404() {
        given()
                .header("Authorization", "Bearer " + token404)
                .contentType(ContentType.JSON)
                .body(new IdDTO(UUID.fromString("3aa1c8f4-14dc-499b-a876-0c6c2c497ec8")))
                .when()
                .delete("/file")
                .then()
                .statusCode(404);
    }

    @Test
    @Order(19)
    public void deleteFileById204() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new IdDTO(UUID.fromString("3aa1c8f4-14dc-499b-a876-0c6c2c497ec8")))
                .when()
                .delete("/file")
                .then()
                .statusCode(204);
    }

    @Test
    @Order(20)
    public void deleteFileByIdFileNotFound404() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new IdDTO(UUID.fromString("3aa1c8f4-14dc-499b-a876-0c6c2c497ec8")))
                .when()
                .delete("/file")
                .then()
                .statusCode(404);
    }
}