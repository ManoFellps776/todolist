// Diminuir tabela Ativar/ Desativar
function minTable() {
    const table = document.getElementById('form-Table');
    const botao = document.getElementById('botaoToggleTabela');

    const visivel = window.getComputedStyle(table).display !== 'none';

    if (visivel) {
        table.style.display = 'none';
        botao.textContent = 'Mostrar Tabela';
    } else {
        table.style.display = 'block';
        botao.textContent = 'Diminui Tabela';
    }
}

// Voltar ao inicio desconectando do admin
function voltarInicio() {

    sessionStorage.setItem("voltarInicio", "true");
    const confirmarSaida = confirm("Você tem certeza que deseja sair do admin e voltar para o início?");

    if (confirmarSaida) {
        window.location.href = "index.html";
        sessionStorage.setItem("voltarInicio", "true");
    } else {
        // Se clicar em "Cancelar", não faz nada
        return;
    }
}
// Desconectar do admin e voltar para tela inicial
function voltarCadastro() {

    sessionStorage.setItem("abrirCadastro", "true");
    const confirmarSaida = confirm("Você tem certeza que deseja sair do login e voltar para o cadastro?");

    if (confirmarSaida) {
        window.location.href = "index.html";
        sessionStorage.setItem("abrirCadastro", "true");
    } else {
        // Se clicar em "Cancelar", não faz nada
        return;
    }

}

//Salvar na tabela Agenda
const API_URL = 'http://localhost:8080/todos';
const form = document.getElementById('task-form');
const nome = document.getElementById('nome');
const descricao = document.getElementById('descricao');
const prioridade = document.getElementById('prioridade');
const data = document.getElementById('data');
const valor = document.getElementById('valor');
const juros = document.getElementById('juros');
const realizado = document.getElementById('realizado');
const tableBody = document.getElementById('task-table-body');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const tarefa = {
        nome: nome.value,
        descricao: descricao.value,
        prioridade: parseInt(prioridade.value),
        data: data.value,
        valor: parseFloat(valor.value),
        juros: parseFloat(juros.value),
        realizado: realizado.checked
    };

    const mensagem = document.getElementById('mensagem-status');

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarefa)
        });

        if (res.ok) {
            mensagem.textContent = '✅ Tarefa foi salva com sucesso!';
            mensagem.style.color = 'green';
            form.reset();
            loadTasks();
        } else {
            mensagem.textContent = '❌ Erro ao adicionar tarefa.';
            mensagem.style.color = 'red';
        }
    } catch (error) {
        mensagem.textContent = '❌ Erro de conexão com o servidor.';
        mensagem.style.color = 'red';
    }

    // 🕒 Remove a mensagem após 3 segundos
    setTimeout(() => {
        mensagem.textContent = '';
    }, 3000);
});

//Puxa a tabela do banco de dados e mostra na tela

    async function loadTasks() {
      const res = await fetch(API_URL);
      const tarefas = await res.json();
      tableBody.innerHTML = '';
      tarefas.forEach(todo => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${todo.nome}</td>
          <td>${todo.descricao}</td>
          <td>${todo.prioridade}</td>
          <td>${todo.data || '-'}</td>
          <td>R$ ${todo.valor != null ? todo.valor.toFixed(2) : '0.00'}</td>
          <td>R$ ${todo.juros != null ? todo.juros.toFixed(2) : '0.00'}</td>
         <td>${todo.realizado === true || todo.realizado === 'true' ? '✅' : '❌'}</td>
          <td class="actions">
            <button class="edit" onclick="editTask(${todo.id}, '${todo.nome}', '${todo.descricao}', ${todo.prioridade}, '${todo.data}', ${todo.valor},${todo.juros}, ${todo.realizado})">Editar</button>
            <button class="delete" onclick="deleteTask(${todo.id})">Excluir</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }

//Deleta da tabela

    async function deleteTask(id) {
      if (confirm('Excluir esta tarefa?')) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadTasks();
      }
    }

//Editar algo na tabela do banco de dados

    async function editTask(id, nomeAtual, descricaoAtual, prioridadeAtual, dataAtual, valorAtual,jurosAtual, realizadoAtual) {
      const novoNome = prompt('Editar nome:', nomeAtual);
      const novaDescricao = prompt('Editar descrição:', descricaoAtual);
      const novaPrioridade = prompt('Editar prioridade:', prioridadeAtual);
      const novaData = prompt('Editar data (YYYY-MM-DD):', dataAtual);
      const novoValor = prompt('Editar valor (R$):', valorAtual);
      const novoJuros = prompt('Editar juros (R$):', jurosAtual);
      const novoRealizado = confirm('Marcar como realizado?');

      const tarefaAtualizada = {
        nome: novoNome,
        descricao: novaDescricao,
        prioridade: parseInt(novaPrioridade),
        data: novaData,
        valor: parseFloat(novoValor),
        juros: parseFloat(novoJuros),
        realizado: novoRealizado
      };

      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tarefaAtualizada)
      });

      loadTasks();
    }

    loadTasks();