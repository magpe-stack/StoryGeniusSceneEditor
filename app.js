/* =========================================================
   Story Genius Scene Editor v2 — lógica da aplicação
   Seções: dados · utilitários · texto/exportação · telas · eventos
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     CONSTANTES
     --------------------------------------------------------- */
  var FORMAT_PROJECT = 'story-genius-project';
  var FORMAT_DOC = 'story-genius-doc';
  var VERSION = 2;
  var KEY = 'sg2-project';
  var THEME_KEY = 'sg-theme';
  var VIEW_KEY = 'sg2-view';
  var BACKUP_KEY = 'sg2-backup';

  var VIEW_INFO = {
    dashboard: ['Dashboard', 'Resumo das fichas, estatísticas do projeto e atalhos rápidos.'],
    p1: ['Fase 1 · Fundação', 'Antes de planejar o enredo, descubra o que move esta história — e por que ela é sua.'],
    p2: ['Fase 2 · Psique do Protagonista', 'O enredo nasce de dentro: quem é o protagonista, o que ele crê de errado e como essa crença o moldou.'],
    p3: ['Fase 3 · Enredo Causal e Terceiro Trilho', 'Cada evento externo precisa pressionar a Falsa Crença. Se não pressiona, é ação vazia.'],
    p4: ['Fase 4 · Cartões de Cena', 'Cada cena é um elo de causa e efeito. O "E por isso?" de uma cena acende a próxima.'],
    p5: ['Fase 5 · Roteiro', 'A visão geral da história, cena a cena, e o caminho para o rascunho.'],
    editor: ['Editor de rascunho', 'Escreva a prosa com o cartão de cena à vista.']
  };
  var VIEWS = Object.keys(VIEW_INFO);

  var ROLES = [['', 'Selecione…'], ['aliado', 'Aliado'], ['antagonista', 'Antagonista'], ['mentor', 'Mentor'],
    ['amor', 'Interesse amoroso'], ['familia', 'Família'], ['outro', 'Outro']];
  var AFFECTS = [['', 'Selecione…'], ['sim', 'Sim'], ['nao', 'Não']];

  // Campos de cada lista (usados na exportação/importação TXT e JSON)
  var SPEC = {
    'plot.matrix': [
      { k: 'conflict', l: 'Conflito / evento externo' },
      { k: 'affects', l: 'Afeta a Falsa Crença?', opts: AFFECTS },
      { k: 'how', l: 'Como afeta' }
    ],
    'plot.subplots': [
      { k: 'name', l: 'Nome' },
      { k: 'role', l: 'Papel', opts: ROLES },
      { k: 'text', l: 'Conexão com o enredo e a Falsa Crença' }
    ],
    'scenes': [
      { k: 'title', l: 'Título' },
      { k: 'alpha', l: 'Ponto Alfa' },
      { k: 'cause', l: 'Causa Externa' },
      { k: 'effect', l: 'Efeito Prático' },
      { k: 'thirdRail', l: 'Terceiro Trilho / Insight' },
      { k: 'soWhat', l: 'E Por Isso?' }
    ]
  };

  /* ---------------------------------------------------------
     ESTADO
     --------------------------------------------------------- */
  var $ = function (id) { return document.getElementById(id); };
  var viewEl = $('view');
  var fileInput = $('file-input');
  var project;
  var view = 'dashboard';
  var dirHandle = null;
  var saveTimer = null;
  var toastTimer = null;
  var refHidden = window.matchMedia && window.matchMedia('(max-width: 860px)').matches; // no celular o cartão de referência começa oculto

  /* ---------------------------------------------------------
     UTILITÁRIOS
     --------------------------------------------------------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function str(v) { return typeof v === 'string' ? v : ''; }
  function has(v) { return String(v == null ? '' : v).trim().length > 0; }
  function uid() { return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function pad(n) { return String(n).padStart(2, '0'); }
  function ts() {
    var d = new Date();
    return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '-' + pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds());
  }
  function slug(t) {
    return (t || 'documento').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'documento';
  }
  function words(t) { t = (t || '').trim(); return t ? t.split(/\s+/).length : 0; }
  function countLabel(t) { t = t || ''; return words(t) + ' palavras · ' + t.length + ' caracteres'; }
  function fmtDate(iso) {
    var d = new Date(iso);
    return isNaN(d) ? '' : pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function getPath(o, path) {
    return path.split('.').reduce(function (a, k) { return a == null ? undefined : a[k]; }, o);
  }
  function setPath(o, path, v) {
    var ks = path.split('.'), last = ks.pop();
    var t = ks.reduce(function (a, k) { return a == null ? undefined : a[k]; }, o);
    if (t != null) t[last] = v;
  }
  function autoGrow(el) {
    el.style.height = 'auto';
    el.style.height = Math.max(el.scrollHeight + 2, el.classList.contains('tall') ? 220 : 84) + 'px';
  }
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 4200);
  }
  function icon(id, cls) {
    return '<svg class="ico ' + (cls || 'ico-inline') + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
  }

  /* ---------------------------------------------------------
     MODELO DE DADOS
     --------------------------------------------------------- */
  function blank() {
    var now = new Date().toISOString();
    return {
      format: FORMAT_PROJECT, version: VERSION, title: '', createdAt: now, updatedAt: now,
      foundation: { spark: '', authorConnection: '', moralPoint: '', whatIf: '' },
      psyche: {
        initialState: '', surfaceDesire: '', innerMotivation: '', misbelief: '', originScene: '',
        crossroads: [{ title: '', text: '' }, { title: '', text: '' }, { title: '', text: '' }]
      },
      plot: { externalProblem: '', matrix: [], subplots: [] },
      scenes: [],
      ui: { currentScene: '' }
    };
  }

  function sanitizeHTML(html) {
    // Mantém apenas tags de formatação seguras (protege contra HTML malicioso em arquivos importados)
    var allowed = { B: 1, STRONG: 1, I: 1, EM: 1, H2: 1, H3: 1, UL: 1, OL: 1, LI: 1, P: 1, BR: 1, DIV: 1 };
    var tpl = document.createElement('template');
    tpl.innerHTML = html || '';
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 1) {
          if (!allowed[child.tagName]) {
            if (/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|LINK|META)$/.test(child.tagName)) { node.removeChild(child); return; }
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

  function normRow(o) {
    o = o || {};
    return { conflict: str(o.conflict), affects: (o.affects === 'sim' || o.affects === 'nao') ? o.affects : '', how: str(o.how) };
  }
  function normSub(o) {
    o = o || {};
    var r = str(o.role);
    if (!ROLES.some(function (x) { return x[0] === r; })) r = '';
    return { name: str(o.name), role: r, text: str(o.text) };
  }
  function normScene(o) {
    o = o || {};
    return {
      id: str(o.id) || uid(), title: str(o.title), alpha: str(o.alpha), cause: str(o.cause), effect: str(o.effect),
      thirdRail: str(o.thirdRail), soWhat: str(o.soWhat), prose: sanitizeHTML(str(o.prose))
    };
  }
  var NORM = { 'plot.matrix': normRow, 'plot.subplots': normSub, 'scenes': normScene };

  function normalize(raw) {
    var p = blank();
    if (!raw || typeof raw !== 'object') return p;
    var f = raw.foundation || {}, s = raw.psyche || {}, pl = raw.plot || {};
    p.title = str(raw.title);
    p.createdAt = str(raw.createdAt) || p.createdAt;
    p.updatedAt = str(raw.updatedAt) || p.updatedAt;
    Object.keys(p.foundation).forEach(function (k) { p.foundation[k] = str(f[k]); });
    ['initialState', 'surfaceDesire', 'innerMotivation', 'misbelief', 'originScene'].forEach(function (k) { p.psyche[k] = str(s[k]); });
    for (var i = 0; i < 3; i++) {
      var c = (Array.isArray(s.crossroads) && s.crossroads[i]) || {};
      p.psyche.crossroads[i] = { title: str(c.title), text: str(c.text) };
    }
    p.plot.externalProblem = str(pl.externalProblem);
    p.plot.matrix = (Array.isArray(pl.matrix) ? pl.matrix : []).slice(0, 200).map(normRow);
    p.plot.subplots = (Array.isArray(pl.subplots) ? pl.subplots : []).slice(0, 200).map(normSub);
    p.scenes = dedupe((Array.isArray(raw.scenes) ? raw.scenes : []).slice(0, 1000).map(normScene));
    p.ui.currentScene = str(raw.ui && raw.ui.currentScene);
    return p;
  }
  function dedupe(scenes) {
    var seen = {};
    scenes.forEach(function (s) { if (seen[s.id]) s.id = uid(); seen[s.id] = 1; });
    return scenes;
  }

  /* ---------- persistência local ---------- */
  function touch() {
    project.updatedAt = new Date().toISOString();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persist, 400);
  }
  function persist() {
    clearTimeout(saveTimer);
    try { localStorage.setItem(KEY, JSON.stringify(project)); }
    catch (e) { toast('Não foi possível salvar no navegador. Baixe um backup do projeto.'); }
  }
  function loadLocal() {
    try { var raw = localStorage.getItem(KEY); if (raw) return normalize(JSON.parse(raw)); } catch (e) {}
    return blank();
  }

  function curScene() {
    var s = project.scenes.filter(function (x) { return x.id === project.ui.currentScene; })[0];
    return s || project.scenes[0] || null;
  }

  /* ---------------------------------------------------------
     TEXTO: HTML <-> TXT / MARKDOWN
     --------------------------------------------------------- */
  function htmlToText(html, mode) {
    var md = mode === 'md';
    var tpl = document.createElement('template');
    tpl.innerHTML = html || '';
    var out = '';
    function nl() { if (out && !/\n$/.test(out)) out += '\n'; }
    // em Markdown, parágrafos precisam de uma linha em branco entre si
    function para() { nl(); if (md && out && !/\n\n$/.test(out)) out += '\n'; }
    function walk(node) {
      Array.prototype.forEach.call(node.childNodes, function (n) {
        if (n.nodeType === 3) { out += n.nodeValue; return; }
        if (n.nodeType !== 1) return;
        var tag = n.tagName;
        if (tag === 'BR') { out += '\n'; return; }
        if (tag === 'UL' || tag === 'OL') {
          para();
          var i = 0;
          Array.prototype.forEach.call(n.children, function (li) {
            i++; nl(); out += (tag === 'OL' ? i + '. ' : '- '); walk(li); nl();
          });
          if (md) out += '\n';
          return;
        }
        if (md && (tag === 'B' || tag === 'STRONG')) { out += '**'; walk(n); out += '**'; return; }
        if (md && (tag === 'I' || tag === 'EM')) { out += '*'; walk(n); out += '*'; return; }
        var heading = /^(H2|H3)$/.test(tag);
        var block = heading || /^(DIV|P)$/.test(tag);
        if (block) para();
        var start = out.length;
        if (heading && md) out += '## ';
        walk(n);
        if (heading && !md) out = out.slice(0, start) + out.slice(start).toUpperCase();
        if (block) { nl(); if (md) out += '\n'; }
      });
    }
    walk(tpl.content);
    return out.replace(/ /g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  }
  function plainToHtml(text) {
    return text.replace(/\r\n?/g, '\n').split('\n').map(function (l) { return '<div>' + (l ? esc(l) : '<br>') + '</div>'; }).join('');
  }

  /* ---------------------------------------------------------
     REGRAS DO MÉTODO
     --------------------------------------------------------- */
  // Estado de cada linha da Matriz do Terceiro Trilho
  function rowState(r) {
    if (!has(r.conflict) && !has(r.how) && !r.affects) return 'vazio';
    if (r.affects === 'nao') return 'vazia';              // ação vazia
    if (r.affects === 'sim' && has(r.how)) return 'ok';
    return 'pendente';
  }
  function sceneComplete(s) { return has(s.alpha) && has(s.cause) && has(s.effect) && has(s.thirdRail) && has(s.soWhat); }
  function sceneEmptyAction(s) {
    return !has(s.thirdRail) && (has(s.alpha) || has(s.cause) || has(s.effect) || has(s.soWhat));
  }
  function proseWords(s) { return words(htmlToText(s.prose, 'txt')); }

  function matrixStats() {
    var n = { ok: 0, vazia: 0, pendente: 0, total: project.plot.matrix.length };
    project.plot.matrix.forEach(function (r) { var st = rowState(r); if (st !== 'vazio') n[st]++; });
    return n;
  }

  function fichaList() {
    var f = project.foundation, s = project.psyche, pl = project.plot, m = matrixStats();
    return {
      p1: [['Primeira Fagulha', has(f.spark)], ['Conexão Autoral', has(f.authorConnection)],
        ['Ponto Central', has(f.moralPoint)], ['Premissa "E Se?"', has(f.whatIf)]],
      p2: [['Estado Inicial', has(s.initialState)], ['Desejo vs. Motivação', has(s.surfaceDesire) && has(s.innerMotivation)],
        ['Falsa Crença', has(s.misbelief)], ['Cena de Origem', has(s.originScene)],
        ['Encruzilhada 1', has(s.crossroads[0].text)], ['Encruzilhada 2', has(s.crossroads[1].text)], ['Encruzilhada 3', has(s.crossroads[2].text)]],
      p3: [['Problema Externo', has(pl.externalProblem)], ['Matriz do Terceiro Trilho', m.total > 0 && m.ok === m.total],
        ['Subtramas', pl.subplots.some(function (x) { return has(x.name); })]]
    };
  }

  function stats() {
    var fl = fichaList(), sc = project.scenes;
    function done(a) { return a.filter(function (x) { return x[1]; }).length; }
    var complete = sc.filter(sceneComplete).length;
    var written = sc.filter(function (s) { return proseWords(s) > 0; }).length;
    var manuscript = sc.reduce(function (a, s) { return a + proseWords(s); }, 0);
    var planning = 0;
    (function walk(o) {
      if (typeof o === 'string') { planning += words(o); return; }
      if (Array.isArray(o)) { o.forEach(walk); return; }
      if (o && typeof o === 'object') Object.keys(o).forEach(function (k) { if (k !== 'prose' && k !== 'id' && k !== 'ui' && k !== 'format') walk(o[k]); });
    })({ f: project.foundation, s: project.psyche, p: project.plot, c: sc.map(function (s) { return [s.title, s.alpha, s.cause, s.effect, s.thirdRail, s.soWhat]; }) });
    var alerts = matrixStats().vazia + sc.filter(sceneEmptyAction).length;
    var n = Math.max(sc.length, 1);
    return {
      phases: [
        { v: 'p1', name: 'Fase 1 · Fundação', done: done(fl.p1), total: fl.p1.length, chips: fl.p1 },
        { v: 'p2', name: 'Fase 2 · Psique do Protagonista', done: done(fl.p2), total: fl.p2.length, chips: fl.p2 },
        { v: 'p3', name: 'Fase 3 · Enredo e Terceiro Trilho', done: done(fl.p3), total: fl.p3.length, chips: fl.p3 },
        { v: 'p4', name: 'Fase 4 · Cartões de Cena', done: complete, total: n, note: sc.length ? complete + ' de ' + sc.length + ' cartões completos' : 'Nenhum cartão ainda' },
        { v: 'p5', name: 'Fase 5 · Rascunho', done: written, total: n, note: sc.length ? written + ' de ' + sc.length + ' cenas com texto' : 'Nenhuma cena ainda' }
      ],
      scenes: sc.length, complete: complete, written: written, manuscript: manuscript, planning: planning, alerts: alerts
    };
  }

  /* ---------------------------------------------------------
     COMPONENTES DE INTERFACE
     --------------------------------------------------------- */
  function btn(act, ic, label, cls, attrs) {
    return '<button type="button" class="icon-btn' + (cls === undefined ? ' small' : (cls ? ' ' + cls : '')) + '" data-act="' + act +
      '" title="' + esc(label) + '" aria-label="' + esc(label) + '"' + (attrs || '') + '><svg class="ico" aria-hidden="true"><use href="#' + ic + '"/></svg></button>';
  }
  function docTools(what) {
    what = what || 'esta ficha';
    return btn('doc-txt', 'i-txt', 'Salvar ' + what + ' em TXT') +
      btn('doc-json', 'i-json', 'Salvar ' + what + ' em JSON') +
      btn('doc-load', 'i-load', 'Carregar documento (.json ou .txt) em ' + what);
  }
  function pageHead(v) {
    var i = VIEW_INFO[v];
    return '<header class="page-head"><h1>' + esc(i[0]) + '</h1><p class="lead">' + esc(i[1]) + '</p></header>';
  }
  function ficha(id, title, hint, body, o) {
    o = o || {};
    return '<section class="ficha" data-ficha="' + id + '" data-title="' + esc(title) + '"' + (o.list ? ' data-list="' + o.list + '"' : '') + '>' +
      '<header class="ficha-head"><div><h2>' + esc(title) + '</h2>' + (hint ? '<p class="hint">' + esc(hint) + '</p>' : '') + '</div>' +
      '<div class="ficha-tools">' + (o.extra || '') + docTools(o.what) + '</div></header>' + body + '</section>';
  }
  function F(path, label, o) {
    o = o || {};
    var v = getPath(project, path); v = v == null ? '' : String(v);
    var id = 'f-' + path.replace(/\./g, '-');
    var common = ' id="' + id + '" data-path="' + path + '" data-label="' + esc(o.dl || label) + '"';
    var ph = o.ph ? ' placeholder="' + esc(o.ph) + '"' : '';
    var h = '<div class="field"><div class="label-row"><label for="' + id + '">' + esc(label) + '</label>' + (o.tool || '') + '</div>';
    if (o.hint) h += '<p class="hint">' + esc(o.hint) + '</p>';
    if (o.type === 'input') {
      h += '<input type="text"' + common + ph + ' value="' + esc(v) + '">';
    } else if (o.type === 'select') {
      h += '<select' + common + '>' + o.options.map(function (op) {
        return '<option value="' + op[0] + '"' + (op[0] === v ? ' selected' : '') + '>' + esc(op[1]) + '</option>';
      }).join('') + '</select>';
    } else {
      h += '<textarea' + common + ph + ' rows="' + (o.rows || 3) + '"' + (o.tall ? ' class="tall"' : '') + '>\n' + esc(v) + '</textarea>';
    }
    if (o.count) h += '<p class="count" data-count-for="' + path + '">' + countLabel(v) + '</p>';
    return h + '</div>';
  }

  /* ---------------------------------------------------------
     TELAS
     --------------------------------------------------------- */
  function viewDashboard() {
    var st = stats();
    var total = st.phases.reduce(function (a, p) { return a + p.total; }, 0);
    var done = st.phases.reduce(function (a, p) { return a + p.done; }, 0);
    var pct = total ? Math.round(done / total * 100) : 0;
    var last = null; try { last = localStorage.getItem(BACKUP_KEY); } catch (e) {}
    var cs = curScene();

    var h = pageHead('dashboard');
    h += '<div class="tiles">' +
      '<div class="tile"><b>' + pct + '%</b><span>do planejamento concluído</span></div>' +
      '<div class="tile"><b>' + st.manuscript.toLocaleString('pt-BR') + '</b><span>palavras no rascunho</span></div>' +
      '<div class="tile"><b>' + st.planning.toLocaleString('pt-BR') + '</b><span>palavras nas fichas</span></div>' +
      '<div class="tile"><b>' + st.scenes + '</b><span>' + (st.scenes === 1 ? 'cena' : 'cenas') + ' (' + st.complete + (st.complete === 1 ? ' cartão completo' : ' cartões completos') + ')</span></div>' +
      '<div class="tile' + (st.alerts ? ' warn' : '') + '"><b>' + st.alerts + '</b><span>alertas de ação vazia</span></div></div>';

    h += '<h2 class="section-title">Atalhos rápidos</h2><div class="quick">' +
      btn('new-scene', 'i-plus', 'Criar nova cena', 'outline') +
      (cs ? btn('open-editor', 'i-pen', 'Continuar escrevendo: ' + (cs.title || 'cena sem título'), 'outline', ' data-id="' + cs.id + '"') : '') +
      btn('nav', 'i-route', 'Abrir a Matriz do Terceiro Trilho', 'outline', ' data-view="p3"') +
      btn('nav', 'i-flag', 'Ver o roteiro das cenas', 'outline', ' data-view="p5"') +
      btn('backup', 'i-backup', 'Baixar backup completo do projeto', 'outline') + '</div>';
    h += '<p class="muted" style="margin-top:10px">' + (last ? 'Último backup baixado: ' + fmtDate(last) + '.' :
      'Nenhum backup baixado ainda. O projeto fica salvo neste navegador; baixe um backup para não depender só dele.') + '</p>';

    h += '<h2 class="section-title">Fichas por fase</h2>';
    st.phases.forEach(function (p) {
      var w = p.total ? Math.round(p.done / p.total * 100) : 0;
      h += '<div class="prog"><div class="prog-top"><div class="prog-name">' + esc(p.name) + '<small>' + (p.note ? esc(p.note) : p.done + '/' + p.total + ' fichas') + '</small></div>' +
        btn('nav', 'i-arrow', 'Ir para ' + p.name, 'small', ' data-view="' + p.v + '"') + '</div>' +
        '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + w + '" aria-label="Progresso de ' + esc(p.name) + '"><i style="width:' + w + '%"></i></div>';
      if (p.chips) {
        h += '<div class="chips">' + p.chips.map(function (c) {
          return '<span class="chip' + (c[1] ? ' ok' : '') + '">' + (c[1] ? icon('i-check') : '') + esc(c[0]) + '</span>';
        }).join('') + '</div>';
      }
      h += '</div>';
    });
    return h;
  }

  function viewP1() {
    return pageHead('p1') +
      ficha('spark', 'A Primeira Fagulha', 'A ideia que acendeu a história: uma imagem, um personagem, uma situação, uma pergunta. Escreva sem filtrar.',
        F('foundation.spark', 'A faísca', { rows: 4, ph: 'Tudo começou quando…', count: 1 })) +
      ficha('connection', 'Conexão Autoral', 'Por que ESTA história importa para VOCÊ? Que experiência, emoção ou pergunta pessoal ela toca? É isso que vai sustentar você até o fim.',
        F('foundation.authorConnection', 'Conexão pessoal', { rows: 4, ph: 'Escrevo isto porque…', count: 1 })) +
      ficha('moral', 'Ponto Central (Mensagem Moral)', 'O que a história diz sobre a natureza humana? A verdade que o leitor leva consigo, dita como uma ideia sobre como o mundo funciona.',
        F('foundation.moralPoint', 'Mensagem moral', { rows: 3, ph: 'Ex.: confiar custa caro, mas isolar-se custa mais.', count: 1 })) +
      ficha('whatif', 'Premissa "E Se?"', 'Una o personagem, o conflito externo e o que ele terá de enfrentar por dentro.',
        F('foundation.whatIf', 'E se…', { rows: 4, ph: 'E se [protagonista com uma falha] precisasse [objetivo externo], mas para isso tivesse de [enfrentar o que mais teme]?', count: 1 }));
  }

  function viewP2() {
    var h = pageHead('p2');
    h += ficha('initial', 'Estado Inicial', 'Quem é o protagonista antes da página 1? Como vive, do que se protege, o que já conquistou e o que lhe falta.',
      F('psyche.initialState', 'Estado inicial', { rows: 4, count: 1 }));
    h += ficha('desire', 'Desejo Superficial vs. Motivação Interna', 'O que ele diz que quer não é o que ele precisa. Separe o desejo externo da necessidade profunda.',
      '<div class="grid-2">' +
      F('psyche.surfaceDesire', 'Desejo superficial (externo)', { rows: 4, hint: 'O que ele busca no mundo.' }) +
      F('psyche.innerMotivation', 'Motivação interna (necessidade)', { rows: 4, hint: 'Por que ele realmente precisa disso.' }) + '</div>');
    h += ficha('misbelief', 'Falsa Crença Central', 'A crença equivocada, adquirida cedo, que distorce como o protagonista lê o mundo e o impede de conseguir o que precisa. Escreva em primeira pessoa.',
      F('psyche.misbelief', 'A Falsa Crença', { rows: 3, ph: 'Se eu confiar em alguém, serei abandonado.', count: 1 }));
    h += ficha('origin', 'Cena de Origem', 'O momento do passado em que a Falsa Crença nasceu. Escreva em primeira pessoa, com detalhes sensoriais: o que viu, sentiu e concluiu.',
      F('psyche.originScene', 'Cena de origem (1ª pessoa)', { tall: true, rows: 10, ph: 'Eu tinha oito anos quando…', count: 1 }));
    for (var i = 0; i < 3; i++) {
      h += ficha('crossroad-' + (i + 1), 'Cena de Encruzilhada ' + (i + 1), 'Um momento entre a Cena de Origem e a página 1 em que a Falsa Crença moldou uma decisão importante — e foi reforçada ou testada.',
        F('psyche.crossroads.' + i + '.title', 'Momento', { type: 'input', ph: 'Ex.: o dia em que recusei a bolsa' }) +
        F('psyche.crossroads.' + i + '.text', 'Cena', { rows: 6, tall: false, count: 1 }));
    }
    return h;
  }

  function matrixRowHtml(r, i) {
    var p = 'plot.matrix.' + i + '.';
    return '<div class="row" data-row="' + i + '"><div class="row-head"><span class="num">' + (i + 1) + '</span><span class="row-state" data-state-for="' + i + '"></span><span class="grow"></span>' +
      btn('del-row', 'i-trash', 'Excluir esta linha da matriz', 'small', ' data-list="plot.matrix" data-i="' + i + '"') + '</div>' +
      F(p + 'conflict', 'Conflito / evento externo', { rows: 2, hint: 'Algo que acontece no mundo e pressiona o protagonista.' }) +
      '<div class="grid-2">' + F(p + 'affects', 'Afeta a Falsa Crença?', { type: 'select', options: AFFECTS }) +
      F(p + 'how', 'Como afeta', { rows: 2, hint: 'De que forma o evento confronta, reforça ou testa a Falsa Crença?' }) + '</div></div>';
  }

  function subplotHtml(r, i) {
    var p = 'plot.subplots.' + i + '.';
    return '<div class="row"><div class="row-head"><span class="num">' + (i + 1) + '</span><span class="grow"></span>' +
      btn('del-row', 'i-trash', 'Excluir esta subtrama / personagem', 'small', ' data-list="plot.subplots" data-i="' + i + '"') + '</div>' +
      '<div class="grid-2">' + F(p + 'name', 'Nome', { type: 'input' }) + F(p + 'role', 'Papel', { type: 'select', options: ROLES }) + '</div>' +
      F(p + 'text', 'Conexão com o enredo e a Falsa Crença', { rows: 3, hint: 'Como este personagem ou subtrama pressiona (ou espelha) a Falsa Crença do protagonista?' }) + '</div>';
  }

  function viewP3() {
    var h = pageHead('p3');
    var mb = project.psyche.misbelief;
    h += '<div class="ref-box"><b>Falsa Crença Central (Fase 2)</b><p>' + (has(mb) ? esc(mb) : '— ainda não definida —') + '</p></div>';
    h += ficha('external', 'Problema Externo Principal', 'O problema do mundo real que força o protagonista a agir — e que, para ser resolvido, vai obrigá-lo a encarar a Falsa Crença.',
      F('plot.externalProblem', 'O problema externo', { rows: 4, count: 1 }));
    h += ficha('matrix', 'Matriz do Terceiro Trilho', 'Liste os conflitos e eventos externos da trama e verifique se cada um pressiona a Falsa Crença. O que não pressiona é ação vazia: barulho, não história.',
      '<div id="matrix-summary"></div>' + project.plot.matrix.map(matrixRowHtml).join('') +
      '<div class="add-row">' + btn('add-row', 'i-plus', 'Adicionar conflito à matriz', 'outline', ' data-list="plot.matrix"') + '</div>',
      { list: 'plot.matrix', what: 'a matriz' });
    h += ficha('subplots', 'Subtramas / Personagens de Apoio', 'Cada subtrama e personagem de apoio deve existir por pressionar ou espelhar a Falsa Crença do protagonista.',
      project.plot.subplots.map(subplotHtml).join('') +
      '<div class="add-row">' + btn('add-row', 'i-plus', 'Adicionar subtrama ou personagem de apoio', 'outline', ' data-list="plot.subplots"') + '</div>',
      { list: 'plot.subplots', what: 'as subtramas' });
    return h;
  }

  var STATE_HTML = {
    ok: icon('i-check') + 'Pressiona a Falsa Crença',
    vazia: icon('i-alert') + 'Ação vazia',
    pendente: 'Pendente',
    vazio: ''
  };

  function updateMatrix() {
    var box = $('matrix-summary');
    if (!box) return;
    var n = matrixStats();
    project.plot.matrix.forEach(function (r, i) {
      var st = rowState(r);
      var el = document.querySelector('[data-state-for="' + i + '"]');
      if (el) { el.className = 'row-state st-' + st; el.innerHTML = STATE_HTML[st]; }
      var row = document.querySelector('[data-row="' + i + '"]');
      if (row) { row.classList.toggle('st-vazia', st === 'vazia'); }
    });
    var h = '';
    if (!has(project.psyche.misbelief)) {
      h += '<div class="alert soft">' + icon('i-alert') + '<span>Defina a Falsa Crença Central na Fase 2 para que esta verificação faça sentido.</span></div>';
    }
    if (n.vazia) {
      h += '<div class="alert" role="alert">' + icon('i-alert') + '<span><b>AÇÃO VAZIA:</b> ' + n.vazia + (n.vazia === 1 ? ' conflito não afeta' : ' conflitos não afetam') +
        ' a Falsa Crença. Sem pressão interna, o evento é só movimento. Reescreva-o para tocar a crença do protagonista ou corte-o.</span></div>';
    } else if (n.total && n.ok === n.total) {
      h += '<div class="alert good">' + icon('i-check') + '<span>Todos os conflitos pressionam a Falsa Crença.</span></div>';
    } else if (n.total) {
      h += '<div class="alert soft">' + icon('i-alert') + '<span>' + n.pendente + ' ' + (n.pendente === 1 ? 'conflito pendente' : 'conflitos pendentes') + ' de análise: marque se afeta a Falsa Crença e explique como.</span></div>';
    } else {
      h += '<p class="hint">Nenhum conflito listado ainda. Use o botão + para adicionar o primeiro.</p>';
    }
    box.innerHTML = h;
  }

  function sceneCardHtml(s, i, n) {
    var p = 'scenes.' + i + '.';
    var next = btn('next-alpha', 'i-chain', 'Usar este "E por isso?" como Ponto Alfa da próxima cena', 'small', ' data-i="' + i + '"');
    return '<article class="ficha scene-card" data-ficha="scene" data-title="Cartão de Cena ' + (i + 1) + '" data-scene="' + s.id + '">' +
      '<header class="ficha-head"><div class="card-title"><span class="num">' + (i + 1) + '</span>' +
      '<input type="text" id="f-scenes-' + i + '-title" data-path="' + p + 'title" data-label="Título" placeholder="Título da cena" aria-label="Título da cena ' + (i + 1) + '" value="' + esc(s.title) + '"></div>' +
      '<div class="ficha-tools">' +
      btn('open-editor', 'i-pen', 'Escrever esta cena no editor', 'small', ' data-id="' + s.id + '"') +
      btn('move-up', 'i-up', 'Mover cartão para cima', 'small', ' data-i="' + i + '"' + (i === 0 ? ' disabled' : '')) +
      btn('move-down', 'i-down', 'Mover cartão para baixo', 'small', ' data-i="' + i + '"' + (i === n - 1 ? ' disabled' : '')) +
      btn('del-scene', 'i-trash', 'Excluir este cartão de cena', 'small', ' data-i="' + i + '"') +
      '<span class="sep"></span>' + docTools('este cartão') + '</div></header>' +
      '<div class="grid-2">' +
      F(p + 'alpha', 'Ponto Alfa', { rows: 3, hint: 'Onde a cena começa: o estado de coisas herdado da cena anterior.' }) +
      F(p + 'cause', 'Causa Externa', { rows: 3, hint: 'O que acontece (ou o que o protagonista faz) que desencadeia esta cena.' }) + '</div>' +
      '<div class="grid-2">' +
      F(p + 'effect', 'Efeito Prático', { rows: 3, hint: 'A consequência concreta, visível no mundo externo.' }) +
      F(p + 'thirdRail', 'Terceiro Trilho / Insight', { rows: 3, hint: 'O que o protagonista percebe, sente ou conclui por dentro — e como isso toca a Falsa Crença.' }) + '</div>' +
      F(p + 'soWhat', '"E Por Isso?"', { rows: 2, hint: 'O que isso força o protagonista a fazer em seguida? É o gancho causal para a próxima cena.', tool: next }) +
      '<div class="alert alert-sm" data-scene-alert="' + i + '" role="alert"' + (sceneEmptyAction(s) ? '' : ' hidden') + '>' + icon('i-alert') +
      '<span><b>AÇÃO VAZIA:</b> sem Terceiro Trilho, esta cena é só movimento externo. O que muda por dentro do protagonista?</span></div></article>';
  }
  function updateSceneAlert(i) {
    var el = document.querySelector('[data-scene-alert="' + i + '"]');
    if (el && project.scenes[i]) el.hidden = !sceneEmptyAction(project.scenes[i]);
  }

  function viewP4() {
    var sc = project.scenes, n = sc.length;
    var h = pageHead('p4');
    h += '<div class="deck-head" data-list="scenes" data-title="Cartões de Cena"><p class="muted" style="margin:0">' + n + (n === 1 ? ' cartão' : ' cartões') + '</p>' +
      '<div class="ficha-tools">' + btn('add-scene', 'i-plus', 'Criar novo cartão de cena', 'outline') + '<span class="sep"></span>' + docTools('todos os cartões') + '</div></div>';
    if (!n) {
      h += '<div class="empty"><p>Nenhum cartão de cena ainda.</p>' + btn('add-scene', 'i-plus', 'Criar o primeiro cartão de cena', 'outline') + '</div>';
    } else {
      h += sc.map(function (s, i) { return sceneCardHtml(s, i, n); }).join('');
      h += '<div class="add-row">' + btn('add-scene', 'i-plus', 'Criar novo cartão de cena', 'outline') + '</div>';
    }
    return h;
  }

  function viewP5() {
    var sc = project.scenes;
    var h = pageHead('p5');
    var nextIdx = -1;
    sc.forEach(function (s, i) { if (nextIdx < 0 && proseWords(s) === 0) nextIdx = i; });
    h += '<div class="deck-head"><p class="muted" style="margin:0">' + sc.length + (sc.length === 1 ? ' cena' : ' cenas') + ' no roteiro</p><div class="ficha-tools">' +
      btn('new-scene', 'i-plus', 'Criar nova cena', 'outline') +
      (nextIdx >= 0 ? btn('open-editor', 'i-pen', 'Escrever a próxima cena sem texto: ' + (sc[nextIdx].title || 'cena ' + (nextIdx + 1)), 'outline', ' data-id="' + sc[nextIdx].id + '"') : '') + '</div></div>';
    if (!sc.length) {
      return h + '<div class="empty"><p>O roteiro está vazio. Crie cartões de cena na Fase 4.</p>' + btn('nav', 'i-cards', 'Ir para os Cartões de Cena', 'outline', ' data-view="p4"') + '</div>';
    }
    h += '<ol class="timeline">' + sc.map(function (s, i) {
      var w = proseWords(s), ok = sceneComplete(s);
      return '<li class="' + (w > 0 ? 'done' : '') + '"><div class="tl-head"><h3>' + (i + 1) + '. ' + esc(s.title || 'Cena sem título') + '</h3><div class="ficha-tools">' +
        btn('open-editor', 'i-pen', 'Escrever a cena ' + (i + 1) + ' no editor', 'small', ' data-id="' + s.id + '"') +
        btn('go-card', 'i-cards', 'Ver o cartão da cena ' + (i + 1), 'small', ' data-i="' + i + '"') + '</div></div>' +
        '<div class="chips" style="margin:6px 0"><span class="chip' + (ok ? ' ok' : '') + '">' + (ok ? icon('i-check') : '') + 'Cartão ' + (ok ? 'completo' : 'incompleto') + '</span>' +
        '<span class="chip' + (w ? ' ok' : '') + '">' + (w ? icon('i-check') + w + ' palavras' : 'Sem rascunho') + '</span>' +
        (sceneEmptyAction(s) ? '<span class="chip ok">' + icon('i-alert') + 'Ação vazia</span>' : '') + '</div>' +
        (has(s.alpha) ? '<p class="tl-body"><em>Alfa</em><br>' + esc(s.alpha) + '</p>' : '') +
        (has(s.soWhat) ? '<p class="tl-body"><em>E por isso?</em><br>' + esc(s.soWhat) + '</p>' : '') + '</li>';
    }).join('') + '</ol>';
    return h;
  }

  function viewEditor() {
    var s = curScene();
    var h = pageHead('editor');
    if (!s) {
      return h + '<div class="empty"><p>Nenhuma cena para escrever ainda.</p>' + btn('new-scene', 'i-plus', 'Criar a primeira cena', 'outline') + '</div>';
    }
    var i = project.scenes.indexOf(s), p = 'scenes.' + i + '.';
    var opts = project.scenes.map(function (x, k) {
      return '<option value="' + x.id + '"' + (x === s ? ' selected' : '') + '>' + (k + 1) + '. ' + esc(x.title || 'Cena sem título') + '</option>';
    }).join('');
    var cmd = function (c, ic, label) { return btn('fmt', ic, label, 'small', ' data-cmd="' + c + '"'); };

    h += '<div class="editor-bar"><select id="scene-select" aria-label="Escolher a cena a escrever">' + opts + '</select>' +
      '<div class="ficha-tools">' + btn('new-scene', 'i-plus', 'Criar nova cena', 'small') + '</div></div>';
    h += '<div class="toolbar" role="toolbar" aria-label="Ferramentas do editor">' +
      btn('ed-panel', 'i-panel', 'Mostrar ou ocultar o cartão de cena de referência', 'small' + (refHidden ? '' : ' active')) +
      btn('ed-focus', 'i-focus', 'Modo foco (esconde tudo, exceto o texto)', 'small') + '<span class="sep"></span>' +
      cmd('bold', 'i-bold', 'Negrito') + cmd('italic', 'i-italic', 'Itálico') + cmd('heading', 'i-heading', 'Título') +
      cmd('insertUnorderedList', 'i-ul', 'Lista com marcadores') + cmd('insertOrderedList', 'i-ol', 'Lista numerada') + cmd('removeFormat', 'i-clear', 'Limpar formatação') +
      '<span class="sep"></span>' +
      btn('ed-txt', 'i-txt', 'Salvar o texto desta cena em TXT') + btn('ed-json', 'i-json', 'Salvar esta cena em JSON') +
      btn('ed-load', 'i-load', 'Carregar documento (.json ou .txt) no editor') + '</div>';

    var ref = '<aside class="ref-panel" id="ref-panel"' + (refHidden ? ' hidden' : '') + '><h2>Cartão de Cena ' + (i + 1) + '</h2><dl>' +
      '<dt>Falsa Crença</dt><dd>' + (has(project.psyche.misbelief) ? esc(project.psyche.misbelief) : '—') + '</dd>' +
      [['Ponto Alfa', s.alpha], ['Causa Externa', s.cause], ['Efeito Prático', s.effect], ['Terceiro Trilho / Insight', s.thirdRail], ['E Por Isso?', s.soWhat]].map(function (x) {
        return '<dt>' + x[0] + '</dt><dd>' + (has(x[1]) ? esc(x[1]) : '—') + '</dd>';
      }).join('') + '</dl><div style="margin-top:12px">' + btn('go-card', 'i-cards', 'Editar o cartão desta cena', 'small outline', ' data-i="' + i + '"') + '</div></aside>';

    h += '<div class="editor-layout' + (refHidden ? ' no-ref' : '') + '" id="editor-layout">' + ref + '<section class="writer">' +
      '<input type="text" class="scene-title" id="f-scenes-' + i + '-title" data-path="' + p + 'title" data-label="Título" placeholder="Título da cena" aria-label="Título da cena" value="' + esc(s.title) + '">' +
      '<div id="prose" class="editor" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Texto da cena" spellcheck="true"></div>' +
      '<div class="statusbar"><span id="wc"></span><span id="cc"></span></div></section></div>';
    return h;
  }

  var RENDERERS = { dashboard: viewDashboard, p1: viewP1, p2: viewP2, p3: viewP3, p4: viewP4, p5: viewP5, editor: viewEditor };

  function render(keepScroll) {
    var y = window.scrollY;
    if (view !== 'editor') document.body.classList.remove('focus');
    viewEl.innerHTML = RENDERERS[view]();
    Array.prototype.forEach.call(viewEl.querySelectorAll('textarea'), autoGrow);
    Array.prototype.forEach.call(document.querySelectorAll('#rail [data-view]'), function (b) {
      var on = b.getAttribute('data-view') === view;
      b.classList.toggle('active', on);
      if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current');
    });
    $('project-title').value = project.title;
    if (view === 'p3') updateMatrix();
    if (view === 'editor') {
      var s = curScene(), pe = $('prose');
      if (s && pe) { pe.innerHTML = s.prose; updateEditorCounts(); }
    }
    document.title = VIEW_INFO[view][0] + ' · Story Genius';
    if (keepScroll) window.scrollTo(0, y); else window.scrollTo(0, 0);
  }

  function go(v) {
    if (VIEWS.indexOf(v) < 0) v = 'dashboard';
    view = v;
    try { localStorage.setItem(VIEW_KEY, v); } catch (e) {}
    render(false);
  }

  function updateEditorCounts() {
    var pe = $('prose'); if (!pe) return;
    var t = pe.innerText.replace(/\n/g, ' ');
    $('wc').textContent = words(t) + ' palavras';
    $('cc').textContent = t.replace(/\s+$/, '').length + ' caracteres';
  }

  /* ---------------------------------------------------------
     ARQUIVOS: gravar (pasta escolhida ou download) e ler
     --------------------------------------------------------- */
  async function writeOut(name, content, mime, okMsg, onOk) {
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
        await w.write(content);
        await w.close();
        if (onOk) onOk();
        toast((okMsg || 'Salvo na pasta: ') + name);
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') { toast('Salvamento cancelado.'); return; }
        dirHandle = null; // cai para o download
      }
    }
    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
    if (onOk) onOk();
    toast('Arquivo baixado: ' + name);
  }

  function pickViaInput(exts) {
    return new Promise(function (resolve) {
      fileInput.value = '';
      fileInput.accept = exts.join(',');
      fileInput.onchange = function () {
        var f = fileInput.files && fileInput.files[0];
        if (!f) { resolve(null); return; }
        var r = new FileReader();
        r.onload = function () { resolve({ name: f.name, text: String(r.result).replace(/^﻿/, '') }); };
        r.onerror = function () { resolve(null); };
        r.readAsText(f);
      };
      fileInput.oncancel = function () { resolve(null); };
      fileInput.click();
    });
  }
  async function pickText(exts) {
    if (window.showOpenFilePicker) {
      try {
        var accept = {};
        var j = exts.filter(function (e) { return e === '.json'; }), t = exts.filter(function (e) { return e !== '.json'; });
        if (j.length) accept['application/json'] = j;
        if (t.length) accept['text/plain'] = t;
        var opts = { types: [{ description: 'Documentos', accept: accept }], multiple: false };
        if (dirHandle) opts.startIn = dirHandle;
        var picked = await window.showOpenFilePicker(opts);
        var file = await picked[0].getFile();
        return { name: file.name, text: (await file.text()).replace(/^﻿/, '') };
      } catch (err) {
        if (err && err.name === 'AbortError') return null;
      }
    }
    return pickViaInput(exts);
  }
  function extOf(name) { var m = /\.([a-z0-9]+)$/i.exec(name || ''); return m ? m[1].toLowerCase() : ''; }

  /* ---------------------------------------------------------
     FICHAS: exportar / importar (TXT e JSON)
     --------------------------------------------------------- */
  function hostDoc(host) {
    var title = host.getAttribute('data-title') || 'Ficha';
    var list = host.getAttribute('data-list');
    if (list) return { kind: 'list', title: title, list: list, items: getPath(project, list) || [], ficha: host.getAttribute('data-ficha') || list };
    var fields = Array.prototype.map.call(host.querySelectorAll('[data-path]'), function (el) {
      var path = el.getAttribute('data-path');
      var v = getPath(project, path);
      return { key: path.split('.').pop(), path: path, label: el.getAttribute('data-label') || path, value: v == null ? '' : String(v) };
    });
    return { kind: 'fields', title: title, fields: fields, ficha: host.getAttribute('data-ficha') || 'ficha' };
  }

  function optLabel(opts, v) {
    var o = (opts || []).filter(function (x) { return x[0] === v; })[0];
    return o && v ? o[1] : '';
  }
  function docToJson(d) {
    var base = { format: FORMAT_DOC, version: VERSION, kind: d.kind, ficha: d.ficha, title: d.title, savedAt: new Date().toISOString() };
    if (d.kind === 'list') { base.list = d.list; base.items = d.items; }
    else { base.values = {}; d.fields.forEach(function (f) { base.values[f.key] = f.value; }); }
    return JSON.stringify(base, null, 2);
  }
  function docToTxt(d) {
    var L = [d.title.toUpperCase(), '='.repeat(60), 'Exportado em ' + new Date().toLocaleString('pt-BR'), ''];
    if (d.kind === 'fields') {
      d.fields.forEach(function (f) { L.push('[' + f.label + ']'); L.push(f.value.trim()); L.push(''); });
    } else {
      d.items.forEach(function (it, i) {
        L.push('### ITEM ' + (i + 1));
        SPEC[d.list].forEach(function (sp) {
          L.push('[' + sp.l + ']');
          L.push(sp.opts ? optLabel(sp.opts, it[sp.k]) : String(it[sp.k] || '').trim());
          L.push('');
        });
      });
      if (!d.items.length) L.push('(lista vazia)', '');
    }
    return L.join('\n');
  }

  function parseLabeled(text, labels) {
    var out = {}, cur = null, buf = [], found = 0;
    function flush() { if (cur !== null) out[cur] = buf.join('\n').replace(/^\s+|\s+$/g, ''); buf = []; }
    text.split(/\r?\n/).forEach(function (line) {
      var m = /^\s*\[(.+)\]\s*$/.exec(line);
      var k = m ? labels[m[1].trim().toLowerCase()] : undefined;
      if (k) { flush(); cur = k; found++; }
      else if (cur !== null) buf.push(line);
    });
    flush();
    return { values: out, found: found };
  }
  function optFromText(opts, text) {
    var t = text.trim().toLowerCase().replace('não', 'nao');
    if (!t) return '';
    var hit = opts.filter(function (o) { return o[0] && (o[0] === t || o[1].toLowerCase().replace('não', 'nao') === t); })[0];
    if (!hit && /^sim/.test(t)) hit = opts.filter(function (o) { return o[0] === 'sim'; })[0];
    return hit ? hit[0] : '';
  }

  function applyToHost(host, name, text) {
    var ext = extOf(name);
    var list = host.getAttribute('data-list');
    var applied = 0;

    if (ext === 'json') {
      var data;
      try { data = JSON.parse(text); } catch (e) { toast('Arquivo JSON inválido.'); return; }
      if (data && data.format === FORMAT_PROJECT) { toast('Este arquivo é um backup do projeto. Use o ícone de carregar projeto no cabeçalho.'); return; }
      if (!data || data.format !== FORMAT_DOC) { toast('Arquivo não reconhecido: não foi gerado por este app.'); return; }
      if (list) {
        if (data.kind !== 'list' || data.list !== list || !Array.isArray(data.items)) { toast('Este documento não pertence a esta ficha.'); return; }
        if (!confirm('Substituir todos os itens atuais por ' + data.items.length + ' item(ns) do arquivo?')) return;
        var items = data.items.slice(0, 1000).map(NORM[list]);
        if (list === 'scenes') items = dedupe(items);
        setPath(project, list, items);
        applied = items.length;
      } else {
        if (data.kind !== 'fields' || !data.values || typeof data.values !== 'object') { toast('Este documento não pertence a uma ficha de campos.'); return; }
        applied = applyFields(host, data.values);
      }
    } else {
      if (list) {
        var spec = SPEC[list], labels = {};
        spec.forEach(function (sp) { labels[sp.l.toLowerCase()] = sp.k; });
        var parts = text.split(/^\s*###\s*ITEM\s*\d+\s*$/mi).slice(1);
        if (!parts.length) { toast('Nenhum item encontrado. O TXT precisa ter blocos "### ITEM n".'); return; }
        if (!confirm('Substituir todos os itens atuais por ' + parts.length + ' item(ns) do arquivo?')) return;
        var old = getPath(project, list);
        var arr = parts.map(function (part, idx) {
          var r = parseLabeled(part, labels).values, o = {};
          spec.forEach(function (sp) { o[sp.k] = r[sp.k] == null ? '' : (sp.opts ? optFromText(sp.opts, r[sp.k]) : r[sp.k]); });
          if (list === 'scenes' && old[idx]) { o.id = old[idx].id; o.prose = old[idx].prose; }
          return NORM[list](o);
        });
        if (list === 'scenes') arr = dedupe(arr);
        setPath(project, list, arr);
        applied = arr.length;
      } else {
        var fl = {}, els = host.querySelectorAll('[data-path]');
        Array.prototype.forEach.call(els, function (el) { fl[(el.getAttribute('data-label') || '').toLowerCase()] = el.getAttribute('data-path').split('.').pop(); });
        var res = parseLabeled(text, fl);
        if (res.found) applied = applyFields(host, res.values);
        else if (els.length === 1) { applied = applyFields(host, (function () { var o = {}; o[els[0].getAttribute('data-path').split('.').pop()] = text.trim(); return o; })()); }
        else { toast('Nenhum campo reconhecido. Use um TXT exportado por esta ficha.'); return; }
      }
    }
    if (!applied) { toast('Nada foi carregado: nenhum campo correspondente.'); return; }
    touch(); persist();
    render(true);
    toast('Documento carregado: ' + applied + (list ? ' item(ns).' : ' campo(s).'));
  }
  function applyFields(host, values) {
    var n = 0;
    Array.prototype.forEach.call(host.querySelectorAll('[data-path]'), function (el) {
      var path = el.getAttribute('data-path'), key = path.split('.').pop();
      if (!Object.prototype.hasOwnProperty.call(values, key)) return;
      var v = values[key];
      if (typeof v !== 'string') return;
      if (el.tagName === 'SELECT') {
        var okOpt = Array.prototype.some.call(el.options, function (o) { return o.value === v; });
        if (!okOpt) return;
      }
      setPath(project, path, v); n++;
    });
    return n;
  }

  /* ---------- editor: exportar / importar ---------- */
  function editorTxt(s) {
    return (s.title || 'CENA SEM TÍTULO').toUpperCase() + '\n' + '='.repeat(60) + '\n\n' + (htmlToText(s.prose, 'txt') || '(em branco)') + '\n';
  }
  function editorJson(s) {
    return JSON.stringify({
      format: FORMAT_DOC, version: VERSION, kind: 'editor', ficha: 'editor', title: s.title, savedAt: new Date().toISOString(),
      card: { alpha: s.alpha, cause: s.cause, effect: s.effect, thirdRail: s.thirdRail, soWhat: s.soWhat },
      words: proseWords(s), prose: s.prose
    }, null, 2);
  }
  async function editorLoad() {
    var s = curScene(); if (!s) return;
    var f = await pickText(['.json', '.txt']);
    if (!f) return;
    var html = '', title = '', ext = extOf(f.name);
    if (ext === 'json') {
      var d; try { d = JSON.parse(f.text); } catch (e) { toast('Arquivo JSON inválido.'); return; }
      if (!d || d.format !== FORMAT_DOC || d.kind !== 'editor' || typeof d.prose !== 'string') { toast('Este JSON não é um documento do editor.'); return; }
      html = sanitizeHTML(d.prose); title = str(d.title);
    } else {
      var txt = f.text.replace(/\r\n?/g, '\n'), m = /^(.*)\n={10,}\n\n?/.exec(txt);
      if (m) { title = m[1].trim(); txt = txt.slice(m[0].length); }
      txt = txt.replace(/\n+$/, '');
      html = plainToHtml(txt);
    }
    if (has($('prose').innerText) && !confirm('O texto atual desta cena será substituído. Continuar?')) return;
    s.prose = html;
    if (title && !has(s.title) && title.toLowerCase() !== 'cena sem título') s.title = title;
    touch(); persist(); render(true);
    toast('Texto carregado no editor.');
  }

  /* ---------------------------------------------------------
     EXPORTAÇÕES GLOBAIS (backup e dossiê)
     --------------------------------------------------------- */
  function markBackup() { try { localStorage.setItem(BACKUP_KEY, new Date().toISOString()); } catch (e) {} if (view === 'dashboard') render(true); }

  function backup() {
    persist();
    writeOut(slug(project.title || 'projeto') + '_backup_' + ts() + '.json', JSON.stringify(project, null, 2), 'application/json', 'Backup salvo na pasta: ', markBackup);
  }

  function dossier(fmt) {
    var md = fmt === 'md', L = [];
    function rule(t, ch) { return t + '\n' + ch.repeat(Math.max(t.length, 20)); }
    function h1(t) { L.push(md ? '# ' + t : rule(t.toUpperCase(), '=')); L.push(''); }
    function h2(t) { L.push(md ? '## ' + t : rule(t.toUpperCase(), '-')); L.push(''); }
    function h3(t) { L.push(md ? '### ' + t : '> ' + t); L.push(''); }
    function item(label, val) {
      val = String(val || '').trim();
      L.push(md ? '**' + label + '**\n\n' + (val || '_(em branco)_') + '\n' : label + ':\n' + (val || '(em branco)') + '\n');
    }
    var f = project.foundation, s = project.psyche, pl = project.plot;
    h1(project.title || 'Projeto sem título');
    L.push((md ? '_' : '') + 'Dossiê gerado em ' + new Date().toLocaleString('pt-BR') + ' · método Story Genius' + (md ? '_' : '')); L.push('');

    h2('Fase 1 · Fundação');
    item('A Primeira Fagulha', f.spark); item('Conexão Autoral', f.authorConnection);
    item('Ponto Central (Mensagem Moral)', f.moralPoint); item('Premissa "E Se?"', f.whatIf);

    h2('Fase 2 · Psique do Protagonista');
    item('Estado Inicial', s.initialState); item('Desejo Superficial', s.surfaceDesire); item('Motivação Interna', s.innerMotivation);
    item('Falsa Crença Central', s.misbelief); item('Cena de Origem', s.originScene);
    s.crossroads.forEach(function (c, i) { item('Cena de Encruzilhada ' + (i + 1) + (has(c.title) ? ' — ' + c.title : ''), c.text); });

    h2('Fase 3 · Enredo Causal e Terceiro Trilho');
    item('Problema Externo Principal', pl.externalProblem);
    h3('Matriz do Terceiro Trilho');
    if (!pl.matrix.length) L.push(md ? '_(sem conflitos listados)_\n' : '(sem conflitos listados)\n');
    pl.matrix.forEach(function (r, i) {
      var st = rowState(r), lab = { ok: 'pressiona a Falsa Crença', vazia: 'AÇÃO VAZIA', pendente: 'pendente', vazio: 'em branco' }[st];
      item((i + 1) + '. ' + (r.conflict.trim().split('\n')[0] || 'Conflito sem descrição') + ' [' + lab + ']', r.how);
    });
    h3('Subtramas / Personagens de Apoio');
    if (!pl.subplots.length) L.push(md ? '_(nenhuma)_\n' : '(nenhuma)\n');
    pl.subplots.forEach(function (r, i) { item((i + 1) + '. ' + (r.name || 'Sem nome') + (r.role ? ' (' + optLabel(ROLES, r.role) + ')' : ''), r.text); });

    h2('Fase 4 · Cartões de Cena');
    if (!project.scenes.length) L.push(md ? '_(nenhum cartão)_\n' : '(nenhum cartão)\n');
    project.scenes.forEach(function (sc, i) {
      h3('Cena ' + (i + 1) + (has(sc.title) ? ' — ' + sc.title : ''));
      item('Ponto Alfa', sc.alpha); item('Causa Externa', sc.cause); item('Efeito Prático', sc.effect);
      item('Terceiro Trilho / Insight', sc.thirdRail); item('E Por Isso?', sc.soWhat);
    });

    h2('Fase 5 · Manuscrito');
    var total = 0;
    project.scenes.forEach(function (sc, i) {
      var body = htmlToText(sc.prose, md ? 'md' : 'txt');
      total += words(body);
      h3('Cena ' + (i + 1) + (has(sc.title) ? ' — ' + sc.title : ''));
      L.push(body || (md ? '_(sem rascunho)_' : '(sem rascunho)')); L.push('');
    });
    L.push((md ? '_' : '') + 'Total do manuscrito: ' + total.toLocaleString('pt-BR') + ' palavras.' + (md ? '_' : '')); L.push('');
    return L.join('\n');
  }
  function exportDossier(fmt) {
    persist();
    writeOut(slug(project.title || 'projeto') + '_dossie_' + ts() + '.' + fmt, dossier(fmt),
      fmt === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8', 'Dossiê salvo na pasta: ');
  }

  async function loadProject() {
    var f = await pickText(['.json']);
    if (!f) return;
    var d; try { d = JSON.parse(f.text); } catch (e) { toast('Arquivo JSON inválido.'); return; }
    if (!d || d.format !== FORMAT_PROJECT) { toast('Este arquivo não é um backup de projeto do Story Genius.'); return; }
    if (!confirm('Carregar este backup substituirá o projeto atual deste navegador. Continuar?')) return;
    project = normalize(d);
    persist();
    go('dashboard');
    toast('Projeto carregado: ' + (project.title || 'sem título'));
  }
  function newProject() {
    if (!confirm('Começar um novo projeto? O projeto atual será apagado deste navegador. Baixe um backup antes, se quiser guardá-lo.')) return;
    project = blank(); persist(); go('dashboard');
    toast('Novo projeto criado.');
  }

  /* ---------------------------------------------------------
     CENAS
     --------------------------------------------------------- */
  function addScene(thenView) {
    var s = normScene({});
    project.scenes.push(s);
    project.ui.currentScene = s.id;
    touch(); persist();
    if (thenView) go(thenView); else render(true);
    return s;
  }
  function moveScene(i, d) {
    var j = i + d, sc = project.scenes;
    if (j < 0 || j >= sc.length) return;
    var t = sc[i]; sc[i] = sc[j]; sc[j] = t;
    touch(); persist(); render(true);
    var el = document.querySelector('[data-scene="' + t.id + '"]');
    if (el) el.scrollIntoView({ block: 'center' });
  }
  function deleteScene(i) {
    var s = project.scenes[i]; if (!s) return;
    if (!confirm('Excluir o cartão "' + (s.title || 'Cena ' + (i + 1)) + '" e o texto dessa cena? Esta ação não pode ser desfeita.')) return;
    project.scenes.splice(i, 1);
    if (project.ui.currentScene === s.id) project.ui.currentScene = (project.scenes[i] || project.scenes[i - 1] || {}).id || '';
    touch(); persist(); render(true);
  }
  function nextAlpha(i) {
    var s = project.scenes[i];
    if (!s || !has(s.soWhat)) { toast('Preencha o "E por isso?" desta cena primeiro.'); return; }
    var n = project.scenes[i + 1];
    if (!n) { n = normScene({ alpha: s.soWhat }); project.scenes.push(n); toast('Nova cena criada com este "E por isso?" como Ponto Alfa.'); }
    else if (has(n.alpha) && n.alpha !== s.soWhat) {
      if (!confirm('A próxima cena já tem um Ponto Alfa. Substituí-lo pelo "E por isso?" desta cena?')) return;
      n.alpha = s.soWhat; toast('Ponto Alfa da cena ' + (i + 2) + ' atualizado.');
    } else { n.alpha = s.soWhat; toast('Ponto Alfa da cena ' + (i + 2) + ' preenchido.'); }
    touch(); persist(); render(true);
  }

  /* ---------------------------------------------------------
     TEMA
     --------------------------------------------------------- */
  function currentTheme() { return document.documentElement.getAttribute('data-theme') || 'light'; }
  function setTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    var m = $('meta-theme-color'); if (m) m.setAttribute('content', t === 'dark' ? '#000000' : '#ffffff');
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  }

  /* ---------------------------------------------------------
     EVENTOS
     --------------------------------------------------------- */
  function live(path) {
    var c = document.querySelector('[data-count-for="' + path + '"]');
    if (c) c.textContent = countLabel(getPath(project, path));
    if (/^plot\.matrix\./.test(path)) updateMatrix();
    var m = /^scenes\.(\d+)\./.exec(path);
    if (m) updateSceneAlert(+m[1]);
  }

  function onFieldInput(e) {
    var t = e.target;
    if (t.id === 'prose') {
      var s = curScene();
      if (s) { s.prose = t.innerHTML; touch(); updateEditorCounts(); }
      return;
    }
    var path = t.getAttribute && t.getAttribute('data-path');
    if (!path) return;
    setPath(project, path, t.value);
    if (t.tagName === 'TEXTAREA') autoGrow(t);
    touch();
    live(path);
  }
  viewEl.addEventListener('input', onFieldInput);
  viewEl.addEventListener('change', function (e) {
    if (e.target.id === 'scene-select') {
      project.ui.currentScene = e.target.value; touch(); render(false);
      return;
    }
    onFieldInput(e);
  });

  $('project-title').addEventListener('input', function (e) { project.title = e.target.value; touch(); });

  // toolbar do editor não rouba o foco do texto
  viewEl.addEventListener('mousedown', function (e) {
    if (e.target.closest('[data-cmd]')) e.preventDefault();
  });
  document.addEventListener('selectionchange', function () {
    var pe = $('prose');
    if (!pe || document.activeElement !== pe) return;
    ['bold', 'italic', 'insertUnorderedList', 'insertOrderedList'].forEach(function (c) {
      var b = document.querySelector('[data-cmd="' + c + '"]');
      if (b) b.classList.toggle('active', !!document.queryCommandState(c));
    });
    var h = document.querySelector('[data-cmd="heading"]');
    if (h) h.classList.toggle('active', (document.queryCommandValue('formatBlock') || '').toLowerCase() === 'h2');
  });
  viewEl.addEventListener('paste', function (e) {
    if (e.target.id !== 'prose') return;
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b || b.disabled) return;
    var act = b.getAttribute('data-act');
    var i = parseInt(b.getAttribute('data-i'), 10);
    var host;

    switch (act) {
      case 'nav': go(b.getAttribute('data-view')); break;
      case 'theme': setTheme(currentTheme() === 'dark' ? 'light' : 'dark'); break;
      case 'backup': backup(); break;
      case 'export-md': exportDossier('md'); break;
      case 'export-txt': exportDossier('txt'); break;
      case 'load-project': loadProject(); break;
      case 'new-project': newProject(); break;

      case 'doc-txt':
      case 'doc-json':
        host = b.closest('[data-list],[data-ficha]'); if (!host) break;
        var d = hostDoc(host), ext = act === 'doc-json' ? 'json' : 'txt';
        writeOut(slug(d.title) + '_' + ts() + '.' + ext, ext === 'json' ? docToJson(d) : docToTxt(d),
          ext === 'json' ? 'application/json' : 'text/plain;charset=utf-8', 'Ficha salva na pasta: ');
        break;
      case 'doc-load':
        host = b.closest('[data-list],[data-ficha]'); if (!host) break;
        pickText(['.json', '.txt']).then(function (f) { if (f) applyToHost(host, f.name, f.text); });
        break;

      case 'add-row':
        var list = b.getAttribute('data-list');
        getPath(project, list).push(NORM[list]({}));
        touch(); persist(); render(true);
        var rows = viewEl.querySelectorAll('[data-list="' + list + '"] .row'), last = rows[rows.length - 1];
        if (last) { var fld = last.querySelector('textarea,input,select'); if (fld) fld.focus(); }
        break;
      case 'del-row':
        var l2 = b.getAttribute('data-list');
        if (!confirm('Excluir este item?')) break;
        getPath(project, l2).splice(i, 1);
        touch(); persist(); render(true);
        break;

      case 'new-scene':
        var ns = addScene(null);
        if (view === 'editor') {
          var st = viewEl.querySelector('.scene-title'); if (st) st.focus();
        } else {
          go('p4');
          var nc = document.querySelector('[data-scene="' + ns.id + '"]');
          if (nc) { var ni = nc.querySelector('input'); if (ni) ni.focus(); nc.scrollIntoView({ block: 'center' }); }
        }
        break;
      case 'add-scene':
        var s2 = addScene(null);
        var card = document.querySelector('[data-scene="' + s2.id + '"]');
        if (card) { var ti = card.querySelector('input'); if (ti) ti.focus(); card.scrollIntoView({ block: 'center' }); }
        break;
      case 'move-up': moveScene(i, -1); break;
      case 'move-down': moveScene(i, 1); break;
      case 'del-scene': deleteScene(i); break;
      case 'next-alpha': nextAlpha(i); break;
      case 'open-editor':
        project.ui.currentScene = b.getAttribute('data-id') || project.ui.currentScene; touch();
        go('editor');
        break;
      case 'go-card':
        var target = project.scenes[i]; go('p4');
        if (target) { var c2 = document.querySelector('[data-scene="' + target.id + '"]'); if (c2) c2.scrollIntoView({ block: 'start' }); }
        break;

      case 'fmt':
        var pe = $('prose'); if (!pe) break;
        pe.focus();
        var cmd = b.getAttribute('data-cmd');
        if (cmd === 'heading') {
          var cur = (document.queryCommandValue('formatBlock') || '').toLowerCase();
          document.execCommand('formatBlock', false, cur === 'h2' ? 'div' : 'h2');
        } else { document.execCommand(cmd, false, null); }
        var s3 = curScene(); if (s3) { s3.prose = pe.innerHTML; touch(); updateEditorCounts(); }
        break;
      case 'ed-panel':
        refHidden = !refHidden;
        var rp = $('ref-panel'), lay = $('editor-layout');
        if (rp) rp.hidden = refHidden;
        if (lay) lay.classList.toggle('no-ref', refHidden);
        b.classList.toggle('active', !refHidden);
        break;
      case 'ed-focus':
        document.body.classList.toggle('focus');
        b.classList.toggle('active', document.body.classList.contains('focus'));
        break;
      case 'ed-txt':
        var sc1 = curScene(); if (!sc1) break;
        writeOut(slug(sc1.title || 'cena') + '_' + ts() + '.txt', editorTxt(sc1), 'text/plain;charset=utf-8', 'Texto salvo na pasta: ');
        break;
      case 'ed-json':
        var sc2 = curScene(); if (!sc2) break;
        writeOut(slug(sc2.title || 'cena') + '_' + ts() + '.json', editorJson(sc2), 'application/json', 'Cena salva na pasta: ');
        break;
      case 'ed-load': editorLoad(); break;
    }
  });

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); backup(); }
    if (e.key === 'Escape' && document.body.classList.contains('focus')) {
      document.body.classList.remove('focus');
      var fb = document.querySelector('[data-act="ed-focus"]'); if (fb) fb.classList.remove('active');
    }
  });
  window.addEventListener('pagehide', persist);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') persist(); });
  window.addEventListener('resize', function () {
    Array.prototype.forEach.call(viewEl.querySelectorAll('textarea'), autoGrow);
  });

  /* ---------------------------------------------------------
     INICIALIZAÇÃO
     --------------------------------------------------------- */
  try { document.execCommand('defaultParagraphSeparator', false, 'div'); } catch (e) {}
  setTheme(currentTheme());
  project = loadLocal();
  try { var v = localStorage.getItem(VIEW_KEY); if (v && VIEWS.indexOf(v) >= 0) view = v; } catch (e) {}
  render(false);

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (err) { console.warn('Service Worker não registrado:', err); });
    });
  }
})();
