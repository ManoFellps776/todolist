package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Financeiro;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import br.com.projetospring.projeto_spring.service.FinanceiroService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/financeiro")
@CrossOrigin(origins = "*")
public class FinanceiroController {

    @Autowired
    private FinanceiroService financeiroService;

    @Autowired
    private UsersRepository usersRepository;

    private Users getUsuario(Principal principal) {
        if (principal == null) throw new RuntimeException("Usuário não autenticado");

        String login = principal.getName();
        return usersRepository.findByUsersOrEmail(login, login)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @PostMapping
    public ResponseEntity<Financeiro> criarFinanceiro(@RequestBody Financeiro f, Principal principal) {
        Users usuario = getUsuario(principal);
        return ResponseEntity.ok(financeiroService.criar(f, usuario));
    }

    @GetMapping
    public ResponseEntity<List<Financeiro>> listarFinanceiro(Principal principal) {
        Users usuario = getUsuario(principal);
        return ResponseEntity.ok(financeiroService.listarPorUsuario(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletar(@PathVariable Long id, Principal principal) {
        Users usuario = getUsuario(principal);
        financeiroService.deletar(id, usuario);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/resumo")
public ResponseEntity<Map<String, BigDecimal>> resumo(Principal principal) {
    Users usuario = getUsuario(principal);
    return ResponseEntity.ok(financeiroService.calcularResumoMensal(usuario));
}

}
