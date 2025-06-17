function mostrar(id) {
  const sections = document.querySelectorAll('.conteudo');
  sections.forEach(sec => sec.classList.remove('ativo'));

  const target = document.getElementById(id);
  if (target) {
    target.classList.add('ativo');
    localStorage.setItem("abaAtiva", id);
  }
}
const nome = localStorage.getItem("usuarioNome");
document.getElementById("nomeUsuario").innerText = nome;

function toggleMenu() {
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");
  const isActive = sidebar.classList.toggle("mostrar");
  main.classList.toggle("com-menu", isActive);
  localStorage.setItem("menuAberto", isActive ? "1" : "0");
}

document.addEventListener("DOMContentLoaded", function () {
  
  const sidebar = document.getElementById("sidebar");
  const main = document.getElementById("main");

  if (localStorage.getItem("menuAberto") === "1") {
    sidebar.classList.add("mostrar");
    main.classList.add("com-menu");
  }

  const abaSalva = localStorage.getItem("abaAtiva");
  mostrar(abaSalva || "admin");
});

// ✅ Corrigido: agora só alterna as seções já existentes
function mostrarCadastro() {
  document.getElementById('admin').classList.remove('ativo');
  document.getElementById('clientes').classList.add('ativo');
}

function mostrarLogin() {
  document.getElementById('clientes').classList.remove('ativo');
  document.getElementById('admin').classList.add('ativo');
}

// 🔐 Validação de login
function validarLogin(event) {
  event.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senhaCadastro').value;

  fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users: usuario, senha: senha })
  })
    .then(response => {
  if (!response.ok) throw new Error("Usuário ou senha inválidos.");
  return response.json();
})
.then(usuario => {
  // Salva no localStorage
  localStorage.setItem("usuarioId", usuario.id);
  localStorage.setItem("usuarioNome", usuario.users);
  localStorage.setItem("usuarioEmail", usuario.email);
  localStorage.setItem("usuarioPlano", usuario.plano);

  alert("Login bem-sucedido!");
  window.location.href = "/inicio";
})
.catch(error => {
  alert(error.message || "Erro ao tentar login.");
});

}

// 📝 Validação de cadastro
function validarCadastro(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email1').value;
  const senha = document.getElementById('senhaCadastro1').value;
  const confirmarSenha = document.getElementById('confirmarSenha').value;

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  fetch("/login/cadastro", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users: nome, senha: senha, email: email })
  })
    .then(response => response.text())
    .then(data => {
      if (data.includes("Nome de usuário já existe")) {
        alert("Este nome de usuário já está cadastrado. Tente outro.");
      } else if (data.includes("Email já está cadastrado")) {
        alert("Este e-mail já está cadastrado. Use outro e-mail.");
      } else if (data.includes("sucesso")) {
        alert("Cadastro realizado com sucesso!");
        mostrarLogin(); // volta para o login
      } else {
        alert("Erro ao cadastrar: " + data);
      }
    })
    .catch(error => {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao conectar com o servidor.");
    });
}

localStorage.removeItem("abaAtiva");
