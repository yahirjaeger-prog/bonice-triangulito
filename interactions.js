/* ==========================================================================
   interactions.js — Tarjetas expandibles, paneles, citas y detalles visuales
   ========================================================================== */
(function (ns) {
  "use strict";

  var $ = ns.$;
  var $$ = ns.$$;

  /* ====================================================================
     Acordeones y tarjetas expandibles
     ==================================================================== */
  function setAccordion(acc, open) {
    var button = $(".acc__btn", acc);
    acc.classList.toggle("is-open", open);
    if (button) button.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function syncExpandAll(group) {
    var section = group.closest(".questions");
    if (!section) return;
    var toggle = $("[data-expand-all]", section);
    if (!toggle) return;
    var items = $$(".acc", group);
    var allOpen = items.every(function (acc) { return acc.classList.contains("is-open"); });
    toggle.textContent = allOpen ? "Cerrar todas" : "Abrir todas";
    toggle.setAttribute("aria-pressed", allOpen ? "true" : "false");
  }

  function initAccordions() {
    $$(".acc").forEach(function (acc) {
      var button = $(".acc__btn", acc);
      if (!button) return;
      setAccordion(acc, false);
      button.addEventListener("click", function () {
        setAccordion(acc, !acc.classList.contains("is-open"));
        var group = acc.closest(".acc-group");
        if (group) syncExpandAll(group);
      });
    });

    $$("[data-expand-all]").forEach(function (toggle) {
      var group = $(".acc-group", toggle.closest(".questions"));
      toggle.addEventListener("click", function () {
        var open = toggle.getAttribute("aria-pressed") !== "true";
        $$(".acc", group).forEach(function (acc) { setAccordion(acc, open); });
        syncExpandAll(group);
      });
    });
  }

  /* ====================================================================
     Panel lateral (ficha del producto y glosario)
     ==================================================================== */
  var dialog, dialogTitle, dialogBody, panelTrigger;

  function sheetHTML() {
    return ns.data.productSheet.map(function (row) {
      return '<div class="sheet__row"><dt>' + row.label + "</dt><dd>" + ns.rich(row.value) + "</dd></div>";
    }).join("");
  }

  var panels = {
    ficha: {
      title: "Ficha del producto",
      render: function () {
        return (
          '<div class="panel__product">' +
          '<img src="assets/images/triangulito-chocolate-empaque-sq.png" width="240" height="240" alt="" decoding="async">' +
          "<p>Triangulito de Bonice<br>Producto descontinuado</p></div>" +
          '<p class="panel__intro">Datos tomados de la prensa, de comerciales de la marca y de fuentes enciclopédicas. El producto analizado es el Triangulito, no la marca Bonice completa.</p>' +
          '<dl class="sheet__list">' + sheetHTML() + "</dl>" +
          '<p><a class="btn btn--ghost" href="#producto" data-close-panel>Ir a la sección Producto</a></p>'
        );
      },
    },
    glosario: {
      title: "Glosario de estrategias",
      render: function () {
        return (
          '<p class="panel__intro">Términos que aparecen en las etapas. Pulsa un término subrayado en el texto para abrirlo aquí.</p>' +
          '<dl class="glossary">' +
          ns.data.glossary.map(function (item) {
            return (
              '<div class="glossary__item" id="glosario-' + item.id + '"><dt>' + item.term + "</dt><dd>" +
              ns.rich(item.text) + "</dd></div>"
            );
          }).join("") +
          "</dl>"
        );
      },
    },
  };

  function openPanel(name, trigger, termId) {
    var config = panels[name];
    if (!config || !dialog) return;
    closeCitePop(false);
    panelTrigger = trigger || document.activeElement;
    dialogTitle.textContent = config.title;
    dialogBody.innerHTML = config.render();
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    dialogBody.scrollTop = 0;
    if (termId) {
      var item = document.getElementById("glosario-" + termId);
      if (item) {
        item.classList.add("is-target");
        item.scrollIntoView({ block: "center" });
      }
    }
    $("[data-panel-close]", dialog).focus();
  }

  function closePanel() {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) dialog.close();
    else dialog.removeAttribute("open");
  }

  function initPanel() {
    dialog = $("#panel");
    if (!dialog) return;
    dialogTitle = $("#panel-title", dialog);
    dialogBody = $("[data-panel-body]", dialog);

    document.addEventListener("click", function (event) {
      var opener = event.target.closest("[data-panel]");
      if (opener) {
        event.preventDefault();
        openPanel(opener.getAttribute("data-panel"), opener);
        return;
      }
      var term = event.target.closest("[data-term]");
      if (term) {
        event.preventDefault();
        openPanel("glosario", term, term.getAttribute("data-term"));
      }
    });

    $("[data-panel-close]", dialog).addEventListener("click", closePanel);
    /* Clic en el fondo oscuro: cierra. */
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) closePanel();
      if (event.target.closest("[data-close-panel]")) closePanel();
    });
    dialog.addEventListener("close", function () {
      if (panelTrigger && panelTrigger.focus && document.contains(panelTrigger)) panelTrigger.focus();
    });
  }

  /* ====================================================================
     Ventana emergente de citas
     ==================================================================== */
  var pop, popBody, popTitle, activeCite = null;

  function openCitePop(link) {
    var source = ns.getSource(link.getAttribute("data-cite"));
    if (!source) return;
    if (activeCite === link) {
      closeCitePop(true);
      return;
    }
    closeCitePop(false);
    activeCite = link;
    var n = ns.sourceNumber(source.key);
    popTitle.textContent = "Fuente " + n;
    popBody.innerHTML =
      '<p class="cite-pop__title">' + ns.escapeHTML(source.title) + "</p>" +
      '<p class="cite-pop__meta">' + ns.escapeHTML(source.author) + " · " + ns.escapeHTML(source.container) + " · " + ns.escapeHTML(source.date) + "</p>" +
      '<p class="cite-pop__links">' +
      '<a href="' + source.url + '" target="_blank" rel="noopener">Abrir fuente ' + ns.icon("i-external") +
      '<span class="sr-only"> (se abre en una pestaña nueva)</span></a>' +
      '<a href="#fuente-' + source.key + '" data-cite-goto="' + source.key + '">Ver en la lista</a></p>';
    pop.hidden = false;
    link.setAttribute("aria-expanded", "true");
    positionPop(link);
    var first = $("a", popBody);
    if (first) first.focus({ preventScroll: true });
  }

  function positionPop(link) {
    if (window.matchMedia("(max-width: 640px)").matches) {
      pop.style.left = "";
      pop.style.top = "";
      return;
    }
    var rect = link.getBoundingClientRect();
    var width = pop.offsetWidth;
    var left = rect.left + window.scrollX + rect.width / 2 - width / 2;
    var maxLeft = window.scrollX + document.documentElement.clientWidth - width - 12;
    left = Math.max(window.scrollX + 12, Math.min(left, maxLeft));
    var top = rect.bottom + window.scrollY + 8;
    /* Si no cabe debajo, se muestra arriba de la cita. */
    if (rect.bottom + pop.offsetHeight + 16 > window.innerHeight && rect.top > pop.offsetHeight + 16) {
      top = rect.top + window.scrollY - pop.offsetHeight - 8;
    }
    pop.style.left = left + "px";
    pop.style.top = top + "px";
  }

  function closeCitePop(restoreFocus) {
    if (!pop || pop.hidden) return;
    pop.hidden = true;
    if (activeCite) {
      activeCite.setAttribute("aria-expanded", "false");
      if (restoreFocus) activeCite.focus({ preventScroll: true });
    }
    activeCite = null;
  }

  function flashSource(key) {
    var item = document.getElementById("fuente-" + key);
    if (!item) return;
    item.scrollIntoView({ behavior: ns.reducedMotion() ? "auto" : "smooth", block: "center" });
    item.classList.add("is-flash");
    item.setAttribute("tabindex", "-1");
    item.focus({ preventScroll: true });
    window.setTimeout(function () { item.classList.remove("is-flash"); }, 2200);
  }

  function initCites() {
    pop = $("#cite-pop");
    popBody = $("[data-cite-body]", pop);
    popTitle = $("#cite-pop-title", pop);

    document.addEventListener("click", function (event) {
      var cite = event.target.closest("a.cite[data-cite]");
      if (cite) {
        event.preventDefault();
        /* Dentro del panel modal la ventana quedaría detrás: se va directo a la lista. */
        if (cite.closest("dialog")) {
          closePanel();
          flashSource(cite.getAttribute("data-cite"));
          return;
        }
        openCitePop(cite);
        return;
      }
      var goto = event.target.closest("[data-cite-goto]");
      if (goto) {
        event.preventDefault();
        var key = goto.getAttribute("data-cite-goto");
        closeCitePop(false);
        if (dialog && dialog.open) closePanel();
        flashSource(key);
        return;
      }
      if (!pop.hidden && !event.target.closest("#cite-pop")) closeCitePop(false);
    });

    $("[data-cite-close]", pop).addEventListener("click", function () { closeCitePop(true); });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !pop.hidden) {
        event.stopPropagation();
        closeCitePop(true);
      }
    });
    window.addEventListener("resize", function () {
      if (activeCite) positionPop(activeCite);
    });
  }

  /* ====================================================================
     Revelado progresivo de bloques al desplazarse
     ==================================================================== */
  function initReveal() {
    var items = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || ns.reducedMotion()) {
      items.forEach(function (item) { item.classList.add("is-revealed"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (item) { observer.observe(item); });
  }

  /* ====================================================================
     Anillos de distribución (etapa 2)
     ==================================================================== */
  function initRings() {
    $$("[data-rings]").forEach(function (rings) {
      ns.onceVisible(rings, function () { rings.classList.add("is-playing"); }, { threshold: 0.45 });
      var replay = $("[data-rings-replay]", rings);
      if (!replay) return;
      if (ns.reducedMotion()) {
        replay.hidden = true;
        return;
      }
      replay.addEventListener("click", function () {
        rings.classList.remove("is-playing");
        void rings.offsetWidth;
        rings.classList.add("is-playing");
      });
    });
  }

  /* ====================================================================
     Comparador de respuestas estratégicas (etapa 4)
     ==================================================================== */
  function initResponses() {
    var tabsBox = $("[data-response-tabs]");
    var panelBox = $("[data-response-panel]");
    if (!tabsBox || !panelBox) return;
    var options = ns.data.declineOptions;

    tabsBox.innerHTML = options.map(function (option, index) {
      return (
        '<button class="response-tab" type="button" role="tab" id="response-tab-' + option.id + '" ' +
        'aria-controls="responses-panel" aria-selected="false" tabindex="-1" data-index="' + index + '">' +
        ns.icon(option.icon) + option.name + "</button>"
      );
    }).join("");
    var tabs = $$(".response-tab", tabsBox);

    function select(index, animate) {
      var option = options[index];
      tabs.forEach(function (tab, i) {
        tab.setAttribute("aria-selected", i === index ? "true" : "false");
        tab.setAttribute("tabindex", i === index ? "0" : "-1");
      });
      panelBox.setAttribute("aria-labelledby", "response-tab-" + option.id);
      panelBox.innerHTML =
        '<div class="response-fact"><h4>' + ns.icon("i-info") + "Qué implica</h4><p>" + ns.rich(option.what) + "</p></div>" +
        '<div class="response-fact"><h4>' + ns.icon("i-check") + "Cuándo tiene sentido</h4><p>" + ns.rich(option.when) + "</p></div>" +
        '<div class="response-fact"><h4>' + ns.icon("i-alert") + "Riesgo</h4><p>" + ns.rich(option.risk) + "</p></div>" +
        '<div class="response-fact response-fact--case"><h4>' + ns.icon("i-search") + "¿Y el Triangulito?</h4><p>" + ns.rich(option.product) + "</p></div>";
      if (animate) {
        panelBox.classList.remove("is-changing");
        void panelBox.offsetWidth;
        panelBox.classList.add("is-changing");
      }
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () { select(index, true); });
      tab.addEventListener("keydown", function (event) {
        var target = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") target = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") target = 0;
        else if (event.key === "End") target = tabs.length - 1;
        if (target === null) return;
        event.preventDefault();
        select(target, true);
        tabs[target].focus();
      });
    });
    var initial = 0;
    options.forEach(function (option, index) {
      if (option.selected) initial = index;
    });
    select(initial, false);
  }

  /* ====================================================================
     Pantalla completa y apertura en pestaña nueva (útil dentro de Notion)
     ==================================================================== */
  function initViewOptions() {
    var fullscreenBtn = $('[data-action="fullscreen"]');
    var newTabLink = $('[data-action="newtab"]');
    var root = document.documentElement;

    var embedded = false;
    try {
      embedded = window.self !== window.top;
    } catch (error) {
      embedded = true;
    }

    /* Dentro de un marco (Notion) no se consulta la API de pantalla completa:
       algunos navegadores la bloquean y registran un error. Se ofrece abrir en pestaña nueva. */
    if (newTabLink && embedded) {
      newTabLink.href = window.location.href.split("#")[0];
      newTabLink.hidden = false;
    }
    if (embedded) return;

    var canFullscreen = false;
    try {
      canFullscreen = !!document.fullscreenEnabled && typeof root.requestFullscreen === "function";
    } catch (error) {
      canFullscreen = false;
    }

    if (fullscreenBtn && canFullscreen) {
      fullscreenBtn.hidden = false;
      var label = $("[data-fullscreen-label]", fullscreenBtn);
      fullscreenBtn.addEventListener("click", function () {
        if (document.fullscreenElement) document.exitFullscreen();
        else root.requestFullscreen().catch(function () { fullscreenBtn.hidden = true; });
      });
      document.addEventListener("fullscreenchange", function () {
        label.textContent = document.fullscreenElement ? "Salir de pantalla completa" : "Pantalla completa";
      });
    }
  }

  ns.modules.interactions = {
    init: function () {
      initAccordions();
      initPanel();
      initCites();
      initReveal();
      initRings();
      initResponses();
      initViewOptions();
    },
  };
})(window.CicloVida);
