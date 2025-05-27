package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Paciente;
import br.com.projetospring.projeto_spring.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/pacientes")
@Validated
@CrossOrigin("*")
public class PacienteController {

    @Autowired
    private PacienteService pacienteService;

    @PostMapping
    public ResponseEntity<Paciente> criar(@RequestBody @Valid Paciente paciente) {
        return ResponseEntity.ok(pacienteService.create(paciente));
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> list() {
        return ResponseEntity.ok(pacienteService.list());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> buscarPorId(@PathVariable Long id) {
        Paciente paciente = pacienteService.buscarPorId(id);
        if (paciente != null) {
            return ResponseEntity.ok(paciente);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> update(@PathVariable Long id, @RequestBody Paciente paciente) {
        return ResponseEntity.ok(pacienteService.update(id, paciente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<List<Paciente>> delete(@PathVariable Long id) {
        return ResponseEntity.ok(pacienteService.delete(id));
    }
}
