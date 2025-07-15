package br.com.projetospring.projeto_spring.security;

import br.com.projetospring.projeto_spring.entity.Users;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;

public class UsersDetails implements UserDetails {

    private final Users user;

    public UsersDetails(Users user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList(); // Sem roles por enquanto
    }

    @Override
    public String getPassword() {
        return user.getSenha();
    }

    @Override
    public String getUsername() {
        return user.getUsers();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
public boolean isEnabled() {
    return user.isVerificado();
}

    public String getEmail() {
        return user.getEmail();
    }

    public String getPlano() {
        return user.getPlano();
    }

    public Long getId() {
        return user.getId();
    }
}
