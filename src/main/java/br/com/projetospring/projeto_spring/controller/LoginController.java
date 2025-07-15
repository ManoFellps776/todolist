package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import br.com.projetospring.projeto_spring.service.EmailVerificationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailVerificationService emailVerificationService;


    // ---------- CADASTRO ----------
  @PostMapping("/cadastro")
public ResponseEntity<String> cadastrar(@RequestBody Users novoUsuario) {
    if (novoUsuario.getUsers() == null || novoUsuario.getSenha() == null || novoUsuario.getEmail() == null) {
        return ResponseEntity.badRequest().body("Campos obrigatórios não preenchidos.");
    }

    if (usersRepository.findByUsers(novoUsuario.getUsers()).isPresent()) {
        return ResponseEntity.status(409).body("Usuário já existe.");
    }

    if (usersRepository.findByEmail(novoUsuario.getEmail()).isPresent()) {
        return ResponseEntity.status(409).body("E-mail já cadastrado.");
    }

    novoUsuario.setSenha(passwordEncoder.encode(novoUsuario.getSenha()));
    novoUsuario.setPlano("FREE");

    usersRepository.save(novoUsuario);

    // ✅ ENVIA E-MAIL DE VERIFICAÇÃO
    emailVerificationService.enviarTokenConfirmacao(novoUsuario);

    return ResponseEntity.ok("Usuário cadastrado com sucesso! Verifique seu e-mail para ativar a conta.");
}


    // ---------- ATUALIZAR USUÁRIO ----------
    @PutMapping("/usuarios")
    public ResponseEntity<String> atualizarUsuario(@RequestBody Map<String, String> dados, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }

        String nomeLogado = principal.getName();
        Optional<Users> optUsuarioAtual = usersRepository.findByUsersOrEmail(nomeLogado, nomeLogado);
        if (!optUsuarioAtual.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }

        Users usuarioAtual = optUsuarioAtual.get();
        String novoNome = dados.get("nome");
        String novoEmail = dados.get("email");

        if (novoNome != null && !novoNome.equals(usuarioAtual.getUsers())) {
            Optional<Users> outroComMesmoNome = usersRepository.findByUsers(novoNome);
            if (outroComMesmoNome.isPresent() && !outroComMesmoNome.get().getId().equals(usuarioAtual.getId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Nome de usuário já está em uso.");
            }
            usuarioAtual.setUsers(novoNome);
        }

        if (novoEmail != null && !novoEmail.equals(usuarioAtual.getEmail())) {
            Optional<Users> outroComMesmoEmail = usersRepository.findByEmail(novoEmail);
            if (outroComMesmoEmail.isPresent() && !outroComMesmoEmail.get().getId().equals(usuarioAtual.getId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("E-mail já está em uso.");
            }
            usuarioAtual.setEmail(novoEmail);
        }

        usersRepository.save(usuarioAtual);
        return ResponseEntity.ok("Usuário atualizado com sucesso.");
    }
    // ---------- VERIFICAÇÃO POR TOKEN ----------
    @GetMapping("/verificacao")
public ResponseEntity<String> verificarEmail(@RequestParam String token) {
    Optional<Users> usuarioOpt = emailVerificationService.validarToken(token);

    if (usuarioOpt.isEmpty()) {
        return ResponseEntity.badRequest().body("Token inválido ou expirado.");
    }

    Users usuario = usuarioOpt.get();
    usuario.setAtivo(true);
    usersRepository.save(usuario);

    return ResponseEntity.ok("E-mail verificado com sucesso! Você já pode fazer login.");
}

    // ---------- RETORNAR USUÁRIO LOGADO ----------
    @GetMapping("/logado")
    public ResponseEntity<?> usuarioLogado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Optional<Users> optUser = usersRepository.findByUsersOrEmail(username, username);
        if (!optUser.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuário não encontrado.");
        }

        return ResponseEntity.ok(optUser.get());
    }
}
