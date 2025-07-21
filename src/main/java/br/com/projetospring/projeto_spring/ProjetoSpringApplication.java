package br.com.projetospring.projeto_spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ProjetoSpringApplication {

	public static void main(String[] args) {
		System.out.println("EMAIL = " + System.getenv("spring.mail.host"));
System.out.println("EMAIL from props = " + System.getProperty("spring.mail.host"));

		SpringApplication.run(ProjetoSpringApplication.class, args);
	}

}
