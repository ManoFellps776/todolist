package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/verificacao")
@CrossOrigin(origins = "*")
public class VerificacaoController {

    @Autowired
    private UsersRepository usersRepository;

    @GetMapping
    public ResponseEntity<String> verificarEmail(@RequestParam("token") String token) {
        Optional<Users> usuarioOpt = usersRepository.findByTokenVerificacao(token);

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Token inválido ou expirado.");
        }

        Users user = usuarioOpt.get();
        user.setVerificado(true);
        user.setTokenVerificacao(null);
        usersRepository.save(user);

        return ResponseEntity.ok("E-mail verificado com sucesso! Agora você pode fazer login.");
    }
}
