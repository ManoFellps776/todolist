package br.com.projetospring.projeto_spring.service;

import br.com.projetospring.projeto_spring.entity.Paciente;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.PacienteRepository;
import br.com.projetospring.projeto_spring.repository.UsersRepository;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;

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
    public Paciente update(Long id, Paciente pacienteAtualizado, Long usuarioId) {
        Users usuario = usersRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado com ID: " + usuarioId));

        Paciente existente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + id));

        if (!existente.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Você não tem permissão para editar este paciente.");
        }

        existente.setUsuario(usuario);
        existente.setNome(pacienteAtualizado.getNome());
        existente.setCpf(pacienteAtualizado.getCpf());
        existente.setBirthday(pacienteAtualizado.getBirthday());
        existente.setEstadoCivil(pacienteAtualizado.getEstadoCivil());
        existente.setProfissao(pacienteAtualizado.getProfissao());
        existente.setEscola(pacienteAtualizado.getEscola());
        existente.setCep(pacienteAtualizado.getCep());
        existente.setEstadoCep(pacienteAtualizado.getEstadoCep());
        existente.setCidade(pacienteAtualizado.getCidade());
        existente.setBairro(pacienteAtualizado.getBairro());
        existente.setRua(pacienteAtualizado.getRua());
        existente.setNumeroRua(pacienteAtualizado.getNumeroRua());
        existente.setTelefone(pacienteAtualizado.getTelefone());
        existente.setEmail(pacienteAtualizado.getEmail());
        existente.setDescricao(pacienteAtualizado.getDescricao());

        return pacienteRepository.save(existente);
    }

    @Transactional
    public List<Paciente> delete(Long id, Long usuarioId) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado com ID: " + id));

        if (!paciente.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Você não tem permissão para excluir este paciente.");
        }

        pacienteRepository.deleteById(id);
        return listByUsuario(usuarioId);
    }
}
