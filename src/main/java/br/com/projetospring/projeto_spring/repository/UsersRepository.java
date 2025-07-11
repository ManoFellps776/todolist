package br.com.projetospring.projeto_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.projetospring.projeto_spring.entity.Users;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {

    // Busca por username
    Optional<Users> findByUsers(String users);

    // Busca por email
    Optional<Users> findByEmail(String email);

    // Busca por username OU email
    Optional<Users> findByUsersOrEmail(String users, String email);
}
