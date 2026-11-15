/*
 * NewWay site settings.
 * Fill in the real values below. While a value still starts with "[",
 * it is shown as a highlighted placeholder and its link stays inactive.
 */
const CONFIG = {
  whatsapp: "[nömrə]", // digits only with country code, e.g. "994501234567"
  email: "[email]", // e.g. "info@newway.az"
  instagram: "[@hesab]", // e.g. "@newway.az"
  responseTime: "[2 iş günü]", // e.g. "2 iş günü"
};

(function () {
  "use strict";

  const isPlaceholder = (value) => !value || value.trim().startsWith("[");

  const links = {
    whatsapp: (v) => "https://wa.me/" + v.replace(/\D/g, ""),
    email: (v) => "mailto:" + v,
    instagram: (v) => "https://instagram.com/" + v.replace(/^@/, ""),
  };

  // Fill text from CONFIG
  document.querySelectorAll("[data-config]").forEach((el) => {
    const key = el.dataset.config;
    const value = CONFIG[key];
    if (value === undefined) return;
    el.textContent = value;
    el.classList.toggle("placeholder", isPlaceholder(value));
  });

  // Fill links from CONFIG
  document.querySelectorAll("[data-config-link]").forEach((el) => {
    const key = el.dataset.configLink;
    const value = CONFIG[key];
    if (isPlaceholder(value) || !links[key]) {
      el.removeAttribute("href");
      el.setAttribute("aria-disabled", "true");
      el.title = "Əlaqə məlumatı tezliklə əlavə olunacaq";
      return;
    }
    el.href = links[key](value);
    if (key !== "email") {
      el.target = "_blank";
      el.rel = "noopener";
    }
  });

  // Mobile navigation
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Mark the current page in the nav
  const page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((a) => {
    const target = a.getAttribute("href").split("/").pop();
    if (target === page || (page === "" && target === "index.html")) {
      a.setAttribute("aria-current", "page");
    }
  });

  // Preselect options from the URL (?seviyye=..., ?proqram=...)
  const params = new URLSearchParams(location.search);

  const levelSelect = document.getElementById("seviyye");
  if (levelSelect) {
    const titles = {
      bakalavr: "Bakalavr",
      magistratura: "Magistratura",
      doktorantura: "Doktorantura",
    };
    const titleEl = document.getElementById("form-title-level");
    const updateTitle = () => {
      const label = titles[levelSelect.value];
      if (titleEl) titleEl.textContent = label ? label + " müraciət formu" : "Xaricdə təhsil müraciət formu";
    };
    const wanted = (params.get("seviyye") || "").toLowerCase();
    if (titles[wanted]) levelSelect.value = wanted;
    updateTitle();
    levelSelect.addEventListener("change", updateTitle);
  }

  const programParam = (params.get("proqram") || "").toLowerCase();
  if (programParam) {
    const radio = document.querySelector('input[name="proqram"][value="' + CSS.escape(programParam) + '"]');
    if (radio) radio.checked = true;
  }

  // Checkbox groups where at least one option must be ticked
  document.querySelectorAll("[data-require-one]").forEach((group) => {
    const boxes = Array.from(group.querySelectorAll('input[type="checkbox"]'));
    if (!boxes.length) return;
    const validate = () => {
      const ok = boxes.some((b) => b.checked);
      boxes[0].setCustomValidity(ok ? "" : "Ən azı bir ölkə seçin.");
    };
    boxes.forEach((b) => b.addEventListener("change", validate));
    validate();
  });

  // Footer year
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
