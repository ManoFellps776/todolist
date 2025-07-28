package br.com.projetospring.projeto_spring.repository;

import br.com.projetospring.projeto_spring.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {

    // Busca todos os agendamentos de uma data específica
    List<Agendamento> findByData(LocalDate data);

    // Busca agendamentos dentro de um intervalo de datas
    List<Agendamento> findByDataBetween(LocalDate inicio, LocalDate fim);

    // Busca todos os agendamentos de um paciente
    List<Agendamento> findByPacienteId(Long paciente);

    // Busca agendamentos por intervalo de datas e por usuário (ideal para segurança por sessão)
    List<Agendamento> findByDataBetweenAndUsuario_Id(LocalDate dataInicio, LocalDate dataFim, Long usuarioId);
}
