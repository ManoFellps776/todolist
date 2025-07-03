package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.LixeiraPacienteCompleta;
import br.com.projetospring.projeto_spring.repository.LixeiraPacienteCompletaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lixeira")
@CrossOrigin(origins = "*")
public class LixeiraPacienteCompletaController {

    @Autowired
    private LixeiraPacienteCompletaRepository repo;

    // ✅ Listar todos os registros da lixeira
    @GetMapping
    public ResponseEntity<List<LixeiraPacienteCompleta>> listarTodos() {
        List<LixeiraPacienteCompleta> lista = repo.findAll();
        return ResponseEntity.ok(lista);
    }

    // ✅ Buscar um item específico por ID
    @GetMapping("/{id}")
    public ResponseEntity<LixeiraPacienteCompleta> buscarPorId(@PathVariable Long id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Deletar permanentemente um item da lixeira
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarDefinitivo(@PathVariable Long id) {
        if (repo.existsById(id)) {
            repo.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ Deletar toda a lixeira (⚠️ uso com cautela)
    @DeleteMapping
    public ResponseEntity<Void> deletarTudo() {
        repo.deleteAll();
        return ResponseEntity.noContent().build();
    }
}
