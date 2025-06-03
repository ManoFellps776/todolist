//Calendario
const calendar = document.getElementById('calendar');
const monthYearLabel = document.getElementById('monthYearLabel');
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');

let currentDate = new Date();
let selectedDate = null;
let tasks = {};

function populateYearSelect() {
  for (let y = 2010; y <= 2099; y++) {
    const option = document.createElement('option');
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }
}

function generateCalendar(date) {
  document.querySelector('.calendar-container').style.display = 'block';
  document.getElementById('agendamentoContainer').style.display = 'none';

  const year = date.getFullYear();
  const month = date.getMonth();
  monthSelect.value = month;
  yearSelect.value = year;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  calendar.innerHTML = "";

  const hoje = new Date();
  const diaHoje = hoje.getDate();
  const mesHoje = hoje.getMonth();
  const anoHoje = hoje.getFullYear();

  const label = (mesHoje === month && anoHoje === year)
    ? `Hoje é: ${('0' + diaHoje).slice(-2)}/${('0' + (month + 1)).slice(-2)}/${year}`
    : `${('0' + (month + 1)).slice(-2)}/${year}`;

  monthYearLabel.textContent = label;

  carregarAgendamentosDoMes(`${year}-${String(month + 1).padStart(2, '0')}`)
    .then(() => {
      for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'day';
        calendar.appendChild(empty);
      }

      for (let d = 1; d <= lastDate; d++) {
        const dayEl = document.createElement('div');
        const isToday = year === hoje.getFullYear() && month === hoje.getMonth() && d === hoje.getDate();
        dayEl.className = isToday ? 'day today' : 'day';
        dayEl.innerHTML = `<div class="date">${d}</div>`;

        const key = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
        if (tasks[key]) {
          const scrollContainer = document.createElement('div');
          scrollContainer.className = 'task-scroll';

          tasks[key].sort((a, b) => a.hora.localeCompare(b.hora)).forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = 'task-item ' + (task.cor || 'verde');
            const horaFormatada = task.hora?.substring(0, 5) || "00:00";
            const nomePaciente = task.paciente?.nome?.split(" ")[0] || "Paciente";
            taskEl.textContent = `${horaFormatada} ➔ ${nomePaciente} `;
            scrollContainer.appendChild(taskEl);
          });

          dayEl.appendChild(scrollContainer);
        }

        dayEl.onclick = () => {
          selectedDate = key;
          showDayView();
        };

        calendar.appendChild(dayEl);
      }
    })
    .catch(error => {
      console.error('Erro ao carregar agendamentos:', error);
      alert('Erro ao carregar agendamentos');
    });
}

async function carregarAgendamentosDoMes(anoMes) {
  try {
    const res = await fetch(`http://localhost:8080/agendamentos/mes/${anoMes}`);
    if (!res.ok) throw new Error('Erro ao carregar agendamentos');
    const agendamentos = await res.json();
    tasks = {};
    agendamentos.forEach(item => {
      const key = item.data;
      if (!tasks[key]) tasks[key] = [];
      tasks[key].push(item);
    });
  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    throw err;
  }
}

function showDayView() {
  document.querySelector('.calendar-container').style.display = 'none';
  const container = document.getElementById('agendamentoContainer');
  container.style.display = 'block';
  container.innerHTML = "";

  const view = document.createElement('div');
  view.className = 'day-view';

  const [year, month, day] = selectedDate.split("-");
  const titulo = document.createElement('h2');
  titulo.textContent = `Tarefas de ${day}/${month}/${year}`;
  view.appendChild(titulo);

  const lista = document.createElement('div');
  lista.className = 'task-list';
  if (tasks[selectedDate]) {
    tasks[selectedDate].sort((a, b) => a.hora.localeCompare(b.hora)).forEach(t => {
      const item = document.createElement('div');
      item.className = 'task-item ' + (t.cor || 'verde');
      const horaFormatada = t.hora?.substring(0, 5) || "00:00";
      const nomePaciente = t.paciente?.nome?.split(' ')[0] || "Paciente";

      const texto = document.createElement('span');
      texto.innerHTML = `<strong>${horaFormatada}</strong> - (${nomePaciente}) ➔ ${t.descricao}`;

      const actionsDiv = document.createElement('div');
actionsDiv.className = 'task-actions';

const btnEditar = document.createElement('button');
btnEditar.textContent = 'Editar';
btnEditar.className = 'btn-editar';
btnEditar.onclick = () => editarAgendamento(t);

const btnDeletar = document.createElement('button');
btnDeletar.textContent = 'Deletar';
btnDeletar.className = 'btn-deletar';
btnDeletar.onclick = () => deletarAgendamento(t.id);

actionsDiv.appendChild(btnEditar);
actionsDiv.appendChild(btnDeletar);

item.appendChild(texto);
item.appendChild(actionsDiv);

      lista.appendChild(item);
    });
  }
  view.appendChild(lista);

  const form = document.createElement('div');
form.className = 'add-task-form';
form.innerHTML = `
  <div class="form-group">
    <label for="pacienteSelect">Paciente:</label>
    <select id="pacienteSelect">
      <option value="">Selecione o paciente</option>
    </select>
  </div>

  <div class="form-group">
    <label for="taskTime">Hora:</label>
    <input type="time" id="taskTime">
  </div>

  <div class="form-group">
    <label for="taskDesc">Descrição:</label>
    <textarea id="taskDesc" placeholder="Descrição detalhada"></textarea>
  </div>

  <div class="form-group">
    <label for="taskColor">Cor:</label>
    <select id="taskColor">
      <option value="verde">Verde</option>
      <option value="amarelo">Amarelo</option>
      <option value="vermelho">Vermelho</option>
    </select>
  </div>

  <div class="form-buttons">
    <button class="save-btn" onclick="saveTask()">Salvar</button>
    <button class="back-btn" onclick="generateCalendar(currentDate)">Voltar</button>
  </div>
`;

  view.appendChild(form);
  container.appendChild(view);

  fetch('http://localhost:8080/pacientes')
    .then(res => res.json())
    .then(pacientes => {
      const select = document.getElementById('pacienteSelect');
      pacientes.sort((a, b) => a.nome.localeCompare(b.nome));
      pacientes.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nome;
        select.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Erro ao carregar pacientes:', err);
      alert('Erro ao carregar pacientes');
    });
}

function saveTask() {
  const pacienteId = document.getElementById('pacienteSelect').value;
  const time = document.getElementById('taskTime').value;
  const desc = document.getElementById('taskDesc').value;
  const color = document.getElementById('taskColor').value;
  const data = selectedDate;

  if (!pacienteId || !time || !desc || !data) {
    alert('Preencha todos os campos antes de salvar.');
    return;
  }

  const agendamento = {
    pacienteId: Number(pacienteId),
    hora: time,
    descricao: desc,
    cor: color,
    data: data
  };

  fetch('http://localhost:8080/agendamentos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(agendamento)
  })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao salvar agendamento');
      return res.json();
    })
    .then(() => {
  carregarAgendamentosDoMes(selectedDate.slice(0, 7))  // Recarrega os dados do mês atual
    .then(() => showDayView());                         // Atualiza a tela após carregar
})
    .catch(err => {
      console.error(err);
      alert('Erro ao salvar agendamento');
    });
}

function editarAgendamento(agendamento) {
  document.getElementById('pacienteSelect').value = agendamento.paciente.id;
  document.getElementById('taskTime').value = agendamento.hora;
  document.getElementById('taskDesc').value = agendamento.descricao;
  document.getElementById('taskColor').value = agendamento.cor;

  const salvarBtn = document.querySelector('.save-btn');
  salvarBtn.textContent = "Atualizar";
  salvarBtn.onclick = () => atualizarAgendamento(agendamento.id);
}

function atualizarAgendamento(id) {
  const pacienteId = document.getElementById('pacienteSelect').value;
  const time = document.getElementById('taskTime').value;
  const desc = document.getElementById('taskDesc').value;
  const color = document.getElementById('taskColor').value;
  const data = selectedDate;

  if (!pacienteId || !time || !desc || !data) {
    alert('Preencha todos os campos antes de atualizar.');
    return;
  }

  const agendamentoAtualizado = {
    pacienteId: Number(pacienteId),
    hora: time,
    descricao: desc,
    cor: color,
    data: data
  };

  fetch(`http://localhost:8080/agendamentos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agendamentoAtualizado)
  })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao atualizar agendamento');
      return res.json();
    })
    .then(() => {
  carregarAgendamentosDoMes(selectedDate.slice(0, 7))  // Atualiza os dados
    .then(() => showDayView());                        // Reexibe a tela
})
    .catch(err => {
      console.error(err);
      alert('Erro ao atualizar agendamento');
    });
}

function deletarAgendamento(id) {
  if (!confirm("Deseja realmente excluir este agendamento?")) return;

  fetch(`http://localhost:8080/agendamentos/${id}`, {
    method: 'DELETE'
  })
    

    .then(() => {
  carregarAgendamentosDoMes(selectedDate.slice(0, 7))
    .then(() => showDayView());
})
    .catch(err => {
      console.error(err);
      alert("Erro ao deletar agendamento.");
    });
    
}
function changeMonth(offset) {
  currentDate.setMonth(currentDate.getMonth() + offset);
  generateCalendar(currentDate);
}

function selectMonthYear() {
  const newMonth = parseInt(monthSelect.value);
  const newYear = parseInt(yearSelect.value);
  currentDate.setMonth(newMonth);
  currentDate.setFullYear(newYear);
  generateCalendar(currentDate);
}

populateYearSelect();
generateCalendar(currentDate);
