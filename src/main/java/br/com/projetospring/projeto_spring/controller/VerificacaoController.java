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
        String baseUrl = environment.getProperty("app.url.frontend", "https://minha-agencia.onrender.com");

        System.out.println("🔍 Token recebido para verificação: " + token);

        Optional<Users> usuarioOpt = usersRepository.findByTokenVerificacao(token);

        if (usuarioOpt.isEmpty()) {
            System.out.println("❌ Token inválido ou expirado: " + token);
            return new RedirectView(baseUrl + "/erro");
        }

        Users user = usuarioOpt.get();
        user.setVerificado(true);
        user.setAtivo(true);
        user.setTokenVerificacao(null); // Evita reuso do token

        try {
            usersRepository.save(user);
            System.out.println("✅ Verificação concluída com sucesso para o e-mail: " + user.getEmail());
        } catch (Exception e) {
            System.out.println("❗ Erro ao salvar usuário verificado: " + e.getMessage());
            return new RedirectView(baseUrl + "/erro");
        }

        return new RedirectView(baseUrl + "/verificado");
    }
}
