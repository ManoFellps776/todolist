// ➕ Formata CPF ou CNPJ automaticamente
function formatarCpfCnpj(valor) {
  valor = valor.replace(/\D/g, "");
  if (valor.length <= 11) {
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");
  }
  return valor;
}

// ➕ Formata número de telefone
function formatarTelefone(valor) {
  valor = valor.replace(/\D/g, "");
  if (valor.length > 10) {
    return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else {
    return valor.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  }
}

// ✅ Aguarda DOM carregar
document.addEventListener("DOMContentLoaded", async () => {
  let usuarioId = null;

  try {
    const userRes = await fetch("/login/logado", {
      credentials: "include"
    });

    if (!userRes.ok) throw new Error("Falha ao buscar usuário logado");

    const user = await userRes.json();
    usuarioId = user.id;

    // Exibir nome no formulário
    document.getElementById("NomeConcluaCadastro").innerText = user.nome;

    // Verificar se já preencheu os dados
    const dadosRes = await fetch(`/dados/existe/${usuarioId}`, {
      credentials: "include"
    });

    const existe = await dadosRes.json();

    if (!existe) {
      document.getElementById("popupCadastro").style.display = "flex";
      document.body.style.overflow = "hidden";
    }
  } catch (err) {
    console.error("Erro ao obter dados do usuário:", err);
    return;
  }

  const cpfCnpjInput = document.getElementById("cpfCnpj");
  const telefoneInput = document.getElementById("telefone");

  cpfCnpjInput.addEventListener("input", () => {
    cpfCnpjInput.value = formatarCpfCnpj(cpfCnpjInput.value);
  });

  telefoneInput.addEventListener("input", () => {
    telefoneInput.value = formatarTelefone(telefoneInput.value);
  });

  document.getElementById("formDados").addEventListener("submit", async (e) => {
    e.preventDefault();

    const cpfCnpj = cpfCnpjInput.value;
    const telefone = telefoneInput.value;
    const dataNascimento = document.getElementById("dataNascimento").value;
    const foto = document.getElementById("foto").files[0];

    // Validação de CPF/CNPJ
    if (!validarCpfCnpj(cpfCnpj)) {
      alert("CPF ou CNPJ inválido.");
      return;
    }

    const formData = new FormData();
    formData.append("cpfCnpj", cpfCnpj);
    formData.append("telefone", telefone);
    formData.append("dataNascimento", dataNascimento);
    formData.append("foto", foto);

    try {
      const res = await fetch(`/dados/completar/${usuarioId}`, {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (res.ok) {
        alert("✅ Dados salvos com sucesso!");
        document.getElementById("popupCadastro").style.display = "none";
        document.body.style.overflow = "auto";
      } else {
        const erro = await res.text();
        alert("Erro: " + erro);
      }
    } catch (err) {
      alert("Erro ao enviar dados: " + err.message);
    }
  });
});
