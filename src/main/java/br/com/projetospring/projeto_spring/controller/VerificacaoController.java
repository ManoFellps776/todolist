package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;

@RestController
@RequestMapping("/verificacao")
@CrossOrigin(origins = "*")
public class VerificacaoController {

    @Autowired
    private UsersRepository usersRepository;

    @GetMapping
public RedirectView verificarEmail(@RequestParam("token") String token) {
    Optional<Users> usuarioOpt = usersRepository.findByTokenVerificacao(token);

    if (usuarioOpt.isEmpty()) {
        return new RedirectView("https://minha-agencia.onrender.com/erro-verificacao.html");
    }

    Users user = usuarioOpt.get();
    user.setVerificado(true);
    user.setAtivo(true);
    user.setTokenVerificacao(null);
    usersRepository.save(user);

    return new RedirectView("https://minha-agencia.onrender.com/verificado.html");
}
}
