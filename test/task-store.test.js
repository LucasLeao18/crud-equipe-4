import test from "node:test";
import assert from "node:assert/strict";
import { normalizeTask, removeTask, toggleTask, upsertTask } from "../task-store.js";

test("normaliza uma tarefa válida", () => {
  const task = normalizeTask({ title: "  Estudar testes  ", priority: "alta" });
  assert.equal(task.title, "Estudar testes");
  assert.equal(task.done, false);
  assert.ok(task.id);
});

test("rejeita título curto e prioridade inválida", () => {
  assert.throws(() => normalizeTask({ title: "Oi", priority: "alta" }), /3 caracteres/);
  assert.throws(() => normalizeTask({ title: "Tarefa", priority: "urgente" }), /prioridade válida/);
});

test("cria e atualiza sem duplicar", () => {
  const created = upsertTask([], { id: "1", title: "Primeira tarefa", priority: "média" });
  const updated = upsertTask(created, { ...created[0], title: "Tarefa atualizada" });
  assert.equal(updated.length, 1);
  assert.equal(updated[0].title, "Tarefa atualizada");
});

test("alterna conclusão e exclui tarefa", () => {
  const tasks = [{ id: "1", title: "Tarefa", priority: "baixa", done: false }];
  assert.equal(toggleTask(tasks, "1")[0].done, true);
  assert.deepEqual(removeTask(tasks, "1"), []);
});
