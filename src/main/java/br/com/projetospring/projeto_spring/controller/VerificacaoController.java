package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;

@RestController
@RequestMapping("/verificacao")
@CrossOrigin(origins = "*")
public class VerificacaoController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private Environment environment;

    @GetMapping
    public RedirectView verificarEmail(@RequestParam("token") String token) {
        Optional<Users> usuarioOpt = usersRepository.findByTokenVerificacao(token);

        String baseUrl = environment.getProperty("app.url.frontend", "https://minha-agencia.onrender.com");

        if (usuarioOpt.isEmpty()) {
            // 🔴 Redireciona para a página de erro no front-end
            return new RedirectView(baseUrl + "/erro-verificacao.html");
        }

        Users user = usuarioOpt.get();
        user.setVerificado(true);
        user.setAtivo(true);
        user.setTokenVerificacao(null);
        usersRepository.save(user);

        // ✅ Redireciona para a página de sucesso no front-end
        return new RedirectView(baseUrl + "/verificado.html");
    }
}
