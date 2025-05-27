let pacientes = [];
let pacienteSelecionadoId = null;

window.addEventListener('DOMContentLoaded', async () => {
  await carregarPacientes();

  document.getElementById('botoesAcao').style.display = 'none';
  document.getElementById('editForm').style.display = 'none';

  document.getElementById('selectPaciente').addEventListener('change', async () => {
  const id = document.getElementById('selectPaciente').value;

  if (id) {
    pacienteSelecionadoId = id;
    document.getElementById('botoesAcao').style.display = 'block';

    try {
      const response = await fetch(`http://localhost:8080/pacientes/${pacienteSelecionadoId}`);
      if (!response.ok) throw new Error('Erro ao buscar paciente');

      const paciente = await response.json();
      preencherFormulario(paciente);
      document.getElementById('editForm').style.display = 'block';

    } catch (error) {
      console.error(error);
      alert('Erro ao carregar dados do paciente');
    }
  } else {
    pacienteSelecionadoId = null;
    document.getElementById('botoesAcao').style.display = 'none';
    document.getElementById('editForm').style.display = 'none';
  }
});

  document.getElementById('btnEditar').addEventListener('click', async () => {
    if (!pacienteSelecionadoId) return;

    try {
      const response = await fetch(`http://localhost:8080/pacientes/${pacienteSelecionadoId}`);
      if (!response.ok) throw new Error('Erro ao buscar paciente');

      const paciente = await response.json();
      console.log("Paciente carregado:", paciente);

      preencherFormulario(paciente);
      document.getElementById('editForm').style.display = 'block';
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar dados do paciente');
    }
  });
});

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

async function deletarPaciente() {
  if (!pacienteSelecionadoId) return;
  const confirmacao = confirm('Deseja realmente deletar este paciente?');
  if (!confirmacao) return;

  try {
    const response = await fetch(`http://localhost:8080/pacientes/${pacienteSelecionadoId}`, {
      method: 'DELETE'
    });

    if (!response.ok) throw new Error('Erro ao deletar paciente');

    alert('Paciente deletado com sucesso');
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('botoesAcao').style.display = 'none';
    document.getElementById('selectPaciente').value = '';
    await carregarPacientes();
  } catch (error) {
    console.error(error);
    alert('Erro ao deletar paciente');
  }
}
