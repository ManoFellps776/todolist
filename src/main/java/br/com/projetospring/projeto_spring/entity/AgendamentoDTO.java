package br.com.projetospring.projeto_spring.entity;

import java.time.LocalDate;
import java.time.LocalTime;

public class AgendamentoDTO {
    private Long pacienteId;
    private Long usuarioId;
    private LocalDate data;
    private LocalTime hora;
    private String descricao;
    private String cor;

    // Getters e setters
    public Long getPacienteId() { return pacienteId; }
    public void setPacienteId(Long pacienteId) { this.pacienteId = pacienteId; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }

    public LocalTime getHora() { return hora; }
    public void setHora(LocalTime hora) { this.hora = hora; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getCor() { return cor; }
    public void setCor(String cor) { this.cor = cor; }
}
