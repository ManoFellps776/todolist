function abrirFormularioServico() {
  document.getElementById("popupServico").style.display = "flex";
}

function fecharFormularioServico() {
  document.getElementById("popupServico").style.display = "none";
}

// 📦 Carrega os serviços do usuário logado
async function carregarServicos() {
  try {
    const resp = await fetch("/servicos", {
      method: "GET",
      credentials: "include" // Inclui cookies para autenticação por sessão
    });

    if (!resp.ok) throw new Error("Erro ao carregar serviços");

    const servicos = await resp.json();

    const lista = document.getElementById("listaServicos");
    const select = document.getElementById("servicoSelect");

    lista.innerHTML = "";
    select.innerHTML = '<option value="">Selecione um serviço</option>';

    servicos.forEach(s => {
      const li = document.createElement("li");
      li.textContent = `${s.nome} - R$ ${s.preco.toFixed(2)} (${s.duracao} min)`;
      lista.appendChild(li);

      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.nome;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error("❌ Erro ao carregar serviços:", err);
    alert("Erro ao carregar os serviços. Verifique a conexão ou o login.");
  }
}

// 📩 Envia novo serviço para o backend
document.getElementById("formServico").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nomeServico").value.trim();
  const preco = parseFloat(document.getElementById("precoServico").value);
  const duracao = parseInt(document.getElementById("duracaoServico").value);

  if (!nome || isNaN(preco) || isNaN(duracao)) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  try {
    const resp = await fetch("/servicos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nome, preco, duracao })
    });

    if (!resp.ok) throw new Error("Erro ao salvar");

    alert("✅ Serviço criado!");
    fecharFormularioServico();
    carregarServicos();
  } catch (err) {
    console.error("❌ Erro ao salvar serviço:", err);
    alert("Erro ao salvar serviço. Tente novamente.");
  }
});


// Função futura para lançar movimentações
async function lancarMovimento() {
  const tipo = document.getElementById("tipoLancamento").value;
  const valor = parseFloat(document.getElementById("valorLancamento").value);
  const data = document.getElementById("dataLancamento").value;
  const descricao = document.getElementById("descricaoLancamento").value;

  if (!tipo || isNaN(valor) || !data) {
    alert("Preencha os campos obrigatórios: tipo, valor e data.");
    return;
  }

  const body = {
    tipo: tipo.toUpperCase(), // receita ou despesa
    valor: valor,
    data: data,
    descricao: descricao
  };

  try {
    const response = await fetch("/financeiro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include", // para enviar cookies/session se estiver usando Spring Security com sessão
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(erro);
    }

    const json = await response.json();
    alert("Movimento lançado com sucesso!");

    // opcional: atualizar o dashboard automaticamente
    atualizarDashboard();

    // limpar campos
    document.getElementById("tipoLancamento").value = "receita";
    document.getElementById("valorLancamento").value = "";
    document.getElementById("dataLancamento").value = "";
    document.getElementById("descricaoLancamento").value = "";

  } catch (error) {
    console.error("Erro ao lançar nota:", error);
    alert("Erro ao lançar nota: " + error.message);
  }
}

function atualizarDashboard() {
  fetch("/financeiro/resumo", {
    method: "GET",
    credentials: "include" // ou headers com Authorization, conforme seu login
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao buscar resumo financeiro");
      return res.json();
    })
    .then(dados => {
      document.getElementById("saldoTotal").textContent = formatarMoeda(dados.saldo);
      document.getElementById("totalReceitas").textContent = formatarMoeda(dados.receitas);
      document.getElementById("totalDespesas").textContent = formatarMoeda(dados.despesas);
    })
    .catch(err => {
      console.error("Erro ao atualizar dashboard:", err);
    });
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

