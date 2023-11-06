FROM eclipse-temurin:11

WORKDIR /app/mixonat-conductor

COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN bash mvnw dependency:go-offline

COPY src ./src

CMD ["./mvnw", "spring-boot:run"]

