package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.DTO.AgendamentoDTO;
import br.com.projetospring.projeto_spring.DTO.AgendamentoResponseDTO;
import br.com.projetospring.projeto_spring.entity.Agendamento;
import br.com.projetospring.projeto_spring.entity.LixeiraPacienteCompleta;
import br.com.projetospring.projeto_spring.repository.AgendamentoRepository;
import br.com.projetospring.projeto_spring.repository.LixeiraPacienteCompletaRepository;
import br.com.projetospring.projeto_spring.security.UsersDetails;
import br.com.projetospring.projeto_spring.service.AgendamentoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/agendamentos")
@CrossOrigin("*")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @Autowired
    private AgendamentoRepository agendamentoRepository;
    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private LixeiraPacienteCompletaRepository lixeiraPacienteCompletaRepository;

    // 🔸 Criar novo agendamento
    @PostMapping
    public ResponseEntity<Void> criar(@RequestBody AgendamentoDTO dto,
            @AuthenticationPrincipal UsersDetails userDetails) {
        agendamentoService.criar(dto, userDetails.getId());
        return ResponseEntity.status(201).build(); // retorna apenas o status 201 (Created)
    }

    // 🔸 Atualizar agendamento existente
    @PutMapping("/{id}")
    public ResponseEntity<Void> atualizar(@PathVariable Long id,
            @RequestBody AgendamentoDTO dto,
            @AuthenticationPrincipal UsersDetails userDetails) {
        agendamentoService.atualizar(id, dto, userDetails.getId());
        return ResponseEntity.noContent().build(); // retorna status 204 (No Content)
    }

    // 🔸 Deletar agendamento por ID
   @DeleteMapping("/{id}")
public ResponseEntity<Void> deletar(@PathVariable Long id) {
    try {
        Agendamento agendamento = agendamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agendamento não encontrado"));

        // 🔹 Monta dados simples para evitar erros de serialização
        Map<String, Object> dadosAgendamento = new HashMap<>();
        dadosAgendamento.put("id", agendamento.getId());
        dadosAgendamento.put("descricao", agendamento.getDescricao());
        dadosAgendamento.put("data", agendamento.getData());
        dadosAgendamento.put("hora", agendamento.getHora());
        dadosAgendamento.put("cor", agendamento.getCor());

        if (agendamento.getPaciente() != null) {
            dadosAgendamento.put("pacienteId", agendamento.getPaciente().getId());
            dadosAgendamento.put("pacienteNome", agendamento.getPaciente().getNome());
        }

        String dadosAgendamentoJson = objectMapper.writeValueAsString(dadosAgendamento);

        // 🔹 Cria entrada na lixeira
        LixeiraPacienteCompleta lixo = new LixeiraPacienteCompleta();
        lixo.setAgendamentos(dadosAgendamentoJson);
        lixo.setPacienteOriginalId(agendamento.getPaciente() != null ? agendamento.getPaciente().getId() : null);
        lixo.setDadosPaciente(null);
        lixo.setAnamneses(null);
        lixo.setDataExclusao(LocalDateTime.now());

        lixeiraPacienteCompletaRepository.save(lixo);

        // 🔹 Deleta agendamento original
        agendamentoRepository.deleteById(id);

        return ResponseEntity.noContent().build();

    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(500).build();
    }
}


    // 🔸 Buscar agendamentos de um determinado mês (filtrando pelo usuário logado)
   @GetMapping("/mes/{anoMes}")
public ResponseEntity<List<AgendamentoResponseDTO>> listarPorMes(
        @PathVariable String anoMes,
        @AuthenticationPrincipal UsersDetails userDetails) {
    try {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
        YearMonth yearMonth = YearMonth.parse(anoMes, formatter);
        LocalDate inicio = yearMonth.atDay(1);
        LocalDate fim = yearMonth.atEndOfMonth();

        List<Agendamento> lista = agendamentoRepository.findByDataBetweenAndUsuario_Id(inicio, fim, userDetails.getId());

        List<AgendamentoResponseDTO> dtos = lista.stream().map(ag -> {
            AgendamentoResponseDTO dto = new AgendamentoResponseDTO();
            dto.setId(ag.getId());
            dto.setDescricao(ag.getDescricao());
            dto.setCor(ag.getCor());
            dto.setData(ag.getData());
            dto.setHora(ag.getHora());
            if (ag.getPaciente() != null) {
                dto.setPacienteId(ag.getPaciente().getId());
                dto.setPacienteNome(ag.getPaciente().getNome());
            }
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    } catch (DateTimeParseException e) {
        return ResponseEntity.badRequest().build();
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().build();
    }
}


    // 🔸 Buscar agendamentos por paciente
    @GetMapping("/paciente/{id}")
    public ResponseEntity<List<Agendamento>> listarPorPaciente(@PathVariable Long id) {
        List<Agendamento> lista = agendamentoRepository.findByPacienteId(id);
        return ResponseEntity.ok(lista);
    }
}
