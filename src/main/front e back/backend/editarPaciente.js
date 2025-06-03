let pacientes = [];
let mostrandoLista = false;
let pacienteSelecionadoId = null;

window.addEventListener('DOMContentLoaded', async () => {
  await carregarPacientes();

  document.getElementById('botoesAcao').style.display = 'none';
  document.getElementById('editForm').style.display = 'none';
//Selecionar paciente manualmente

  document.getElementById('selectPaciente').addEventListener('change', async () => {
  const id = document.getElementById('selectPaciente').value;
  const btnEditar = document.getElementById('btnEditar');

  if (id) {
    pacienteSelecionadoId = Number(id); // garantir que seja número
    document.getElementById('botoesAcao').style.display = 'block';
    btnEditar.textContent = 'Editar Paciente';

    try {
      const response = await fetch(`http://localhost:8080/pacientes/${pacienteSelecionadoId}`);
      if (!response.ok) throw new Error('Erro ao buscar paciente');
      const paciente = await response.json();
      preencherFormulario(paciente);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar informações do paciente.");
    }

  } else {
    pacienteSelecionadoId = null;
    document.getElementById('botoesAcao').style.display = 'none';
    document.getElementById('editForm').style.display = 'none';
  }
});


// Botão de Listar
document.getElementById('btnListar').addEventListener('click', async () => {
  const listaContainer = document.getElementById('listaPacientes');
  const botaoListar = document.getElementById('btnListar');
  const form = document.getElementById('editForm');
  const botaoEditar = document.getElementById('btnEditar');

  // Se a lista está visível, fecha
  if (mostrandoLista) {
    listaContainer.style.display = 'none';
    botaoListar.textContent = 'Listar Pacientes';
    mostrandoLista = false;
    return;
  }

  // Fecha edição se estiver aberta
  if (form.style.display === 'block') {
    form.style.display = 'none';
    botaoEditar.textContent = 'Editar Paciente';
  }

  try {
    const response = await fetch('http://localhost:8080/pacientes');
    if (!response.ok) throw new Error('Erro ao carregar pacientes');

    const pacientes = await response.json();
    listaContainer.innerHTML = ''; // Limpa lista antiga

    pacientes.forEach(paciente => {
      const item = document.createElement('div');
      item.textContent = paciente.nome;
      item.classList.add('paciente-lista-item');
      item.style.cursor = 'pointer';
      item.onclick = () => {
        document.getElementById('selectPaciente').value = paciente.id;
        pacienteSelecionadoId = paciente.id;
        document.getElementById('botoesAcao').style.display = 'block';
        listaContainer.style.display = 'none';
        botaoListar.textContent = 'Listar Pacientes';
        mostrandoLista = false;
        preencherFormulario(paciente);
      };
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

// Botão de Editar
document.getElementById('btnEditar').addEventListener('click', async () => {
  const btnEditar = document.getElementById('btnEditar');
  const form = document.getElementById('editForm');
  const listaContainer = document.getElementById('listaPacientes');
  const botaoListar = document.getElementById('btnListar');

  if (!pacienteSelecionadoId) return;

  // Fecha a lista se estiver aberta
  if (mostrandoLista) {
    listaContainer.style.display = 'none';
    botaoListar.textContent = 'Listar Pacientes';
    mostrandoLista = false;
  }

  // Toggle do formulário
  if (form.style.display === 'block') {
    form.style.display = 'none';
    btnEditar.textContent = 'Editar Paciente';
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/pacientes/${pacienteSelecionadoId}`);
    if (!response.ok) throw new Error('Erro ao buscar paciente');

    const paciente = await response.json();
    preencherFormulario(paciente);

    form.style.display = 'block';
    btnEditar.textContent = 'Fechar Edição';

  } catch (error) {
    console.error(error);
    alert('Erro ao carregar dados do paciente');
  }
});
});
//Carregar paciente
async function carregarPacientes() {
  try {
    const response = await fetch('http://localhost:8080/pacientes');
    if (!response.ok) throw new Error('Erro ao carregar pacientes');
    pacientes = await response.json();

    const select = document.getElementById('selectPaciente');
    select.innerHTML = '<option value="">Selecione um paciente</option>'; // limpa antes de preencher

    pacientes.forEach(p => {
      const option = document.createElement('option');
      option.value = p.id;
      option.textContent = p.nome;
      select.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    alert('Erro ao carregar lista de pacientes');
  }
}

function preencherFormulario(p) {
  document.getElementById('nomeEd').value = p.nome || '';
  document.getElementById('cpfCnpjEd').value = p.cpf || '';

  // Corrigir o campo de data para o formato YYYY-MM-DD
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
}
//Salvar alteração do paciente
async function salvarAlteracoes(event) {
    btnEditar.textContent = 'Editar Paciente';
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
    descricao: document.getElementById('descricaoEd').value
  };

  try {
    const response = await fetch(`http://localhost:8080/pacientes/${pacienteSelecionadoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pacienteAtualizado)
    });

    if (!response.ok) throw new Error('Erro ao atualizar paciente');

    alert('Paciente atualizado com sucesso!');
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('botoesAcao').style.display = 'none';
    document.getElementById('selectPaciente').value = '';
    await carregarPacientes();
  } catch (error) {
    console.error(error);
    alert('Erro ao salvar alterações');
  }
}
//Deletar cadastro do paciente
async function deletarPaciente() {
  const select = document.getElementById('selectPaciente');
  pacienteSelecionadoId = Number(select.value);

  if (!pacienteSelecionadoId || isNaN(pacienteSelecionadoId)) {
    alert("Nenhum paciente selecionado!");
    return;
  }

  // Pega o nome do paciente direto do <option>
  const nomeSelecionado = select.options[select.selectedIndex].text;

  const confirmacao = confirm(`Deseja realmente deletar o paciente: "${nomeSelecionado}"?`);
  if (!confirmacao) return;

  try {
    const response = await fetch(`http://localhost:8080/pacientes/${pacienteSelecionadoId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Erro ao deletar paciente');

    alert(`Paciente "${nomeSelecionado}" deletado com sucesso!`);
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('botoesAcao').style.display = 'none';
    select.value = '';
    pacienteSelecionadoId = null;
    await carregarPacientes();
  } catch (error) {
    console.error("Erro ao deletar:", error);
    alert('Erro ao deletar paciente');
  }
}


