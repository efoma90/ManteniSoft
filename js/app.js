const STORAGE_KEY = "mantenisoft_requests";
const form = document.getElementById("requestForm");
const requestList = document.getElementById("requestList");
const emptyState = document.getElementById("emptyState");
const statusFilter = document.getElementById("statusFilter");
let requests = loadRequests();

function loadRequests() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRequests() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
}



function renderRequests() {
  const filter = statusFilter.value;

  // Mostrar primero las solicitudes más recientes
  // Las nuevas se agregan al inicio con unshift()
  const sortedRequests = [...requests];

  const visible = sortedRequests.filter(
    item => filter === "Todas" || item.status === filter
  );

  requestList.innerHTML = "";
  emptyState.hidden = visible.length > 0;

  visible.forEach(item => {
    const card = document.createElement("article");
    card.className = "request-card";

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

    ["Pendiente", "En proceso", "Finalizada"].forEach(status => {
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

    removeButton.addEventListener("click", () => {
      deleteRequest(item.id);
    });

    actions.append(select, removeButton);
    card.append(content, actions);
    requestList.appendChild(card);
  });

  // Actualizar los contadores
  document.getElementById("totalCount").textContent = requests.length;

  document.getElementById("pendingCount").textContent =
    requests.filter(x => x.status === "Pendiente").length;

  document.getElementById("progressCount").textContent =
    requests.filter(x => x.status === "En proceso").length;

  document.getElementById("doneCount").textContent =
    requests.filter(x => x.status === "Finalizada").length;
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

  requests.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    title,
    description,
    type: document.getElementById("type").value,
    priority: document.getElementById("priority").value,
    status: "Pendiente",
    createdAt: new Date().toLocaleDateString("es-CO")
  });

  saveRequests();
  form.reset();

  message.textContent = "Solicitud registrada correctamente.";
  message.classList.remove("error");

  renderRequests();

  setTimeout(() => {
    message.textContent = "";
  }, 2500);
});


function updateStatus(id, status) {
  requests = requests.map(item => item.id === id ? { ...item, status } : item);
  saveRequests();
  renderRequests();
}

function deleteRequest(id) {
  const item = requests.find(request => request.id === id);
  if (!item || !confirm(`¿Deseas eliminar la solicitud "${item.title}"?`)) return;
  requests = requests.filter(request => request.id !== id);
  saveRequests();
  renderRequests();
}

statusFilter.addEventListener("change", renderRequests);
renderRequests();
