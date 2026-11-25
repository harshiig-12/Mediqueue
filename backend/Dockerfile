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

# Memory settings for a small (256 MB) free server
ENV JAVA_TOOL_OPTIONS="-Xms32m -Xmx80m -Xss512k -XX:MaxMetaspaceSize=128m -XX:ReservedCodeCacheSize=32m -XX:+UseSerialGC -XX:TieredStopAtLevel=1"

# The JWT keystore is supplied as a base64 text environment variable
ENTRYPOINT ["sh", "-c", "printf '%s' \"$JWT_KEYSTORE_BASE64\" | base64 -d > /tmp/jwt-keystore.p12 && exec java -Dspring.profiles.active=prod -Dserver.port=${PORT:-10000} -jar app.jar"]
