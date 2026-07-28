
(function () {
  const grid = document.getElementById("faculty-grid");
  const searchInput = document.getElementById("faculty-search");
  const filtersWrap = document.getElementById("faculty-filters");
  const noResults = document.getElementById("faculty-no-results");

  if (!grid || !searchInput || !filtersWrap || !noResults) return;

  let activeFilter = "todos";

  function getInitials(nombre) {
    const palabras = nombre
      .replace(/^(Dr\.|Dra\.|Mag\.|MSc\.|MsBA\.)\s*/i, "")
      .split(" ")
      .filter(Boolean);
    const primeras = palabras.slice(0, 2).map((p) => p.charAt(0).toUpperCase());
    return primeras.join("");
  }

  function crearTarjeta(prof) {
    const card = document.createElement("article");
    card.className = "faculty-card";
    card.setAttribute("role", "listitem");

    const avatar = document.createElement("div");
    avatar.className = "faculty-avatar";
    avatar.textContent = getInitials(prof.nombre);
    avatar.setAttribute("aria-hidden", "true");

    const info = document.createElement("div");
    info.className = "faculty-info";

    const nombre = document.createElement("h3");
    nombre.className = "faculty-name";
    nombre.textContent = prof.nombre;

    const cargo = document.createElement("p");
    cargo.className = "faculty-role";
    cargo.textContent = prof.cargo;

    const area = document.createElement("p");
    area.className = "faculty-area";
    area.textContent = prof.area;

    const tag = document.createElement("span");
    tag.className = "faculty-tag";
    tag.textContent = prof.carreraLabel;

    const email = document.createElement("a");
    email.className = "faculty-email";
    email.href = "mailto:" + prof.email;
    email.textContent = prof.email;

    info.append(nombre, cargo, area, tag, email);
    card.append(avatar, info);
    return card;
  }

  function construirFiltros() {
    const carreras = new Map();
    carreras.set("todos", "Todos");
    PROFESORES.forEach((p) => carreras.set(p.carrera, p.carreraLabel));

    carreras.forEach((label, key) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "filter-chip" + (key === "todos" ? " is-active" : "");
      chip.textContent = label;
      chip.dataset.filter = key;
      chip.addEventListener("click", () => {
        activeFilter = key;
        document
          .querySelectorAll(".filter-chip")
          .forEach((c) => c.classList.toggle("is-active", c === chip));
        render();
      });
      filtersWrap.appendChild(chip);
    });
  }

  function render() {
    const termino = searchInput.value.trim().toLowerCase();

    const filtrados = PROFESORES.filter((p) => {
      const coincideFiltro = activeFilter === "todos" || p.carrera === activeFilter;
      const texto = (p.nombre + " " + p.area + " " + p.email + " " + p.cargo).toLowerCase();
      const coincideBusqueda = texto.includes(termino);
      return coincideFiltro && coincideBusqueda;
    });

    grid.innerHTML = "";
    filtrados.forEach((p) => grid.appendChild(crearTarjeta(p)));
    noResults.hidden = filtrados.length !== 0;
  }

  construirFiltros();
  render();
  searchInput.addEventListener("input", render);
})();
