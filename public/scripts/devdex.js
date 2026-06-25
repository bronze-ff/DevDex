/* DevDex — interatividade global (carregado via Starlight `head`). */
(function () {
  'use strict';

  // ── Checklists: task lists `- [ ]` viram clicáveis e persistem ──
  // (ignora os checkboxes do gerador, que têm data-cmd)
  function initChecklists() {
    var boxes = document.querySelectorAll(
      '.sl-markdown-content input[type="checkbox"]:not([data-cmd])'
    );
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

  // ── Gerador de script de setup ──
  function initGenerator() {
    document.querySelectorAll('[data-ddx-gen]').forEach(function (gen) {
      if (gen.dataset.ddxInit) return;
      gen.dataset.ddxInit = '1';
      var code = gen.querySelector('.ddx-gen__code code');
      var copy = gen.querySelector('.ddx-gen__copy');
      var boxes = gen.querySelectorAll('input[type="checkbox"]');
      function rebuild() {
        var lines = ['# DevDex — setup da máquina (winget)'];
        boxes.forEach(function (cb) {
          if (cb.checked && cb.dataset.cmd) lines.push(cb.dataset.cmd);
        });
        if (code) code.textContent = lines.join('\n');
      }
      boxes.forEach(function (cb) {
        cb.addEventListener('change', rebuild);
      });
      if (copy) {
        copy.addEventListener('click', async function () {
          try {
            await navigator.clipboard.writeText(code ? code.textContent : '');
            var o = copy.textContent;
            copy.textContent = 'Copiado!';
            setTimeout(function () { copy.textContent = o; }, 1500);
          } catch (e) {}
        });
      }
      rebuild();
    });
  }

  function init() {
    initChecklists();
    initGenerator();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('astro:page-load', init); // View Transitions
})();
