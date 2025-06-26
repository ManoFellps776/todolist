package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Paciente;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import br.com.projetospring.projeto_spring.service.PacienteService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/pacientes")
@Validated
@CrossOrigin(origins = "*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;
    @Autowired
    private UsersRepository usersRepository;

    /* -------------------------------------------------
       UTILITY: obtém o usuário logado a partir do Principal
       ------------------------------------------------- */
    private Users getUsuario(Principal principal) {
        if (principal == null) throw new RuntimeException("Usuário não autenticado");
        Users u = usersRepository.findByUsers(principal.getName());
        if (u == null) throw new RuntimeException("Usuário não encontrado");
        return u;
    }

    /* ------------------  CREATE  ------------------ */
    @PostMapping
    public ResponseEntity<Paciente> criar(@Valid @RequestBody Paciente paciente,
                                          Principal principal) {
        Users usuario = getUsuario(principal);
        Paciente salvo = pacienteService.create(paciente, usuario);
        return ResponseEntity.ok(salvo);
    }

    /* ------------------  READ ( LIST )  ------------------ */
    @GetMapping
    public ResponseEntity<List<Paciente>> listar(Principal principal) {
        Users usuario = getUsuario(principal);
        return ResponseEntity.ok(pacienteService.listByUsuario(usuario));
    }

    /* ------------------  READ ( BY ID )  ------------------ */
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id, Principal principal) {
        Users usuario = getUsuario(principal);
        Paciente p = pacienteService.buscarPorIdEUsuario(id, usuario);
        return ResponseEntity.ok(p);
    }

    /* ------------------  UPDATE  ------------------ */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id,
                                       @Valid @RequestBody Paciente paciente,
                                       Principal principal) {
        Users usuario = getUsuario(principal);
        Paciente atualizado = pacienteService.update(id, paciente, usuario);
        return ResponseEntity.ok(atualizado);
    }

    /* ------------------  DELETE  ------------------ */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id, Principal principal) {
        Users usuario = getUsuario(principal);
        pacienteService.delete(id, usuario);
        return ResponseEntity.noContent().build();
    }
}
