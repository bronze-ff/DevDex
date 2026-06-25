/* DevDex — interatividade global (carregado via Starlight `head`). */
(function () {
  'use strict';

  var reduce =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Checklists: task lists `- [ ]` viram clicáveis e persistem ──
  function initChecklists() {
    var boxes = document.querySelectorAll(
      '.sl-markdown-content li input[type="checkbox"]:not([data-cmd])'
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
      boxes.forEach(function (cb) { cb.addEventListener('change', rebuild); });
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

  // ── Terminal "ao vivo": digita o comando e revela a saída ──
  function initTermPlay() {
    document.querySelectorAll('[data-ddx-play]').forEach(function (el) {
      if (el.dataset.ddxInit) return;
      el.dataset.ddxInit = '1';
      var code = el.querySelector('.ddx-play__body code');
      var replay = el.querySelector('.ddx-play__replay');
      var session;
      try { session = JSON.parse(el.getAttribute('data-session') || '[]'); }
      catch (e) { session = []; }
      var timers = [];

      function full() {
        return session
          .map(function (it) { return (it.t === 'cmd' ? '> ' : '') + it.s; })
          .join('\n');
      }
      function run() {
        timers.forEach(clearTimeout);
        timers = [];
        if (!code) return;
        if (reduce) { code.textContent = full(); return; }
        code.textContent = '';
        var delay = 0;
        session.forEach(function (item) {
          if (item.t === 'cmd') {
            timers.push(setTimeout(function () { code.textContent += '> '; }, delay));
            delay += 220;
            item.s.split('').forEach(function (ch) {
              timers.push(setTimeout(function () { code.textContent += ch; }, delay));
              delay += 42;
            });
            timers.push(setTimeout(function () { code.textContent += '\n'; }, delay));
            delay += 180;
          } else {
            timers.push(setTimeout(function () { code.textContent += item.s + '\n'; }, delay));
            delay += 380;
          }
        });
      }

      if (replay) replay.addEventListener('click', run);
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) { run(); io.unobserve(el); }
          });
        }, { threshold: 0.3 });
        io.observe(el);
      } else {
        run();
      }
    });
  }

  // ── Sidebar recolhível (botão flutuante, só onde há sidebar) ──
  function initSidebarToggle() {
    var KEY = 'ddx-sidebar-collapsed';
    var root = document.documentElement;
    var existing = document.getElementById('ddx-sb-toggle');

    if (!document.querySelector('.sidebar-pane')) {
      if (existing) existing.remove();
      root.classList.remove('ddx-sidebar-collapsed');
      return;
    }

    root.classList.toggle('ddx-sidebar-collapsed', localStorage.getItem(KEY) === '1');
    if (existing) return;

    var btn = document.createElement('button');
    btn.id = 'ddx-sb-toggle';
    btn.className = 'ddx-sb-toggle';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Recolher ou expandir o menu lateral');
    function render() {
      btn.textContent = root.classList.contains('ddx-sidebar-collapsed') ? '☰' : '◀';
    }
    btn.addEventListener('click', function () {
      var c = root.classList.toggle('ddx-sidebar-collapsed');
      localStorage.setItem(KEY, c ? '1' : '0');
      render();
    });
    render();
    document.body.appendChild(btn);
  }

  function init() {
    initChecklists();
    initGenerator();
    initTermPlay();
    initSidebarToggle();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('astro:page-load', init); // View Transitions
})();
