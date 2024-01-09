package com.backend.mixonat;

import com.backend.mixonat.dto.LoginsDTO;
import com.backend.mixonat.dto.NewUserDTO;
import io.restassured.RestAssured;
import io.restassured.filter.log.RequestLoggingFilter;
import io.restassured.filter.log.ResponseLoggingFilter;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.*;
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

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.hasKey;

@Lazy
@Testcontainers
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@Sql(scripts={"classpath:postgres/auth_test_init.sql"}, executionPhase = Sql.ExecutionPhase.BEFORE_TEST_CLASS)
@SpringBootTest(classes = {AuthenticationTest.class, MixonatApplication.class},
                webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AuthenticationTest {
    @LocalServerPort
    private Integer port;

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
    public void signUp201() {
        given()
                .contentType(ContentType.JSON)
                .body(new NewUserDTO(
                        "Test", "Test",
                        "test@test.fr", "test@test.fr",
                        "1pwdTest?", "1pwdTest?",
                        true))
                .when()
                .put("/user/sign-up")
                .then()
                .statusCode(201)
                .body("$", hasKey("token"));
    }

    @Test
    @Order(2)
    public void signUp400() {
        given()
                .contentType(ContentType.JSON)
                .body(new NewUserDTO(
                        "test", "test",
                        "test@test.fr", "test_@test.fr",
                        "pwd", "pwd_",
                        false))
                .when()
                .put("/user/sign-up")
                .then()
                .statusCode(400)
                .body("$", hasKey("firstName"),
                        "$", hasKey("lastName"),
                        "$", hasKey("email"),
                        "$", hasKey("sameEmail"),
                        "$", hasKey("password"),
                        "$", hasKey("samePassword"),
                        "$", hasKey("consent"));
    }

    @Test
    @Order(3)
    public void signIn200() {
        given()
                .contentType(ContentType.JSON)
                .body(new LoginsDTO(
                        "test@test.fr", "1pwdTest?"))
                .when()
                .post("/user/sign-in")
                .then()
                .statusCode(200)
                .body("$", hasKey("token"));
    }

    @Test
    @Order(4)
    public void signIn401WrongEmail() {
        given()
                .contentType(ContentType.JSON)
                .body(new LoginsDTO(
                        "test_@test.fr", "1pwdTest?"))
                .when()
                .post("/user/sign-in")
                .then()
                .statusCode(401)
                .body("$", hasKey("message"));
    }

    @Test
    @Order(5)
    public void signIn401WrongPassword() {
        given()
                .contentType(ContentType.JSON)
                .body(new LoginsDTO(
                        "test@test.fr", "pwd"))
                .when()
                .post("/user/sign-in")
                .then()
                .statusCode(401)
                .body("$", hasKey("message"));
    }
}