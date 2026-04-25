// ============ THEME SYSTEM ============

(function () {
  // Read persisted theme from localStorage
  var stored = null;
  try {
    stored = JSON.parse(localStorage.getItem("cbf-theme"));
  } catch (e) {}

  var state = {
    theme: (stored && stored.theme) || "light",
    accent: (stored && stored.accent) || "teal",
    personality: true,
  };

  // Validate
  if (["light", "dark", "auto"].indexOf(state.theme) === -1) {
    state.theme = "light";
  }

  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function resolved() {
    return state.theme === "auto"
      ? mq.matches
        ? "dark"
        : "light"
      : state.theme;
  }

  var ICONS = {
    light:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="8" cy="8" r="3"/><path d="M8 1.5v1.5M8 13v1.5M14.5 8H13M3 8H1.5M12.6 12.6l-1.06-1.06M4.46 4.46L3.4 3.4M12.6 3.4l-1.06 1.06M4.46 11.54l-1.06 1.06"/></svg>',
    dark: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><path d="M13.5 9.2A5.5 5.5 0 0 1 6.8 2.5a5.5 5.5 0 1 0 6.7 6.7z"/></svg>',
    auto: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="8" cy="8" r="5.5"/><path d="M8 2.5v11" /><path d="M8 2.5a5.5 5.5 0 0 1 0 11z" fill="currentColor" stroke="none"/></svg>',
  };

  var LABELS = { light: "LIGHT", dark: "DARK", auto: "AUTO" };

  function persist() {
    try {
      localStorage.setItem(
        "cbf-theme",
        JSON.stringify({ theme: state.theme, accent: state.accent })
      );
    } catch (e) {}
  }

  function apply() {
    document.body.dataset.theme = resolved();
    document.body.dataset.themePref = state.theme;
    document.body.dataset.accent = state.accent;
    document.body.dataset.personality = state.personality ? "on" : "off";

    var btn = document.getElementById("themeBtn");
    if (btn) {
      btn.innerHTML = ICONS[state.theme];
      btn.setAttribute(
        "aria-label",
        "Theme: " + LABELS[state.theme] + " — click to cycle"
      );
      btn.setAttribute("title", "Theme: " + LABELS[state.theme]);
    }
  }

  apply();
  mq.addEventListener("change", function () {
    if (state.theme === "auto") apply();
  });

  // Theme button — cycles light → dark → auto
  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var order = ["light", "dark", "auto"];
      state.theme = order[(order.indexOf(state.theme) + 1) % order.length];
      apply();
      persist();
    });
  }

  // ============ FILTER LOGIC ============

  var filterBar = document.getElementById("filters");
  var items = Array.from(document.querySelectorAll(".tl-item"));

  if (filterBar) {
    filterBar.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-filter]");
      if (!b) return;
      filterBar.querySelectorAll("button").forEach(function (x) {
        x.classList.toggle("active", x === b);
      });
      var f = b.dataset.filter;
      items.forEach(function (it) {
        var match = f === "all" || it.dataset.kind === f;
        it.style.display = match ? "" : "none";
      });
    });
  }
})();
