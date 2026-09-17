export const PRIORITIES = ["alta", "média", "baixa"];

export function normalizeTask(input) {
  const title = String(input.title ?? "").trim();
  if (title.length < 3) throw new Error("O título deve ter pelo menos 3 caracteres.");
  if (!PRIORITIES.includes(input.priority)) throw new Error("Selecione uma prioridade válida.");
  return {
    id: input.id ?? crypto.randomUUID(),
    title,
    description: String(input.description ?? "").trim(),
    priority: input.priority,
    done: Boolean(input.done),
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

export function upsertTask(tasks, input) {
  const task = normalizeTask(input);
  const index = tasks.findIndex((item) => item.id === task.id);
  if (index === -1) return [task, ...tasks];
  return tasks.map((item) => (item.id === task.id ? task : item));
}

export function removeTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

export function toggleTask(tasks, id) {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
}
