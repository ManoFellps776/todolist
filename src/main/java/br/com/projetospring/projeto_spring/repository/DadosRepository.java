package br.com.projetospring.projeto_spring.repository;

import br.com.projetospring.projeto_spring.entity.Dados;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DadosRepository extends JpaRepository<Dados, Long> {
    
    Optional<Dados> findByUsuarioId(Long usuarioId);

    boolean existsByUsuarioId(Long usuarioId);
}
