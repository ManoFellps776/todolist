
package br.com.projetospring.projeto_spring.repository;

import br.com.projetospring.projeto_spring.entity.Paciente;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {
    List<Paciente> findByUsuarioIdOrderByNomeAsc(Long usuarioId);

}

