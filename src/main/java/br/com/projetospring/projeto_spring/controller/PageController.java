package br.com.projetospring.projeto_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping({"/", "/home"})
    public String index() {
        return "index"; // carrega index.html em templates/
    }

    @GetMapping("/inicio")
    public String login() {
        return "logado"; // carrega logado.html em templates/
    }
    @GetMapping("/verificado.html")
    public String verificado() {
        return "verificado"; // carrega o verificado.html do templates (com Thymeleaf)
    }

    @GetMapping("/erro.html")
    public String erro() {
        return "erro"; // carrega o erro.html do templates
    }

    // Adicione mais rotas conforme suas páginas HTML
}
