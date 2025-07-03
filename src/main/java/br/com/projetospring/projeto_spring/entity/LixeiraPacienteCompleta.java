package br.com.projetospring.projeto_spring.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lixeira_paciente_completa")
public class LixeiraPacienteCompleta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long pacienteOriginalId;
    private String dadosPaciente;     // JSON com dados do paciente
    private String anamneses;         // JSON com todas anamneses
    private String agendamentos;      // JSON com todos agendamentos

    private LocalDateTime dataExclusao;

    public LixeiraPacienteCompleta() {}

    public LixeiraPacienteCompleta(String dadosPaciente, String anamneses, String agendamentos, Long pacienteOriginalId) {
        this.pacienteOriginalId = pacienteOriginalId;
        this.dadosPaciente = dadosPaciente;
        this.anamneses = anamneses;
        this.agendamentos = agendamentos;
        this.dataExclusao = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPacienteOriginalId() {
        return pacienteOriginalId;
    }

    public void setPacienteOriginalId(Long pacienteOriginalId) {
        this.pacienteOriginalId = pacienteOriginalId;
    }

    public String getDadosPaciente() {
        return dadosPaciente;
    }

    public void setDadosPaciente(String dadosPaciente) {
        this.dadosPaciente = dadosPaciente;
    }

    public String getAnamneses() {
        return anamneses;
    }

    public void setAnamneses(String anamneses) {
        this.anamneses = anamneses;
    }

    public String getAgendamentos() {
        return agendamentos;
    }

    public void setAgendamentos(String agendamentos) {
        this.agendamentos = agendamentos;
    }

    public LocalDateTime getDataExclusao() {
        return dataExclusao;
    }

    public void setDataExclusao(LocalDateTime dataExclusao) {
        this.dataExclusao = dataExclusao;
    }

    // getters e setters omitidos por brevidade
}
