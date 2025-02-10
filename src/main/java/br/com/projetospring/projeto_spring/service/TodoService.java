package br.com.projetospring.projeto_spring.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import br.com.projetospring.projeto_spring.entity.Todo;
import br.com.projetospring.projeto_spring.repository.TodoRepository;
import jakarta.transaction.Transactional;

@Service
public class TodoService {
    @Autowired
private TodoRepository todoRepository;

  
public TodoService(TodoRepository todoRepository) {

    this.todoRepository = todoRepository;
}
@Transactional
public List<Todo> create(Todo todo){
    todoRepository.save(todo);
    return list();

}
@Transactional
public List<Todo> list(){
    Sort sort = Sort.by("prioridade").descending().and(
        Sort.by("nome").ascending());
    return todoRepository.findAll(sort);

}
@Transactional
public Todo updateTodo(Long id, Todo todo) {
    return todoRepository.findById(id)
            .map(existingTodo -> {
                existingTodo.setNome(todo.getNome());
                existingTodo.setDescricao(todo.getDescricao());
                existingTodo.setPrioridade(todo.getPrioridade());
                existingTodo.setRealizado(false);
                return todoRepository.save(existingTodo);
            })
            .orElseThrow(() -> new RuntimeException("Todo não encontrado!"));
}

@Transactional
public List<Todo> delete(Long id){
    todoRepository.deleteById(id);
    return list();
}
    
}
