# Etapa 1: imagem base com Java 17+ (Render suporta)
FROM eclipse-temurin:17-jdk-alpine

# Cria uma pasta dentro do container
WORKDIR /app

# Copia o .jar gerado localmente
COPY target/projeto_spring-0.0.1-SNAPSHOT.jar app.jar

# Expõe a porta usada pelo Spring Boot (padrão: 8080)
EXPOSE 8080

# Comando para rodar o jar
ENTRYPOINT ["java", "-jar", "app.jar"]