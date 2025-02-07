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
    List<Todo> update(@RequestBody @Valid Todo todo){
        return todoService.update(todo);
 
    }
    @DeleteMapping("/{id}")
    public ResponseEntity <Void> delete(@PathVariable Long id){
        this.todoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    
}
