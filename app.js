/*
  Main application controller.
  Page-specific logic is activated through body[data-page].
*/

import { CHALLENGES, EVENT_CONFIG, getChallengeById } from "./challenges.js";
import { isFirebaseReady, listenChallengeClaims, claimChallenge } from "./firebase.js";

const STORAGE_KEYS = Object.freeze({
  theme: "hackathon:selectedTheme",
  team: "hackathon:team"
});

const state = {
  claims: {},
  selectedThemeForModal: null,
  unsubscribeClaims: null
};

document.addEventListener("DOMContentLoaded", () => {
  initThemeMode();
  initNavigation();
  initHeaderScroll();
  initCountdowns();
  initPageController();
});

function initPageController() {
  const page = document.body.dataset.page;

  if (page === "home") initHomePage();
  if (page === "challenge") initChallengePage();
  if (page === "dashboard") initDashboardPage();
  if (page === "faq") initAccordions();
}

function initThemeMode() {
  const stored = localStorage.getItem("hackathon:themeMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initial = stored || (prefersDark ? "dark" : "light");

  document.documentElement.dataset.theme = initial;
  updateThemeButtons(initial);

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      localStorage.setItem("hackathon:themeMode", next);
      updateThemeButtons(next);
    });
  });
}

function updateThemeButtons(mode) {
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.textContent = mode === "dark" ? "Modo claro" : "Modo oscuro";
  });
}

function initNavigation() {
  const toggle = document.querySelector("[data-nav-toggle]");
  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll("[data-nav] a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initHeaderScroll() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  const sync = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  sync();
  window.addEventListener("scroll", sync, { passive: true });
}

function initCountdowns() {
  const countdownElements = [...document.querySelectorAll("[data-countdown='presentation']")];
  if (!countdownElements.length) return;

  document.querySelectorAll("[data-presentation-label]").forEach((element) => {
    element.textContent = `${EVENT_CONFIG.presentationLabel} - ${EVENT_CONFIG.timezoneLabel}`;
  });

  const target = new Date(EVENT_CONFIG.presentationAt);

  const update = () => {
    const remaining = getRemainingTime(target);
    countdownElements.forEach((element) => renderCountdown(element, remaining));
  };

  update();
  window.setInterval(update, 1000);
}

function getRemainingTime(targetDate) {
  const total = Math.max(0, targetDate.getTime() - Date.now());
  const seconds = Math.floor(total / 1000);

  return {
    total,
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60
  };
}

function renderCountdown(root, remaining) {
  const formatter = new Intl.NumberFormat("es-PA", { minimumIntegerDigits: 2 });
  root.querySelector("[data-days]").textContent = formatter.format(remaining.days);
  root.querySelector("[data-hours]").textContent = formatter.format(remaining.hours);
  root.querySelector("[data-minutes]").textContent = formatter.format(remaining.minutes);
  root.querySelector("[data-seconds]").textContent = formatter.format(remaining.seconds);
}

function initRealtimeClaims(onUpdate) {
  const status = document.querySelector("[data-firebase-status]");

  if (status) {
    if (isFirebaseReady()) {
      status.textContent = "Firestore conectado. Estados actualizados en tiempo real.";
      status.classList.add("is-ready");
    } else {
      status.textContent = "Modo demo: pega tus credenciales en config.example.js para activar Firestore.";
      status.classList.add("is-warning");
    }
  }

  state.unsubscribeClaims?.();
  state.unsubscribeClaims = listenChallengeClaims(
    (claims) => {
      state.claims = claims;
      onUpdate?.(claims);
    },
    (error) => {
      console.error(error);
      if (status) {
        status.textContent = "No se pudo conectar con Firestore. Revisa config.example.js y las reglas de seguridad.";
        status.classList.add("is-warning");
      }
    }
  );
}

function initHomePage() {
  const cardsRoot = document.getElementById("themeCards");
  const modal = document.getElementById("confirmModal");
  const confirmButton = document.getElementById("revealConfirm");

  if (!cardsRoot || !modal || !confirmButton) return;

  const render = () => renderThemeCards(cardsRoot);
  initRealtimeClaims(render);
  render();

  cardsRoot.addEventListener("click", (event) => {
    const button = event.target.closest("[data-view-challenge]");
    if (!button || button.disabled) return;

    const themeId = button.dataset.viewChallenge;
    const localThemeId = getStoredThemeId();

    if (localThemeId && localThemeId !== themeId) {
      window.location.href = `challenge.html?theme=${encodeURIComponent(localThemeId)}`;
      return;
    }

    state.selectedThemeForModal = themeId;
    modal.showModal();
  });

  confirmButton.addEventListener("click", (event) => {
    event.preventDefault();
    const themeId = state.selectedThemeForModal;
    if (!themeId) return;

    modal.close();
    storeThemeId(themeId);
    runRevealAnimation(themeId);
  });
}

function renderThemeCards(root) {
  const localThemeId = getStoredThemeId();

  root.innerHTML = CHALLENGES.map((challenge) => {
    const claim = state.claims[challenge.id];
    const isClaimed = claim?.status === "claimed";
    const lockedByLocalChoice = localThemeId && localThemeId !== challenge.id;
    const buttonDisabled = isClaimed || lockedByLocalChoice;

    const statusText = isClaimed
      ? `\uD83D\uDD12 Claimed by ${escapeHTML(claim.teamName || "Equipo")}`
      : lockedByLocalChoice
        ? "\uD83D\uDD12 Ya revelaste otra tematica"
        : "\uD83D\uDFE2 Disponible";

    const buttonText = localThemeId === challenge.id
      ? "Ver mi reto"
      : isClaimed
        ? "No disponible"
        : "Ver reto";

    return `
      <article class="theme-card ${isClaimed ? "is-claimed" : ""}">
        <div class="theme-icon" aria-hidden="true">${challenge.icon}</div>
        <h3>${challenge.label}</h3>
        <p>${escapeHTML(challenge.cardDescription || "Revela la mision para conocer el reto asignado a esta tematica.")}</p>
        <footer>
          <span class="status-pill ${isClaimed ? "is-claimed" : lockedByLocalChoice ? "is-local-locked" : ""}">${statusText}</span>
          <button class="button button-primary" type="button" data-view-challenge="${challenge.id}" ${buttonDisabled && localThemeId !== challenge.id ? "disabled" : ""}>${buttonText}</button>
        </footer>
      </article>
    `;
  }).join("");
}

async function runRevealAnimation(themeId) {
  const overlay = document.getElementById("revealOverlay");
  const log = document.getElementById("revealLog");
  const progress = document.getElementById("revealProgress");

  const steps = [
    { text: "Inicializando...", width: "14%" },
    { text: "Conectando...", width: "34%" },
    { text: "Descifrando reto...", width: "62%" },
    { text: "█████████████", width: "84%" },
    { text: "100%", width: "100%" },
    { text: "\u2713 Reto desbloqueado", width: "100%" }
  ];

  overlay.classList.add("is-visible");
  overlay.setAttribute("aria-hidden", "false");
  log.textContent = "";
  progress.style.width = "0";

  for (const step of steps) {
    await wait(520);
    log.textContent += `${step.text}\n`;
    progress.style.width = step.width;
  }

  await wait(650);
  window.location.href = `challenge.html?theme=${encodeURIComponent(themeId)}`;
}

function initChallengePage() {
  const themeId = getThemeFromURL() || getStoredThemeId();
  const challenge = getChallengeById(themeId);

  if (!challenge) {
    renderMissingChallenge();
    return;
  }

  storeThemeId(challenge.id);
  renderChallenge(challenge);
  initRealtimeClaims(() => updateChallengeClaimStatus(challenge));
  initMissionForm(challenge);
}

function renderMissingChallenge() {
  const title = document.getElementById("challengeTitle");
  const intro = document.getElementById("challengeIntro");
  const details = document.getElementById("challengeDetails");
  const acceptButton = document.getElementById("acceptMissionButton");

  title.textContent = "No hay reto seleccionado";
  intro.textContent = "Vuelve a la pagina inicial y revela una tematica para continuar.";
  details.innerHTML = "";
  acceptButton.disabled = true;
}

function renderChallenge(challenge) {
  const title = document.getElementById("challengeTitle");
  const intro = document.getElementById("challengeIntro");
  const details = document.getElementById("challengeDetails");

  title.textContent = challenge.title || `Reto de ${challenge.label}`;
  intro.textContent = challenge.brief || "Revisa la mision asignada y prepara un prototipo funcional con Python.";

  const sections = [
    { title: "Mision", value: challenge.mission },
    { title: "Enfoque sugerido", value: challenge.focus, list: true },
    { title: "Criterio de exito", value: challenge.success }
  ].filter((section) => {
    if (Array.isArray(section.value)) return section.value.length > 0;
    return Boolean(section.value);
  });

  details.innerHTML = sections.map((section) => {
    const content = renderChallengeSectionContent(section);
    return `
      <article class="detail-card">
        <h2>${section.title}</h2>
        ${content}
      </article>
    `;
  }).join("");

  updateChallengeClaimStatus(challenge);
}

function renderChallengeSectionContent(section) {
  if (section.list) {
    if (!Array.isArray(section.value) || section.value.length === 0) {
      return "";
    }

    return `<ul>${section.value.map((item) => `<li>${escapeHTML(item)}</li>`).join("")}</ul>`;
  }

  if (!section.value) {
    return "";
  }

  return `<p>${escapeHTML(section.value)}</p>`;
}

function updateChallengeClaimStatus(challenge) {
  const status = document.getElementById("challengeStatus");
  const acceptButton = document.getElementById("acceptMissionButton");
  const claim = state.claims[challenge.id];
  const isClaimed = claim?.status === "claimed";

  if (!status || !acceptButton) return;

  if (isClaimed) {
    status.textContent = `\uD83D\uDD12 Claimed by ${claim.teamName || "Equipo"}`;
    status.classList.add("is-claimed");
    acceptButton.disabled = true;
    acceptButton.textContent = "Reto ya reclamado";
    return;
  }

  status.textContent = "\uD83D\uDFE2 Disponible para reclamar";
  status.classList.remove("is-claimed");
  acceptButton.disabled = false;
  acceptButton.textContent = "Aceptar mision";
}

function initMissionForm(challenge) {
  const button = document.getElementById("acceptMissionButton");
  const modal = document.getElementById("missionModal");
  const form = document.getElementById("missionForm");
  const alert = document.getElementById("formAlert");
  const close = document.querySelector("[data-close-mission]");

  if (!button || !modal || !form || !alert) return;

  button.addEventListener("click", () => modal.showModal());
  close?.addEventListener("click", () => modal.close());

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    alert.classList.remove("is-visible");
    alert.textContent = "";

    const formData = new FormData(form);
    const payload = {
      teamName: String(formData.get("teamName") || ""),
      leaderName: String(formData.get("leaderName") || ""),
      leaderEmail: String(formData.get("leaderEmail") || ""),
      themeLabel: challenge.label
    };

    try {
      setButtonLoading(form.querySelector("button[type='submit']"), true, "Confirmando...");
      const claim = await claimChallenge(challenge.id, payload);
      localStorage.setItem(STORAGE_KEYS.team, JSON.stringify({ ...claim, themeId: challenge.id }));
      window.location.href = "dashboard.html";
    } catch (error) {
      alert.textContent = error.message || "No se pudo confirmar el reclamo.";
      alert.classList.add("is-visible");
      setButtonLoading(form.querySelector("button[type='submit']"), false);
    }
  });
}

function initDashboardPage() {
  const themeId = getStoredThemeId();
  const challenge = getChallengeById(themeId);
  const storedTeam = readStoredTeam();

  renderDashboard(challenge, storedTeam);
  initRealtimeClaims(() => renderDashboard(challenge, readStoredTeam()));
}

function renderDashboard(challenge, storedTeam) {
  const themeId = challenge?.id || storedTeam?.themeId;
  const claim = themeId ? state.claims[themeId] : null;
  const active = claim?.status === "claimed" ? claim : storedTeam;

  setText("dashTeam", active?.teamName || "Sin reclamar");
  setText("dashTheme", active?.themeLabel || challenge?.label || "Pendiente");
  setText("dashStatus", active?.status === "claimed" ? "Reclamado" : "No confirmado");
  setText("dashPresentation", `${EVENT_CONFIG.presentationLabel} - ${EVENT_CONFIG.timezoneLabel}`);

  const link = document.getElementById("dashboardChallengeLink");
  if (link && themeId) link.href = `challenge.html?theme=${encodeURIComponent(themeId)}`;
}

function initAccordions() {
  const root = document.querySelector("[data-accordion]");
  if (!root) return;

  root.addEventListener("click", (event) => {
    const trigger = event.target.closest(".accordion-trigger");
    if (!trigger) return;

    const item = trigger.closest(".accordion-item");
    const panel = item.querySelector(".accordion-panel");
    const isOpen = item.classList.toggle("is-open");

    trigger.setAttribute("aria-expanded", String(isOpen));
    panel.style.maxHeight = isOpen ? `${panel.scrollHeight}px` : "0";
  });
}

function getThemeFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("theme");
}

function getStoredThemeId() {
  return localStorage.getItem(STORAGE_KEYS.theme);
}

function storeThemeId(themeId) {
  localStorage.setItem(STORAGE_KEYS.theme, themeId);
}

function readStoredTeam() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.team) || "null");
  } catch {
    return null;
  }
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setButtonLoading(button, isLoading, text = "") {
  if (!button) return;

  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.disabled = true;
    button.textContent = text;
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || "Confirmar";
  }
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
