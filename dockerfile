# Etapa de build
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# Copia o Maven Wrapper com permissão
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw

# Copia o restante do projeto
COPY pom.xml .
COPY src src

# Compila o projeto e gera o .jar (fat jar com dependências)
RUN ./mvnw clean package -DskipTests

# Etapa de runtime
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copia o .jar compilado
COPY --from=builder /app/target/*.jar app.jar

# Expõe a porta usada pelo Spring Boot
EXPOSE 8080

# Comando de execução
ENTRYPOINT ["java", "-jar", "app.jar"]
