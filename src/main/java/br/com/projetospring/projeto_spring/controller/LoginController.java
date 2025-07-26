package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Dados;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.DadosRepository;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import br.com.projetospring.projeto_spring.service.EmailVerificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.Base64;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/login")
@CrossOrigin(origins = "*")
public class LoginController {

    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private DadosRepository dadosRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailVerificationService emailVerificationService;

    // ✅ CADASTRAR NOVO USUÁRIO
    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@RequestBody Users novoUsuario) {
        if (novoUsuario.getUsers() == null || novoUsuario.getSenha() == null || novoUsuario.getEmail() == null) {
            return ResponseEntity.badRequest().body("❌ Campos obrigatórios não preenchidos.");
        }

        if (usersRepository.findByUsers(novoUsuario.getUsers()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("⚠️ Nome de usuário já existe.");
        }

        if (usersRepository.findByEmail(novoUsuario.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("⚠️ E-mail já cadastrado.");
        }

        novoUsuario.setSenha(passwordEncoder.encode(novoUsuario.getSenha()));
        novoUsuario.setPlano("FREE");
        usersRepository.save(novoUsuario);

        // ✅ Envia e-mail de verificação
        emailVerificationService.enviarTokenConfirmacao(novoUsuario);

        return ResponseEntity.ok("✅ Usuário cadastrado com sucesso! Verifique seu e-mail para ativar a conta.");
    }

    // ✅ ATUALIZAR NOME OU E-MAIL DO USUÁRIO
    @PutMapping("/usuarios")
public ResponseEntity<String> atualizarUsuario(
        @RequestParam("nome") String nome,
        @RequestParam("email") String email,
        @RequestParam(value = "dataNascimento", required = false) String dataNascimento,
        @RequestParam(value = "cpfCnpj", required = false) String cpfCnpj,
        @RequestParam(value = "telefone", required = false) String telefone,
        @RequestParam(value = "foto", required = false) MultipartFile foto,
        Principal principal) {

    if (principal == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Usuário não autenticado.");
    }

    String login = principal.getName();
    Optional<Users> optUsuario = usersRepository.findByUsersOrEmail(login, login);

    if (optUsuario.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Usuário não encontrado.");
    }

    Users usuario = optUsuario.get();

    // Verifica nome e email únicos
    if (!nome.equals(usuario.getUsers()) && usersRepository.findByUsers(nome).isPresent()) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("⚠️ Nome de usuário já está em uso.");
    }

    if (!email.equals(usuario.getEmail()) && usersRepository.findByEmail(email).isPresent()) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body("⚠️ E-mail já está em uso.");
    }

    usuario.setUsers(nome);
    usuario.setEmail(email);

    // Atualiza ou cria os dados complementares
    Dados dados = usuario.getDados();
    if (dados == null) {
        dados = new Dados();
        dados.setUsuario(usuario);
    }

    dados.setCpfCnpj(cpfCnpj);
    dados.setTelefone(telefone);
    dados.setDataNascimento(dataNascimento);

    // Se foto foi enviada, armazena como byte[]
    if (foto != null && !foto.isEmpty()) {
        try {
            dados.setFoto(foto.getBytes());
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Erro ao processar a foto.");
        }
    }

    // Salva alterações
    usersRepository.save(usuario);
    dadosRepository.save(dados);

    return ResponseEntity.ok("✅ Dados atualizados com sucesso.");
}


    // ✅ RETORNAR USUÁRIO LOGADO
   @GetMapping("/logado")
public ResponseEntity<?> usuarioLogado() {
    Authentication auth = SecurityContextHolder.getContext().getAuthentication();

    if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Usuário não autenticado.");
    }

    String username = auth.getName();
    Optional<Users> optUser = usersRepository.findByUsersOrEmail(username, username);

    if (optUser.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Usuário não encontrado.");
    }

    Users usuario = optUser.get();
    Dados dados = usuario.getDados();

    // Converter byte[] da foto (se existir)
    String fotoBase64 = null;
    if (dados != null && dados.getFoto() != null) {
        fotoBase64 = "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(dados.getFoto());
    }

    // Dados complementares (com segurança para nulls)
    Map<String, Object> dadosMap = new java.util.HashMap<>();
    if (dados != null) {
        dadosMap.put("dataNascimento", dados.getDataNascimento());
        dadosMap.put("cpfCnpj", dados.getCpfCnpj());
        dadosMap.put("telefone", dados.getTelefone());
    }

    Map<String, Object> response = new java.util.HashMap<>();
    response.put("id", usuario.getId());
    response.put("users", usuario.getUsers());
    response.put("email", usuario.getEmail());
    response.put("plano", usuario.getPlano());
    response.put("foto", fotoBase64);
    response.put("dados", dadosMap); // ✅ agrupado corretamente

    return ResponseEntity.ok(response);
}


}
