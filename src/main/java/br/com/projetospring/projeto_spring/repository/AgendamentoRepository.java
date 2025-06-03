package br.com.projetospring.projeto_spring.repository;

import br.com.projetospring.projeto_spring.entity.Agendamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AgendamentoRepository extends JpaRepository<Agendamento, Long> {
    List<Agendamento> findByData(LocalDate data);
    List<Agendamento> findByDataBetween(LocalDate inicio, LocalDate fim);
    List<Agendamento> findByPacienteId(Long pacienteId);

}
