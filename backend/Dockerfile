FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY src src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 10000

ENTRYPOINT ["sh", "-c", "base64 -d /etc/secrets/jwt-keystore.p12.base64 > /tmp/jwt-keystore.p12 && exec java -Dmediqueue.jwt.keystore-path=/tmp/jwt-keystore.p12 -Dserver.port=${PORT:-10000} -jar app.jar"]