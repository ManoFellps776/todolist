package br.com.projetospring.projeto_spring.service;

import br.com.projetospring.projeto_spring.entity.Paciente;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.PacienteRepository;
import br.com.projetospring.projeto_spring.repository.UsersRepository;

import org.springframework.beans.factory.annotation.Autowired;
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
    @Autowired
    private UsersRepository usersRepository;


    @Transactional
public Paciente create(Paciente paciente, Long usuarioId) {
    Users usuario = usersRepository.findById(usuarioId)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + usuarioId));
    paciente.setUsuario(usuario);
    return pacienteRepository.save(paciente);
}


    @Transactional
public List<Paciente> listByUsuario(Long usuarioId) {
    return pacienteRepository.findByUsuarioIdOrderByNomeAsc(usuarioId);
}

    @Transactional
    public Paciente buscarPorId(Long id) {
        return pacienteRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + id));
    }

   @Transactional
public Paciente update(Long id, Paciente paciente, Long usuarioId) {
    Users usuario = usersRepository.findById(usuarioId)
        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

    return pacienteRepository.findById(id)
        .map(p -> {
            p.setUsuario(usuario);
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
public List<Paciente> delete(Long id, Long usuarioId) {
    Paciente paciente = pacienteRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + id));

    // Validação de segurança se quiser:
    if (!paciente.getUsuario().getId().equals(usuarioId)) {
        throw new RuntimeException("Paciente não pertence a este usuário.");
    }

    pacienteRepository.deleteById(id);
    return listByUsuario(usuarioId);
}
}
