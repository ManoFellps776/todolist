package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.AnamnesePronta;
import br.com.projetospring.projeto_spring.repository.AnamneseProntaRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/anamnese")
@CrossOrigin(origins = "*")
public class AnamneseProntaController {

    @Autowired
    private AnamneseProntaRepository repository;

    // ✅ Salvar nova anamnese
    @PostMapping
public ResponseEntity<AnamnesePronta> salvar(@RequestBody AnamnesePronta anamnese) {
    // limpa CPF antes de salvar
    if (anamnese.getCpfA() != null) {
        anamnese.setCpfA(anamnese.getCpfA().replaceAll("\\D", ""));
    }
    return ResponseEntity.ok(repository.save(anamnese));
}

    // ✅ Buscar anamnese por CPF (filtrando corretamente)
    @GetMapping("/paciente/{cpf}")
public ResponseEntity<List<AnamnesePronta>> listarPorCpf(@PathVariable String cpf) {
    // Remove pontuação se vier com CPF formatado
    String cpfLimpo = cpf.replaceAll("\\D", "");
    List<AnamnesePronta> lista = repository.findByCpfA(cpfLimpo);
    return ResponseEntity.ok(lista);
}

    // ✅ Buscar anamnese por ID (para visualizar ou gerar PDF)
    @GetMapping("/{id}")
    public ResponseEntity<AnamnesePronta> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Deletar uma anamnese pelo ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarAnamnese(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
