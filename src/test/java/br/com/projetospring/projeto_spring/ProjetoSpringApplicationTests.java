package br.com.projetospring.projeto_spring;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.web.reactive.server.WebTestClient;

import br.com.projetospring.projeto_spring.entity.Todo;

@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class ProjetoSpringApplication {

    @Autowired
    private WebTestClient webTestClient;

    @SuppressWarnings("null")
    @Test
    void testCreateTodoSuccess() {
        var todo = new Todo("todo 1", "desc todo 1", false, BigDecimal.valueOf(15.23), 1, LocalDate.now(), BigDecimal.valueOf(3.80));

        webTestClient
                .post()
                .uri("/todos")
                .bodyValue(todo)
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(Todo.class)
                .consumeWith(result -> {
                    var list = result.getResponseBody();
                    assert list != null;
                    assert list.stream().anyMatch(t -> t.getNome().equals("todo 1"));
                });
    }

    @Test
    void testCreateTodoFailure() {
        var todo = new Todo("", "", false, BigDecimal.ZERO, 0, null, BigDecimal.ZERO);

        webTestClient
                .post()
                .uri("/todos")
                .bodyValue(todo)
                .exchange()
                .expectStatus().isBadRequest();
    }

    @SuppressWarnings("null")
    @Test
    void testUpdateTodo() {
        var todo = new Todo("original", "descricao", false, BigDecimal.valueOf(10), 1, LocalDate.now(), BigDecimal.valueOf(2));

        var response = webTestClient
                .post()
                .uri("/todos")
                .bodyValue(todo)
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(Todo.class)
                .returnResult()
                .getResponseBody();

        assert response != null;
        assert !response.isEmpty();

        var created = response.get(0);
        created.setNome("atualizado");
        created.setDescricao("desc atualizada");
        created.setValor(BigDecimal.valueOf(99));
        created.setJuros(BigDecimal.valueOf(24.75));

        webTestClient
                .put()
                .uri("/todos/" + created.getId())
                .bodyValue(created)
                .exchange()
                .expectStatus().isOk()
                .expectBody()
                .jsonPath("$.nome").isEqualTo("atualizado")
                .jsonPath("$.descricao").isEqualTo("desc atualizada")
                .jsonPath("$.valor").isEqualTo(99.0)
                .jsonPath("$.juros").isEqualTo(24.75);
    }

    @SuppressWarnings("null")
    @Test
    void testDeleteTodo() {
        var todo = new Todo("para deletar", "descricao", false, BigDecimal.valueOf(5), 1, LocalDate.now(), BigDecimal.valueOf(1.25));

        var response = webTestClient
                .post()
                .uri("/todos")
                .bodyValue(todo)
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(Todo.class)
                .returnResult()
                .getResponseBody();

        assert response != null;
        assert !response.isEmpty();

        var created = response.get(0);

        webTestClient
                .delete()
                .uri("/todos/" + created.getId())
                .exchange()
                .expectStatus().isOk()
                .expectBodyList(Todo.class)
                .consumeWith(result -> {
                    var list = result.getResponseBody();
                    assert list != null;
                    assert list.stream().noneMatch(t -> t.getId().equals(created.getId()));
                });
    }
}
