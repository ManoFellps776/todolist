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

  const usuarioId = localStorage.getItem("usuarioId");
  if (!usuarioId) {
    alert("Usuário não identificado.");
    return;
  }

  const nome = document.getElementById("novoNome").value.trim();
  const email = document.getElementById("novoEmail").value.trim();

  if (!nome || !email) {
    alert("Preencha todos os campos.");
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/login/usuarios/${usuarioId}`, {
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
