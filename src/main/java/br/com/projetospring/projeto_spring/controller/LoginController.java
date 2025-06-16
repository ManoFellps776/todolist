
package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private UsersRepository usersRepository;

   @PostMapping
public ResponseEntity<?> login(@RequestBody Users user) {
    Users existingUser = usersRepository.findByUsersAndSenha(user.getUsers(), user.getSenha());
    if (existingUser != null) {
        return ResponseEntity.ok(existingUser); // Retorna JSON com id, nome, email e plano
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário ou senha incorretos.");
    }
}

    @PostMapping("/cadastro")
    public String cadastrar(@RequestBody Users novoUsuario) {
        if (novoUsuario.getUsers() == null || novoUsuario.getSenha() == null ||novoUsuario.getEmail()==null ||
            novoUsuario.getUsers().isBlank() || novoUsuario.getSenha().isBlank() ||novoUsuario.getEmail().isBlank()) {
            return "Usuário e senha não podem estar em branco.";
        }
if (usersRepository.findByUsers(novoUsuario.getUsers()) != null) {
        return "Nome de usuário já existe.";
    }

    if (usersRepository.findByEmail(novoUsuario.getEmail()) != null) {
        return "Email já está cadastrado.";
    }
        
        novoUsuario.setPlano("FREE");
        usersRepository.save(novoUsuario);
        return "Usuário cadastrado com sucesso!";
    }
    @PutMapping("/usuarios/{id}")
public ResponseEntity<String> atualizarUsuario(@PathVariable Long id, @RequestBody Map<String, String> dados) {
    Users usuarioAtual = usersRepository.findById(id).orElse(null);
    if (usuarioAtual == null) {
        return ResponseEntity.notFound().build();
    }

    String novoNome = dados.get("nome");
    String novoEmail = dados.get("email");

    // Verifica se já existe outro usuário com o mesmo nome
    Users outroComMesmoNome = usersRepository.findByUsers(novoNome);
    if (outroComMesmoNome != null && !outroComMesmoNome.getId().equals(id)) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Nome de usuário já está em uso.");
    }

    // Verifica se já existe outro usuário com o mesmo email
    Users outroComMesmoEmail = usersRepository.findByEmail(novoEmail);
    if (outroComMesmoEmail != null && !outroComMesmoEmail.getId().equals(id)) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Email já está em uso.");
    }

    if (novoNome != null) usuarioAtual.setUsers(novoNome);
    if (novoEmail != null) usuarioAtual.setEmail(novoEmail);

    usersRepository.save(usuarioAtual);
    return ResponseEntity.ok("Usuário atualizado com sucesso.");
}
}
