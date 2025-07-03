package br.com.projetospring.projeto_spring.repository;

import br.com.projetospring.projeto_spring.entity.AnamnesePronta;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AnamneseProntaRepository extends JpaRepository<AnamnesePronta, Long> {
    List<AnamnesePronta> findByCpfA(String cpfA);
    List<AnamnesePronta> findByCpfAAndUsuario_Id(String cpfLimpo, Long usuarioId);

    // 🔥 Novo método para deletar paciente corretamente
    List<AnamnesePronta> findByPacienteId(Long pacienteId);
}
