/* =========================================================
   Story Genius Scene Editor — lógica da aplicação
   ========================================================= */
(function () {
  'use strict';

  var FORMAT = 'story-genius-scene';
  var VERSION = 1;
  var DRAFT_KEY = 'sg-draft';
  var THEME_KEY = 'sg-theme';
  var FIELDS = ['anchor', 'misbelief', 'goal', 'trouble', 'shift'];

  var $ = function (id) { return document.getElementById(id); };
  var titleEl = $('scene-title');
  var proseEl = $('prose');
  var statusEl = $('status');
  var fileInput = $('file-input');
  var textareas = Array.prototype.slice.call(document.querySelectorAll('textarea[data-field]'));

  var dirHandle = null;     // pasta escolhida pelo usuário (File System Access API)
  var dirty = false;
  var statusTimer = null;

  /* ---------- Utilidades ---------- */
  function setStatus(msg, sticky) {
    statusEl.textContent = msg;
    clearTimeout(statusTimer);
    if (!sticky && msg) {
      statusTimer = setTimeout(function () { statusEl.textContent = ''; }, 4000);
    }
  }

  function slugify(text) {
    return (text || 'cena')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '').slice(0, 40) || 'cena';
  }

  function timestamp() {
    var d = new Date();
    var p = function (n) { return String(n).padStart(2, '0'); };
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
  }

  function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = Math.max(el.scrollHeight + 2, 84) + 'px';
  }

  /* ---------- Estado da cena ---------- */
  function collect() {
    var data = {
      format: FORMAT,
      version: VERSION,
      savedAt: new Date().toISOString(),
      title: titleEl.value.trim(),
      pillars: {},
      prose: proseEl.innerHTML
    };
    textareas.forEach(function (t) { data.pillars[t.dataset.field] = t.value; });
    return data;
  }

  function sanitizeHTML(html) {
    // Mantém apenas tags de formatação seguras (evita injeção via arquivo importado)
    var allowed = { B: 1, STRONG: 1, I: 1, EM: 1, H2: 1, H3: 1, UL: 1, OL: 1, LI: 1, P: 1, BR: 1, DIV: 1 };
    var tpl = document.createElement('template');
    tpl.innerHTML = html || '';
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 1) {
          if (!allowed[child.tagName]) {
            if (/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED)$/.test(child.tagName)) {
              node.removeChild(child);
              return;
            }
            walk(child);
            while (child.firstChild) node.insertBefore(child.firstChild, child);
            node.removeChild(child);
            return;
          }
          Array.prototype.slice.call(child.attributes).forEach(function (a) { child.removeAttribute(a.name); });
          walk(child);
        } else if (child.nodeType !== 3) {
          node.removeChild(child);
        }
      });
    })(tpl.content);
    return tpl.innerHTML;
  }

  function apply(data) {
    titleEl.value = data.title || '';
    var p = data.pillars || {};
    textareas.forEach(function (t) {
      t.value = typeof p[t.dataset.field] === 'string' ? p[t.dataset.field] : '';
      autoGrow(t);
    });
    proseEl.innerHTML = sanitizeHTML(data.prose);
  }

  function isEmpty() {
    return !titleEl.value.trim() && !proseEl.textContent.trim() &&
      textareas.every(function (t) { return !t.value.trim(); });
  }

  /* ---------- Rascunho automático (localStorage) ---------- */
  var draftTimer = null;
  function markDirty() {
    dirty = true;
    clearTimeout(draftTimer);
    draftTimer = setTimeout(saveDraft, 600);
  }

  function saveDraft() {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(collect())); } catch (e) {}
  }

  function loadDraft() {
    try {
      var raw = localStorage.getItem(DRAFT_KEY);
      if (raw) apply(JSON.parse(raw));
    } catch (e) {}
  }

  /* ---------- Nova cena ---------- */
  function newScene() {
    if (!isEmpty() && dirty && !confirm('Descartar as alterações não salvas e começar uma nova cena?')) return;
    apply({});
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
    dirty = false;
    titleEl.focus();
    setStatus('Nova cena criada.');
  }

  /* ---------- Salvar ---------- */
  async function save() {
    var data = collect();
    var json = JSON.stringify(data, null, 2);
    var name = slugify(data.title) + '_' + timestamp() + '.json';

    if (window.showDirectoryPicker) {
      try {
        if (!dirHandle) {
          dirHandle = await window.showDirectoryPicker({ mode: 'readwrite', id: 'story-genius' });
        } else if (dirHandle.queryPermission) {
          var perm = await dirHandle.queryPermission({ mode: 'readwrite' });
          if (perm !== 'granted') perm = await dirHandle.requestPermission({ mode: 'readwrite' });
          if (perm !== 'granted') { dirHandle = null; throw new Error('permission'); }
        }
        var fh = await dirHandle.getFileHandle(name, { create: true });
        var w = await fh.createWritable();
        await w.write(json);
        await w.close();
        dirty = false;
        saveDraft();
        setStatus('Versão salva na pasta: ' + name);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') { setStatus('Salvamento cancelado.'); return; }
        dirHandle = null; // cai para o download
      }
    }
    downloadFallback(json, name);
  }

  function downloadFallback(json, name) {
    var blob = new Blob([json], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    dirty = false;
    saveDraft();
    setStatus('Arquivo baixado: ' + name);
  }

  /* ---------- Carregar ---------- */
  async function load() {
    if (!isEmpty() && dirty && !confirm('Carregar um arquivo substituirá o conteúdo atual não salvo. Continuar?')) return;

    if (window.showOpenFilePicker) {
      try {
        var opts = {
          types: [{ description: 'Cena Story Genius', accept: { 'application/json': ['.json'] } }],
          multiple: false
        };
        if (dirHandle) opts.startIn = dirHandle;
        var picked = await window.showOpenFilePicker(opts);
        var file = await picked[0].getFile();
        importText(await file.text(), file.name);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return;
        // qualquer outro erro: usa o seletor padrão
      }
    }
    fileInput.value = '';
    fileInput.click();
  }

  function importText(text, name) {
    try {
      var data = JSON.parse(text);
      if (!data || data.format !== FORMAT) throw new Error('formato');
      apply(data);
      dirty = false;
      saveDraft();
      setStatus('Cena carregada: ' + name);
    } catch (e) {
      setStatus('Arquivo inválido: não é uma cena do Story Genius.');
    }
  }

  fileInput.addEventListener('change', function () {
    var f = fileInput.files && fileInput.files[0];
    if (!f) return;
    var reader = new FileReader();
    reader.onload = function () { importText(String(reader.result), f.name); };
    reader.readAsText(f);
  });

  /* ---------- Tema ---------- */
  function currentTheme() { return document.documentElement.getAttribute('data-theme') || 'light'; }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var meta = $('meta-theme-color');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  }

  $('btn-theme').addEventListener('click', function () {
    setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Barra de formatação ---------- */
  document.querySelector('.toolbar').addEventListener('mousedown', function (e) {
    // impede que o botão roube o foco/seleção do editor
    if (e.target.closest('button')) e.preventDefault();
  });

  document.querySelector('.toolbar').addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-cmd]');
    if (!btn) return;
    proseEl.focus();
    var cmd = btn.dataset.cmd;
    if (cmd === 'heading') {
      var current = (document.queryCommandValue('formatBlock') || '').toLowerCase();
      document.execCommand('formatBlock', false, current === 'h2' ? 'div' : 'h2');
    } else {
      document.execCommand(cmd, false, null);
    }
    refreshToolbar();
    markDirty();
  });

  function refreshToolbar() {
    ['bold', 'italic', 'insertUnorderedList', 'insertOrderedList'].forEach(function (c) {
      var b = document.querySelector('[data-cmd="' + c + '"]');
      if (b) b.classList.toggle('active', !!document.queryCommandState(c));
    });
    var h = document.querySelector('[data-cmd="heading"]');
    if (h) h.classList.toggle('active', (document.queryCommandValue('formatBlock') || '').toLowerCase() === 'h2');
  }

  document.addEventListener('selectionchange', function () {
    if (document.activeElement === proseEl) refreshToolbar();
  });

  // Cola somente texto simples (evita estilos externos no editor)
  proseEl.addEventListener('paste', function (e) {
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  });

  /* ---------- Eventos gerais ---------- */
  textareas.forEach(function (t) {
    t.addEventListener('input', function () { autoGrow(t); markDirty(); });
  });
  titleEl.addEventListener('input', markDirty);
  proseEl.addEventListener('input', markDirty);

  $('btn-new').addEventListener('click', newScene);
  $('btn-save').addEventListener('click', save);
  $('btn-load').addEventListener('click', load);

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      save();
    }
  });

  window.addEventListener('beforeunload', function (e) {
    if (dirty) { saveDraft(); e.preventDefault(); e.returnValue = ''; }
  });

  /* ---------- Inicialização ---------- */
  document.execCommand('defaultParagraphSeparator', false, 'div');
  setTheme(currentTheme());
  loadDraft();
  textareas.forEach(autoGrow);
  window.addEventListener('resize', function () { textareas.forEach(autoGrow); });

  /* ---------- Service Worker ---------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (err) {
        console.warn('Service Worker não registrado:', err);
      });
    });
  }
})();
