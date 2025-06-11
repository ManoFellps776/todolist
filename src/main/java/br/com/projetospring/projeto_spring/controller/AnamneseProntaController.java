package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.AnamnesePronta;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.AnamneseProntaRepository;
import br.com.projetospring.projeto_spring.repository.UsersRepository;

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

    @Autowired
    private UsersRepository usersRepository;

    // ✅ Salvar nova anamnese vinculada ao usuário
    @PostMapping
public ResponseEntity<AnamnesePronta> salvar(
    @RequestBody AnamnesePronta anamnese,
    @RequestParam Long usuarioId
) {
    if (anamnese.getCpfA() != null) {
        anamnese.setCpfA(anamnese.getCpfA().replaceAll("\\D", ""));
    }

    Users usuario = usersRepository.findById(usuarioId)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    anamnese.setUsuario(usuario);
    return ResponseEntity.ok(repository.save(anamnese));
}

    // ✅ Buscar anamnese por CPF e usuário
    @GetMapping("/paciente/{cpf}")
public ResponseEntity<List<AnamnesePronta>> listarPorCpf(
    @PathVariable String cpf,
    @RequestParam Long usuarioId
) {
    String cpfLimpo = cpf.replaceAll("\\D", "");
    List<AnamnesePronta> lista = repository.findByCpfAAndUsuario_Id(cpfLimpo, usuarioId);
    return ResponseEntity.ok(lista);
}

    // ✅ Buscar por ID (sem filtro de usuário neste caso específico)
    @GetMapping("/{id}")
    public ResponseEntity<AnamnesePronta> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Deletar anamnese
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
