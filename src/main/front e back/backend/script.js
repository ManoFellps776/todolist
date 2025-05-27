//Mostrar Menu
function mostrar(id) {
    const sections = document.querySelectorAll('.conteudo');
    sections.forEach(sec => sec.classList.remove('ativo'));
    document.getElementById(id).classList.add('ativo');

    // 🟨 NOVO: salvar aba ativa
    localStorage.setItem("abaAtiva", id);
}
//Menu Ativar/desativar
function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    const isActive = sidebar.classList.toggle("mostrar");
    main.classList.toggle("com-menu", isActive);

    // 🟨 NOVO: salvar estado do menu
    localStorage.setItem("menuAberto", isActive ? "1" : "0");
}

document.addEventListener("DOMContentLoaded", function () {
     const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");

    // 🟨 NOVO: restaurar estado do menu salvo
    const menuAberto = localStorage.getItem("menuAberto") === "1";
    if (menuAberto) {
        sidebar.classList.add("mostrar");
        main.classList.add("com-menu");
    }

    // 🟨 NOVO: restaurar aba ativa salva
    const abaSalva = localStorage.getItem("abaAtiva");
    if (abaSalva) {
        mostrar(abaSalva);
    }
  // Clientes
    const clienteBtn = document.querySelector("#clientes button");
    const clienteList = document.querySelector("#clientes ul");

    clienteBtn.addEventListener("click", () => {
        const nome = document.querySelector("#clientes input[type='text']").value;
        const email = document.querySelector("#clientes input[type='email']").value;
        if (nome && email) {
            const li = document.createElement("li");
            li.textContent = `${nome} - ${email}`;
            clienteList.appendChild(li);
        }
    });

    // Cadastrar Paciente

    // Tarefas
    const tarefaBtn = document.querySelector("#tarefas button");
    tarefaBtn.addEventListener("click", () => {
        const tarefa = document.querySelector("#tarefas input[type='text']").value;
        const status = document.querySelector("#tarefas select").value;
        alert(`Tarefa adicionada: "${tarefa}" [${status}]`);
    });

    // Financeiro
    const financeiroBtn = document.querySelector("#financeiro button");
    financeiroBtn.addEventListener("click", () => {
        const valor = document.querySelector("#financeiro input[type='number']").value;
        const tipo = document.querySelector("#financeiro select").value;
        alert(`${tipo} registrada: R$ ${valor}`);
    });

    // Agenda
    const agendaBtn = document.querySelector("#agenda button");
    agendaBtn.addEventListener("click", () => {
        const dataHora = document.querySelector("#agenda input[type='datetime-local']").value;
        const compromisso = document.querySelector("#agenda input[type='text']").value;
        alert(`Compromisso agendado em ${dataHora}: ${compromisso}`);
    });
});
// View Login admin Ativa/desativar
function mostrarLogin() {
      document.getElementById('form-cadastro').style.display = 'none';
    document.getElementById('form-admin').style.display = 'block';
    }


//Validação de login
function validarLogin(event) {
      event.preventDefault();
      const usuario = document.getElementById('usuario').value;
      const senha = document.getElementById('senhaCadastro').value;

      fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ users: usuario, senha: senha })
      })
      .then(response => response.text())
      .then(data => {
        if (data.includes("bem-sucedido")) {
          window.location.href = "page_adm.html";
        } else{
          alert("Usuário ou senha incorretos!");
        }return;
      })
      .catch(error => {
        console.error("Erro ao tentar login:", error);
        alert("Erro ao conectar com o servidor.");
      });
      
    } 
//Validação de cadastro
function validarCadastro(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email1').value;
  const senha = document.getElementById('senhaCadastro1').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  fetch("http://localhost:8080/login/cadastro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ users: nome, senha: senha, email: email})
  })
  .then(response => response.text())
  .then(data => {
    if (data.includes("Nome de usuário já existe")) {
      alert("Este nome de usuário já está cadastrado. Tente outro.");
    } else if (data.includes("Email já está cadastrado")) {
      alert("Este e-mail já está cadastrado. Use outro e-mail.");
    } else if (data.includes("sucesso")) {
      alert("Cadastro realizado com sucesso!");

    } else {
      alert("Erro ao cadastrar: " + data);
    }
  })
  .catch(error => {
    console.error("Erro ao cadastrar:", error);
    alert("Erro ao conectar com o servidor.");
  });
}
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

  // ✅ Mostrar o dia de hoje no rótulo
  const hoje = new Date();
  const diaHoje = hoje.getDate();
  const mesHoje = hoje.getMonth();
  const anoHoje = hoje.getFullYear();

  const label = (mesHoje === month && anoHoje === year)
    ? `Hoje: ${('0' + diaHoje).slice(-2)}/${('0' + (month + 1)).slice(-2)}/${year}`
    : `${('0' + (month + 1)).slice(-2)}/${year}`;

  monthYearLabel.textContent = label;

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

      tasks[key].sort((a, b) => a.time.localeCompare(b.time)).forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = 'task-item ' + (task.color || 'verde');
        taskEl.textContent = `${task.time} - ${task.desc}`;
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
    tasks[selectedDate].sort((a, b) => a.time.localeCompare(b.time)).forEach(t => {
      const item = document.createElement('div');
      item.className = 'task-item ' + (t.color || 'verde');
      item.innerHTML = `<strong>${t.time}</strong> - ${t.desc}`;
      lista.appendChild(item);
    });
  }
  view.appendChild(lista);

  const form = document.createElement('div');
  form.className = 'add-task-form';
  form.innerHTML = `
    <label>Hora:</label><input type="time" id="taskTime">
    <label>Descrição:</label><textarea id="taskDesc" placeholder="Descrição detalhada"></textarea>
    <label>Cor:</label>
    <select id="taskColor">
      <option value="verde">Verde</option>
      <option value="amarelo">Amarelo</option>
      <option value="vermelho">Vermelho</option>
    </select>
    <button class="save-btn" onclick="saveTask()">Salvar</button>
    <button class="back-btn" onclick="generateCalendar(currentDate)">Voltar</button>
  `;
  view.appendChild(form);
  container.appendChild(view);
}

function saveTask() {
  const time = document.getElementById('taskTime').value;
  const desc = document.getElementById('taskDesc').value;
  const color = document.getElementById('taskColor') ? document.getElementById('taskColor').value : 'verde';
  if (!time || !desc || !selectedDate) return;

  if (!tasks[selectedDate]) tasks[selectedDate] = [];
  tasks[selectedDate].push({ time, desc, color });

  showDayView();
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
