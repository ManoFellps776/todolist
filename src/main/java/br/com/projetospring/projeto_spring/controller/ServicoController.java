package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Servico;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import br.com.projetospring.projeto_spring.service.ServicoService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/servicos")
@CrossOrigin(origins = "*")
public class ServicoController {

    @Autowired
    private ServicoService servicoService;

    @Autowired
    private UsersRepository usersRepository;

    // 🔐 Utilitário para buscar o usuário autenticado
    private Users getUsuario(Principal principal) {
        if (principal == null) throw new RuntimeException("Usuário não autenticado");
        return usersRepository.findByUsersOrEmail(principal.getName(), principal.getName())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    // ✅ Criar serviço
    @PostMapping
    public ResponseEntity<Servico> criar(@Valid @RequestBody Servico servico, Principal principal) {
        Users usuario = getUsuario(principal);
        return ResponseEntity.ok(servicoService.create(servico, usuario));
    }

    // ✅ Listar serviços do usuário logado
    @GetMapping
    public ResponseEntity<List<Servico>> listar(Principal principal) {
        Users usuario = getUsuario(principal);
        return ResponseEntity.ok(servicoService.listByUsuario(usuario));
    }

    // ✅ Deletar serviço (opcional)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id, Principal principal) {
        Users usuario = getUsuario(principal);
        servicoService.delete(id, usuario);
        return ResponseEntity.noContent().build();
    }
}
