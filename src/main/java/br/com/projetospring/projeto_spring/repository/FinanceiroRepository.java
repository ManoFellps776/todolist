package br.com.projetospring.projeto_spring.repository;

import br.com.projetospring.projeto_spring.entity.Financeiro;
import br.com.projetospring.projeto_spring.entity.Users;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FinanceiroRepository extends JpaRepository<Financeiro, Long> {
    List<Financeiro> findByUsuario(Users usuario);
    Optional<Financeiro> findByIdAndUsuario(Long id, Users usuario);
    List<Financeiro> findByUsuarioAndDataBetween(Users usuario, LocalDate inicio, LocalDate fim);
}
