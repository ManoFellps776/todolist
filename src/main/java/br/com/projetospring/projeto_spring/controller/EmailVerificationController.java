package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.EmailVerificationToken;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.EmailVerificationTokenRepository;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/verificar-email")
@CrossOrigin(origins = "*")
public class EmailVerificationController {

    @Autowired
    private EmailVerificationTokenRepository tokenRepository;

    @Autowired
    private UsersRepository usersRepository;

    @GetMapping
    public ResponseEntity<String> verificarEmail(@RequestParam("token") String token) {
        Optional<EmailVerificationToken> optionalToken = tokenRepository.findByToken(token);

        if (optionalToken.isEmpty()) {
            return ResponseEntity.badRequest().body("Token inválido ou expirado.");
        }

        EmailVerificationToken tokenEntity = optionalToken.get();
        Users user = tokenEntity.getUser();

        if (user == null) {
            return ResponseEntity.badRequest().body("Usuário não encontrado.");
        }

        user.setVerificado(true);
        usersRepository.save(user);
        tokenRepository.delete(tokenEntity); // remove o token após uso

        return ResponseEntity.ok("E-mail verificado com sucesso! Agora você pode acessar sua conta.");
    }
}
