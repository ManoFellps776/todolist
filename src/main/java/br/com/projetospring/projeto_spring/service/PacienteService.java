package br.com.projetospring.projeto_spring.service;

import br.com.projetospring.projeto_spring.entity.Paciente;
import br.com.projetospring.projeto_spring.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import java.util.List;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    @Autowired
    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    @Transactional
    public Paciente create(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    @Transactional
    public List<Paciente> list() {
        return pacienteRepository.findAll(Sort.by("nome").ascending());
    }

    @Transactional
    public Paciente buscarPorId(Long id) {
        return pacienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + id));
    }

    @Transactional
    public Paciente update(Long id, Paciente paciente) {
        return pacienteRepository.findById(id)
                .map(p -> {
                    p.setNome(paciente.getNome());
                    p.setCpf(paciente.getCpf());
                    p.setBirthday(paciente.getBirthday());
                    p.setEstadoCivil(paciente.getEstadoCivil());
                    p.setProfissao(paciente.getProfissao());
                    p.setEscola(paciente.getEscola());
                    p.setCep(paciente.getCep());
                    p.setEstadoCep(paciente.getEstadoCep());
                    p.setCidade(paciente.getCidade());
                    p.setBairro(paciente.getBairro());
                    p.setRua(paciente.getRua());
                    p.setNumeroRua(paciente.getNumeroRua());
                    p.setTelefone(paciente.getTelefone());
                    p.setEmail(paciente.getEmail());
                    p.setDescricao(paciente.getDescricao());
                    return pacienteRepository.save(p);
                })
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + id));
    }

    @Transactional
    public List<Paciente> delete(Long id) {
        pacienteRepository.deleteById(id);
        return list();
    }
}
