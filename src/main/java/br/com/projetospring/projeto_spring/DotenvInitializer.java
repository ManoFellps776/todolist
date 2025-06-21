package br.com.projetospring.projeto_spring;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class DotenvInitializer {
    @PostConstruct
    public void loadEnv() {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
    }

}
