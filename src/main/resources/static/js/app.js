

document.getElementById("nomeUsuario").innerText = nome;

document.getElementById("emailUsuario").innerText = email;

document.getElementById("planoUsuario").innerText = plano;


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
      
      document.getElementById('editForm').style.display = 'none';
     
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
} else {
    mostrar("agenda"); // Coloque aqui a aba padrão que você quer mostrar
}


    // Financeiro
    const financeiroBtn = document.querySelector("#financeiro button");
    financeiroBtn.addEventListener("click", () => {
        const valor = document.querySelector("#financeiro input[type='number']").value;
        const tipo = document.querySelector("#financeiro select").value;
        alert(`${tipo} registrada: R$ ${valor}`);
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

      fetch("/login", {
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
async function validarCadastro(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email1").value.trim();
  const senha = document.getElementById("senhaCadastro1").value.trim();
  const confirmarSenha = document.getElementById("confirmarSenha").value.trim();

  if (!nome || !email || !senha || !confirmarSenha) {
    alert("Preencha todos os campos.");
    return;
  }

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  const usuario = {
    users: nome,
    senha: senha,
    email: email
  };

  try {
    const res = await fetch("/login/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });

    const texto = await res.text();

    if (!res.ok) {
      throw new Error(texto);
    }

    alert("✅ Usuário cadastrado com sucesso!");
    mostrarLogin();

  } catch (err) {
    console.error("Erro ao cadastrar:", err);
    alert("❌ Erro ao cadastrar: " + err.message);
  }
}


localStorage.removeItem("abaAtiva");

// Simulando um objeto de usuário recuperado do back-end
  const usuarioLogado = {
    nome: "Felipe Rezende",
    foto: "https://i.pravatar.cc/150?u=felipe@example.com" // pode substituir por path real
  };

  window.onload = function () {
    document.getElementById("userAvatar").src = usuarioLogado.foto;
  };

  function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
  }

 function sairLogin() {
  const confirmar = confirm("Deseja realmente sair?");
  if (confirmar) {
    localStorage.clear();
    window.location.href = "/logout";
  }
}

function mostrar(id) {
  const sections = document.querySelectorAll('.conteudo');
  sections.forEach(sec => sec.classList.remove('ativo'));

  const target = document.getElementById(id);
  if (target) {
    target.classList.add('ativo');
    localStorage.setItem("abaAtiva", id);
  }
}
document.getElementById("nomeUsuario").innerText = nome;

function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  const isActive = sidebar.classList.toggle("mostrar");
  main.classList.toggle("com-menu", isActive);
  localStorage.setItem("menuAberto", isActive ? "1" : "0");
}

document.addEventListener("DOMContentLoaded", function () {
  
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  if (localStorage.getItem("menuAberto") === "1") {
    sidebar.classList.add("mostrar");
    main.classList.add("com-menu");
  }

  const abaSalva = localStorage.getItem("abaAtiva");
  mostrar(abaSalva || "admin");
});

// ✅ Corrigido: agora só alterna as seções já existentes
function mostrarCadastro() {
  document.getElementById('admin').classList.remove('ativo');
  document.getElementById('clientes').classList.add('ativo');
}

function mostrarLogin() {
  document.getElementById('clientes').classList.remove('ativo');
  document.getElementById('admin').classList.add('ativo');
}

// 🔐 Validação de login


// 📝 Validação de cadastro
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

  fetch("/login/cadastro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users: nome, senha: senha, email: email })
  })
    .then(response => response.text())
    .then(data => {
      if (data.includes("Nome de usuário já existe")) {
        alert("Este nome de usuário já está cadastrado. Tente outro.");
      } else if (data.includes("Email já está cadastrado")) {
        alert("Este e-mail já está cadastrado. Use outro e-mail.");
      } else if (data.includes("sucesso")) {
        alert("Cadastro realizado com sucesso!");
        mostrarLogin(); // volta para o login
      } else {
        alert("Erro ao cadastrar: " + data);
      }
    })
    .catch(error => {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao conectar com o servidor.");
    });
}

localStorage.removeItem("abaAtiva");
document.addEventListener("DOMContentLoaded", () => {
  inicializarEventosAnamnese();
});

function inicializarEventosAnamnese() {
  const select = document.getElementById("pacienteAnamnese");

  if (select) {
    carregarPacientesAnamnese();

    if (!select.dataset.eventoAdicionado) {
      select.addEventListener("change", () => {
        mostrarBotoesAnamnese();

        // Limpa visualizações ao trocar de paciente
        const listaAg = document.getElementById("listaAgendamentos");
        const listaReg = document.getElementById("listaRegistros");
        if (listaAg) listaAg.innerHTML = "";
        if (listaReg) listaReg.innerHTML = "";

        ["agendamentos", "criarAnamnese", "registroAnamnese"].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = "none";
        });
      });
      select.dataset.eventoAdicionado = "true";
    }
  }

  const btnAg = document.querySelector("#botoesAcaoAnamnese button:nth-child(1)");
  const btnCriar = document.querySelector("#botoesAcaoAnamnese button:nth-child(2)");
  const btnReg = document.querySelector("#botoesAcaoAnamnese button:nth-child(3)");

  if (btnAg) btnAg.onclick = () => exibirSecaoAnamnese("agendamentos");
  if (btnCriar) btnCriar.onclick = async () => {
    await preencherPaciente();
    exibirSecaoAnamnese("criarAnamnese");
  };
  if (btnReg) btnReg.onclick = () => exibirSecaoAnamnese("registroAnamnese");
}
async function carregarPacientesAnamnese() {
  const select = document.getElementById("pacienteAnamnese");
  if (!select) return;



  try {
    const res = await fetch(`/pacientes`);
    if (!res.ok) throw new Error("Erro ao buscar pacientes");

    const pacientes = await res.json();

    // Garante que está vindo como array
    if (!Array.isArray(pacientes)) {
      throw new Error("Resposta inesperada da API (esperado um array)");
    }

    select.innerHTML = '<option value="">Selecione um paciente</option>';
    pacientes.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.nome;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar pacientes:", err);
    alert("Erro ao carregar lista de pacientes.");
  }
}
function mostrarBotoesAnamnese() {
  const s = document.getElementById("pacienteAnamnese");
  document.getElementById("botoesAcaoAnamnese").style.display = s.value ? "flex" : "none";
}

async function exibirSecaoAnamnese(secaoId) {
  ["agendamentos", "criarAnamnese", "registroAnamnese"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === secaoId ? "block" : "none";
  });

  if (secaoId === "agendamentos") {
    await exibirAgendamentos();
  }

  if (secaoId === "criarAnamnese") {
    await preencherPaciente();
  }

  if (secaoId === "registroAnamnese") {
    await exibirRegistrosAnamnese();
  }
}

async function exibirAgendamentos() {
  const idPaciente = document.getElementById("pacienteAnamnese").value;
  const container = document.getElementById("listaAgendamentos");
  container.innerHTML = "";

  if (!idPaciente) return;

  try {
    const res = await fetch(`/agendamentos/paciente/${idPaciente}`);
    if (!res.ok) throw new Error("Erro ao buscar agendamentos");

    const agendamentos = await res.json();

    if (!Array.isArray(agendamentos) || agendamentos.length === 0) {
      container.innerHTML = "<p>Nenhum agendamento encontrado.</p>";
      return;
    }

    // 🔷 Ordenar por data crescente
    agendamentos.sort((a, b) => new Date(a.data) - new Date(b.data));

    agendamentos.forEach(a => {
      const data = new Date(a.data + "T00:00:00");
      if (isNaN(data.getTime())) return;

      const dia = String(data.getDate()).padStart(2, '0');
      const mes = String(data.getMonth() + 1).padStart(2, '0');
      const ano = String(data.getFullYear()).slice(-2);
      const dataFormatada = `${dia}/${mes}/${ano}`;

      const horaFormatada = a.hora ? a.hora.substring(0, 5) : "00:00";

      container.innerHTML += `
        <div class="agendamento-card">
          📅 <strong>${dataFormatada}</strong> às <strong>${horaFormatada}</strong> → ${a.descricao || 'Sem descrição'}
        </div>`;
    });
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    container.innerHTML = "<p>Erro ao carregar agendamentos.</p>";
  }
}


async function preencherPaciente() {
  const id = document.getElementById("pacienteAnamnese").value;
  if (!id) return;

  try {
    const res = await fetch(`/pacientes/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar paciente");

    const p = await res.json();
    const f = document.getElementById("formAnamnese");

    if (!f) return;

    f.nomeA.value = p.nome || "";
    f.cpfA.value = p.cpf || "";
    f.nascimentoA.value = p.birthday || "";
    f.telefoneA.value = p.telefone || "";
    f.emailA.value = p.email || "";
    f.enderecoA.value = p.rua || "";
    f.cidadeA.value = p.cidade || "";

    // Campos que o usuário deve preencher manualmente:
    f.sexo.value = "";
    f.altura.value = "";
    f.pesoAtual.value = "";
    f.pesoIdeal.value = "";

    // (Opcional) Se quiser salvar o ID do usuário ocultamente:
    
  } catch (err) {
    console.error("Erro ao preencher dados do paciente:", err);
  }
}

async function exibirRegistrosAnamnese() {
  const container = document.getElementById("listaRegistros");
  container.innerHTML = "";
  document.getElementById("visualizacaoAnamnese").style.display = "none";

  const idPaciente = document.getElementById("pacienteAnamnese")?.value;
  if (!idPaciente) return;

  try {
    const pacienteRes = await fetch(`/pacientes/${idPaciente}`);
    if (!pacienteRes.ok) throw new Error("Erro ao buscar paciente");

    const paciente = await pacienteRes.json();
    const cpf = paciente?.cpf?.replace(/\D/g, ""); // Remove tudo que não é número

    if (!cpf) {
      container.innerHTML = "<p>Paciente sem CPF cadastrado.</p>";
      return;
    }
    const res = await fetch(`/anamnese/paciente/${cpf}`);

    if (!res.ok) throw new Error("Erro ao buscar anamneses");

    const registros = await res.json();
    if (!Array.isArray(registros)) throw new Error("Formato inválido da resposta");

    const registrosPaciente = registros.filter(r => r.cpfA?.replace(/\D/g, "") === cpf);

    if (registrosPaciente.length === 0) {
      container.innerHTML = "<p>Paciente não tem histórico de anamnese.</p>";
      return;
    }

    registrosPaciente.forEach(a => {
      const dataCriacao = a.dataCriacao
        ? new Date(a.dataCriacao).toLocaleDateString()
        : "-";

      container.innerHTML += `
        <div class="registro-card">
          <strong>Data de criação:</strong> ${dataCriacao}<br>
          <strong>Nome do paciente:</strong> ${a.nomeA || "-"}<br>
          <strong>Obs:</strong> ${a.obs || "-"}<br>
          <button class="btn-pdf" onclick="gerarPDF(${a.id})">PDF</button>
          <button class="btn-editar" onclick="visualizarAnamnese(${a.id})">Visualizar</button>
          <button class="btn-deletar" onclick="deletarAnamnese(${a.id})">Deletar</button>
        </div>
      `;
    });

  } catch (err) {
    console.error("❌ Erro ao buscar registros de anamnese:", err);
    container.innerHTML = "<p>Erro ao carregar os registros.</p>";
  }
}


async function deletarAnamnese(id) {
  const confirmacao = confirm("Deseja realmente excluir esta anamnese?");
  if (!confirmacao) return;

  try {
    const res = await fetch(`/anamnese/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("✅ Anamnese excluída com sucesso.");
      await exibirRegistrosAnamnese(); // Atualiza a lista
    } else {
      alert("❌ Erro ao excluir anamnese.");
    }
  } catch (err) {
    console.error("Erro ao deletar anamnese:", err);
    alert("❌ Erro de conexão com o servidor.");
  }
}
//Salvar anamnese no banco
document.getElementById("formAnamnese")?.addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;

  const data = {
    nomeA: form.nomeA.value,
    cpfA: form.cpfA.value?.replace(/\D/g, ""), // limpa o CPF
    nascimentoA: form.nascimentoA.value,
    telefoneA: form.telefoneA.value,
    emailA: form.emailA.value,
    enderecoA: form.enderecoA.value,
    cidadeA: form.cidadeA.value,
    sexo: form.sexo.value,
    altura: form.altura.value,
    pesoAtual: form.pesoAtual.value,
    pesoIdeal: form.pesoIdeal.value,

    agua: form.agua.checked,
    sono: form.sono.checked,
    atividade: form.atividade.checked,
    etilismo: form.etilismo.checked,
    intestino: form.intestino.checked,
    gestante: form.gestante.checked,
    cirurgias: form.cirurgias.checked,
    diabetes: form.diabetes.checked,

    obs: form.obs.value,

    usuario: { id: parseInt(usuarioId) } // ✅ O campo obrigatório!
  };

  try {
    const res = await fetch(`/anamnese?usuarioId=${usuarioId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("✅ Anamnese salva com sucesso!");

      const pacienteId = document.getElementById("pacienteAnamnese").value;
      form.reset();

      document.getElementById("criarAnamnese").style.display = "none";
      document.getElementById("registroAnamnese").style.display = "none";
      document.getElementById("agendamentos").style.display = "none";
      document.getElementById("botoesAcaoAnamnese").style.display = "flex";

      document.getElementById("pacienteAnamnese").value = pacienteId;

    } else {
      const erroTexto = await res.text();
      console.error("❌ Erro ao salvar:", erroTexto);
      alert("❌ Erro ao salvar anamnese.");
    }
  } catch (err) {
    console.error("❌ Erro ao conectar:", err);
    alert("❌ Erro ao conectar ao servidor.");
  }


});
// Gerar PDF
async function gerarPDF(id) {
  try {
    const res = await fetch(`/anamnese/${id}`);
    if (!res.ok) throw new Error("Erro ao buscar anamnese");

    const a = await res.json();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("FICHA DE ANAMNESE", 105, 15, null, null, "center");
    doc.setLineWidth(0.2);
    doc.line(10, 18, 200, 18); // linha separadora

    let y = 25;

    const campo = (label, valor = "", x = 15) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`${label}:`, x, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${valor || "__________________________"}`, x + 45, y);
      y += 7;
    };

    // Dados Pessoais
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Dados Pessoais", 15, y);
    y += 7;
    campo("Nome", a.nomeA);
    campo("Endereço", a.enderecoA);
    campo("Data de Nascimento", a.nascimentoA);
    campo("Profissão");
    campo("CI");
    campo("CPF", a.cpfA);
    campo("Nome da Mãe");
    campo("Telefone", a.telefoneA);
    campo("Telefone Residencial");
    campo("Estado Civil");
    campo("E-mail", a.emailA);
    campo("Queixa principal");
    y += 5;

    // Informações Importantes
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMAÇÕES IMPORTANTES", 15, y);
    y += 7;

    const check = (label, checked) => {
      doc.setFont("helvetica", "normal");
      doc.text(`(${checked ? "X" : " "}) ${label}`, 20, y);
      y += 6;
    };

    check("Diabetes / Tipo", a.diabetes);
    check("Problemas Circulatórios", a.atividade);
    check("Pressão Alta", false);
    check("Lesões anteriores", a.cirurgias);
    doc.text("Taxa de Glicemia capilar: ____________________", 20, y);
    y += 6;
    check("Antecedentes Cancerígenos", false);
    doc.text("Outros: ____________________________________________", 20, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text("* Está gestante?", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`( ${a.gestante ? "X" : " "} ) sim   ( ${!a.gestante ? "X" : " "} ) não`, 70, y);
    y += 7;

    doc.setFont("helvetica", "bold");
    doc.text("* Apresenta alergia a medicamentos?", 20, y);
    doc.setFont("helvetica", "normal");
    doc.text("( ) sim   ( ) não", 100, y);
    y += 6;
    doc.text("Qual: ___________________________________", 25, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("* No momento está tomando quais medicamentos", 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text("________________________________________________________________________________", 20, y);
    y += 6;
    doc.text("________________________________________________________________________________", 20, y);
    y += 10;

    // Hábitos
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Hábitos", 15, y);
    y += 7;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("• Consome em média quantos litros de água por dia? ____________________", 20, y);
    y += 6;
    doc.text(`• Qual o seu peso e altura? ${a.pesoAtual || "____"} kg / ${a.altura || "____"} m`, 20, y);
    y += 6;
    doc.text("• Qual tipo de calçado que você mais usa? __________________________", 20, y);
    y += 6;
    doc.text("• Possui calos? Especifique o tipo de calo que o paciente possui.", 20, y);
    y += 6;
    doc.text("__________________________________________________________", 20, y);
    y += 6;
    doc.text("• Há histórico de ulceração nos pés? ( ) Sim   ( ) Não", 20, y);
    y += 6;
    doc.text("• Utiliza meias", 20, y);
    y += 6;
    doc.text("• Permanece mais tempo: ( ) sentado   ( ) em pé   ( ) andando", 20, y);
    y += 20;

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Declaro que as informações acima são verdadeiras, não cabendo ao profissional quaisquer responsabilidades", 15, y);
    y += 6;
    doc.text("por informações contidas nesta anamnese.", 15, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.line(30, y, 100, y);
    doc.line(120, y, 180, y);
    y += 5;
    doc.text("Assinatura do Paciente", 40, y);
    doc.text("Data", 145, y);

    doc.save(`anamnese_${a.nomeA || "paciente"}.pdf`);
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    alert("❌ Não foi possível gerar o PDF.");
  }
}



//Vizualizar anamnese antes
async function visualizarAnamnese(id) {
  try {
    const res = await fetch(`/anamnese/${id}`);
    const a = await res.json();

    const html = `
      <h4>Dados Pessoais</h4>
      <p><strong>Nome:</strong> ${a.nomeA}</p>
      <p><strong>CPF:</strong> ${a.cpfA}</p>
      <p><strong>Nascimento:</strong> ${a.nascimentoA}</p>
      <p><strong>Telefone:</strong> ${a.telefoneA}</p>
      <p><strong>Email:</strong> ${a.emailA}</p>
      <p><strong>Endereço:</strong> ${a.enderecoA}</p>
      <p><strong>Cidade:</strong> ${a.cidadeA}</p>
      <p><strong>Sexo:</strong> ${a.sexo}</p>
      <p><strong>Altura:</strong> ${a.altura}</p>
      <p><strong>Peso Atual:</strong> ${a.pesoAtual}</p>
      <p><strong>Peso Ideal:</strong> ${a.pesoIdeal}</p>

      <h4>Histórico</h4>
      <ul>
        ${a.agua ? "<li>Ingestão de Água Diária</li>" : ""}
        ${a.sono ? "<li>Horas de Sono</li>" : ""}
        ${a.atividade ? "<li>Atividade Física</li>" : ""}
        ${a.etilismo ? "<li>Bebidas Alcoólicas</li>" : ""}
        ${a.intestino ? "<li>Intestino Regular</li>" : ""}
        ${a.gestante ? "<li>Gestante</li>" : ""}
        ${a.cirurgias ? "<li>Cirurgias</li>" : ""}
        ${a.diabetes ? "<li>Diabetes</li>" : ""}
      </ul>

      <h4>Outras Informações</h4>
      <p>${a.obs || "-"}</p>
    `;

    document.getElementById("conteudoVisualizacao").innerHTML = html;
    document.getElementById("visualizacaoAnamnese").style.display = "block";
  } catch (err) {
    console.error("Erro ao visualizar anamnese:", err);
  }
}
function fecharVisualizacaoAnamnese() {
  const container = document.getElementById("visualizacaoAnamnese");
  container.style.display = "none";
  document.getElementById("conteudoVisualizacao").innerHTML = "";
}
document.addEventListener("DOMContentLoaded", () => {
});
let pacientes = [];
let mostrandoLista = false;
let pacienteSelecionadoId = null;

window.addEventListener('DOMContentLoaded', async () => {
  await carregarPacientes();
  document.getElementById('editForm').style.display = 'none';

  document.getElementById('selectPaciente').addEventListener('change', async () => {
  const id = document.getElementById('selectPaciente').value;

  if (id) {
    pacienteSelecionadoId = Number(id);
    const response = await fetch(`/pacientes/${pacienteSelecionadoId}?usuarioId=${usuarioId}`);
    if (response.ok) {
      const paciente = await response.json();
      preencherFormulario(paciente);
      document.getElementById('selectPaciente').disabled = false;
    } else {
      alert("Paciente não encontrado ou você não tem permissão.");
    }
  } else {
    pacienteSelecionadoId = null;
    document.getElementById('editForm').style.display = 'none';
  }
});


 document.getElementById('btnListar').addEventListener('click', async () => {

  const listaContainer = document.getElementById('listaPacientes');
  const botaoListar = document.getElementById('btnListar');
  const form = document.getElementById('editForm');

  if (mostrandoLista) {
    listaContainer.style.display = 'none';
    botaoListar.textContent = 'Listar Pacientes';
    mostrandoLista = false;
    return;
  }

  if (form.style.display === 'block') {
    form.style.display = 'none';
  }

  try {
    const response = await fetch(`/pacientes?usuarioId=${usuarioId}`);
    if (!response.ok) throw new Error('Erro ao carregar pacientes');

    const pacientes = await response.json();
    listaContainer.innerHTML = '';

    pacientes.forEach(paciente => {
      const item = document.createElement('div');
      item.classList.add('paciente-lista-item');

      const nome = document.createElement('span');
      nome.textContent = paciente.nome;

      const btnEditar = document.createElement('button');
      btnEditar.textContent = 'Editar';
      btnEditar.className = 'btn-editar';
      btnEditar.onclick = async () => {
        pacienteSelecionadoId = paciente.id;
        const res = await fetch(`/pacientes/${paciente.id}?usuarioId=${usuarioId}`);
        if (!res.ok) return alert('Erro ao buscar paciente');
        const p = await res.json();
        preencherFormulario(p);
        document.getElementById('selectPaciente').value = paciente.id;
        document.getElementById('selectPaciente').disabled = false;
        form.style.display = 'block';
        listaContainer.style.display = 'none';
        botaoListar.textContent = 'Listar Pacientes';
        mostrandoLista = false;
      };

      const btnDeletar = document.createElement('button');
      btnDeletar.textContent = 'Deletar';
      btnDeletar.className = 'btn-deletar';
      btnDeletar.onclick = async () => {
        const confirmar = confirm(`Deseja realmente deletar o paciente "${paciente.nome}"?`);
        if (!confirmar) return;
        try {
          const resp = await fetch(`/pacientes/${paciente.id}?usuarioId=${usuarioId}`, {
            method: 'DELETE'
          });
          if (!resp.ok) throw new Error('Erro ao deletar');
          alert('Paciente deletado com sucesso!');
          await carregarPacientes();
          listaContainer.style.display = 'none';
          botaoListar.textContent = 'Listar Pacientes';
          mostrandoLista = false;
        } catch (err) {
          console.error(err);
          alert('Erro ao deletar paciente.');
        }
      };

      item.appendChild(nome);
      item.appendChild(btnEditar);
      item.appendChild(btnDeletar);
      listaContainer.appendChild(item);
    });

    listaContainer.style.display = 'block';
    botaoListar.textContent = 'Ocultar Lista';
    mostrandoLista = true;
  } catch (error) {
    console.error(error);
    alert('Erro ao listar pacientes');
  }
});
});
async function carregarPacientes() {

  try {
    const response = await fetch(`/pacientes?usuarioId=${usuarioId}`);
    if (!response.ok) throw new Error('Erro ao carregar pacientes');
    pacientes = await response.json();

    const select = document.getElementById('selectPaciente');
    select.innerHTML = '<option value="">Selecione um paciente</option>';

    pacientes.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = p.nome;
      select.appendChild(option);
    });

    if (pacienteSelecionadoId === null) {
      select.disabled = false;
    }
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar lista de pacientes');
  }
}


function preencherFormulario(p) {
  document.getElementById('nomeEd').value = p.nome || '';
  document.getElementById('cpfCnpjEd').value = p.cpf || '';
  if (p.birthday) {
    const dataFormatada = new Date(p.birthday).toISOString().split('T')[0];
    document.getElementById('nascimentoEd').value = dataFormatada;
  } else {
    document.getElementById('nascimentoEd').value = '';
  }
  document.getElementById('estadoCivilEd').value = p.estadoCivil || '';
  document.getElementById('profissaoEd').value = p.profissao || '';
  document.getElementById('escolaridadeEd').value = p.escola || '';
  document.getElementById('cepEd').value = p.cep || '';
  document.getElementById('estadoEd').value = p.estadoCep || '';
  document.getElementById('cidadeEd').value = p.cidade || '';
  document.getElementById('bairroEd').value = p.bairro || '';
  document.getElementById('ruaEd').value = p.rua || '';
  document.getElementById('numeroRuaEd').value = p.numeroRua || '';
  document.getElementById('telefoneEd').value = p.telefone || '';
  document.getElementById('emailEd').value = p.email || '';
  document.getElementById('descricaoEd').value = p.descricao || '';
  document.getElementById('selectPaciente').disabled = false;
}

function limparFormulario() {
  const campos = document.querySelectorAll('#editForm input, #editForm textarea');
  campos.forEach(campo => campo.value = '');
}
async function salvarAlteracoes(event) {
  event.preventDefault();


  const pacienteAtualizado = {
    nome: document.getElementById('nomeEd').value,
    cpf: document.getElementById('cpfCnpjEd').value,
    birthday: document.getElementById('nascimentoEd').value,
    estadoCivil: document.getElementById('estadoCivilEd').value,
    profissao: document.getElementById('profissaoEd').value,
    escola: document.getElementById('escolaridadeEd').value,
    cep: document.getElementById('cepEd').value,
    estadoCep: document.getElementById('estadoEd').value,
    cidade: document.getElementById('cidadeEd').value,
    bairro: document.getElementById('bairroEd').value,
    rua: document.getElementById('ruaEd').value,
    numeroRua: document.getElementById('numeroRuaEd').value,
    telefone: document.getElementById('telefoneEd').value,
    email: document.getElementById('emailEd').value,
    descricao: document.getElementById('descricaoEd').value,
    usuario: { id: usuarioId } // 🟢 Importante: vincula ao usuário correto
  };

  try {
    const response = await fetch(`/pacientes/${pacienteSelecionadoId}?usuarioId=${usuarioId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pacienteAtualizado)
    });

    if (!response.ok) throw new Error('Erro ao atualizar paciente');

    alert('Paciente atualizado com sucesso!');
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('selectPaciente').value = '';
    await carregarPacientes();
  } catch (error) {
    console.error(error);
    alert('Erro ao salvar alterações');
  }
}
async function salvarPaciente(event) {
  event.preventDefault();


  const paciente = {
    nome: document.getElementById('nomeEd').value,
    cpf: document.getElementById('cpfCnpjEd').value,
    birthday: document.getElementById('nascimentoEd').value,
    estadoCivil: document.getElementById('estadoCivilEd').value,
    profissao: document.getElementById('profissaoEd').value,
    escola: document.getElementById('escolaridadeEd').value,
    cep: document.getElementById('cepEd').value,
    estadoCep: document.getElementById('estadoEd').value,
    cidade: document.getElementById('cidadeEd').value,
    bairro: document.getElementById('bairroEd').value,
    rua: document.getElementById('ruaEd').value,
    numeroRua: document.getElementById('numeroRuaEd').value,
    telefone: document.getElementById('telefoneEd').value,
    email: document.getElementById('emailEd').value,
    descricao: document.getElementById('descricaoEd').value,
    usuario: { id: usuarioId } // 🟢 Associa o paciente ao usuário logado
  };

  const url = pacienteSelecionadoId 
      ? `/pacientes/${pacienteSelecionadoId}?usuarioId=${usuarioId}` 
      : `/pacientes?usuarioId=${usuarioId}`;

  const method = pacienteSelecionadoId ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paciente)
    });

    if (!res.ok) throw new Error('Erro ao salvar paciente');
    alert(pacienteSelecionadoId ? 'Paciente atualizado!' : 'Paciente criado!');
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('selectPaciente').disabled = false;
    await carregarPacientes();
  } catch (err) {
    alert('Erro ao salvar');
    console.error(err);
  }
}


function voltarEdicao() {
  document.getElementById('editForm').style.display = 'none';
  document.getElementById('selectPaciente').value = '';
  document.getElementById('selectPaciente').disabled = false; // ← Reativar select
  pacienteSelecionadoId = null;
  
}
document.getElementById('btnEditar').addEventListener('click', async () => {

  const select = document.getElementById('selectPaciente');
  const idSelecionado = select.value;

  if (!idSelecionado) {
    alert('Selecione um paciente para editar.');
    return;
  }

  try {
    const res = await fetch(`/pacientes/${idSelecionado}`);
    if (!res.ok) throw new Error('Erro ao buscar paciente');

    const paciente = await res.json();

    preencherFormulario(paciente); // Preenche os campos com os dados

    document.getElementById('editForm').style.display = 'block';
    document.getElementById('selectPaciente').disabled = false;
    document.getElementById('listaPacientes').style.display = 'none';
    document.getElementById('btnListar').textContent = 'Listar Pacientes';
    mostrandoLista = false;

  } catch (err) {
    console.error(err);
    alert('Erro ao carregar paciente.');
  }
});
function mostrarFormularioEdicao() {
  const nome = document.getElementById("nomeUsuario").textContent;
  const email = document.getElementById("emailUsuario").textContent;

  document.getElementById("novoNome").value = nome;
  document.getElementById("novoEmail").value = email;
  document.getElementById("formEditarUsuario").style.display = "block";
}

function cancelarEdicao() {
  document.getElementById("formEditarUsuario").style.display = "none";
}
async function editarUsuario(event) {
  event.preventDefault();

  const nome = document.getElementById("novoNome").value.trim();
  const email = document.getElementById("novoEmail").value.trim();

  if (!nome || !email) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch("/login/usuarios", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, email }) // campos enviados
    });

    if (!response.ok) throw new Error("Erro ao atualizar usuário.");

    document.getElementById("nomeUsuario").textContent = nome;
    document.getElementById("emailUsuario").textContent = email;

    alert("✅ Dados atualizados com sucesso!");
    cancelarEdicao();

  } catch (err) {
    console.error("❌ Erro ao atualizar:", err);
    alert("❌ Falha ao salvar alterações.");
  }
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
    const url = `/agendamentos/mes/${anoMes}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao carregar agendamentos');

    const agendamentos = await res.json();

    if (!Array.isArray(agendamentos)) {
      console.error('Resposta inesperada da API:', agendamentos);
      throw new Error('Formato inválido de agendamentos');
    }

    tasks = {};
    agendamentos.forEach(item => {
      const key = item.data;
      if (!tasks[key]) tasks[key] = [];
      tasks[key].push(item);
    });

  } catch (err) {
    console.error('Erro ao buscar agendamentos:', err);
    alert('Erro ao carregar agendamentos. Verifique se o usuário possui agendamentos.');
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
  titulo.textContent = `Agendamentos do dia ${day}/${month}/${year}`;
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

  <button class="btnSimplificado" onclick="generateCalendar(currentDate)">Criar um cadastro simplificado</button>

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

// Carrega pacientes com filtro por usuário, se necessário
fetch("/pacientes")
  .then(res => {
    if (!res.ok) throw new Error("Erro ao buscar pacientes");
    return res.json();
  })
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
    console.error("Erro ao carregar pacientes:", err);
    alert("Erro ao carregar pacientes");
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
    // ❌ usuarioId: não é mais necessário
  };

  fetch('/agendamentos', {
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
      carregarAgendamentosDoMes(selectedDate.slice(0, 7))
        .then(() => showDayView());
    })
    .catch(err => {
      console.error('Erro ao salvar agendamento:', err);
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

  fetch(`/agendamentos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agendamentoAtualizado)
  })
    .then(res => {
      if (!res.ok) throw new Error('Erro ao atualizar agendamento');
      return res.json();
    })
    .then(() => {
      carregarAgendamentosDoMes(selectedDate.slice(0, 7))
        .then(() => showDayView());
    })
    .catch(err => {
      console.error('Erro ao atualizar agendamento:', err);
      alert('Erro ao atualizar agendamento');
    });
}


function deletarAgendamento(id) {
  if (!confirm("Deseja realmente excluir este agendamento?")) return;

  fetch(`/agendamentos/${id}`, {
    method: 'DELETE'
  })
    .then(() => {
      carregarAgendamentosDoMes(selectedDate.slice(0, 7))
        .then(() => showDayView());
    })
    .catch(err => {
      console.error('Erro ao deletar agendamento:', err);
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

document.getElementById('cadastroForm').addEventListener('submit', async function (e) {
  e.preventDefault();


  const cpfCnpj = document.getElementById('cpfCnpj').value.replace(/\D/g, '');
  const email = document.getElementById('email').value;

  if (!validarCpfCnpj(cpfCnpj)) {
    alert("CPF ou CNPJ inválido!");
    return;
  }

  if (!validarEmail(email)) {
    alert("E-mail inválido!");
    return;
  }

  const paciente = {
    nome: document.getElementById('nomePaciente').value,
    cpf: cpfCnpj,
    birthday: document.getElementById('nascimento').value,
    estadoCivil: document.getElementById('estadoCivil').value,
    profissao: document.getElementById('profissao').value,
    escola: document.getElementById('escolaridade').value,
    cep: document.getElementById('cep').value.replace(/\D/g, ''),
    estadoCep: document.getElementById('estado').value,
    cidade: document.getElementById('cidade').value,
    bairro: document.getElementById('bairro').value,
    rua: document.getElementById('rua').value,
    numeroRua: document.getElementById('numero').value,
    telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
    email: email,
    descricao: document.getElementById('outrasInfo').value
  };

  try {
    const response = await fetch(`/pacientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paciente)
    });

    if (response.ok) {
      const resultado = `
        <h3>Paciente Cadastrado com Sucesso!</h3>
        <p><strong>Nome:</strong> ${paciente.nome}</p>
        <p><strong>CPF/CNPJ:</strong> ${paciente.cpf}</p>
        <p><strong>Data de Nascimento:</strong> ${paciente.birthday}</p>
        <p><strong>Estado Civil:</strong> ${paciente.estadoCivil}</p>
        <p><strong>Profissão:</strong> ${paciente.profissao}</p>
        <p><strong>Escolaridade:</strong> ${paciente.escola}</p>
        <p><strong>Endereço:</strong> ${paciente.rua}, ${paciente.numeroRua}, ${paciente.bairro}, ${paciente.cidade} - ${paciente.estadoCep}, CEP: ${paciente.cep}</p>
        <p><strong>Telefone:</strong> ${paciente.telefone}</p>
        <p><strong>Email:</strong> ${paciente.email}</p>
        <p><strong>Outras Informações:</strong> ${paciente.descricao}</p>
      `;
      const divResultado = document.getElementById('resultado');
      divResultado.innerHTML = resultado;
      divResultado.style.display = 'block';
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

      document.getElementById('cadastroForm').reset();
    } else {
      alert("Erro ao cadastrar paciente.");
    }
  } catch (error) {
    console.error("Erro:", error);
  }
});

document.getElementById('cep').addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);
});

document.getElementById('cpfCnpj').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '');
  if (v.length <= 11) {
    v = v.replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    v = v.replace(/(\d{2})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d)/, '$1.$2')
         .replace(/(\d{3})(\d)/, '$1/$2')
         .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
  this.value = v;
});

document.getElementById('telefone').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '');
  v = v.replace(/^0/, '');
  if (v.length > 10) {
    v = v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (v.length > 5) {
    v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (v.length > 2) {
    v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  }
  this.value = v;
});

document.getElementById('email').addEventListener('input', function () {
  const sugestoes = ['@gmail.com', '@hotmail.com', '@outlook.com', '@yahoo.com'];
  const input = this;
  const datalist = document.getElementById('emails');
  if (!datalist) {
    const list = document.createElement('datalist');
    list.id = 'emails';
    document.body.appendChild(list);
    input.setAttribute('list', 'emails');
  }

  const valor = input.value;
  const arrobaIndex = valor.indexOf('@');
  const listElement = document.getElementById('emails');
  listElement.innerHTML = '';

  if (arrobaIndex === -1 && valor.length > 2) {
    sugestoes.forEach(dom => {
      const option = document.createElement('option');
      option.value = valor + dom;
      listElement.appendChild(option);
    });
  }
});

document.getElementById('cep').addEventListener('blur', function () {
  const cep = this.value.replace(/\D/g, '');
  if (cep.length !== 8) {
    alert("CEP inválido. Digite 8 números.");
    return;
  }

  fetch('https://viacep.com.br/ws/' + cep + '/json/')
    .then(response => response.json())
    .then(data => {
      if (!data.erro) {
        document.getElementById('rua').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
      } else {
        alert("CEP não encontrado. Verifique o número digitado.");
      }
    })
    .catch(() => alert("Erro ao buscar o CEP. Tente novamente."));
});

function validarEmail(email) {
  const re = /^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i;
  return re.test(email);
}

function validarCpfCnpj(value) {
  value = value.replace(/[^\d]+/g, '');

  if (value.length === 11) {
    return validarCPF(value);
  } else if (value.length === 14) {
    return validarCNPJ(value);
  }
  return false;
}

function validarCPF(cpf) {
  if (/^(\d)\1{10}$/.test(cpf)) return false;
  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  return resto === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpj) {
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado !== parseInt(digitos.charAt(0))) return false;

  tamanho += 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  return resultado === parseInt(digitos.charAt(1));
}

document.getElementById('naoSeiCep').addEventListener('change', function () {
  const isChecked = this.checked;
  const cepInput = document.getElementById('cep');
  const estadoInput = document.getElementById('estado');
  const cidadeInput = document.getElementById('cidade');

  if (isChecked) {
    cepInput.disabled = true;
    estadoInput.disabled = false;
    cidadeInput.disabled = false;
    cepInput.value = "";
  } else {
    cepInput.disabled = false;
    if (cepInput.value === "") {
      estadoInput.disabled = false;
      cidadeInput.disabled = false;
    }
  }
});

document.getElementById('cep').addEventListener('input', function () {
  const estadoInput = document.getElementById('estado');
  const cidadeInput = document.getElementById('cidade');
  const checkbox = document.getElementById('naoSeiCep');
  if (this.value.replace(/\D/g, '').length > 0) {
    estadoInput.disabled = true;
    cidadeInput.disabled = true;
    checkbox.disabled = true;
  } else {
    estadoInput.disabled = false;
    cidadeInput.disabled = false;
    checkbox.disabled = false;
  }
});

document.getElementById('cep').addEventListener('blur', function () {
  const cep = this.value.replace(/\D/g, '');
  const cepInput = document.getElementById('cep');
  if (cepInput.disabled || cep === '') return;

  if (cep.length !== 8) {
    alert("CEP inválido. Digite 8 números.");
    return;
  }

  fetch('https://viacep.com.br/ws/' + cep + '/json/')
    .then(response => response.json())
    .then(data => {
      if (!data.erro) {
        document.getElementById('rua').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
      } else {
        alert("CEP não encontrado. Verifique o número digitado.");
      }
    })
    .catch(() => alert("Erro ao buscar o CEP. Tente novamente."));
});
