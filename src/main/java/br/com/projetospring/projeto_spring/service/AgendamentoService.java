package br.com.projetospring.projeto_spring.service;

import br.com.projetospring.projeto_spring.entity.Agendamento;
import br.com.projetospring.projeto_spring.entity.AgendamentoDTO;
import br.com.projetospring.projeto_spring.entity.Paciente;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.AgendamentoRepository;
import br.com.projetospring.projeto_spring.repository.PacienteRepository;
import br.com.projetospring.projeto_spring.repository.UsersRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AgendamentoService {

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @Autowired
    private PacienteRepository pacienteRepository;

    @Autowired
    private UsersRepository usersRepository;

    // 🔸 Criar agendamento com ID de usuário vindo da URL (ex: via ?usuarioId=)
    public Agendamento criar(AgendamentoDTO dto) {
    Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
        .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

    Users usuario = usersRepository.findById(dto.getUsuarioId())
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    Agendamento agendamento = new Agendamento();
    agendamento.setData(dto.getData());
    agendamento.setHora(dto.getHora());
    agendamento.setDescricao(dto.getDescricao());
    agendamento.setCor(dto.getCor());
    agendamento.setPaciente(paciente);
    agendamento.setUsuario(usuario); // 👈 Aqui você associa

    return agendamentoRepository.save(agendamento);
}

    // 🔸 Atualizar agendamento
    @Transactional
    public Agendamento atualizar(Long id, AgendamentoDTO dto) {
        Agendamento agendamentoExistente = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado com ID: " + id));

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + dto.getPacienteId()));

        agendamentoExistente.setPaciente(paciente);
        agendamentoExistente.setData(dto.getData());
        agendamentoExistente.setHora(dto.getHora());
        agendamentoExistente.setDescricao(dto.getDescricao());
        agendamentoExistente.setCor(dto.getCor());

        return agendamentoRepository.save(agendamentoExistente);
    }

    // 🔸 Buscar agendamentos por data
    public List<Agendamento> buscarPorData(LocalDate data) {
        return agendamentoRepository.findByData(data);
    }

    // 🔸 Deletar agendamento
    @Transactional
    public void deletar(Long id) {
        if (!agendamentoRepository.existsById(id)) {
            throw new RuntimeException("Agendamento não encontrado com ID: " + id);
        }
        agendamentoRepository.deleteById(id);
    }
}
