/* DevDex — interatividade global (carregado via Starlight `head`). */
(function () {
  'use strict';

  // ── Checklists interativos: task lists `- [ ]` viram clicáveis e persistem ──
  function initChecklists() {
    var boxes = document.querySelectorAll('.sl-markdown-content input[type="checkbox"]');
    boxes.forEach(function (cb, i) {
      if (cb.dataset.ddxInit) return;
      cb.dataset.ddxInit = '1';
      cb.disabled = false;
      cb.style.cursor = 'pointer';
      var key = 'ddx-check:' + location.pathname + ':' + i;
      var li = cb.closest('li');
      if (localStorage.getItem(key) === '1') {
        cb.checked = true;
        if (li) li.classList.add('ddx-done');
      }
      cb.addEventListener('change', function () {
        localStorage.setItem(key, cb.checked ? '1' : '0');
        if (li) li.classList.toggle('ddx-done', cb.checked);
      });
    });
  }

  function init() {
    initChecklists();
  }

  document.addEventListener('DOMContentLoaded', init);
  // Starlight usa View Transitions — re-inicializa a cada navegação
  document.addEventListener('astro:page-load', init);
})();
