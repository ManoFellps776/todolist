
package br.com.projetospring.projeto_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.projetospring.projeto_spring.entity.Users;

public interface UsersRepository extends JpaRepository<Users, Long> {
    Users findByUsers(String users);

    Users findByEmail(String email);
}