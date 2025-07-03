package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.AnamnesePronta;
import br.com.projetospring.projeto_spring.entity.Paciente;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.AnamneseProntaRepository;
import br.com.projetospring.projeto_spring.repository.PacienteRepository;
import br.com.projetospring.projeto_spring.repository.UsersRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/anamnese")
@CrossOrigin(origins = "*")
public class AnamneseProntaController {

    @Autowired
    private AnamneseProntaRepository repository;

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PacienteRepository pacienteRepository;


    // ✅ Salvar nova anamnese vinculada ao usuário logado
    @PostMapping
public ResponseEntity<AnamnesePronta> salvar(
    @RequestBody AnamnesePronta anamnese
) {
    if (anamnese.getCpfA() != null) {
        anamnese.setCpfA(anamnese.getCpfA().replaceAll("\\D", ""));
    }

    if (anamnese.getPaciente() == null || anamnese.getPaciente().getId() == null) {
        return ResponseEntity.badRequest().build();
    }

    // Se quiser, valide se o paciente existe no banco
    Paciente paciente = pacienteRepository.findById(anamnese.getPaciente().getId())
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

    anamnese.setPaciente(paciente);
    return ResponseEntity.ok(repository.save(anamnese));
}


    // ✅ Buscar anamnese por CPF e usuário logado
    @GetMapping("/paciente/{cpf}")
public ResponseEntity<List<AnamnesePronta>> listarPorCpf(
    @PathVariable String cpf,
    Principal principal
) {
    String cpfLimpo = cpf.replaceAll("\\D", "");
    String nomeUsuario = principal.getName();
    Users usuario = usersRepository.findByUsers(nomeUsuario);
    if (usuario == null) {
        return ResponseEntity.status(401).build();
    }

    List<AnamnesePronta> lista = repository.findByCpfAAndUsuario_Id(cpfLimpo, usuario.getId());
    return ResponseEntity.ok(lista);
}

    // ✅ Buscar por ID (sem filtro de usuário neste caso específico)
    @GetMapping("/{id}")
    public ResponseEntity<AnamnesePronta> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Deletar anamnese (idealmente só permitir se for do usuário logado)
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
