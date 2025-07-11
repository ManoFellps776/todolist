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
import java.util.Map;

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
    if (principal == null) {
        throw new RuntimeException("Usuário não autenticado");
    }

    String login = principal.getName();
    return usersRepository.findByUsersOrEmail(login, login)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
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
/*----------------------   SIMPLIFICADO    ---------------------- */
@PostMapping("/simplificado")
public ResponseEntity<Paciente> criarSimplificado(@RequestBody Map<String, String> dados, Principal principal) {
    Users usuario = getUsuario(principal);

    Paciente p = new Paciente();
    p.setNome(dados.get("nome"));
    p.setTelefone(dados.get("telefone"));
    p.setUsuario(usuario);

    // Se sua entidade tiver campos obrigatórios no banco, defina valores padrões:
    p.setCpf("CADASTRO_SIMPLIFICADO");
    p.setEmail("simplificado@" + System.currentTimeMillis() + ".com");
    p.setBirthday(null);
    p.setEstadoCivil("NÃO INFORMADO");
    p.setProfissao("NÃO INFORMADO");
    p.setEscola("NÃO INFORMADO");
    p.setCep("00000000");
    p.setEstadoCep("NÃO INFORMADO");
    p.setCidade("NÃO INFORMADO");
    p.setBairro("NÃO INFORMADO");
    p.setRua("NÃO INFORMADO");
    p.setNumeroRua("0");
    p.setDescricao("Cadastro simplificado. Completar depois.");

    return ResponseEntity.ok(pacienteService.create(p, usuario));
}


/* ------------------  DELETE  ------------------ */
@DeleteMapping("/{id}")
public ResponseEntity<?> deletar(@PathVariable Long id, Principal principal) {
    try {
        // ✅ Obtém o usuário autenticado
        Users usuario = getUsuario(principal);

        // ✅ Chama o service que envia o paciente (e dados relacionados) para a lixeira antes de excluir
        pacienteService.delete(id, usuario);

        // ✅ Retorna resposta de sucesso sem conteúdo (204)
        return ResponseEntity.noContent().build();

    } catch (RuntimeException e) {
        // 🔴 Erros de regra de negócio ou validação (ex: paciente não encontrado ou acesso negado)
        System.err.println("Erro ao deletar paciente: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.badRequest().body("Erro ao deletar paciente: " + e.getMessage());

    } catch (Exception e) {
        // 🔴 Erros inesperados (ex: falha ao serializar para lixeira, erro no banco)
        System.err.println("Erro interno ao deletar paciente: " + e.getMessage());
        e.printStackTrace();
        return ResponseEntity.status(500).body("Erro interno ao deletar paciente: " + e.getMessage());
    }
}

}
