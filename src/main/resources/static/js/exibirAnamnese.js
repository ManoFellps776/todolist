document.addEventListener("DOMContentLoaded", () => {
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "menuinicial.html"; // redireciona para o login
  }
});
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

  const usuarioId = localStorage.getItem("usuarioId");

  try {
    const res = await fetch(`http://localhost:8080/pacientes?usuarioId=${usuarioId}`);
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
    const res = await fetch(`http://localhost:8080/agendamentos/paciente/${idPaciente}`);
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
    const res = await fetch(`http://localhost:8080/pacientes/${id}`);
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
    if (f.usuarioId) {
      f.usuarioId.value = localStorage.getItem("usuarioId") || "";
    }
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
    const pacienteRes = await fetch(`http://localhost:8080/pacientes/${idPaciente}`);
    if (!pacienteRes.ok) throw new Error("Erro ao buscar paciente");

    const paciente = await pacienteRes.json();
    const cpf = paciente?.cpf?.replace(/\D/g, ""); // Remove tudo que não é número

    if (!cpf) {
      container.innerHTML = "<p>Paciente sem CPF cadastrado.</p>";
      return;
    }

    const res = await fetch(`http://localhost:8080/anamnese/paciente/${cpf}?usuarioId=${localStorage.getItem("usuarioId")}`);

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
    const res = await fetch(`http://localhost:8080/anamnese/${id}`, {
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
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    alert("⚠️ Usuário não identificado. Faça login novamente.");
    window.location.href = "menuinicial.html";
    return;
  }

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
    const res = await fetch(`http://localhost:8080/anamnese?usuarioId=${usuarioId}`, {
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
    const res = await fetch(`http://localhost:8080/anamnese/${id}`);
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
    const res = await fetch(`http://localhost:8080/anamnese/${id}`);
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