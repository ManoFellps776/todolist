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
        System.out.println("🔑 TOKEN recebido: " + token);

        Optional<Users> usuarioOpt = usersRepository.findByTokenVerificacao(token);

        if (usuarioOpt.isEmpty()) {
            System.out.println("❌ Token inválido ou expirado.");
            return new RedirectView("/erro");
        }

        Users user = usuarioOpt.get();
        System.out.println("✅ Usuário encontrado: " + user.getEmail());

        user.setVerificado(true);
        user.setAtivo(true);
        user.setTokenVerificacao(null);

        usersRepository.save(user);
        System.out.println("✅ Usuário ativado e verificado com sucesso.");

        return new RedirectView("/verificado"); // Certifique-se de que este arquivo existe no front-end
    }
}
