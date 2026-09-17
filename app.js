import { upsertTask, removeTask, toggleTask } from "./task-store.js";

const STORAGE_KEY = "foco:tasks";
const taskApp = document.querySelector("#task-app");
let tasks = loadTasks();
let editingId = null;

function loadTasks() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []; }
  catch { return []; }
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

function render() {
  const completed = tasks.filter((task) => task.done).length;
  taskApp.innerHTML = `
    <div class="dashboard-heading">
      <div><p class="eyebrow">Meu painel</p><h1 id="app-title">Suas tarefas, no ritmo certo.</h1></div>
      <div class="metric"><strong>${completed}/${tasks.length}</strong><span>concluídas</span></div>
    </div>
    <div class="dashboard-grid">
      <form id="task-form" class="task-form card" novalidate>
        <input id="task-id" type="hidden" value="${editingId ?? ""}" />
        <h2>${editingId ? "Editar tarefa" : "Nova tarefa"}</h2>
        <label for="task-title">Título</label>
        <input id="task-title" name="title" maxlength="80" placeholder="Ex.: Revisar protótipo" required />
        <label for="task-description">Descrição</label>
        <textarea id="task-description" name="description" rows="4" maxlength="240" placeholder="Contexto e próximos passos"></textarea>
        <label for="task-priority">Prioridade</label>
        <select id="task-priority" name="priority">
          <option value="alta">Alta</option><option value="média" selected>Média</option><option value="baixa">Baixa</option>
        </select>
        <small id="task-error" class="field-error" aria-live="polite"></small>
        <button class="primary-button" type="submit">${editingId ? "Salvar alterações" : "Adicionar tarefa"}</button>
        ${editingId ? '<button id="cancel-edit" class="text-button" type="button">Cancelar edição</button>' : ""}
      </form>
      <section class="task-list" aria-labelledby="task-list-title">
        <div class="list-heading"><h2 id="task-list-title">Tarefas</h2><span>${tasks.length} ${tasks.length === 1 ? "item" : "itens"}</span></div>
        ${tasks.length ? tasks.map(taskTemplate).join("") : '<div class="empty-state"><span aria-hidden="true">◎</span><h3>Nenhuma tarefa ainda</h3><p>Crie a primeira tarefa para começar.</p></div>'}
      </section>
    </div>`;

  if (editingId) {
    const task = tasks.find((item) => item.id === editingId);
    if (task) {
      taskApp.querySelector("#task-title").value = task.title;
      taskApp.querySelector("#task-description").value = task.description;
      taskApp.querySelector("#task-priority").value = task.priority;
    }
  }
}

function taskTemplate(task) {
  return `<article class="task-item ${task.done ? "is-done" : ""}">
    <button class="check-button" data-action="toggle" data-id="${task.id}" aria-label="${task.done ? "Reabrir" : "Concluir"} ${escapeHtml(task.title)}">${task.done ? "✓" : ""}</button>
    <div class="task-copy"><div class="task-meta"><span class="priority priority-${task.priority}">${task.priority}</span></div><h3>${escapeHtml(task.title)}</h3>${task.description ? `<p>${escapeHtml(task.description)}</p>` : ""}</div>
    <div class="task-actions"><button data-action="edit" data-id="${task.id}">Editar</button><button class="danger" data-action="delete" data-id="${task.id}">Excluir</button></div>
  </article>`;
}

taskApp.addEventListener("submit", (event) => {
  if (event.target.id !== "task-form") return;
  event.preventDefault();
  const data = new FormData(event.target);
  const previous = editingId ? tasks.find((item) => item.id === editingId) : {};
  try {
    tasks = upsertTask(tasks, { ...previous, id: editingId ?? undefined, title: data.get("title"), description: data.get("description"), priority: data.get("priority") });
    editingId = null; persist(); render();
  } catch (error) { taskApp.querySelector("#task-error").textContent = error.message; }
});

taskApp.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    if (event.target.id === "cancel-edit") { editingId = null; render(); }
    return;
  }
  const { action, id } = button.dataset;
  if (action === "toggle") tasks = toggleTask(tasks, id);
  if (action === "delete") tasks = removeTask(tasks, id);
  if (action === "edit") editingId = id;
  persist(); render();
});

document.addEventListener("foco:ready", render);
if (!document.querySelector("#app-view").hidden) render();
