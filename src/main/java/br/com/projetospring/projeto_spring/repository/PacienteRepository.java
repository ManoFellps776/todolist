package br.com.projetospring.projeto_spring.repository;

import br.com.projetospring.projeto_spring.entity.Paciente;
import br.com.projetospring.projeto_spring.entity.Users;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PacienteRepository extends JpaRepository<Paciente, Long> {

    // Retorna pacientes do usuário ordenados por nome
    List<Paciente> findByUsuarioOrderByNomeAsc(Users usuario);

}
