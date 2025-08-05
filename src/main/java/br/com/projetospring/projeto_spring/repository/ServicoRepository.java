package br.com.projetospring.projeto_spring.repository;

import br.com.projetospring.projeto_spring.entity.Servico;
import br.com.projetospring.projeto_spring.entity.Users;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServicoRepository extends JpaRepository<Servico, Long> {
    List<Servico> findByUsuario(Users usuario);
    Optional<Servico> findByIdAndUsuario(Long id, Users usuario);
}
