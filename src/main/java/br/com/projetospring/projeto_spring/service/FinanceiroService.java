package br.com.projetospring.projeto_spring.service;

import br.com.projetospring.projeto_spring.entity.Financeiro;
import br.com.projetospring.projeto_spring.entity.Users;
import br.com.projetospring.projeto_spring.repository.FinanceiroRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FinanceiroService {

    @Autowired
    private FinanceiroRepository financeiroRepository;

    public Financeiro criar(Financeiro f, Users usuario) {
        f.setUsuario(usuario);
        return financeiroRepository.save(f);
    }

    public List<Financeiro> listarPorUsuario(Users usuario) {
        return financeiroRepository.findByUsuario(usuario);
    }

    public void deletar(Long id, Users usuario) {
        Financeiro f = financeiroRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));
        financeiroRepository.delete(f);
    }

    public Map<String, BigDecimal> calcularResumoMensal(Users usuario) {
    LocalDate primeiroDia = LocalDate.now().withDayOfMonth(1);
    LocalDate ultimoDia = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());

    List<Financeiro> registros = financeiroRepository.findByUsuarioAndDataBetween(usuario, primeiroDia, ultimoDia);

    BigDecimal receitas = registros.stream()
            .filter(f -> f.getTipo().equalsIgnoreCase("receita"))
            .map(Financeiro::getValor)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal despesas = registros.stream()
            .filter(f -> f.getTipo().equalsIgnoreCase("despesa"))
            .map(Financeiro::getValor)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    BigDecimal saldo = receitas.subtract(despesas);

    Map<String, BigDecimal> resumo = new HashMap<>();
    resumo.put("saldo", saldo);
    resumo.put("receitas", receitas);
    resumo.put("despesas", despesas);
    return resumo;
}

}
