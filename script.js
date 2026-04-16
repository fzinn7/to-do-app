const input = document.getElementById("taskInput");
const select = document.getElementById("prioritySelect");
const button = document.getElementById("addTaskBtn");
const list = document.getElementById("taskList");
const filtro = document.getElementById("filtro");
const toggleTheme = document.getElementById("toggleTheme");

let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

// 🌙 Tema salvo
const temaSalvo = localStorage.getItem("tema");
if (temaSalvo === "light") {
    document.body.classList.add("light");
}

// Alternar tema
toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("light");

    const temaAtual = document.body.classList.contains("light") ? "light" : "dark";
    localStorage.setItem("tema", temaAtual);
});

// Salvar tarefas
function salvarTarefas() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

// Criar tarefa
function criarTarefa(texto, prioridade) {
    return {
        id: Date.now(),
        texto,
        prioridade,
        concluida: false
    };
}

// Renderizar
function renderizarTarefas() {
    list.innerHTML = "";

    const filtroAtual = filtro.value;

    const tarefasFiltradas = tarefas.filter(t => {
        if (filtroAtual === "todas") return true;
        return t.prioridade === filtroAtual;
    });

    tarefasFiltradas.forEach(tarefa => {
        const li = document.createElement("li");
        const span = document.createElement("span");

        const btnConcluir = document.createElement("button");
        const btnExcluir = document.createElement("button");
        const btnEditar = document.createElement("button");

        span.textContent = tarefa.texto;

        btnConcluir.textContent = "✔";
        btnExcluir.textContent = "🗑";
        btnEditar.textContent = "✏";

        li.classList.add(tarefa.prioridade);

        if (tarefa.concluida) {
            li.classList.add("concluida");
        }

        // ✔ Concluir
        btnConcluir.addEventListener("click", () => {
            tarefa.concluida = !tarefa.concluida;
            salvarTarefas();
            renderizarTarefas();
        });

        // 🗑 Excluir
        btnExcluir.addEventListener("click", () => {
            tarefas = tarefas.filter(t => t.id !== tarefa.id);
            salvarTarefas();
            renderizarTarefas();
        });

        // ✏ Editar
        btnEditar.addEventListener("click", () => {
            const novoTexto = prompt("Editar tarefa:", tarefa.texto);

            if (novoTexto && novoTexto.trim() !== "") {
                tarefa.texto = novoTexto.trim();
                salvarTarefas();
                renderizarTarefas();
            }
        });

        li.appendChild(span);
        li.appendChild(btnConcluir);
        li.appendChild(btnEditar);
        li.appendChild(btnExcluir);

        list.appendChild(li);
    });
}

// Adicionar
function adicionarTarefa() {
    const texto = input.value.trim();
    const prioridade = select.value;

    if (!texto) {
        alert("Digite uma tarefa!");
        return;
    }

    const novaTarefa = criarTarefa(texto, prioridade);
    tarefas.push(novaTarefa);

    salvarTarefas();
    renderizarTarefas();

    input.value = "";
}

// Eventos
button.addEventListener("click", adicionarTarefa);

input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        adicionarTarefa();
    }
});

filtro.addEventListener("change", renderizarTarefas);

// Inicialização
renderizarTarefas();
