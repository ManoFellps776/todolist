
package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
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
}
