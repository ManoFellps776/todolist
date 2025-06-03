
package br.com.projetospring.projeto_spring.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "anamneseProntas")
public class AnamnesePronta {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomeA;
    private String cpfA;
    private String nascimentoA;
    private String telefoneA;
    private String emailA;
    private String enderecoA;
    private String cidadeA;
    private String sexo;

    private String altura;
    private String pesoAtual;
    private String pesoIdeal;

    private boolean agua;
    private boolean sono;
    private boolean atividade;
    private boolean etilismo;
    private boolean intestino;
    private boolean gestante;
    private boolean cirurgias;
    private boolean diabetes;

    @Column(columnDefinition = "TEXT")
    private String obs;
}
