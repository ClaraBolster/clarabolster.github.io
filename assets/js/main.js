// ============ LANGUAGE TOGGLE ============

(function () {
  var langToggle = document.querySelector(".lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("click", function () {
      var goingToFr = location.pathname.indexOf("/fr/") !== 0;
      try { localStorage.setItem("cbf-lang", goingToFr ? "fr" : "en"); } catch (e) {}
    });
  }
})();

// ============ THEME SYSTEM ============

(function () {
  var stored = null;
  try { stored = localStorage.getItem("cbf-theme"); } catch (e) {}

  var theme = stored || "light";
  if (["light", "dark", "auto"].indexOf(theme) === -1) theme = "light";

  var mq = window.matchMedia("(prefers-color-scheme: dark)");

  function resolved() {
    return theme === "auto" ? (mq.matches ? "dark" : "light") : theme;
  }

  var ICONS = {
    light:
      '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="8" cy="8" r="3"/><path d="M8 1.5v1.5M8 13v1.5M14.5 8H13M3 8H1.5M12.6 12.6l-1.06-1.06M4.46 4.46L3.4 3.4M12.6 3.4l-1.06 1.06M4.46 11.54l-1.06 1.06"/></svg>',
    dark: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><path d="M13.5 9.2A5.5 5.5 0 0 1 6.8 2.5a5.5 5.5 0 1 0 6.7 6.7z"/></svg>',
    auto: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><circle cx="8" cy="8" r="5.5"/><path d="M8 2.5v11" /><path d="M8 2.5a5.5 5.5 0 0 1 0 11z" fill="currentColor" stroke="none"/></svg>',
  };

  var LABELS = { light: "LIGHT", dark: "DARK", auto: "AUTO" };

  function persist() {
    try { localStorage.setItem("cbf-theme", theme); } catch (e) {}
  }

  function apply() {
    document.documentElement.dataset.theme = resolved();
    document.documentElement.dataset.themePref = theme;

    var btn = document.getElementById("themeBtn");
    if (btn) {
      btn.innerHTML = ICONS[theme];
      btn.setAttribute("aria-label", "Theme: " + LABELS[theme]);
      btn.setAttribute("title", "Theme: " + LABELS[theme]);
    }
  }

  apply();
  mq.addEventListener("change", function () {
    if (theme === "auto") apply();
  });

  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var order = ["light", "dark", "auto"];
      theme = order[(order.indexOf(theme) + 1) % order.length];
      apply();
      persist();
    });
  }
})();

// ============ FILTER LOGIC ============

(function () {
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
      var lastVisible = null;
      items.forEach(function (it) {
        var match = f === "all" || it.dataset.kind === f;
        it.style.display = match ? "" : "none";
        it.classList.remove("last-visible");
        if (match) lastVisible = it;
      });
      if (lastVisible) lastVisible.classList.add("last-visible");
    });
  }
})();
