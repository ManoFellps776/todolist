// src/main/java/br/com/projetospring/projeto_spring/config/EnvConfig.java
package br.com.projetospring.projeto_spring.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class EnvConfig {

    @PostConstruct
    public void init() {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

        setIfAbsent("DB_URL", dotenv.get("DB_URL"));
        setIfAbsent("DB_USER", dotenv.get("DB_USER"));
        setIfAbsent("DB_PASS", dotenv.get("DB_PASS"));
    }

    private void setIfAbsent(String key, String value) {
        if (value != null && System.getenv(key) == null) {
            System.setProperty(key, value);
        }
    }
}
