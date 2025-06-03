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
      const response = await fetch(`http://localhost:8080/pacientes/${pacienteSelecionadoId}`);
      if (response.ok) {
        const paciente = await response.json();
        preencherFormulario(paciente);
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
      const response = await fetch('http://localhost:8080/pacientes');
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
          const res = await fetch(`http://localhost:8080/pacientes/${paciente.id}`);
          if (!res.ok) return alert('Erro ao buscar paciente');
          const p = await res.json();
          preencherFormulario(p);
          document.getElementById('selectPaciente').value = paciente.id;
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
            const resp = await fetch(`http://localhost:8080/pacientes/${paciente.id}`, { method: 'DELETE' });
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
    const response = await fetch('http://localhost:8080/pacientes');
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
    document.getElementById('selectPaciente').value = '';
    await carregarPacientes();
  } catch (error) {
    console.error(error);
    alert('Erro ao salvar alterações');
  }
}

function voltarEdicao() {
  document.getElementById('editForm').style.display = 'none';
  document.getElementById('selectPaciente').value = '';
  pacienteSelecionadoId = null;
  document.getElementById('botoesAcao').style.display = 'none';
}
