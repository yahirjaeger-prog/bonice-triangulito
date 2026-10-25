/* ==========================================================================
   core.js — Espacio de nombres, utilidades y estado compartido
   Se carga primero. Los demás módulos se registran en CicloVida.modules
   y app.js los inicializa en orden.
   ========================================================================== */
(function () {
  "use strict";

  var ns = {
    modules: {},
    state: { stage: 1 },
  };

  /* ---------- Selectores ---------- */
  ns.$ = function (selector, context) {
    return (context || document).querySelector(selector);
  };
  ns.$$ = function (selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  };

  /* ---------- Preferencias del sistema ---------- */
  var motionQuery = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  ns.reducedMotion = function () {
    return !!(motionQuery && motionQuery.matches);
  };

  /* ---------- Bus de eventos mínimo ---------- */
  var listeners = {};
  ns.on = function (eventName, handler) {
    (listeners[eventName] = listeners[eventName] || []).push(handler);
  };
  ns.emit = function (eventName, detail) {
    (listeners[eventName] || []).forEach(function (handler) {
      handler(detail);
    });
  };

  /* Etapa activa compartida por la gráfica, el indicador y las secciones. */
  ns.setStage = function (stageNumber, source) {
    var n = Math.max(1, Math.min(4, Number(stageNumber) || 1));
    if (n === ns.state.stage && source !== "init") return;
    ns.state.stage = n;
    ns.emit("stage", { stage: n, source: source || "user" });
  };

  /* ---------- Texto y HTML ---------- */
  ns.escapeHTML = function (value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  /* Índice (1, 2, 3…) de una fuente según el orden de data.sources. */
  ns.sourceNumber = function (key) {
    var sources = (ns.data && ns.data.sources) || [];
    for (var i = 0; i < sources.length; i++) {
      if (sources[i].key === key) return i + 1;
    }
    return null;
  };

  ns.getSource = function (key) {
    var sources = (ns.data && ns.data.sources) || [];
    for (var i = 0; i < sources.length; i++) {
      if (sources[i].key === key) return sources[i];
    }
    return null;
  };

  /* Etiqueta breve de cita: «Autor, año». */
  ns.sourceShort = function (source) {
    return source.shortAuthor + ", " + source.year;
  };

  /* HTML de una cita en línea. */
  ns.citeHTML = function (key) {
    var source = ns.getSource(key);
    if (!source) {
      if (window.console) console.warn("[CicloVida] Fuente no encontrada:", key);
      return "";
    }
    var n = ns.sourceNumber(key);
    return (
      '<a class="cite" href="#fuente-' + key + '" data-cite="' + key + '" ' +
      'aria-label="Fuente ' + n + ": " + ns.escapeHTML(ns.sourceShort(source)) + '">' + n + "</a>"
    );
  };

  /* Convierte {{clave-de-fuente}} en citas. El contenido de data.js es de
     confianza (lo escribe el equipo), por eso admite HTML básico. */
  ns.rich = function (text) {
    return String(text || "").replace(/\{\{([\w-]+)\}\}/g, function (_, key) {
      return ns.citeHTML(key);
    });
  };

  /* Completa las citas escritas directamente en index.html. */
  ns.hydrateCites = function (root) {
    ns.$$("a.cite[data-cite]", root).forEach(function (link) {
      if (link.textContent.trim()) return;
      var source = ns.getSource(link.getAttribute("data-cite"));
      if (!source) return;
      var n = ns.sourceNumber(source.key);
      link.textContent = n;
      link.setAttribute("aria-label", "Fuente " + n + ": " + ns.sourceShort(source));
    });
  };

  ns.icon = function (id, extraClass) {
    return (
      '<svg class="icon' + (extraClass ? " " + extraClass : "") + '" aria-hidden="true" focusable="false">' +
      '<use href="#' + id + '"></use></svg>'
    );
  };

  /* ---------- Visibilidad ---------- */
  /* Ejecuta fn una sola vez cuando el elemento entra en pantalla. */
  ns.onceVisible = function (element, fn, options) {
    if (!element) return;
    if (!("IntersectionObserver" in window)) {
      fn(element);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          observer.disconnect();
          fn(element);
        }
      });
    }, options || { threshold: 0.25 });
    observer.observe(element);
  };

  /* Animación por cuadros con easing; respeta prefers-reduced-motion. */
  ns.tween = function (duration, onFrame, onDone) {
    if (ns.reducedMotion() || !window.requestAnimationFrame) {
      onFrame(1);
      if (onDone) onDone();
      return;
    }
    var start = null;
    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min(1, (timestamp - start) / duration);
      var eased = 1 - Math.pow(1 - progress, 3);
      onFrame(eased);
      if (progress < 1) window.requestAnimationFrame(step);
      else if (onDone) onDone();
    }
    window.requestAnimationFrame(step);
  };

  var uidCounter = 0;
  ns.uid = function (prefix) {
    uidCounter += 1;
    return (prefix || "uid") + "-" + uidCounter;
  };

  window.CicloVida = ns;
})();
