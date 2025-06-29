package br.com.projetospring.projeto_spring.controller;

import br.com.projetospring.projeto_spring.entity.Agendamento;
import br.com.projetospring.projeto_spring.entity.AgendamentoDTO;
import br.com.projetospring.projeto_spring.repository.AgendamentoRepository;
import br.com.projetospring.projeto_spring.security.UsersDetails;
import br.com.projetospring.projeto_spring.service.AgendamentoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    // 🔸 Criar novo agendamento
    @PostMapping
public ResponseEntity<Agendamento> criar(@RequestBody AgendamentoDTO dto,
                                         @AuthenticationPrincipal UsersDetails userDetails) {
    return ResponseEntity.ok(agendamentoService.criar(dto, userDetails.getId()));
}

    // 🔸 Atualizar agendamento existente
    @PutMapping("/{id}")
public ResponseEntity<Agendamento> atualizar(@PathVariable Long id,
                                             @RequestBody AgendamentoDTO dto,
                                             @AuthenticationPrincipal UsersDetails userDetails) {
    return ResponseEntity.ok(agendamentoService.atualizar(id, dto, userDetails.getId()));
}

    // 🔸 Deletar agendamento por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        agendamentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // 🔸 Buscar agendamentos de um determinado mês (filtrando pelo usuário logado)
    @GetMapping("/mes/{anoMes}")
    public ResponseEntity<List<Agendamento>> listarPorMes(
            @PathVariable String anoMes,
            @AuthenticationPrincipal UsersDetails userDetails
    ) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");
            YearMonth yearMonth = YearMonth.parse(anoMes, formatter);
            LocalDate inicio = yearMonth.atDay(1);
            LocalDate fim = yearMonth.atEndOfMonth();

            List<Agendamento> lista = agendamentoRepository
                    .findByDataBetweenAndUsuario_Id(inicio, fim, userDetails.getId());

            return ResponseEntity.ok(lista);
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
