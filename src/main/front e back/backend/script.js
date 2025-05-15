

//Funções basícas //
function voltarInicio() {
    document.getElementById('form-admin').style.display = 'none';
}
// View Cadastro Ativa/desativar
function mostrarCadastro() {
    document.getElementById('form-cadastro').style.display = 'block';
    document.getElementById('form-admin').style.display = 'none';

}
// View Login admin Ativa/desativar
function mostrarLogin() {
      document.getElementById('form-cadastro').style.display = 'none';
    document.getElementById('form-admin').style.display = 'block';
    }

// Validação de entrada admin
 function validarLogin(event) {
      event.preventDefault();
      const usuario = document.getElementById('usuario').value;
      const senha = document.getElementById('senhaCadastro').value;

      fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ users: usuario, senha: senha })
      })
      .then(response => response.text())
      .then(data => {
        if (data.includes("bem-sucedido")) {
          window.location.href = "page_adm.html";
        } else{
          alert("Usuário ou senha incorretos!");
        }return;
      })
      .catch(error => {
        console.error("Erro ao tentar login:", error);
        alert("Erro ao conectar com o servidor.");
      });
      
    } 

//Validação de cadastro

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

  fetch("http://localhost:8080/login/cadastro", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ users: nome, senha: senha, email: email})
  })
  .then(response => response.text())
  .then(data => {
    if (data.includes("Nome de usuário já existe")) {
      alert("Este nome de usuário já está cadastrado. Tente outro.");
    } else if (data.includes("Email já está cadastrado")) {
      alert("Este e-mail já está cadastrado. Use outro e-mail.");
    } else if (data.includes("sucesso")) {
      alert("Cadastro realizado com sucesso!");
      mostrarLogin();
    } else {
      alert("Erro ao cadastrar: " + data);
    }
  })
  .catch(error => {
    console.error("Erro ao cadastrar:", error);
    alert("Erro ao conectar com o servidor.");
  });
}

//Desconectar do admin
window.onload = function() {
    const deveAbrirCadastro = sessionStorage.getItem("abrirCadastro");
    if (deveAbrirCadastro === "true") {
      document.getElementById('form-cadastro').style.display = 'block';
      document.getElementById('form-admin').style.display = 'none';
      sessionStorage.removeItem("abrirCadastro");
    }
  };