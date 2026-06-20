# Build Stage
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copy Maven wrapper and Project Object Model (POM)
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Grant execution rights on the mvnw wrapper
RUN chmod +x mvnw

# Resolve dependencies (cached layer)
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src ./src

# Build the application (skipping tests for speed)
RUN ./mvnw package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy the built artifact from the build stage
COPY --from=build /app/target/StressPrediction-0.0.1-SNAPSHOT.jar app.jar

# Expose the port
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
