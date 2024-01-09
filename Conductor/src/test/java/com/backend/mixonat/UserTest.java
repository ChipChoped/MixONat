package com.backend.mixonat;

import com.backend.mixonat.dto.*;
import com.backend.mixonat.model.Role;
import com.backend.mixonat.model.User;
import com.backend.mixonat.service.FileService;
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
import static org.hamcrest.Matchers.hasKey;

@Lazy
@Testcontainers
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Sql(scripts={"classpath:postgres/user_test_init.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@SpringBootTest(classes = {UserTest.class, MixonatApplication.class},
                webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserTest {
    @LocalServerPort
    private Integer port;

    @Autowired
    private UserService userService;

    @Autowired
    private FileService fileService;

    @Autowired
    private JwtService jwtService;

    private String token;
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
    public static void setUp() {
        container.withReuse(true);
        container.start();
        redis.start();

        RestAssured.filters(new RequestLoggingFilter(), new ResponseLoggingFilter());
    }

    @AfterAll
    public static void tearDown() {
        container.stop();
        redis.stop();
    }

    @BeforeEach
    public void beforeEach() {
        RestAssured.baseURI = "http://localhost:" + port;

        var user = userService.findUserById(UUID.fromString("d287b4b3-16ac-4b83-800e-42a6d64d6df1"))
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
        token404 = jwtService.generateToken(user404);
    }

    @DynamicPropertySource
    public static void overrideProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", container::getJdbcUrl);
        registry.add("spring.datasource.username", container::getUsername);
        registry.add("spring.datasource.password", container::getPassword);
        registry.add("spring.datasource.driver-class-name", container::getDriverClassName);
    }

    @Test
    @Order(1)
    public void getUser200() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .when()
                .get("/user")
                .then()
                .statusCode(200)
                .body("id", org.hamcrest.Matchers.equalTo("d287b4b3-16ac-4b83-800e-42a6d64d6df1"))
                .body("first_name", org.hamcrest.Matchers.equalTo("Test"))
                .body("last_name", org.hamcrest.Matchers.equalTo("Test"))
                .body("email", org.hamcrest.Matchers.equalTo("test@test.fr"))
                .body("$", hasKey("created_at"))
                .body("$", hasKey("updated_at"));
    }

    @Test
    @Order(2)
    public void getUser401() {
        given()
                .header("Authorization", "Bearer " + "Invalid.Token")
                .when()
                .get("/user")
                .then()
                .statusCode(401)
                .body("$", hasKey("message"));
    }

    @Test
    @Order(3)
    public void getUser403() {
        given()
                .when()
                .get("/user")
                .then()
                .statusCode(403);
    }

    @Test
    @Order(4)
    public void getUser404() {
        given()
                .header("Authorization", "Bearer " + token404)
                .contentType(ContentType.JSON)
                .when()
                .get("/user")
                .then()
                .statusCode(404)
                .body("$", hasKey("message"));
    }

    @Test
    @Order(5)
    public void getUserId200() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .when()
                .get("/user/id")
                .then()
                .statusCode(200)
                .body("id", org.hamcrest.Matchers.equalTo("d287b4b3-16ac-4b83-800e-42a6d64d6df1"));
    }

    @Test
    @Order(6)
    public void getUserId401() {
        given()
                .header("Authorization", "Bearer " + "Invalid.Token")
                .when()
                .get("/user/id")
                .then()
                .statusCode(401)
                .body("$", hasKey("message"));
    }

    @Test
    @Order(7)
    public void getUserId403() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/user/id")
                .then()
                .statusCode(400);
    }

    @Test
    @Order(8)
    public void getUserId404() {
        given()
                .header("Authorization", "Bearer " + token404)
                .contentType(ContentType.JSON)
                .when()
                .get("/user/id")
                .then()
                .statusCode(404)
                .body("$", hasKey("message"));
    }

    @Test
    @Order(9)
    public void getUserById200() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/user/d287b4b3-16ac-4b83-800e-42a6d64d6df1")
                .then()
                .statusCode(200)
                .body("id", org.hamcrest.Matchers.equalTo("d287b4b3-16ac-4b83-800e-42a6d64d6df1"))
                .body("first_name", org.hamcrest.Matchers.equalTo("Test"))
                .body("last_name", org.hamcrest.Matchers.equalTo("Test"))
                .body("email", org.hamcrest.Matchers.equalTo("test@test.fr"))
                .body("$", hasKey("created_at"))
                .body("$", hasKey("updated_at"));
    }

    @Test
    @Order(10)
    public void getUserById404() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .get("/user/88b6ebe2-2ec8-4b90-965b-4b753ab68f24")
                .then()
                .statusCode(404);
    }

    @Test
    @Order(11)
    public void updateUserIdentity204() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new IdentityDTO("Testupdate", "Testupdate"))
                .when()
                .put("/user/update/identity")
                .then()
                .statusCode(204);
    }

    @Test
    @Order(12)
    public void updateUserIdentity400() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new IdentityDTO("test", "test"))
                .when()
                .put("/user/update/identity")
                .then()
                .statusCode(400)
                .body("$", hasKey("firstName"))
                .body("$", hasKey("lastName"));
    }

    @Test
    @Order(13)
    public void updateUserIdentity401() {
        given()
                .header("Authorization", "Bearer " + "Invalid.Token")
                .contentType(ContentType.JSON)
                .body(new IdentityDTO("Testupdate", "Testupdate"))
                .when()
                .put("/user/update/identity")
                .then()
                .statusCode(401)
                .body("$", hasKey("message"));
    }

    @Test
    @Order(14)
    public void updateUserIdentity403() {
        given()
                .contentType(ContentType.JSON)
                .body(new IdentityDTO("Testupdate", "Testupdate"))
                .when()
                .put("/user/update/identity")
                .then()
                .statusCode(403);
    }

    @Test
    @Order(15)
    public void updateUserIdentity404() {
        given()
                .header("Authorization", "Bearer " + token404)
                .contentType(ContentType.JSON)
                .body(new IdentityDTO("Testupdate", "Testupdate"))
                .when()
                .put("/user/update/identity")
                .then()
                .statusCode(404)
                .body("$", hasKey("message"));
    }

    @Test
    @Order(16)
    public void updateUserEmail204() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new EmailDTO("test-update@test.fr", "test-update@test.fr"))
                .when()
                .put("/user/update/email")
                .then()
                .statusCode(204);
    }

    @Test
    @Order(17)
    public void updateUserEmail400() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new EmailDTO("test", "test_"))
                .when()
                .put("/user/update/email")
                .then()
                .statusCode(400)
                .body("$", hasKey("email"))
                .body("$", hasKey("sameEmail"));
    }

    @Test
    @Order(19)
    public void updateUserEmail401() {
        given()
                .header("Authorization", "Bearer " + "Invalid.Token")
                .contentType(ContentType.JSON)
                .body(new EmailDTO("test-update@test.fr", "test-update@test.fr"))
                .when()
                .put("/user/update/email")
                .then()
                .statusCode(401)
                .body("$", hasKey("message"));
    }

    @Test
    @Order(20)
    public void updateUserEmail403() {
        given()
                .contentType(ContentType.JSON)
                .body(new EmailDTO("test-update@test.fr", "test-update@test.fr"))
                .when()
                .put("/user/update/email")
                .then()
                .statusCode(403);
    }

    @Test
    @Order(21)
    public void updateUserEmail404() {
        given()
                .header("Authorization", "Bearer " + token404)
                .contentType(ContentType.JSON)
                .body(new EmailDTO("test-update@test.fr", "test-update@test.fr"))
                .when()
                .put("/user/update/email")
                .then()
                .statusCode(404)
                .body("$", hasKey("message"));
    }

    @Test
    @Order(22)
    public void updateUserPassword204() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new PasswordDTO("1pwdTest?", "1pwdTest!", "1pwdTest!"))
                .when()
                .put("/user/update/password")
                .then()
                .statusCode(204);
    }

    @Test
    @Order(23)
    public void updateUserPasswordMalformed400() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new PasswordDTO("", "pwd", "pwd_"))
                .when()
                .put("/user/update/password")
                .then()
                .statusCode(400)
                .body("$", hasKey("currentPassword"))
                .body("$", hasKey("newPassword"))
                .body("$", hasKey("samePassword"));
    }

    @Test
    @Order(24)
    public void updateUserPasswordSameAsOldOne400() {
        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .body(new PasswordDTO("1pwdTest!", "1pwdTest!", "1pwdTest!"))
                .when()
                .put("/user/update/password")
                .then()
                .statusCode(400)
                .body("$", hasKey("differentPassword"));
    }

    @Test
    @Order(25)
    public void updateUserPassword403() {
        given()
                .contentType(ContentType.JSON)
                .body(new PasswordDTO("1pwdTest!", "1pwdTest?", "1pwdTest?"))
                .when()
                .put("/user/update/password")
                .then()
                .statusCode(403);
    }

    @Test
    @Order(26)
    public void updateUserPassword404() {
        given()
                .header("Authorization", "Bearer " + token404)
                .contentType(ContentType.JSON)
                .body(new PasswordDTO("1pwdTest!", "1pwdTest?", "1pwdTest?"))
                .when()
                .put("/user/update/password")
                .then()
                .statusCode(404)
                .body("$", hasKey("message"));
    }

    @Test
    @Order(27)
    public void deleteUser401() {
        given()
                .header("Authorization", "Bearer " + "Invalid.Token")
                .contentType(ContentType.JSON)
                .when()
                .delete("/user")
                .then()
                .statusCode(401);
    }

    @Test
    @Order(28)
    public void deleteUser403() {
        given()
                .contentType(ContentType.JSON)
                .when()
                .delete("/user")
                .then()
                .statusCode(403);
    }

    @Test
    @Order(29)
    public void deleteUser404() {
        given()
                .header("Authorization", "Bearer " + token404)
                .contentType(ContentType.JSON)
                .when()
                .delete("/user")
                .then()
                .statusCode(404)
                .body("$", hasKey("message"));
    }

    @Test
    @Order(30)
    public void deleteUser204() {
        assert fileService.getAllFilesInfoOnlyByUserId(UUID.fromString("d287b4b3-16ac-4b83-800e-42a6d64d6df1")).size() == 4;

        given()
                .header("Authorization", "Bearer " + token)
                .contentType(ContentType.JSON)
                .when()
                .delete("/user")
                .then()
                .statusCode(204);

        assert fileService.getAllFilesInfoOnlyByUserId(UUID.fromString("d287b4b3-16ac-4b83-800e-42a6d64d6df1")).isEmpty();
    }
}