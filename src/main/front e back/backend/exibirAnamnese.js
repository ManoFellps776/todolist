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
    const res = await fetch("http://localhost:8080/pacientes");
    const pacientes = await res.json();

    select.innerHTML = '<option value="">Selecione um paciente</option>';
    pacientes.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id;
      option.textContent = p.nome;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar pacientes:", err);
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
    const agendamentos = await res.json();

    if (agendamentos.length === 0) {
      container.innerHTML = "<p>Nenhum agendamento encontrado.</p>";
    } else {
      agendamentos.forEach(a => {
        // Formata data para dd/MM/yy
        const data = new Date(a.data);
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = String(data.getFullYear()).slice(-2); // pega os 2 últimos dígitos
        const dataFormatada = `${dia}/${mes}/${ano}`;

        // Hora no formato HH:mm (sem segundos)
        const horaFormatada = a.hora?.substring(0, 5);

        container.innerHTML += `<div>Data: ${dataFormatada} às ${horaFormatada} → ${a.descricao}</div>`;
      });
    }
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
  }
}

async function preencherPaciente() {
  const id = document.getElementById("pacienteAnamnese").value;
  if (!id) return;

  try {
    const res = await fetch(`http://localhost:8080/pacientes/${id}`);
    const p = await res.json();
    const f = document.getElementById("formAnamnese");

    f.nomeA.value = p.nome || "";
    f.cpfA.value = p.cpf || "";
    f.nascimentoA.value = p.birthday || "";
    f.telefoneA.value = p.telefone || "";
    f.emailA.value = p.email || "";
    f.enderecoA.value = p.rua || "";
    f.cidadeA.value = p.cidade || "";
    f.sexo.value = "";
    f.altura.value = "";
    f.pesoAtual.value = "";
    f.pesoIdeal.value = "";
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
    const cpf = paciente?.cpf?.replace(/\D/g, ""); // Remove pontos e traços

    if (!cpf) {
      container.innerHTML = "<p>Paciente sem CPF cadastrado.</p>";
      return;
    }

    const res = await fetch(`http://localhost:8080/anamnese/paciente/${cpf}`);
    if (!res.ok) throw new Error("Erro ao buscar anamneses");

    const registros = await res.json();
    if (!Array.isArray(registros)) throw new Error("Formato inválido da resposta");

    // Filtro usando CPF limpo
    const registrosPaciente = registros.filter(r => r.cpfA?.replace(/\D/g, "") === cpf);

    if (registrosPaciente.length === 0) {
      container.innerHTML = "<p>Paciente não tem histórico de anamnese.</p>";
      return;
    }

    registrosPaciente.forEach(a => {
      const dataCriacao = a.dataCriacao ? new Date(a.dataCriacao).toLocaleDateString() : new Date().toLocaleDateString();

      container.innerHTML += `
        <div class="registro-card">
          <strong>Data de criação:</strong> ${dataCriacao}<br>
          <strong>Nome do paciente:</strong> ${a.nomeA}<br>
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

  const data = {
    nomeA: form.nomeA.value,
    cpfA: form.cpfA.value,
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

    obs: form.obs.value
  };

  try {
    const res = await fetch("http://localhost:8080/anamnese", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert("✅ Anamnese salva com sucesso!");

      // ✅ Limpa apenas os campos, mantém paciente selecionado
      const pacienteId = document.getElementById("pacienteAnamnese").value;
      form.reset();

      // ✅ Mostra só os botões
      document.getElementById("criarAnamnese").style.display = "none";
      document.getElementById("registroAnamnese").style.display = "none";
      document.getElementById("agendamentos").style.display = "none";
      document.getElementById("botoesAcaoAnamnese").style.display = "flex";

      // ✅ Reforça manter paciente selecionado
      document.getElementById("pacienteAnamnese").value = pacienteId;

    } else {
      alert("❌ Erro ao salvar anamnese.");
    }
  } catch (err) {
    console.error("Erro:", err);
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
    const addCampo = (label, valor) => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`${label}:`, 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${valor || "-"}`, 60, y);
      y += 7;
    };

    // Seção: Dados Pessoais
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Dados Pessoais", 15, y);
    y += 6;

    addCampo("Nome", a.nomeA);
    addCampo("CPF", a.cpfA);
    addCampo("Nascimento", a.nascimentoA);
    addCampo("Telefone", a.telefoneA);
    addCampo("Email", a.emailA);
    addCampo("Endereço", a.enderecoA);
    addCampo("Cidade", a.cidadeA);
    addCampo("Sexo", a.sexo === "m" ? "Masculino" : a.sexo === "f" ? "Feminino" : "-");
    addCampo("Altura", a.altura);
    addCampo("Peso Atual", a.pesoAtual);
    addCampo("Peso Ideal", a.pesoIdeal);

    // Seção: Histórico
    y += 5;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Histórico", 15, y);
    y += 6;

    const check = (txt, val) => {
      doc.setFont("helvetica", "normal");
      doc.text(`[${val ? "X" : " "}] ${txt}`, 20, y);
      y += 6;
    };

    check("Ingestão de Água Diária", a.agua);
    check("Horas de Sono", a.sono);
    check("Atividade Física", a.atividade);
    check("Bebidas Alcoólicas", a.etilismo);
    check("Intestino Regular", a.intestino);
    check("Gestante", a.gestante);
    check("Cirurgias", a.cirurgias);
    check("Diabetes", a.diabetes);

    // Seção: Outras Informações
    y += 6;
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Outras Informações", 15, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(a.obs || "-", 15, y, { maxWidth: 180 });

    // Termo de responsabilidade
    y += 30;
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    doc.text(
      "Declaro que as informações acima são verdadeiras, não cabendo ao profissional quaisquer responsabilidades\npor informações contidas nesta anamnese.",
      15,
      y
    );

    // Assinatura e data
    y += 25;
    doc.setFont("helvetica", "normal");
    doc.setLineWidth(0.1);
    doc.line(20, y, 90, y); // linha da assinatura
    doc.line(120, y, 170, y); // linha da data
    y += 5;
    doc.text("Assinatura do Paciente", 30, y);
    doc.text("Data", 135, y);

    // Salvar PDF
    doc.save(`anamnese_${a.nomeA}.pdf`);
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