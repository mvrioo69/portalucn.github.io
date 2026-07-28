(function () {
  "use strict";

  const grid = document.getElementById("platform-grid");
  const searchInput = document.getElementById("search");
  const noResults = document.getElementById("no-results");
  const yearEl = document.getElementById("year");
  const themeToggle = document.getElementById("theme-toggle");

  yearEl.textContent = new Date().getFullYear();

  /** Only allow http/https links to avoid javascript: or data: URL injection. */
  function isSafeUrl(url) {
    try {
      const parsed = new URL(url, window.location.href);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch {
      return false;
    }
  }

  function createCard(platform) {
    const card = document.createElement("a");
    card.className = "platform-card";
    card.setAttribute("role", "listitem");

    if (isSafeUrl(platform.url)) {
      card.href = platform.url;
      card.target = "_blank";
      card.rel = "noopener noreferrer";
    } else {
      card.href = "#";
      card.setAttribute("aria-disabled", "true");
      card.classList.add("platform-card--disabled");
    }

    const icon = document.createElement("span");
    icon.className = "platform-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = platform.icon || "🔗";

    const title = document.createElement("span");
    title.className = "platform-name";
    title.textContent = platform.name;

    const desc = document.createElement("span");
    desc.className = "platform-desc";
    desc.textContent = platform.desc || "";

    card.append(icon, title, desc);
    return card;
  }

  function render(list) {
    grid.innerHTML = "";
    const fragment = document.createDocumentFragment();
    list.forEach((platform) => fragment.appendChild(createCard(platform)));
    grid.appendChild(fragment);
    noResults.hidden = list.length !== 0;
  }

  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  render(PLATFORMS);

  searchInput.addEventListener("input", () => {
    const term = normalize(searchInput.value.trim());
    const filtered = PLATFORMS.filter((p) => normalize(p.name).includes(term) || normalize(p.desc || "").includes(term));
    render(filtered);
  });

  // Theme toggle with persisted preference
  const THEME_KEY = "ucn-theme";

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    themeToggle.querySelector("span").textContent = theme === "dark" ? "☀️" : "🌙";
  }

  const savedTheme = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });
})();
