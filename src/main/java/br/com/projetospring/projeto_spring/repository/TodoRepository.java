package br.com.projetospring.projeto_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.projetospring.projeto_spring.entity.Todo;

public interface TodoRepository extends JpaRepository<Todo, Long>{


}
