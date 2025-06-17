document.addEventListener("DOMContentLoaded", () => {
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "menuinicial.html";
  }
});
let pacientes = [];
let mostrandoLista = false;
let pacienteSelecionadoId = null;

window.addEventListener('DOMContentLoaded', async () => {
  await carregarPacientes();
  document.getElementById('editForm').style.display = 'none';

  document.getElementById('selectPaciente').addEventListener('change', async () => {
  const id = document.getElementById('selectPaciente').value;
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    alert("Você precisa estar logado.");
    window.location.href = "menuinicial.html";
    return;
  }

  if (id) {
    pacienteSelecionadoId = Number(id);
    const response = await fetch(`http://localhost:8080/pacientes/${pacienteSelecionadoId}?usuarioId=${usuarioId}`);
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
  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId) {
    alert("Você precisa estar logado.");
    window.location.href = "menuinicial.html";
    return;
  }

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
    const response = await fetch(`http://localhost:8080/pacientes?usuarioId=${usuarioId}`);
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
        const res = await fetch(`http://localhost:8080/pacientes/${paciente.id}?usuarioId=${usuarioId}`);
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
          const resp = await fetch(`http://localhost:8080/pacientes/${paciente.id}?usuarioId=${usuarioId}`, {
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
  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId) {
    alert("Você precisa estar logado.");
    window.location.href = "menuinicial.html";
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/pacientes?usuarioId=${usuarioId}`);
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

  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId) {
    alert("Você precisa estar logado.");
    window.location.href = "menuinicial.html";
    return;
  }

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
    const response = await fetch(`http://localhost:8080/pacientes/${pacienteSelecionadoId}?usuarioId=${usuarioId}`, {
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

  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId) {
    alert("Você precisa estar logado.");
    window.location.href = "menuinicial.html";
    return;
  }

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
      ? `http://localhost:8080/pacientes/${pacienteSelecionadoId}?usuarioId=${usuarioId}` 
      : `http://localhost:8080/pacientes?usuarioId=${usuarioId}`;

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
  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId) {
    alert("Você precisa estar logado.");
    window.location.href = "menuinicial.html";
    return;
  }

  const select = document.getElementById('selectPaciente');
  const idSelecionado = select.value;

  if (!idSelecionado) {
    alert('Selecione um paciente para editar.');
    return;
  }

  try {
    const res = await fetch(`http://localhost:8080/pacientes/${idSelecionado}?usuarioId=${usuarioId}`);
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
