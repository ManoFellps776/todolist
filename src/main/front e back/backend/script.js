//Mostrar Menu
function mostrar(id) {
    const sections = document.querySelectorAll('.conteudo');
    sections.forEach(sec => sec.classList.remove('ativo'));
    document.getElementById(id).classList.add('ativo');

    //Desmarcar o paciente selecionado
    if (id !== 'editarPaciente') {
    const select = document.getElementById('selectPaciente');
    if (select) {
      select.value = '';
      pacienteSelecionadoId = null;
      document.getElementById('botoesAcao').style.display = 'none';
      document.getElementById('editForm').style.display = 'none';
      btnEditar.textContent = 'Editar Paciente';
    }
  }


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