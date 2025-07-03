package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.AnamnesePronta;
import br.com.projetospring.projeto_spring.entity.LixeiraPacienteCompleta;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.AnamneseProntaRepository;
import br.com.projetospring.projeto_spring.repository.LixeiraPacienteCompletaRepository;
import br.com.projetospring.projeto_spring.repository.UsersRepository;

import com.fasterxml.jackson.databind.ObjectMapper;

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
    private LixeiraPacienteCompletaRepository lixeiraRepository;

    @Autowired
    private ObjectMapper objectMapper;

    // ✅ Salvar nova anamnese vinculada ao usuário logado
    @PostMapping
    public ResponseEntity<AnamnesePronta> salvar(@RequestBody AnamnesePronta anamnese, Principal principal) {
        if (anamnese.getCpfA() != null) {
            anamnese.setCpfA(anamnese.getCpfA().replaceAll("\\D", ""));
        }

        String nomeUsuario = principal.getName();
        Users usuario = usersRepository.findByUsers(nomeUsuario);
        if (usuario == null) {
            return ResponseEntity.status(401).build();
        }

        anamnese.setUsuario(usuario);
        return ResponseEntity.ok(repository.save(anamnese));
    }

    // ✅ Buscar anamnese por CPF e usuário logado
    @GetMapping("/paciente/{cpf}")
    public ResponseEntity<List<AnamnesePronta>> listarPorCpf(@PathVariable String cpf, Principal principal) {
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

    // ✅ Deletar anamnese enviando para lixeira antes
    @DeleteMapping("/{id}")
public ResponseEntity<Void> deletarAnamnese(@PathVariable Long id) {
    try {
        AnamnesePronta a = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Anamnese não encontrada"));

        // 🔷 Serializa a anamnese em JSON
        String json = objectMapper.writeValueAsString(a);

        // 🔷 Cria objeto LixeiraPacienteCompleta preenchendo apenas o campo de anamneses
        LixeiraPacienteCompleta l = new LixeiraPacienteCompleta();
        l.setPacienteOriginalId(null); // Caso deseje referenciar algum paciente no futuro
        l.setDadosPaciente(null);
        l.setAgendamentos(null);
        l.setAnamneses(json);
        l.setDataExclusao(java.time.LocalDateTime.now());

        // 🔷 Salva na lixeira
        lixeiraRepository.save(l);

        // 🔷 Deleta a anamnese original
        repository.delete(a);

        return ResponseEntity.noContent().build();
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).build();
    }
}

}
