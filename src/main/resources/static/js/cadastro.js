
document.getElementById('cadastroForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const usuarioId = localStorage.getItem("usuarioId");

  if (!usuarioId) {
    alert("Você precisa estar logado.");
    window.location.href = "menuinicial.html";
    return;
  }

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
    const response = await fetch(`http://localhost:8080/pacientes?usuarioId=${usuarioId}`, {
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
