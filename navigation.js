/* ==========================================================================
   navigation.js — Índice, sección actual, progreso y paso entre secciones
   ========================================================================== */
(function (ns) {
  "use strict";

  var $ = ns.$;
  var $$ = ns.$$;

  var sections = [];
  var navLinks = [];
  var currentIndex = -1;
  var nav, openButton, backdrop, progressBar, countEl, labelEl, prevBtn, nextBtn;
  var lastFocused = null;
  var railQuery = window.matchMedia("(min-width: 1200px)");

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  /* ---------- Panel del índice en móvil ---------- */
  function isDrawerMode() {
    return !railQuery.matches;
  }

  function openNav() {
    if (!isDrawerMode()) return;
    lastFocused = document.activeElement;
    nav.classList.add("is-open");
    backdrop.hidden = false;
    openButton.setAttribute("aria-expanded", "true");
    var current = $(".navlink[aria-current]", nav) || $(".navlink", nav);
    window.setTimeout(function () { current.focus(); }, 60);
  }

  function closeNav(restoreFocus) {
    if (!nav.classList.contains("is-open")) return;
    nav.classList.remove("is-open");
    backdrop.hidden = true;
    openButton.setAttribute("aria-expanded", "false");
    if (restoreFocus !== false && lastFocused && lastFocused.focus) lastFocused.focus();
  }

  /* Mantiene el foco dentro del índice mientras está abierto en móvil. */
  function trapFocus(event) {
    if (event.key !== "Tab" || !nav.classList.contains("is-open")) return;
    var focusable = $$("a[href], button:not([disabled])", nav).filter(function (el) {
      return !el.hidden && el.offsetParent !== null;
    });
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* ---------- Sección actual ---------- */
  function findCurrentIndex() {
    var marker = window.innerHeight * 0.35;
    var index = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top <= marker) index = i;
    }
    /* Al llegar al final de la página, la última sección es la actual. */
    var scrollBottom = window.scrollY + window.innerHeight;
    if (scrollBottom >= document.documentElement.scrollHeight - 4) index = sections.length - 1;
    return index;
  }

  function setCurrent(index) {
    if (index === currentIndex) return;
    currentIndex = index;
    var section = sections[index];
    var id = section.id;

    navLinks.forEach(function (link) {
      var linkIndex = sectionIndexById(link.getAttribute("data-nav"));
      if (link.getAttribute("data-nav") === id) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
      link.classList.toggle("is-past", linkIndex > -1 && linkIndex < index);
    });

    countEl.textContent = pad(index + 1) + "/" + pad(sections.length);
    labelEl.textContent = section.getAttribute("data-nav-label") || "";
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === sections.length - 1;

    var stage = section.getAttribute("data-stage");
    if (stage) ns.setStage(Number(stage), "scroll");
    ns.emit("section", { id: id, index: index });
  }

  function sectionIndexById(id) {
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].id === id) return i;
    }
    return -1;
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progressBar.style.transform = "scaleX(" + ratio.toFixed(4) + ")";
      setCurrent(findCurrentIndex());
    });
  }

  /* ---------- Desplazamiento ---------- */
  var settleTimer = null;

  function topOffset() {
    var bar = $(".topbar");
    return bar && window.getComputedStyle(bar).display !== "none" ? bar.offsetHeight : 0;
  }

  function targetY(target) {
    return Math.max(0, Math.round(target.getBoundingClientRect().top + window.scrollY - topOffset()));
  }

  function cancelSettle() {
    window.clearInterval(settleTimer);
    settleTimer = null;
    ["wheel", "touchstart", "keydown"].forEach(function (type) {
      window.removeEventListener(type, cancelSettle);
    });
  }

  /* Algunos motores detienen el desplazamiento suave antes de llegar:
     cuando el movimiento termina, se corrige la posición si quedó corta.
     Si la persona desplaza por su cuenta, no se interviene. */
  function settleOn(target) {
    cancelSettle();
    var last = -1;
    var started = Date.now();
    settleTimer = window.setInterval(function () {
      var y = window.scrollY;
      var stopped = Math.abs(y - last) < 1;
      last = y;
      if (!stopped && Date.now() - started < 2500) return;
      cancelSettle();
      if (Math.abs(targetY(target) - y) > 4) window.scrollTo({ top: targetY(target), behavior: "auto" });
    }, 140);
    ["wheel", "touchstart", "keydown"].forEach(function (type) {
      window.addEventListener(type, cancelSettle, { passive: true });
    });
  }

  ns.scrollToSection = function (id) {
    var target = document.getElementById(id);
    if (!target) return;
    /* El foco se mueve antes de desplazar para no interrumpir la animación. */
    var heading = target.querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    var smooth = !ns.reducedMotion();
    window.scrollTo({ top: targetY(target), behavior: smooth ? "smooth" : "auto" });
    if (smooth) settleOn(target);
    if (window.history && window.history.replaceState) window.history.replaceState(null, "", "#" + id);
  };

  function goRelative(step) {
    var next = Math.max(0, Math.min(sections.length - 1, currentIndex + step));
    ns.scrollToSection(sections[next].id);
  }

  /* Los enlaces internos (#seccion) usan el mismo desplazamiento. */
  function onDocumentClick(event) {
    var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;
    if (!link || link.classList.contains("cite") || link.classList.contains("skip-link")) return;
    var id = link.getAttribute("href").slice(1);
    if (sectionIndexById(id) === -1) return;
    event.preventDefault();
    closeNav(false);
    ns.scrollToSection(id);
  }

  ns.modules.navigation = {
    init: function () {
      sections = $$("main > section[id]");
      nav = $("#sitenav");
      navLinks = $$(".navlink", nav);
      openButton = $("[data-nav-open]");
      backdrop = $(".nav-backdrop");
      progressBar = $("[data-progress-bar]");
      countEl = $("[data-current-count]");
      labelEl = $("[data-current-label]");
      prevBtn = $('[data-pager="prev"]');
      nextBtn = $('[data-pager="next"]');

      openButton.addEventListener("click", openNav);
      $$("[data-nav-close]").forEach(function (el) {
        el.addEventListener("click", function () { closeNav(); });
      });
      nav.addEventListener("keydown", trapFocus);
      document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeNav();
      });
      var onBreakpoint = function () { closeNav(false); };
      if (railQuery.addEventListener) railQuery.addEventListener("change", onBreakpoint);
      else if (railQuery.addListener) railQuery.addListener(onBreakpoint);

      prevBtn.addEventListener("click", function () { goRelative(-1); });
      nextBtn.addEventListener("click", function () { goRelative(1); });

      document.addEventListener("click", onDocumentClick);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      onScroll();
    },
  };
})(window.CicloVida);
