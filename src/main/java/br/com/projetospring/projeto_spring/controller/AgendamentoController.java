package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Agendamento;
import br.com.projetospring.projeto_spring.entity.AgendamentoDTO;
import br.com.projetospring.projeto_spring.service.AgendamentoService;
import br.com.projetospring.projeto_spring.repository.AgendamentoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/agendamentos")
@CrossOrigin("*")
public class AgendamentoController {

    @Autowired
    private AgendamentoService agendamentoService;

    @Autowired
    private AgendamentoRepository agendamentoRepository;

    @PostMapping
    public ResponseEntity<Agendamento> criar(@RequestBody AgendamentoDTO dto) {
        return ResponseEntity.ok(agendamentoService.criar(dto));
    }

    @PutMapping("/{id}")
public ResponseEntity<Agendamento> atualizar(@PathVariable Long id, @RequestBody AgendamentoDTO dto) {
    return ResponseEntity.ok(agendamentoService.atualizar(id, dto));
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        agendamentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/mes/{anoMes}")
    public ResponseEntity<List<Agendamento>> listarPorMes(@PathVariable String anoMes) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
            YearMonth yearMonth = YearMonth.parse(anoMes, formatter);
            LocalDate inicio = yearMonth.atDay(1);
            LocalDate fim = yearMonth.atEndOfMonth();
            return ResponseEntity.ok(agendamentoRepository.findByDataBetween(inicio, fim));
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/paciente/{id}")
public ResponseEntity<List<Agendamento>> listarPorPaciente(@PathVariable Long id) {
    List<Agendamento> lista = agendamentoRepository.findByPacienteId(id);
    return ResponseEntity.ok(lista);
}
}
