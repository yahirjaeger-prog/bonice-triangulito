/* ==========================================================================
   lifecycle.js — Curva conceptual del ciclo de vida y selector de etapas
   --------------------------------------------------------------------------
   La curva es un MODELO TEÓRICO: se dibuja con funciones matemáticas y no
   con datos de ventas. Por eso no lleva escala numérica.
   ========================================================================== */
(function (ns) {
  "use strict";

  var $ = ns.$;
  var $$ = ns.$$;
  var SVG_NS = "http://www.w3.org/2000/svg";

  /* Geometría compartida (unidades del viewBox). */
  var G = {
    width: 800,
    height: 440,
    x0: 64,     // inicio del eje del tiempo
    x1: 780,    // fin del eje del tiempo
    yZero: 352, // eje del tiempo = utilidad cero
    yTop: 76,   // altura del valor máximo (1.0)
    bandTop: 22,
    bandBottom: 424,
  };

  /* Ventas: crecimiento en forma de S que se frena y luego decae. */
  function sales(t) {
    var adoption = 1 / (1 + Math.exp(-(t - 0.34) * 13));
    var decay = t > 0.62 ? Math.exp(-Math.pow((t - 0.62) / 0.3, 2)) : 1;
    return adoption * decay;
  }

  /* Utilidades: pérdidas al lanzar, máximo antes que las ventas y caída posterior. */
  function profit(t) {
    var gain = 0.8 * Math.exp(-Math.pow((t - 0.5) / 0.2, 2));
    var launchCost = 0.14 * Math.exp(-Math.pow((t - 0.1) / 0.07, 2));
    var lateDrag = t > 0.78 ? 0.12 * Math.pow((t - 0.78) / 0.22, 2) : 0;
    return gain - launchCost - lateDrag;
  }

  function x(t) { return G.x0 + t * (G.x1 - G.x0); }
  function y(value) { return G.yZero - value * (G.yZero - G.yTop); }

  function buildPath(fn) {
    var steps = 160;
    var d = "";
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      d += (i === 0 ? "M" : "L") + x(t).toFixed(1) + " " + y(fn(t)).toFixed(1);
    }
    return d;
  }

  var SALES_PATH = buildPath(sales);
  var PROFIT_PATH = buildPath(profit);

  function pct(value, total) {
    return (value / total) * 100 + "%";
  }

  function stageMid(stage) {
    return (stage.range[0] + stage.range[1]) / 2;
  }

  function el(name, attrs) {
    var node = document.createElementNS(SVG_NS, name);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  /* --------------------------------------------------------------------
     createCurve(container, options)
       options.interactive  → bandas y etiquetas seleccionables
       options.highlight    → número de etapa resaltada al inicio
       options.compact      → oculta etiquetas de ejes (mini gráfica)
       options.title        → texto accesible de la gráfica
     Devuelve { setStage(n), reveal() }.
     -------------------------------------------------------------------- */
  ns.createCurve = function (container, options) {
    options = options || {};
    var stages = ns.data.stages;
    var id = ns.uid("lc");
    var interactive = !!options.interactive;

    var canvas = document.createElement("div");
    canvas.className = "lc-canvas" + (interactive ? "" : " lc-canvas--static");
    canvas.setAttribute("data-stage", options.highlight || 1);

    var svg = el("svg", {
      class: "lc-svg",
      viewBox: "0 0 " + G.width + " " + G.height,
      role: "img",
      "aria-labelledby": id + "-title " + id + "-desc",
      focusable: "false",
    });
    var title = el("title", { id: id + "-title" });
    title.textContent = options.title || "Curva conceptual del ciclo de vida del producto";
    var desc = el("desc", { id: id + "-desc" });
    desc.textContent =
      "Modelo teórico sin datos reales. Las ventas crecen lentamente en la introducción, aceleran en el crecimiento, " +
      "alcanzan su máximo en la madurez y descienden en el declive. Las utilidades son negativas al inicio, " +
      "alcanzan su máximo antes que las ventas y caen después.";
    svg.appendChild(title);
    svg.appendChild(desc);

    /* defs: trama para la etapa activa y recortes */
    var defs = el("defs");
    var pattern = el("pattern", {
      id: id + "-hatch",
      width: 10,
      height: 10,
      patternUnits: "userSpaceOnUse",
      patternTransform: "rotate(45)",
    });
    pattern.appendChild(el("line", { class: "lc-hatch-line", x1: 0, y1: 0, x2: 0, y2: 10 }));
    defs.appendChild(pattern);

    /* Sin movimiento reducido, las curvas empiezan ocultas y reveal() las traza. */
    var startHidden = !ns.reducedMotion() && "IntersectionObserver" in window;
    var revealClip = el("clipPath", { id: id + "-reveal" });
    var revealRect = el("rect", { x: 0, y: 0, width: startHidden ? 0 : G.width, height: G.height });
    revealClip.appendChild(revealRect);
    defs.appendChild(revealClip);

    var activeClip = el("clipPath", { id: id + "-active" });
    var activeRect = el("rect", { x: 0, y: 0, width: 0, height: G.height });
    activeClip.appendChild(activeRect);
    defs.appendChild(activeClip);
    svg.appendChild(defs);

    /* Bandas de etapa */
    var bandGroup = el("g", { class: "lc-bands" });
    var bands = stages.map(function (stage) {
      var bx = x(stage.range[0]);
      var bw = x(stage.range[1]) - bx;
      var band = el("rect", {
        class: "lc-band" + (interactive ? " is-interactive" : ""),
        "data-stage": stage.number,
        x: bx.toFixed(1),
        y: G.bandTop,
        width: bw.toFixed(1),
        height: G.bandBottom - G.bandTop,
      });
      bandGroup.appendChild(band);
      return band;
    });
    var hatch = el("rect", {
      class: "lc-hatch",
      fill: "url(#" + id + "-hatch)",
      y: G.bandTop,
      height: G.bandBottom - G.bandTop,
      "pointer-events": "none",
    });
    bandGroup.appendChild(hatch);
    svg.appendChild(bandGroup);

    /* Fronteras entre etapas */
    stages.slice(1).forEach(function (stage) {
      var bx = x(stage.range[0]).toFixed(1);
      svg.appendChild(el("line", {
        class: "lc-boundary", x1: bx, x2: bx, y1: G.bandTop, y2: G.bandBottom,
        "vector-effect": "non-scaling-stroke",
      }));
    });

    /* Ejes sin escala numérica */
    svg.appendChild(el("path", {
      class: "lc-axis",
      d: "M" + G.x0 + " " + (G.bandTop + 8) + " L" + G.x0 + " " + G.bandBottom,
      "vector-effect": "non-scaling-stroke",
    }));
    svg.appendChild(el("path", {
      class: "lc-axis",
      d: "M" + G.x0 + " " + G.yZero + " L" + (G.x1 + 6) + " " + G.yZero,
      "vector-effect": "non-scaling-stroke",
    }));
    svg.appendChild(el("path", {
      class: "lc-axis-head",
      d: "M" + (G.x1 + 14) + " " + G.yZero + " l-12 -6 v12 z",
    }));
    svg.appendChild(el("path", {
      class: "lc-axis-head",
      d: "M" + G.x0 + " " + (G.bandTop - 2) + " l-6 12 h12 z",
    }));

    /* Curvas (recortadas para la animación de trazado) */
    var curves = el("g", { "clip-path": "url(#" + id + "-reveal)" });
    curves.appendChild(el("path", { class: "lc-profit", d: PROFIT_PATH, "vector-effect": "non-scaling-stroke" }));
    curves.appendChild(el("path", { class: "lc-sales", d: SALES_PATH, "vector-effect": "non-scaling-stroke" }));
    var highlightGroup = el("g", { class: "lc-highlight-group", "clip-path": "url(#" + id + "-active)" });
    highlightGroup.appendChild(el("path", { class: "lc-halo", d: SALES_PATH, "vector-effect": "non-scaling-stroke" }));
    highlightGroup.appendChild(el("path", { class: "lc-highlight", d: SALES_PATH, "vector-effect": "non-scaling-stroke" }));
    curves.appendChild(highlightGroup);
    svg.appendChild(curves);

    canvas.appendChild(svg);

    /* Capas HTML: texto legible a cualquier tamaño */
    function overlay(className, text, left, top) {
      var node = document.createElement("span");
      node.className = "lc-overlay " + className;
      node.textContent = text;
      node.style.left = left;
      node.style.top = top;
      node.setAttribute("aria-hidden", "true");
      canvas.appendChild(node);
      return node;
    }

    if (!options.compact) {
      overlay("lc-label lc-label--axis-y", "Ventas y utilidades", "0", "50%");
      overlay("lc-label lc-label--axis-x", "Tiempo", pct(G.x1, G.width), pct(G.yZero - 16, G.height));
      overlay("lc-label lc-label--loss", "Pérdidas", pct(x(0.1), G.width), pct(G.yZero + 62, G.height));
      /* Etiquetas directas en zonas libres: arriba de la caída de ventas y bajo la cola de utilidades. */
      overlay("lc-label lc-label--series", "Ventas", pct(700, G.width), pct(150, G.height));
      overlay("lc-label lc-label--series", "Utilidades", pct(706, G.width), pct(402, G.height));
    }

    /* Número de etapa sobre cada banda (los nombres están en las pestañas y en el pie). */
    var chips = stages.map(function (stage) {
      var chip = document.createElement("span");
      chip.className = "lc-overlay lc-chip";
      chip.setAttribute("data-stage", stage.number);
      chip.setAttribute("aria-hidden", "true");
      chip.setAttribute("title", stage.name);
      chip.style.left = pct(x(stageMid(stage)), G.width);
      chip.style.top = pct(G.bandTop + 8, G.height);
      chip.textContent = stage.number;
      canvas.appendChild(chip);
      return chip;
    });

    /* Marcador que recorre la curva */
    var pin = document.createElement("span");
    pin.className = "lc-overlay lc-pin";
    pin.setAttribute("aria-hidden", "true");
    if (startHidden) pin.style.opacity = "0";
    canvas.appendChild(pin);

    container.appendChild(canvas);

    if (!options.compact) {
      var axes = document.createElement("p");
      axes.className = "lc-axes";
      axes.textContent = "Eje horizontal: tiempo. Eje vertical: ventas y utilidades, sin escala.";
      container.appendChild(axes);
    }

    var activeStage = null;
    function setActive(n, animate) {
      var stage = stages[n - 1];
      if (!stage) return;
      var changed = activeStage !== n;
      activeStage = n;
      canvas.setAttribute("data-stage", n);
      bands.forEach(function (band, i) {
        band.classList.toggle("is-active", i === n - 1);
      });
      chips.forEach(function (chip, i) {
        chip.classList.toggle("is-active", i === n - 1);
      });
      var bx = x(stage.range[0]);
      var bw = x(stage.range[1]) - bx;
      hatch.setAttribute("x", bx.toFixed(1));
      hatch.setAttribute("width", bw.toFixed(1));
      activeRect.setAttribute("x", bx.toFixed(1));
      activeRect.setAttribute("width", bw.toFixed(1));
      var mid = stageMid(stage);
      pin.style.left = pct(x(mid), G.width);
      pin.style.top = pct(y(sales(mid)), G.height);
      if (changed && animate) {
        highlightGroup.classList.remove("is-changing");
        void canvas.offsetWidth; // fuerza el recálculo para reiniciar la animación
        highlightGroup.classList.add("is-changing");
      }
    }

    /* Interacción con el puntero sobre las bandas */
    if (interactive) {
      var hoverTargets = bands.concat(chips);
      hoverTargets.forEach(function (target) {
        var n = Number(target.getAttribute("data-stage"));
        target.addEventListener("click", function () {
          if (options.onSelect) options.onSelect(n);
        });
        target.addEventListener("pointerenter", function () {
          bands[n - 1].classList.add("is-hover");
        });
        target.addEventListener("pointerleave", function () {
          bands[n - 1].classList.remove("is-hover");
        });
      });
    }

    setActive(options.highlight || 1, false);

    return {
      setStage: function (n) { setActive(n, true); },
      /* Dibuja las curvas de izquierda a derecha una sola vez. */
      reveal: function () {
        if (!startHidden) return;
        ns.tween(1300, function (p) {
          revealRect.setAttribute("width", (G.width * p).toFixed(1));
        }, function () {
          pin.style.opacity = "";
        });
      },
    };
  };

  /* ====================================================================
     Selector principal: pestañas + gráfica + panel
     ==================================================================== */
  var tabs = [];
  var mainChart = null;
  var panel = null;

  function renderTabs(container) {
    container.innerHTML = ns.data.stages.map(function (stage) {
      return (
        '<button class="stage-tab" type="button" role="tab" data-stage="' + stage.number + '" ' +
        'id="stage-tab-' + stage.number + '" aria-controls="lc-panel" aria-selected="false" tabindex="-1">' +
        '<span class="stage-tab__num" aria-hidden="true">' + stage.number + "</span>" +
        '<span class="stage-tab__text"><span class="stage-tab__kicker">Etapa ' + stage.number + "</span>" +
        '<span class="stage-tab__name">' + stage.name + "</span></span></button>"
      );
    }).join("");
    tabs = $$(".stage-tab", container);

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        ns.setStage(index + 1, "tabs");
      });
      tab.addEventListener("keydown", function (event) {
        var target = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") target = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") target = 0;
        else if (event.key === "End") target = tabs.length - 1;
        if (target === null) return;
        event.preventDefault();
        ns.setStage(target + 1, "tabs");
        tabs[target].focus();
      });
    });
  }

  /* Las cuatro etapas se dibujan apiladas en la misma celda de una cuadrícula:
     el panel conserva siempre la altura de la más larga y cambiar de etapa no
     desplaza el resto de la página (Safari no compensa esos saltos al desplazarse). */
  var slides = [];

  function slideHTML(stage) {
    var n = stage.number;
    var total = ns.data.stages.length;
    var progress = "";
    for (var i = 1; i <= total; i++) {
      progress += '<span class="' + (i < n ? "is-done" : i === n ? "is-current" : "") + '"></span>';
    }
    return (
      '<div class="lc-slide" data-stage="' + n + '">' +
      '<p class="lc-panel__step"><span>Etapa ' + n + " de " + total + "</span>" +
      '<span class="lc-progress" aria-hidden="true">' + progress + "</span></p>" +
      '<h3 class="lc-panel__title">' + ns.icon(stage.icon) + stage.name + "</h3>" +
      '<dl class="lc-facts">' +
      "<div><dt>Ventas (comportamiento teórico)</dt><dd>" + ns.rich(stage.sales) + "</dd></div>" +
      "<div><dt>Utilidades</dt><dd>" + ns.rich(stage.profit) + "</dd></div>" +
      "<div><dt>Objetivo principal</dt><dd>" + ns.rich(stage.objective) + "</dd></div>" +
      "<div><dt>Estrategia recomendada</dt><dd>" + ns.rich(stage.strategy) + "</dd></div>" +
      "</dl>" +
      '<div class="lc-panel__nav">' +
      '<button class="icon-btn" type="button" data-step="-1" aria-label="Etapa anterior"' + (n === 1 ? " disabled" : "") + ">" + ns.icon("i-arrow-left") + "</button>" +
      '<a class="lc-panel__more" href="#' + stage.id + '">Ver la etapa completa ' + ns.icon("i-arrow-down") + "</a>" +
      '<button class="icon-btn" type="button" data-step="1" aria-label="Etapa siguiente"' + (n === total ? " disabled" : "") + ">" + ns.icon("i-arrow-right") + "</button>" +
      "</div></div>"
    );
  }

  function buildPanel() {
    panel.innerHTML = '<div class="lc-slides">' + ns.data.stages.map(slideHTML).join("") + "</div>";
    slides = $$(".lc-slide", panel);
  }

  function showSlide(n, animate) {
    panel.setAttribute("data-stage", n);
    panel.setAttribute("aria-labelledby", "stage-tab-" + n);
    slides.forEach(function (slide, index) {
      var active = index === n - 1;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
      if (active) slide.removeAttribute("inert");
      else slide.setAttribute("inert", "");
    });
    if (animate) {
      var current = slides[n - 1];
      current.classList.remove("is-changing");
      void current.offsetWidth;
      current.classList.add("is-changing");
    }
  }

  function selectStage(n, source) {
    tabs.forEach(function (tab, index) {
      var selected = index === n - 1;
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.setAttribute("tabindex", selected ? "0" : "-1");
    });
    if (mainChart) mainChart.setStage(n);
    showSlide(n, source !== "scroll" && source !== "init");
  }

  /* ====================================================================
     Indicadores típicos de cada etapa
     ==================================================================== */
  function renderIndicators() {
    $$("[data-indicators]").forEach(function (box) {
      var stage = ns.data.stages[Number(box.getAttribute("data-indicators")) - 1];
      if (!stage) return;
      var rows = stage.indicators.map(function (item) {
        var pips = "";
        for (var i = 1; i <= 5; i++) pips += '<span class="' + (i <= item.level ? "is-on" : "") + '"></span>';
        return (
          '<div class="meter"><dt>' + item.label + "</dt><dd>" +
          '<span class="meter__pips" aria-hidden="true">' + pips + "</span>" +
          '<span class="meter__text">' + item.text + "</span></dd></div>"
        );
      }).join("");
      box.innerHTML =
        '<h3 class="indicators__title">Tendencias típicas</h3>' +
        '<p class="indicators__note">Según el modelo teórico ' + ns.citeHTML("openstax-93") + "; no son datos del Triangulito.</p>" +
        '<dl class="meters">' + rows + "</dl>";
    });
  }

  ns.modules.lifecycle = {
    init: function () {
      var root = $("[data-lifecycle]");
      if (root) {
        panel = $("[data-stage-panel]", root);
        renderTabs($("[data-stage-tabs]", root));
        buildPanel();
        mainChart = ns.createCurve($("[data-main-chart]", root), {
          interactive: true,
          highlight: ns.state.stage,
          title: "Curva conceptual del ciclo de vida con cuatro etapas seleccionables",
          onSelect: function (n) { ns.setStage(n, "chart"); },
        });
        panel.addEventListener("click", function (event) {
          var button = event.target.closest("[data-step]");
          if (!button) return;
          ns.setStage(ns.state.stage + Number(button.getAttribute("data-step")), "panel");
        });
        ns.on("stage", function (detail) { selectStage(detail.stage, detail.source); });
        selectStage(ns.state.stage, "init");
        ns.onceVisible(root, function () { mainChart.reveal(); }, { threshold: 0.3 });
      }

      $$("[data-mini-chart]").forEach(function (box) {
        var n = Number(box.getAttribute("data-mini-chart"));
        var stage = ns.data.stages[n - 1];
        var mini = ns.createCurve(box, {
          compact: true,
          highlight: n,
          title: "Curva conceptual con la etapa de " + stage.name.toLowerCase() + " resaltada",
        });
        ns.onceVisible(box, function () { mini.reveal(); }, { threshold: 0.4 });
      });

      renderIndicators();
    },
  };
})(window.CicloVida);
