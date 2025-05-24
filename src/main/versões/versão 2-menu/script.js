
function mostrar(id) {
    const sections = document.querySelectorAll('.conteudo');
    sections.forEach(sec => sec.classList.remove('ativo'));
    document.getElementById(id).classList.add('ativo');
    document.getElementById("sidebar").classList.remove("mostrar");
    document.getElementById("main").classList.remove("com-menu");
}

function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");
    sidebar.classList.toggle("mostrar");
    main.classList.toggle("com-menu");
}

document.addEventListener("DOMContentLoaded", function () {
    const clienteBtn = document.querySelector("#clientes button");
    const clienteList = document.querySelector("#clientes ul");

    clienteBtn.addEventListener("click", () => {
        const nome = document.querySelector("#clientes input[type='text']").value;
        const email = document.querySelector("#clientes input[type='email']").value;
        if (nome && email) {
            const li = document.createElement("li");
            li.innerHTML = `${nome} - ${email} <button class='del'>Deletar</button>`;
            clienteList.appendChild(li);
            li.querySelector(".del").addEventListener("click", () => {
                li.remove();
            });
        }
    });
});
