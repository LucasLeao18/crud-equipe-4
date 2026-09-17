const loginView = document.querySelector("#login-view");
const appView = document.querySelector("#app-view");
const loginForm = document.querySelector("#login-form");
const greeting = document.querySelector("#user-greeting");

function showApp(user) {
  loginView.hidden = true;
  appView.hidden = false;
  greeting.textContent = `Olá, ${user.name}`;
  document.dispatchEvent(new CustomEvent("foco:ready", { detail: user }));
}

function validate(name, email) {
  const errors = {};
  if (name.trim().length < 2) errors.name = "Informe um nome com pelo menos 2 caracteres.";
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = "Informe um e-mail válido.";
  return errors;
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const user = { name: String(data.get("name")).trim(), email: String(data.get("email")).trim() };
  const errors = validate(user.name, user.email);

  document.querySelector("#name-error").textContent = errors.name ?? "";
  document.querySelector("#email-error").textContent = errors.email ?? "";
  if (Object.keys(errors).length) return;

  localStorage.setItem("foco:user", JSON.stringify(user));
  showApp(user);
});

document.querySelector("#logout-button").addEventListener("click", () => {
  localStorage.removeItem("foco:user");
  appView.hidden = true;
  loginView.hidden = false;
  loginForm.reset();
});

try {
  const savedUser = JSON.parse(localStorage.getItem("foco:user"));
  if (savedUser?.name && savedUser?.email) showApp(savedUser);
} catch {
  localStorage.removeItem("foco:user");
}
