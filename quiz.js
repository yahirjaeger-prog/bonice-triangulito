/* ==========================================================================
   quiz.js — Cuestionario de repaso con retroalimentación inmediata
   ========================================================================== */
(function (ns) {
  "use strict";

  var $ = ns.$;
  var LETTERS = ["A", "B", "C", "D", "E"];

  function createQuiz(root, questions) {
    var state = { index: 0, answers: [] };

    function score() {
      return state.answers.filter(function (answer, i) {
        return answer === questions[i].answer;
      }).length;
    }

    function dots() {
      return questions.map(function (q, i) {
        var cls = "";
        if (i < state.answers.length) cls = state.answers[i] === q.answer ? "is-right" : "is-wrong";
        else if (i === state.index) cls = "is-current";
        return '<li class="' + cls + '"></li>';
      }).join("");
    }

    function renderQuestion(focusQuestion) {
      var q = questions[state.index];
      root.innerHTML =
        '<div class="quiz__top">' +
        '<p class="quiz__count">Pregunta ' + (state.index + 1) + " de " + questions.length + "</p>" +
        '<p class="quiz__score">' + ns.icon("i-check") + "Aciertos: " + score() + "</p>" +
        '<ol class="quiz__dots" aria-hidden="true">' + dots() + "</ol>" +
        "</div>" +
        '<h3 class="quiz__question" id="quiz-question" tabindex="-1">' + q.question + "</h3>" +
        '<ul class="quiz__options" role="list" aria-labelledby="quiz-question">' +
        q.options.map(function (option, i) {
          return (
            '<li><button class="quiz-opt" type="button" data-option="' + i + '">' +
            '<span class="quiz-opt__key" aria-hidden="true">' + LETTERS[i] + "</span>" +
            '<span class="quiz-opt__text">' + option + "</span>" +
            '<span class="quiz-opt__verdict"></span>' +
            "</button></li>"
          );
        }).join("") +
        "</ul>" +
        '<div class="quiz__feedback-slot" aria-live="polite"></div>' +
        '<div class="quiz__actions"></div>';

      root.querySelectorAll(".quiz-opt").forEach(function (button) {
        button.addEventListener("click", function () {
          answer(Number(button.getAttribute("data-option")));
        });
      });
      if (focusQuestion) $("#quiz-question", root).focus({ preventScroll: true });
    }

    function answer(choice) {
      if (state.answers.length > state.index) return;
      var q = questions[state.index];
      var correct = choice === q.answer;
      state.answers.push(choice);

      root.querySelectorAll(".quiz-opt").forEach(function (button) {
        var i = Number(button.getAttribute("data-option"));
        var verdict = $(".quiz-opt__verdict", button);
        button.disabled = true;
        if (i === q.answer) {
          button.classList.add("is-correct");
          $(".quiz-opt__key", button).innerHTML = ns.icon("i-check");
          verdict.innerHTML = "Respuesta correcta";
        } else if (i === choice) {
          button.classList.add("is-wrong");
          $(".quiz-opt__key", button).innerHTML = ns.icon("i-close");
          verdict.innerHTML = "Tu respuesta";
        } else {
          button.classList.add("is-dimmed");
        }
      });

      $(".quiz__feedback-slot", root).innerHTML =
        '<div class="quiz__feedback ' + (correct ? "is-good" : "is-bad") + '">' +
        '<p class="quiz__feedback-title">' + ns.icon(correct ? "i-check" : "i-info") +
        (correct ? "¡Correcto!" : "No exactamente. La respuesta es «" + q.options[q.answer] + "».") + "</p>" +
        "<p>" + q.explanation + "</p></div>";

      $(".quiz__score", root).innerHTML = ns.icon("i-check") + "Aciertos: " + score();
      $(".quiz__dots", root).innerHTML = dots();

      var last = state.index === questions.length - 1;
      var actions = $(".quiz__actions", root);
      actions.innerHTML =
        '<button class="btn btn--primary" type="button" data-next>' +
        (last ? "Ver resultado" : "Siguiente pregunta") + ns.icon("i-arrow-right") + "</button>";
      var next = $("[data-next]", actions);
      next.addEventListener("click", function () {
        if (last) renderResult();
        else {
          state.index += 1;
          renderQuestion(true);
        }
      });
      next.focus({ preventScroll: true });
    }

    function renderResult() {
      var total = questions.length;
      var points = score();
      var message;
      if (points === total) message = "¡Excelente! Dominas las cuatro etapas y sus estrategias.";
      else if (points >= total - 2) message = "¡Muy bien! Revisa las explicaciones de las preguntas que fallaste.";
      else message = "Vale la pena repasar el modelo y la tabla comparativa antes de intentarlo de nuevo.";

      root.innerHTML =
        '<div class="quiz-result">' +
        '<div class="quiz-result__ring" style="--pct:' + Math.round((points / total) * 100) + '" role="img" aria-label="' + points + " de " + total + ' respuestas correctas">' +
        "<span>" + points + "<small>/" + total + "</small></span></div>" +
        '<h3 class="quiz-result__title" id="quiz-result-title" tabindex="-1">' + points + " de " + total + " aciertos</h3>" +
        '<p class="quiz-result__text">' + message + "</p>" +
        '<ul class="quiz-result__review">' +
        questions.map(function (q, i) {
          var ok = state.answers[i] === q.answer;
          return (
            '<li class="' + (ok ? "is-right" : "is-wrong") + '">' + ns.icon(ok ? "i-check" : "i-close") +
            "<span><strong>" + (ok ? "Correcta" : "Incorrecta") + ":</strong> " + q.options[q.answer] + "</span></li>"
          );
        }).join("") +
        "</ul>" +
        '<div class="quiz__actions">' +
        '<button class="btn btn--primary" type="button" data-retry>' + ns.icon("i-replay") + "Intentar de nuevo</button>" +
        '<a class="btn btn--ghost" href="#comparacion">Repasar el resumen</a>' +
        "</div></div>";

      $("[data-retry]", root).addEventListener("click", function () {
        state.index = 0;
        state.answers = [];
        renderQuestion(true);
      });
      $("#quiz-result-title", root).focus({ preventScroll: true });
    }

    renderQuestion(false);
  }

  ns.modules.quiz = {
    init: function () {
      var root = $("[data-quiz]");
      if (root && ns.data.quiz && ns.data.quiz.length) createQuiz(root, ns.data.quiz);
    },
  };
})(window.CicloVida);
