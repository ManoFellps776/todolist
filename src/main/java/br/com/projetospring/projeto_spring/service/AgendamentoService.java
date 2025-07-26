package br.com.projetospring.projeto_spring.service;

import br.com.projetospring.projeto_spring.DTO.AgendamentoDTO;
import br.com.projetospring.projeto_spring.entity.Agendamento;
import br.com.projetospring.projeto_spring.entity.Paciente;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.AgendamentoRepository;
import br.com.projetospring.projeto_spring.repository.PacienteRepository;
import br.com.projetospring.projeto_spring.repository.UsersRepository;

import jakarta.transaction.Transactional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
public class AgendamentoService {

    private final AgendamentoRepository agendamentoRepository;
    private final PacienteRepository pacienteRepository;
    private final UsersRepository usersRepository;

    public AgendamentoService(AgendamentoRepository agendamentoRepository,
                               PacienteRepository pacienteRepository,
                               UsersRepository usersRepository) {
        this.agendamentoRepository = agendamentoRepository;
        this.pacienteRepository = pacienteRepository;
        this.usersRepository = usersRepository;
    }

    /* ╔════════════════════════════════════════════════════════╗
       ║ 1. CRIAR AGENDAMENTO                                   ║
       ╚════════════════════════════════════════════════════════╝ */
    public Agendamento criar(AgendamentoDTO dto, Long usuarioId) {
        Users usuario = usersRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        Agendamento agendamento = new Agendamento();
        agendamento.setData(dto.getData());
        agendamento.setHora(dto.getHora());
        agendamento.setDescricao(dto.getDescricao());
        agendamento.setCor(dto.getCor());
        agendamento.setPaciente(paciente);
        agendamento.setUsuario(usuario);

        return agendamentoRepository.save(agendamento);
    }

    /* ╔════════════════════════════════════════════════════════╗
       ║ 2. ATUALIZAR AGENDAMENTO                               ║
       ╚════════════════════════════════════════════════════════╝ */
    public Agendamento atualizar(Long id, AgendamentoDTO dto, Long usuarioId) {
        Agendamento ag = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        if (!ag.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Agendamento não pertence ao usuário autenticado");
        }

        Paciente paciente = pacienteRepository.findById(dto.getPacienteId())
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        ag.setPaciente(paciente);
        ag.setData(dto.getData());
        ag.setHora(dto.getHora());
        ag.setDescricao(dto.getDescricao());
        ag.setCor(dto.getCor());

        return agendamentoRepository.save(ag);
    }

    /* ╔════════════════════════════════════════════════════════╗
       ║ 3. BUSCAR AGENDAMENTOS POR DATA DO USUÁRIO AUTENTICADO║
       ╚════════════════════════════════════════════════════════╝ */
    public List<Agendamento> buscarPorData(LocalDate data) {
        Users usuario = getUsuarioAutenticado();
        return agendamentoRepository.findByDataBetweenAndUsuario_Id(data, data, usuario.getId());
    }

    /* ╔════════════════════════════════════════════════════════╗
       ║ 4. DELETAR AGENDAMENTO                                 ║
       ╚════════════════════════════════════════════════════════╝ */
    public void deletar(Long id) {
        Agendamento ag = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        Users usuario = getUsuarioAutenticado();
        if (!ag.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Agendamento não pertence ao usuário autenticado");
        }

        agendamentoRepository.delete(ag);
    }

    /* ╔════════════════════════════════════════════════════════╗
       ║ 5. OBTÉM USUÁRIO DA SESSÃO ATUAL                       ║
       ╚════════════════════════════════════════════════════════╝ */
    private Users getUsuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return usersRepository.findByUsersOrEmail(username, username)
                .orElseThrow(() -> new RuntimeException("Usuário autenticado não encontrado"));
    }
}
