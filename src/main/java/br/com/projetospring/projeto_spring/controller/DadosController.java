package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.DTO.DadosDTO;
import br.com.projetospring.projeto_spring.entity.Dados;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.DadosRepository;
import br.com.projetospring.projeto_spring.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/dados")
public class DadosController {

    @Autowired
    private DadosRepository dadosRepository;

    @Autowired
    private UsersRepository usersRepository;

    // ✅ 1. Salvar dados complementares
    @PostMapping("/completar")
    public ResponseEntity<String> salvarDados(
            @RequestParam String cpfCnpj,
            @RequestParam String telefone,
            @RequestParam String dataNascimento,
            @RequestParam(required = false) MultipartFile foto
    ) {
        Users user = getUsuarioAutenticado();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Usuário não autenticado.");
        }

        if (dadosRepository.existsByUsuarioId(user.getId())) {
            return ResponseEntity.badRequest().body("⚠️ Dados já cadastrados.");
        }

        Dados dados = new Dados();
        dados.setCpfCnpj(cpfCnpj);
        dados.setTelefone(telefone);
        dados.setDataNascimento(dataNascimento);
        dados.setUsuario(user);

        if (foto != null && !foto.isEmpty()) {
            try {
                dados.setFoto(foto.getBytes());
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Erro ao processar imagem.");
            }
        }

        dadosRepository.save(dados);
        return ResponseEntity.ok("✅ Dados salvos com sucesso.");
    }

    // ✅ 2. Verificar se já preencheu os dados
    @GetMapping("/existe")
    public ResponseEntity<Boolean> verificarSePreencheu() {
        Users user = getUsuarioAutenticado();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        boolean existe = dadosRepository.existsByUsuarioId(user.getId());
        return ResponseEntity.ok(existe);
    }

    // ✅ 3. Buscar dados (sem foto)
    @GetMapping
    public ResponseEntity<DadosDTO> buscarDados() {
        Users user = getUsuarioAutenticado();
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<Dados> dadosOpt = dadosRepository.findByUsuarioId(user.getId());
        if (dadosOpt.isPresent()) {
            Dados dados = dadosOpt.get();
            DadosDTO dto = new DadosDTO(
                    dados.getCpfCnpj(),
                    dados.getTelefone(),
                    dados.getDataNascimento(),
                    user.getId()
            );
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ 4. Buscar foto do usuário
@GetMapping("/foto")
public ResponseEntity<byte[]> getFoto() {
    Users user = getUsuarioAutenticado();
    if (user == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Optional<Dados> dadosOpt = dadosRepository.findByUsuarioId(user.getId());
    if (dadosOpt.isPresent()) {
        Dados dados = dadosOpt.get();
        byte[] imagem = dados.getFoto();

        if (imagem == null || imagem.length == 0) {
            return ResponseEntity.notFound().build();
        }

        // 🔍 Detectar tipo da imagem automaticamente (opcional: melhorar compatibilidade)
        MediaType mediaType = MediaType.IMAGE_JPEG; // padrão

        // ⚠️ Se você quiser detectar o tipo real:
        // use Apache Tika ou outra lib para MIME detection (ou salve tipo na entidade)

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        headers.setCacheControl(CacheControl.noCache()); // Evita cache se trocar imagem

        return new ResponseEntity<>(imagem, headers, HttpStatus.OK);
    }

    return ResponseEntity.notFound().build();
}

    // 🔐 Helper: obter usuário autenticado via SecurityContext
    private Users getUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return null;

        String username = auth.getName();
        return usersRepository.findByUsersOrEmail(username, username).orElse(null);
    }
}
