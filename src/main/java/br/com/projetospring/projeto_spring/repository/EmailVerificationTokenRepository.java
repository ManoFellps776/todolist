package br.com.projetospring.projeto_spring.repository;

import br.com.projetospring.projeto_spring.entity.EmailVerificationToken;
import br.com.projetospring.projeto_spring.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {

    Optional<EmailVerificationToken> findByToken(String token);

    Optional<EmailVerificationToken> findByUser(Users user);
    
}
