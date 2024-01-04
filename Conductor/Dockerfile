FROM maven:3.9.6-eclipse-temurin-21 AS build

COPY pom.xml /build/
COPY src /build/src/

WORKDIR /build/
RUN mvn clean install -DskipTests

FROM openjdk:21-slim
COPY --from=build /build/target/mixonat-0.0.1-SNAPSHOT.jar /usr/local/lib/mixonat.jar
ENTRYPOINT ["java", "-jar", "/usr/local/lib/mixonat.jar"]