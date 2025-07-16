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
    @GetMapping("/erro")
    public String erro() {
        return "erro-verificacao"; // carrega logado.html em templates/
    }
    @GetMapping("/verificado")
    public String verrificado() {
        return "verificado"; // carrega logado.html em templates/
    }

    // Adicione mais rotas conforme suas páginas HTML
}
