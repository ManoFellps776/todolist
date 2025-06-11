
package br.com.projetospring.projeto_spring.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "paciente")
public class Paciente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String nome;

    @NotBlank
    private String cpf;

    private LocalDate birthday;
    private String estadoCivil;
    private String profissao;
    private String escola;
    private String cep;
    private String estadoCep;
    private String cidade;
    private String bairro;
    private String rua;
    private String numeroRua;
    private String telefone;
    private String email;
    private String descricao;
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Users usuario;

    

    public Paciente() {}

    public Paciente(String nome, String cpf, LocalDate birthday, String estadoCivil, String profissao, String escola,
                    String cep, String estadoCep, String cidade, String bairro, String rua, String numeroRua,
                    String telefone, String email, String descricao) {
        this.nome = nome;
        this.cpf = cpf;
        this.birthday = birthday;
        this.estadoCivil = estadoCivil;
        this.profissao = profissao;
        this.escola = escola;
        this.cep = cep;
        this.estadoCep = estadoCep;
        this.cidade = cidade;
        this.bairro = bairro;
        this.rua = rua;
        this.numeroRua = numeroRua;
        this.telefone = telefone;
        this.email = email;
        this.descricao = descricao;
    }
    public Users getUsuario() {
        return usuario;
    }

    public void setUsuario(Users usuario) {
        this.usuario = usuario;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public String getEstadoCivil() {
        return estadoCivil;
    }

    public void setEstadoCivil(String estadoCivil) {
        this.estadoCivil = estadoCivil;
    }

    public String getProfissao() {
        return profissao;
    }

    public void setProfissao(String profissao) {
        this.profissao = profissao;
    }

    public String getEscola() {
        return escola;
    }

    public void setEscola(String escola) {
        this.escola = escola;
    }

    public String getCep() {
        return cep;
    }

    public void setCep(String cep) {
        this.cep = cep;
    }

    public String getEstadoCep() {
        return estadoCep;
    }

    public void setEstadoCep(String estadoCep) {
        this.estadoCep = estadoCep;
    }

    public String getCidade() {
        return cidade;
    }

    public void setCidade(String cidade) {
        this.cidade = cidade;
    }

    public String getBairro() {
        return bairro;
    }

    public void setBairro(String bairro) {
        this.bairro = bairro;
    }

    public String getRua() {
        return rua;
    }

    public void setRua(String rua) {
        this.rua = rua;
    }

    public String getNumeroRua() {
        return numeroRua;
    }

    public void setNumeroRua(String numeroRua) {
        this.numeroRua = numeroRua;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
}
