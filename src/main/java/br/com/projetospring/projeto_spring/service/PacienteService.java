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

    @Autowired
    private PacienteRepository repo;

    @Autowired
    private AgendamentoRepository agendamentoRepo;

    @Autowired
    private AnamneseProntaRepository anamneseRepo;

    @Autowired
    private LixeiraPacienteCompletaRepository lixeiraRepo;

    @Autowired
    private ObjectMapper objectMapper;

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
        Paciente p = buscarPorIdEUsuario(id, usuario); // garante que é do usuário

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
    // ✅ Valida se o paciente pertence ao usuário logado
    Paciente paciente = buscarPorIdEUsuario(id, usuario);

    try {
        // 🔷 Serializa dados do paciente
        String dadosPacienteJson = objectMapper.writeValueAsString(paciente);

        // 🔷 Busca e serializa anamneses
        List<AnamnesePronta> anamneses = anamneseRepo.findByPacienteId(paciente.getId());
        String anamnesesJson = objectMapper.writeValueAsString(anamneses);

        // 🔷 Busca e serializa agendamentos
        List<Agendamento> agendamentos = agendamentoRepo.findByPacienteId(paciente.getId());
        String agendamentosJson = objectMapper.writeValueAsString(agendamentos);

        // 🔷 Cria registro na lixeira
        LixeiraPacienteCompleta lixo = new LixeiraPacienteCompleta();
        lixo.setPacienteOriginalId(paciente.getId());
        lixo.setDadosPaciente(dadosPacienteJson);
        lixo.setAnamneses(anamnesesJson);
        lixo.setAgendamentos(agendamentosJson);
        lixo.setDataExclusao(java.time.LocalDateTime.now());

        // ✅ Salva na lixeira antes de deletar
        lixeiraRepo.save(lixo);

        // ✅ Deleta agendamentos antes de deletar o paciente
        if (!agendamentos.isEmpty()) {
            agendamentoRepo.deleteAll(agendamentos);
        }

        // ✅ Deleta anamneses antes de deletar o paciente
        if (!anamneses.isEmpty()) {
            anamneseRepo.deleteAll(anamneses);
        }

        // ✅ Finalmente deleta paciente
        repo.delete(paciente);

        System.out.println("✅ Paciente ID " + id + " enviado para lixeira e deletado com sucesso.");

    } catch (Exception e) {
        e.printStackTrace();
        throw new RuntimeException("Erro ao enviar paciente para lixeira: " + e.getMessage());
    }
}
}
