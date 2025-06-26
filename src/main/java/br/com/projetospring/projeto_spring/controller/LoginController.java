package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ---------- CADASTRO ----------
   @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody Users novoUsuario) {
        if (novoUsuario.getUsers() == null || novoUsuario.getSenha() == null || novoUsuario.getEmail() == null) {
            return ResponseEntity.badRequest().body("Campos obrigatórios não preenchidos.");
        }

        if (usersRepository.findByUsers(novoUsuario.getUsers()) != null) {
            return ResponseEntity.status(409).body("Usuário já existe.");
        }

        if (usersRepository.findByEmail(novoUsuario.getEmail()) != null) {
            return ResponseEntity.status(409).body("E-mail já cadastrado.");
        }

        novoUsuario.setSenha(passwordEncoder.encode(novoUsuario.getSenha()));
        novoUsuario.setPlano("FREE");

        usersRepository.save(novoUsuario);

        return ResponseEntity.ok("Usuário cadastrado com sucesso!");
    }



    // ---------- ATUALIZAR USUÁRIO ----------
   @PutMapping("/usuarios")
public ResponseEntity<String> atualizarUsuario(@RequestBody Map<String, String> dados, Principal principal) {
    if (principal == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
    }

    String nomeLogado = principal.getName();
    Users usuarioAtual = usersRepository.findByUsers(nomeLogado);
    if (usuarioAtual == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
    }

    String novoNome = dados.get("nome");
    String novoEmail = dados.get("email");

    if (novoNome != null && !novoNome.equals(usuarioAtual.getUsers())) {
        Users outroComMesmoNome = usersRepository.findByUsers(novoNome);
        if (outroComMesmoNome != null && !outroComMesmoNome.getId().equals(usuarioAtual.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Nome de usuário já está em uso.");
        }
        usuarioAtual.setUsers(novoNome);
    }

    if (novoEmail != null && !novoEmail.equals(usuarioAtual.getEmail())) {
        Users outroComMesmoEmail = usersRepository.findByEmail(novoEmail);
        if (outroComMesmoEmail != null && !outroComMesmoEmail.getId().equals(usuarioAtual.getId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("E-mail já está em uso.");
        }
        usuarioAtual.setEmail(novoEmail);
    }

    usersRepository.save(usuarioAtual);
    return ResponseEntity.ok("Usuário atualizado com sucesso.");
}

    // ---------- RETORNAR USUÁRIO LOGADO ----------
    @GetMapping("/logado")
    public ResponseEntity<?> usuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Users user = usersRepository.findByUsers(username);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }

        return ResponseEntity.ok(user);
    }
}
