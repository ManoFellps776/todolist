package br.com.projetospring.projeto_spring.service;

import br.com.projetospring.projeto_spring.entity.Paciente;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.PacienteRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacienteService {

    private final PacienteRepository repo;

    public PacienteService(PacienteRepository repo) {
        this.repo = repo;
    }

    /* --------------------------------  CREATE  ------------------------------- */
    @Transactional
    public Paciente create(Paciente p, Users usuario) {
        p.setUsuario(usuario);
        return repo.save(p);
    }

    /* --------------------------------  LIST  --------------------------------- */
    @Transactional
    public List<Paciente> listByUsuario(Users usuario) {
        return repo.findByUsuarioOrderByNomeAsc(usuario);
    }

    /* -------------  READ - helper que já aplica a regra de proprietário ------- */
    @Transactional
    public Paciente buscarPorIdEUsuario(Long id, Users usuario) {
        Paciente p = repo.findById(id)
                         .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        if (!p.getUsuario().equals(usuario)) {
            throw new RuntimeException("Acesso negado ao paciente");
        }
        return p;
    }

    /* --------------------------------  UPDATE  ------------------------------- */
    @Transactional
    public Paciente update(Long id, Paciente dados, Users usuario) {
        Paciente p = buscarPorIdEUsuario(id, usuario);     // garante que é do usuário
        /* copia campos editáveis */
        p.setNome(dados.getNome());
        p.setCpf(dados.getCpf());
        p.setBirthday(dados.getBirthday());
        p.setEstadoCivil(dados.getEstadoCivil());
        p.setProfissao(dados.getProfissao());
        p.setEscola(dados.getEscola());
        p.setCep(dados.getCep());
        p.setEstadoCep(dados.getEstadoCep());
        p.setCidade(dados.getCidade());
        p.setBairro(dados.getBairro());
        p.setRua(dados.getRua());
        p.setNumeroRua(dados.getNumeroRua());
        p.setTelefone(dados.getTelefone());
        p.setEmail(dados.getEmail());
        p.setDescricao(dados.getDescricao());

        return repo.save(p);
    }

    /* --------------------------------  DELETE  ------------------------------- */
    @Transactional
    public void delete(Long id, Users usuario) {
        Paciente p = buscarPorIdEUsuario(id, usuario);     // valida dono
        repo.delete(p);
    }
}
