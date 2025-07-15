package br.com.projetospring.projeto_spring.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "users") // Evita conflito com "users"
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    @NotBlank
    private String users;

    @NotBlank
    private String senha;

    @Column(unique = true)
    @NotBlank
    private String email;

    private String plano;

    // ✅ Novo campo: se o e-mail já foi verificado
    @Column(nullable = false)
    private boolean verificado = false;
    @Column(name = "ativo")
    private boolean ativo = false;



    // ✅ Novo campo: token de verificação
    @Column(name = "token_verificacao", length = 100)
    private String tokenVerificacao;

    public Users() {}

    public Users(String users, String senha, String email, String plano) {
        this.users = users;
        this.senha = senha;
        this.email = email;
        this.plano = plano;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsers() {
        return users;
    }

    public void setUsers(String users) {
        this.users = users;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPlano() {
        return plano;
    }

    public void setPlano(String plano) {
        this.plano = plano;
    }

    public boolean isVerificado() {
        return verificado;
    }

    public void setVerificado(boolean verificado) {
        this.verificado = verificado;
    }

    public String getTokenVerificacao() {
        return tokenVerificacao;
    }

    public void setTokenVerificacao(String tokenVerificacao) {
        this.tokenVerificacao = tokenVerificacao;
    }
    public boolean isAtivo() {
    return ativo;
}

public void setAtivo(boolean ativo) {
    this.ativo = ativo;
}
}
