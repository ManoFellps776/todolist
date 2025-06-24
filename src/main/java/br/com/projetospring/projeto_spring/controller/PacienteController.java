package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Paciente;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.service.PacienteService;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import br.com.projetospring.projeto_spring.security.UsersDetails;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;


import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/pacientes")
@Validated
@CrossOrigin("*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @Autowired
    private UsersRepository usersRepository;

    // ✅ Criar paciente vinculado ao usuário autenticado
    @PostMapping
    public ResponseEntity<Paciente> criar(@RequestBody @Valid Paciente paciente, Principal principal) {
        Users usuario = usersRepository.findByUsers(principal.getName());
        return ResponseEntity.ok(pacienteService.create(paciente, usuario.getId()));
    }

    // ✅ Listar pacientes do usuário autenticado
    @GetMapping
public ResponseEntity<List<Paciente>> list( @AuthenticationPrincipal UsersDetails userDetails) {
    return ResponseEntity.ok(pacienteService.listByUsuario(userDetails.getId()));
}


    // ✅ Buscar paciente por ID, somente se pertence ao usuário
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id, Principal principal) {
        Users usuario = usersRepository.findByUsers(principal.getName());
        Paciente paciente = pacienteService.buscarPorId(id);

        if (paciente != null && paciente.getUsuario().getId().equals(usuario.getId())) {
            return ResponseEntity.ok(paciente);
        } else {
            return ResponseEntity.status(403).body("Acesso negado.");
        }
    }

    // ✅ Atualizar paciente (vinculado ao usuário autenticado)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody Paciente paciente,
                                    Principal principal) {
        Users usuario = usersRepository.findByUsers(principal.getName());
        return ResponseEntity.ok(pacienteService.update(id, paciente, usuario.getId()));
    }

    // ✅ Deletar paciente apenas se for do usuário autenticado
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, Principal principal) {
        Users usuario = usersRepository.findByUsers(principal.getName());
        return ResponseEntity.ok(pacienteService.delete(id, usuario.getId()));
    }
}
