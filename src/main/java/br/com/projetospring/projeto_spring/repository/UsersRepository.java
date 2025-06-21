package br.com.projetospring.projeto_spring.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.projetospring.projeto_spring.entity.Users;

public interface UsersRepository extends JpaRepository<Users, Long> {

    // Busca por nome de usuário (login)
    Users findByUsers(String users);

    // Busca por email
    Users findByEmail(String email);

    // ❌ DEPRECADO: você deve remover esse método (não é mais usado com senha criptografada)
    // Users findByUsersAndSenha(String users, String senha);
}
