package br.com.projetospring.projeto_spring.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/home")
    public String index() {
        return "index"; // isso carrega o arquivo menuinicial.html da pasta templates
    }

    @GetMapping("/inicio")
    public String login() {
        return "logado";
    }

    

    // Adicione mais rotas conforme suas páginas HTML
}
