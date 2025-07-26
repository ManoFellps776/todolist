package br.com.projetospring.projeto_spring.DTO;

public class DadosDTO {

    private String cpfCnpj;
    private String telefone;
    private String dataNascimento;
    private Long usuarioId;

    // 🔹 Construtor padrão (necessário para serialização)
    public DadosDTO() {}

    // 🔹 Construtor com argumentos
    public DadosDTO(String cpfCnpj, String telefone, String dataNascimento, Long usuarioId) {
        this.cpfCnpj = cpfCnpj;
        this.telefone = telefone;
        this.dataNascimento = dataNascimento;
        this.usuarioId = usuarioId;
    }

    // 🔹 Getters e Setters
    public String getCpfCnpj() {
        return cpfCnpj;
    }

    public void setCpfCnpj(String cpfCnpj) {
        this.cpfCnpj = cpfCnpj;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getDataNascimento() {
        return dataNascimento;
    }

    public void setDataNascimento(String dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }
}
