package br.com.projetospring.projeto_spring.service;

import br.com.projetospring.projeto_spring.entity.*;
import br.com.projetospring.projeto_spring.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacienteService {

    private final PacienteRepository repo;
    private final AnamneseProntaRepository anamneseRepo;
    private final AgendamentoRepository agendamentoRepo;
    private final LixeiraPacienteCompletaRepository lixeiraRepo;
    private final ObjectMapper objectMapper;

    @Autowired
    public PacienteService(
            PacienteRepository repo,
            AnamneseProntaRepository anamneseRepo,
            AgendamentoRepository agendamentoRepo,
            LixeiraPacienteCompletaRepository lixeiraRepo,
            ObjectMapper objectMapper
    ) {
        this.repo = repo;
        this.anamneseRepo = anamneseRepo;
        this.agendamentoRepo = agendamentoRepo;
        this.lixeiraRepo = lixeiraRepo;
        this.objectMapper = objectMapper;
    }

    /* -------------------- CREATE --------------------- */
    @Transactional
    public Paciente create(Paciente p, Users usuario) {
        p.setUsuario(usuario);
        return repo.save(p);
    }

    /* --------------------- LIST --------------------- */
    @Transactional
    public List<Paciente> listByUsuario(Users usuario) {
        return repo.findByUsuarioOrderByNomeAsc(usuario);
    }

    /* ----------------- READ (helper) ---------------- */
    @Transactional
    public Paciente buscarPorIdEUsuario(Long id, Users usuario) {
        Paciente p = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        if (!p.getUsuario().equals(usuario)) {
            throw new RuntimeException("Acesso negado ao paciente");
        }
        return p;
    }

    /* -------------------- UPDATE -------------------- */
    @Transactional
    public Paciente update(Long id, Paciente dados, Users usuario) {
        Paciente p = buscarPorIdEUsuario(id, usuario);
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

    /* -------------------- DELETE (com lixeira) -------------------- */
    @Transactional
    public void delete(Long id, Users usuario) {
        Paciente p = buscarPorIdEUsuario(id, usuario);

        try {
            // 🔷 Serializa dados do paciente
            String dadosPacienteJson = objectMapper.writeValueAsString(p);

            // 🔷 Busca e serializa anamneses do paciente
            List<AnamnesePronta> anamneses = anamneseRepo.findByPacienteId(p.getId());
            String anamnesesJson = objectMapper.writeValueAsString(anamneses);

            // 🔷 Busca e serializa agendamentos do paciente
            List<Agendamento> agendamentos = agendamentoRepo.findByPacienteId(p.getId());
            String agendamentosJson = objectMapper.writeValueAsString(agendamentos);

            // 🔷 Salva na lixeira
            LixeiraPacienteCompleta lixo = new LixeiraPacienteCompleta(
                    dadosPacienteJson,
                    anamnesesJson,
                    agendamentosJson,
                    p.getId()
            );
            lixeiraRepo.save(lixo);

            // 🔷 Deleta agendamentos e anamneses antes de deletar o paciente
            agendamentoRepo.deleteAll(agendamentos);
            anamneseRepo.deleteAll(anamneses);

            // 🔷 Deleta paciente
            repo.delete(p);

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar paciente para lixeira: " + e.getMessage());
        }
    }
}
