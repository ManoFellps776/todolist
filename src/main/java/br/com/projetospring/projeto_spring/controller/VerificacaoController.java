package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequestMapping("/verificacao")
@CrossOrigin(origins = "*")
public class VerificacaoController {

    @Autowired
    private UsersRepository usersRepository;

    @GetMapping
    public String verificarEmail(@RequestParam("token") String token, Model model) {
        System.out.println("🔑 TOKEN recebido: " + token);

        Optional<Users> usuarioOpt = usersRepository.findByTokenVerificacao(token);

        if (usuarioOpt.isEmpty()) {
            System.out.println("❌ Token inválido ou expirado.");
            return "erro"; // carrega erro.html do templates
        }

        Users user = usuarioOpt.get();
        System.out.println("✅ Usuário encontrado: " + user.getEmail());

        user.setVerificado(true);
        user.setAtivo(true);
        user.setTokenVerificacao(null);
        usersRepository.save(user);

        System.out.println("✅ Usuário ativado e verificado com sucesso.");

        return "verificado"; // carrega verificado.html do templates
    }
}
