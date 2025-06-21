package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/login")           // POST /login          → autentica
@CrossOrigin(origins = "*")         // POST /login/cadastro → cria usuário
public class LoginController {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;   // vem do SecurityConfig

    /* ---------- LOGIN ---------- */
    @PostMapping
    public ResponseEntity<?> login(@RequestBody Users credenciais) {
        Users user = usersRepository.findByUsers(credenciais.getUsers());

        if (user == null ||
            !passwordEncoder.matches(credenciais.getSenha(), user.getSenha())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Usuário ou senha incorretos.");
        }
        // Dica: crie um DTO sem senha se não quiser expor a senha criptografada
        return ResponseEntity.ok(user);
    }

    /* ---------- CADASTRO ---------- */
    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody Users novoUsuario) {

        if (novoUsuario.getUsers() == null || novoUsuario.getSenha() == null || novoUsuario.getEmail() == null ||
            novoUsuario.getUsers().isBlank() || novoUsuario.getSenha().isBlank() || novoUsuario.getEmail().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body("Usuário, e-mail e senha não podem estar em branco.");
        }

        if (usersRepository.findByUsers(novoUsuario.getUsers()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("Nome de usuário já existe.");
        }

        if (usersRepository.findByEmail(novoUsuario.getEmail()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body("E-mail já está cadastrado.");
        }

        novoUsuario.setSenha(passwordEncoder.encode(novoUsuario.getSenha())); // 🔑 BCrypt
        novoUsuario.setPlano("FREE");
        usersRepository.save(novoUsuario);

        return ResponseEntity.ok("Usuário cadastrado com sucesso!");
    }

    /* ---------- ATUALIZAR USUÁRIO ---------- */
    @PutMapping("/usuarios/{id}")
    public ResponseEntity<String> atualizarUsuario(@PathVariable Long id,
                                                   @RequestBody Map<String, String> dados) {

        Users usuarioAtual = usersRepository.findById(id).orElse(null);
        if (usuarioAtual == null) {
            return ResponseEntity.notFound().build();
        }

        String novoNome  = dados.get("nome");
        String novoEmail = dados.get("email");

        if (novoNome != null) {
            Users outroComMesmoNome = usersRepository.findByUsers(novoNome);
            if (outroComMesmoNome != null && !outroComMesmoNome.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                     .body("Nome de usuário já está em uso.");
            }
            usuarioAtual.setUsers(novoNome);
        }

        if (novoEmail != null) {
            Users outroComMesmoEmail = usersRepository.findByEmail(novoEmail);
            if (outroComMesmoEmail != null && !outroComMesmoEmail.getId().equals(id)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                                     .body("E-mail já está em uso.");
            }
            usuarioAtual.setEmail(novoEmail);
        }

        usersRepository.save(usuarioAtual);
        return ResponseEntity.ok("Usuário atualizado com sucesso.");
    }
}
