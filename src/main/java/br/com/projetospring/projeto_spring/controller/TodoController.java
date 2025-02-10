package br.com.projetospring.projeto_spring.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.projetospring.projeto_spring.entity.Todo;
import br.com.projetospring.projeto_spring.service.TodoService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/todos")
@Validated
public class TodoController {
    @Autowired
    private TodoService todoService;

    
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }
    @PostMapping
    List<Todo> create(@RequestBody @Valid Todo todo){
        return todoService.create(todo);
    }
    @GetMapping("/{id}")
    List<Todo> list(){
        return todoService.list();
    }
    @PutMapping ("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo todo) {
    Todo updatedTodo = todoService.updateTodo(id, todo); // ✅ Certifique-se de passar ID e Todo
    return ResponseEntity.ok(updatedTodo);
}
    @DeleteMapping("/{id}")
    List<Todo> delete(@PathVariable("id") Long id){
        return todoService.delete(id);
    }

    
}
