package br.com.projetospring.projeto_spring.service;

import br.com.projetospring.projeto_spring.entity.Servico;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.ServicoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ServicoService {

    @Autowired
    private ServicoRepository servicoRepository;

    public Servico create(Servico servico, Users usuario) {
        servico.setUsuario(usuario);
        return servicoRepository.save(servico);
    }

    public List<Servico> listByUsuario(Users usuario) {
        return servicoRepository.findByUsuario(usuario);
    }

    public void delete(Long id, Users usuario) {
        Servico servico = servicoRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new RuntimeException("Serviço não encontrado ou acesso negado"));
        servicoRepository.delete(servico);
    }
}
