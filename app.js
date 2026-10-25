/* ==========================================================================
   app.js — Arranque: dibuja los bloques basados en datos e inicia módulos
   ========================================================================== */
(function (ns) {
  "use strict";

  var $ = ns.$;
  var $$ = ns.$$;

  function renderProductSheet() {
    var target = $("[data-product-sheet]");
    if (!target) return;
    target.innerHTML = ns.data.productSheet.map(function (row) {
      return '<div class="sheet__row"><dt>' + row.label + "</dt><dd>" + ns.rich(row.value) + "</dd></div>";
    }).join("");
  }

  function renderComparison() {
    var body = $("[data-compare-body]");
    if (!body) return;
    body.innerHTML = ns.data.stages.map(function (stage) {
      return (
        '<tr data-stage="' + stage.number + '">' +
        '<th scope="row"><span class="compare-stage"><span class="compare-stage__n" aria-hidden="true">' + stage.number + "</span>" +
        stage.name + ns.icon(stage.icon) + "</span></th>" +
        '<td data-label="Ventas">' + ns.rich(stage.sales) + "</td>" +
        '<td data-label="Objetivo del marketing">' + ns.rich(stage.objective) + "</td>" +
        '<td data-label="Retos principales">' + ns.rich(stage.challenges) + "</td>" +
        '<td data-label="Estrategia recomendada">' + ns.rich(stage.strategy) + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function renderSources() {
    var target = $("[data-sources]");
    if (!target) return;
    target.innerHTML = ns.data.sourceGroups.map(function (group) {
      var items = ns.data.sources.filter(function (source) { return source.group === group.id; });
      return (
        '<div class="source-group"><h3 class="source-group__title">' + group.title + "</h3>" +
        '<ol class="source-list">' +
        items.map(function (source) {
          var n = ns.sourceNumber(source.key);
          return (
            '<li class="source" id="fuente-' + source.key + '">' +
            '<span class="source__n">[' + n + "]</span>" +
            '<div class="source__ref">' + ns.escapeHTML(source.author) + " (" + ns.escapeHTML(source.date) + "). " +
            "<em>" + ns.escapeHTML(source.title) + "</em>" + (/[.?!]$/.test(source.title) ? " " : ". ") +
            ns.escapeHTML(source.container) + ".<br>" +
            '<a class="source__url" href="' + source.url + '" target="_blank" rel="noopener">' +
            ns.escapeHTML(source.url) + ns.icon("i-external") + '<span class="sr-only"> (se abre en una pestaña nueva)</span></a></div>' +
            '<p class="source__supports"><strong>Respalda:</strong> ' + ns.escapeHTML(source.supports) + "</p>" +
            "</li>"
          );
        }).join("") +
        "</ol></div>"
      );
    }).join("");

    var accessed = $("[data-accessed]");
    if (accessed && ns.data.meta.accessed) accessed.textContent = ns.data.meta.accessed;
  }

  function renderImageCredits() {
    var target = $("[data-image-credits]");
    if (!target || !ns.data.imageCredits) return;
    target.innerHTML = ns.data.imageCredits.map(function (item) {
      var license = item.license
        ? ' · <a href="' + item.license + '" target="_blank" rel="noopener">licencia</a>'
        : "";
      var link = item.url
        ? '<a href="' + item.url + '" target="_blank" rel="noopener">Ver original' +
          '<span class="sr-only"> (se abre en una pestaña nueva)</span></a>'
        : "";
      return (
        "<li><strong>" + ns.escapeHTML(item.what) + ":</strong> " + ns.escapeHTML(item.credit) + ". " +
        link + license + "</li>"
      );
    }).join("");
  }

  function renderTeam() {
    var meta = ns.data.meta;
    var target = $("[data-team]");
    var parts = [meta.team, meta.course, meta.institution].filter(Boolean);
    if (!target || !parts.length) return;
    target.textContent = parts.join(" · ");
    target.hidden = false;
  }

  function safely(name, fn) {
    try {
      fn();
    } catch (error) {
      if (window.console) console.error("[CicloVida] Error en " + name + ":", error);
    }
  }

  function init() {
    safely("ficha", renderProductSheet);
    safely("comparación", renderComparison);
    safely("fuentes", renderSources);
    safely("equipo", renderTeam);
    safely("créditos de imágenes", renderImageCredits);

    ["lifecycle", "interactions", "quiz", "navigation"].forEach(function (name) {
      var module = ns.modules[name];
      if (module) safely(name, module.init);
    });

    /* Las citas escritas en index.html se numeran al final. */
    safely("citas", function () { ns.hydrateCites(document); });

    /* Si se llegó con un #ancla, se respeta la posición después de dibujar. */
    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ block: "start" });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window.CicloVida);
