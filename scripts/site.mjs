const dialog = document.querySelector("#contact-dialog");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const allowDrift = window.matchMedia("(min-width: 641px)");
let lastFocusedElement = null;

function openContactDialog(trigger) {
  if (!dialog || dialog.hasAttribute("open")) {
    return;
  }

  lastFocusedElement = trigger instanceof HTMLElement ? trigger : document.activeElement;

  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
    dialog.classList.add("dialog-fallback-open");
    document.body.classList.add("has-open-dialog");
    dialog.querySelector("button")?.focus();
  }
}

function closeContactDialog() {
  if (!dialog || !dialog.hasAttribute("open")) {
    return;
  }

  if (typeof dialog.close === "function") {
    dialog.close();
  } else {
    dialog.removeAttribute("open");
    dialog.classList.remove("dialog-fallback-open");
    document.body.classList.remove("has-open-dialog");
    lastFocusedElement?.focus?.();
  }
}

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const openTrigger = target.closest("[data-contact-open]");
  if (openTrigger) {
    openContactDialog(openTrigger);
    return;
  }

  if (target.closest("[data-contact-close]")) {
    closeContactDialog();
  }
});

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) {
    closeContactDialog();
  }
});

document.addEventListener("keydown", (event) => {
  if (!dialog?.classList.contains("dialog-fallback-open")) {
    return;
  }

  if (event.key === "Escape") {
    event.preventDefault();
    closeContactDialog();
    return;
  }

  if (event.key === "Tab") {
    const focusable = [...dialog.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])")];
    const first = focusable[0];
    const last = focusable.at(-1);

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }
});

const revealElements = document.querySelectorAll("[data-reveal]");
const markerElements = document.querySelectorAll("[data-marker]");

if (!reduceMotion.matches && "IntersectionObserver" in window) {
  document.documentElement.dataset.motion = "ready";

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  const markerObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) {
          continue;
        }

        window.setTimeout(() => entry.target.classList.add("is-marked"), 180);
        markerObserver.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -18%", threshold: 0.45 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
  markerElements.forEach((element) => markerObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
  markerElements.forEach((element) => element.classList.add("is-marked"));
}

const driftElements = [...document.querySelectorAll("[data-drift]")];
let driftFrame = 0;
let driftEnabled = false;

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function updateDrift() {
  driftFrame = 0;

  if (reduceMotion.matches || !allowDrift.matches) {
    driftElements.forEach((element) => element.style.removeProperty("--drift-y"));
    return;
  }

  const viewportHeight = window.innerHeight;
  const measurements = driftElements.map((element) => {
    const host = element.closest(".project-story") ?? element;
    const rect = host.getBoundingClientRect();
    const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
    const speed = Number.parseFloat(element.dataset.driftSpeed ?? "0.03");
    return {
      element,
      offset: clamp((progress - 0.5) * viewportHeight * speed * 2, -72, 72),
    };
  });

  for (const { element, offset } of measurements) {
    element.style.setProperty("--drift-y", `${offset.toFixed(2)}px`);
  }
}

function requestDriftUpdate() {
  if (!driftFrame) {
    driftFrame = window.requestAnimationFrame(updateDrift);
  }
}

function configureDrift() {
  const shouldEnable = driftElements.length > 0 && !reduceMotion.matches && allowDrift.matches;

  if (shouldEnable === driftEnabled) {
    return;
  }

  driftEnabled = shouldEnable;

  if (driftEnabled) {
    window.addEventListener("scroll", requestDriftUpdate, { passive: true });
    window.addEventListener("resize", requestDriftUpdate);
    requestDriftUpdate();
  } else {
    window.removeEventListener("scroll", requestDriftUpdate);
    window.removeEventListener("resize", requestDriftUpdate);
    driftElements.forEach((element) => element.style.removeProperty("--drift-y"));
  }
}

reduceMotion.addEventListener?.("change", configureDrift);
allowDrift.addEventListener?.("change", configureDrift);
configureDrift();
