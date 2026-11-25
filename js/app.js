const STORAGE_KEY = "mantenisoft_requests";
const VALID_STATUSES = ["Pendiente", "En proceso", "Finalizada"];
const form = document.getElementById("requestForm");
const requestList = document.getElementById("requestList");
const emptyState = document.getElementById("emptyState");
const statusFilter = document.getElementById("statusFilter");
const actionMessage = document.getElementById("actionMessage");
const storageMessage = document.getElementById("storageMessage");
let storageReadFailed = false;
let requests = loadRequests();

function showActionMessage(text, isError = false) {
  actionMessage.textContent = text;
  actionMessage.classList.toggle("error", isError);
}

function loadRequests() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === null) return [];
    const parsed = JSON.parse(stored);
    const isRequest = item => item && typeof item === "object"
      && typeof item.id === "string" && item.id.length > 0
      && typeof item.title === "string" && item.title.trim().length > 0
      && typeof item.description === "string"
      && typeof item.type === "string"
      && ["Alta", "Media", "Baja"].includes(item.priority)
      && VALID_STATUSES.includes(item.status)
      && typeof item.createdAt === "string";
    if (!Array.isArray(parsed) || !parsed.every(isRequest)
      || new Set(parsed.map(item => item.id)).size !== parsed.length) {
      throw new Error("Formato de solicitudes no válido");
    }
    return parsed;
  } catch {
    storageReadFailed = true;
    storageMessage.textContent = "No pudimos recuperar tus solicitudes. Para proteger los datos guardados, los cambios están bloqueados. Vuelve a cargar la página; si el problema continúa, solicita ayuda.";
    return [];
  }
}

function saveRequests(nextRequests) {
  if (storageReadFailed) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRequests));
    storageMessage.textContent = "";
    return true;
  } catch {
    storageMessage.textContent = "No se pudo guardar el cambio. No se aplicó la modificación y los datos anteriores se conservan. Comprueba que el navegador permita guardar datos y vuelve a intentarlo.";
    return false;
  }
}


function renderRequests() {
  const filter = statusFilter.value;

  // Mostrar primero las solicitudes más recientes
  const sortedRequests = [...requests];

  const visible = sortedRequests.filter(
    item => filter === "Todas" || item.status === filter
  );

  requestList.innerHTML = "";
  emptyState.hidden = visible.length > 0;
  emptyState.textContent = requests.length === 0
    ? "Todavía no hay solicitudes registradas."
    : "No hay solicitudes con el estado seleccionado.";

  visible.forEach(item => {
    const card = document.createElement("article");
    card.className = "request-card";
    card.dataset.requestId = item.id;

    const content = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = item.title;

    const description = document.createElement("p");
    description.textContent = item.description;

    // Información de la solicitud
    const meta = document.createElement("div");
    meta.className = "meta";

    [
      item.type,
      `Prioridad: ${item.priority}`,
      `Creada: ${item.createdAt}`
    ].forEach(value => {
      const pill = document.createElement("span");
      pill.className = "pill";
      pill.textContent = value;
      meta.appendChild(pill);
    });

    // Mostrar el estado de la solicitud
    const statusBadge = document.createElement("span");
    statusBadge.className =
      `status-badge status-${item.status.toLowerCase().replace(" ", "-")}`;
    statusBadge.textContent = item.status;

    // Mostrar la prioridad de forma visual
    const priorityBadge = document.createElement("span");
    priorityBadge.className =
      `priority-badge priority-${item.priority.toLowerCase()}`;
    priorityBadge.textContent = `Prioridad ${item.priority}`;

    content.append(title, description, meta, statusBadge, priorityBadge);

    const actions = document.createElement("div");
    actions.className = "actions";

    const select = document.createElement("select");
    select.setAttribute("aria-label", `Estado de ${item.title}`);

    VALID_STATUSES.forEach(status => {
      const option = document.createElement("option");
      option.value = status;
      option.textContent = status;
      option.selected = item.status === status;
      select.appendChild(option);
    });

    select.addEventListener("change", () => {
      updateStatus(item.id, select.value);
    });

    const removeButton = document.createElement("button");
    removeButton.className = "delete";
    removeButton.type = "button";
    removeButton.textContent = "Eliminar";
    removeButton.setAttribute("aria-label", `Eliminar solicitud ${item.title}`);
    removeButton.addEventListener("click", () => {
      deleteRequest(item.id);
    });

    actions.append(select, removeButton);
    card.append(content, actions);
    requestList.appendChild(card);
  });

  document.getElementById("totalCount").textContent = requests.length;
  document.getElementById("pendingCount").textContent = requests.filter(x => x.status === "Pendiente").length;
  document.getElementById("progressCount").textContent = requests.filter(x => x.status === "En proceso").length;
  document.getElementById("doneCount").textContent = requests.filter(x => x.status === "Finalizada").length;
}


form.addEventListener("submit", event => {
  event.preventDefault();

  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const message = document.getElementById("formMessage");

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  // Limpiar validaciones anteriores
  titleInput.removeAttribute("aria-invalid");
  descriptionInput.removeAttribute("aria-invalid");
  message.classList.remove("error");
  message.textContent = "";

  // Validar el título
  if (!title) {
    message.textContent = "Por favor, escribe el título de la solicitud.";
    message.classList.add("error");
    titleInput.setAttribute("aria-invalid", "true");
    titleInput.focus();
    return;
  }

  // Validar la descripción
  if (!description) {
    message.textContent = "Por favor, escribe una descripción de la solicitud.";
    message.classList.add("error");
    descriptionInput.setAttribute("aria-invalid", "true");
    descriptionInput.focus();
    return;
  }

  const nextRequests = [{
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title,
    description,
    type: document.getElementById("type").value,
    priority: document.getElementById("priority").value,
    status: "Pendiente",
    createdAt: new Date().toLocaleDateString("es-CO")
  }, ...requests];

  if (!saveRequests(nextRequests)) return;
  requests = nextRequests;
  form.reset();

  message.textContent = "Solicitud registrada correctamente.";
  message.classList.remove("error");

  renderRequests();

  setTimeout(() => {
    message.textContent = "";
  }, 2500);
});


function updateStatus(id, status) {
  const current = requests.find(item => item.id === id);
  if (!current || !VALID_STATUSES.includes(status)) {
    showActionMessage("No se pudo cambiar el estado de la solicitud.", true);
    return false;
  }
  if (current.status === status) return true;
  const nextRequests = requests.map(item => item.id === id ? { ...item, status } : item);
  if (!saveRequests(nextRequests)) {
    renderRequests();
    showActionMessage("El cambio de estado no se aplicó.", true);
    return false;
  }
  requests = nextRequests;
  renderRequests();
  showActionMessage(`La solicitud "${current.title}" cambió a ${status}.`);
  const card = [...requestList.children].find(node => node.dataset.requestId === id);
  (card ? card.querySelector("select") : statusFilter).focus();
  return true;
}

function deleteRequest(id) {
  const item = requests.find(request => request.id === id);
  if (!item) {
    showActionMessage("La solicitud ya no está disponible.", true);
    return false;
  }
  if (!confirm(`¿Deseas eliminar la solicitud "${item.title}"? Esta acción no se puede deshacer.`)) {
    showActionMessage(`Eliminación cancelada. La solicitud "${item.title}" se conserva.`);
    return false;
  }
  const nextRequests = requests.filter(request => request.id !== id);
  if (!saveRequests(nextRequests)) {
    showActionMessage("La solicitud no se eliminó porque no se pudo guardar el cambio.", true);
    return false;
  }
  requests = nextRequests;
  renderRequests();
  showActionMessage(`La solicitud "${item.title}" fue eliminada correctamente.`);
  statusFilter.focus();
  return true;
}

statusFilter.addEventListener("change", renderRequests);
renderRequests();
