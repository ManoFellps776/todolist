
package br.com.projetospring.projeto_spring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import br.com.projetospring.projeto_spring.entity.Todo;
import br.com.projetospring.projeto_spring.service.TodoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/todos")
@Validated
@CrossOrigin("*")
public class TodoController {

    @Autowired
    private TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @PostMapping
    public ResponseEntity<List<Todo>> create(@RequestBody @Valid Todo todo) {
        List<Todo> lista = todoService.create(todo);
        return ResponseEntity.ok(lista);
    }

    @GetMapping
    public ResponseEntity<List<Todo>> list() {
        return ResponseEntity.ok(todoService.list());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
        Todo updatedTodo = todoService.updateTodo(id, todo);
        return ResponseEntity.ok(updatedTodo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<List<Todo>> delete(@PathVariable Long id) {
        return ResponseEntity.ok(todoService.delete(id));
    }
}


