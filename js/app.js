/* Interfaz, progreso (localStorage), práctica adaptativa, retos de código con Pyodide y tutor IA */
(function () {
  const { UNITS, SKILLS } = window.PLAT, Core = window.Core;
  const byId = Object.fromEntries(SKILLS.map((s) => [s.id, s]));
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ---------- Progreso ---------- */
  const KEY = 'plataforma-algebra-v1';
  let P = (function () { try { const x = JSON.parse(localStorage.getItem(KEY)); if (x && x.skills) return x; } catch (e) {} return { xp: 0, streak: 0, lastDay: '', skills: {} }; })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {} };
  const S = (id) => P.skills[id] || (P.skills[id] = { d: 1, streak: 0, correct: 0, mastered: false, code: false });
  const day = (t) => new Date(t).toLocaleDateString('en-CA');
  function touchDay() {
    const t = day(Date.now()); if (P.lastDay === t) return;
    P.streak = P.lastDay === day(Date.now() - 864e5) ? P.streak + 1 : 1; P.lastDay = t;
  }
  const pct = (id) => { const s = S(id); return s.mastered ? 100 : Math.round((((s.d - 1) * 3 + s.streak) / 9) * 100); };

  /* ---------- Utilidades de UI ---------- */
  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2400); }
  function typeset(el) {
    if (window.renderMathInElement) window.renderMathInElement(el || document.body, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false });
  }
  window.addEventListener('load', () => {
    const s = document.createElement('script'); s.defer = true; s.src = 'https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js';
    s.onload = () => typeset(); document.head.appendChild(s);
  });
  function renderStats() {
    const done = SKILLS.filter((s) => S(s.id).mastered).length;
    $('#stats').innerHTML = `<span>🔥 <b>${P.streak}</b> <span class="hide-s">${P.streak === 1 ? 'día' : 'días'}</span></span><span>⭐ <b>${P.xp}</b> XP</span><span>✔ <b>${done}</b>/${SKILLS.length}</span>`;
  }
  function renderNav(active) {
    $('#nav').innerHTML = `<a href="#/" class="${!active ? 'act' : ''}">▶ Inicio</a>` + UNITS.map((u) =>
      `<h4>Unidad ${u.n} · ${esc(u.title)}</h4>` + u.skills.map((id) => `<a href="#/skill/${id}" class="${active === id ? 'act' : ''}">${esc(byId[id].title)}<span class="st">${S(id).mastered ? '✔' : pct(id) + '%'}</span></a>`).join('')).join('');
  }

  /* ---------- Inicio ---------- */
  function renderHome() {
    renderNav(null);
    $('#main').innerHTML = `
    <section class="card hero">
      <h1>Aprende álgebra y geometría analítica practicando</h1>
      <p>Ejercicios que cambian cada vez, retos de programación en Python dentro de tu navegador y la conexión de cada tema con algoritmos e inteligencia artificial. Basado en el programa de la UA <i>Álgebra superior y geometría analítica</i> (Ing. en Inteligencia Artificial, UAEM).</p>
      <div class="levels">
        <div><b>1 · Ver</b>Lección corta con las fórmulas clave.</div>
        <div><b>2 · Practicar</b>Dificultad que sube al dominar: 3 aciertos seguidos.</div>
        <div><b>3 · Programar</b>Implementa el algoritmo en Python y pasa las pruebas.</div>
        <div><b>4 · Aplicar</b>Descubre dónde se usa en IA.</div>
      </div>
    </section>` + UNITS.map((u) => `
    <section class="unit"><h2><span class="ic">${u.icon}</span>Unidad ${u.n}. ${esc(u.title)}</h2><p class="d">${esc(u.desc)}</p>
    <div class="grid">${u.skills.map((id) => { const s = byId[id], st = S(id); return `<a class="sk" href="#/skill/${id}"><div class="t">${esc(s.title)}</div><div class="m"><span>Tema ${s.tema}</span><span>${st.mastered ? '✔ Dominada' : 'Nivel ' + st.d + '/3'}${s.code ? ' · 🐍' : ''}</span></div><div class="bar"><i style="width:${pct(id)}%"></i></div></a>`; }).join('')}</div></section>`).join('');
    renderStats(); typeset($('#main'));
  }

  /* ---------- Habilidad ---------- */
  let tab = 'lesson', cur = null, curSkill = null;
  function renderSkill(id) {
    const sk = byId[id]; if (!sk) return renderHome();
    if (curSkill !== id) { tab = 'lesson'; cur = null; curSkill = id; }
    renderNav(id);
    const u = UNITS[sk.unit - 1];
    const tabs = [['lesson', '1 · Ver'], ['practice', '2 · Practicar']].concat(sk.code ? [['code', '3 · Programar']] : []).concat([['ia', '4 · Aplicar en IA']]);
    $('#main').innerHTML = `<div class="crumb"><a href="#/">Inicio</a> › Unidad ${u.n} · Tema ${sk.tema}</div>
      <h1>${esc(sk.title)}</h1>
      <div class="tabs">${tabs.map((t) => `<button data-tab="${t[0]}" class="${tab === t[0] ? 'on' : ''}">${t[1]}</button>`).join('')}</div>
      <div id="pane"></div>`;
    $('.tabs').onclick = (e) => { const b = e.target.closest('button'); if (b) { tab = b.dataset.tab; renderSkill(id); } };
    const pane = $('#pane');
    ({ lesson: lessonPane, practice: practicePane, code: codePane, ia: iaPane })[tab](sk, pane);
    renderStats(); typeset($('#main'));
  }
  function lessonPane(sk, el) {
    const u = UNITS[sk.unit - 1];
    el.innerHTML = `<div class="card lesson">${sk.lesson}</div>
      <div class="row"><button class="btn" id="go">Practicar →</button>${u.geo ? `<a class="btn sec" target="_blank" rel="noopener" href="https://www.geogebra.org/${u.geo}">Explorar en GeoGebra ↗</a>` : ''}</div>`;
    $('#go').onclick = () => { tab = 'practice'; renderSkill(sk.id); };
  }

  /* ---------- Práctica ---------- */
  function newEx(sk) {
    const st = S(sk.id), seed = (Date.now() ^ (Math.random() * 1e9)) >>> 0;
    cur = { ex: sk.gen(st.d, Core.makeR(seed)), hints: 0, tries: 0, solved: false, revealed: false, lost: false };
  }
  function practicePane(sk, el) {
    const st = S(sk.id); if (!cur || cur.skill !== sk.id) { newEx(sk); cur.skill = sk.id; }
    const ex = cur.ex;
    const chips = [1, 2, 3].map((n) => `<span class="chip ${st.mastered || n < st.d ? 'done' : ''} ${n === st.d && !st.mastered ? 'on' : ''}">${n}</span>`).join('');
    const input = ex.kind === 'mc'
      ? ex.options.map((o, i) => `<label class="opt"><input type="radio" name="mc" value="${i}"> ${esc(o)}</label>`).join('')
      : `<input type="text" id="ans" autocomplete="off" placeholder="${esc(ex.placeholder || 'Tu respuesta')}">`;
    el.innerHTML = `<div class="lvl">Dificultad ${chips}<span>·</span><span>Racha para subir: <span class="dots">${'●'.repeat(st.streak)}${'○'.repeat(3 - st.streak)}</span></span>${st.mastered ? '<b>✔ ¡Habilidad dominada!</b>' : ''}</div>
      <div class="card"><div class="prompt">${ex.prompt}</div>${input}
        <div class="row"><button class="btn" id="chk">Verificar</button><button class="btn sec" id="hint">💡 Pista</button><button class="btn sec" id="sol">Ver solución</button><button class="btn sec" id="tut">🤖 Tutor IA</button><button class="btn sec" id="nxt" style="display:none">Siguiente →</button></div>
        <div id="fb"></div></div>`;
    const fb = $('#fb');
    const show = (c, h) => { fb.className = 'fb ' + c; fb.innerHTML = h; typeset(fb); };
    const getInp = () => (ex.kind === 'mc' ? ($('input[name=mc]:checked') || {}).value : $('#ans').value);
    const next = () => { newEx(sk); cur.skill = sk.id; renderSkill(sk.id); };
    $('#nxt').onclick = next;
    if (ex.kind !== 'mc') { $('#ans').focus(); $('#ans').addEventListener('keydown', (e) => { if (e.key === 'Enter') $('#chk').click(); }); }
    $('#chk').onclick = () => {
      if (cur.solved) return;
      const r = Core.check(ex, getInp());
      if (r.error) return show('info', esc(r.error));
      touchDay();
      if (r.ok) {
        cur.solved = true;
        const clean = cur.tries === 0 && cur.hints === 0 && !cur.revealed;
        const gain = clean ? 10 * st.d : 3; P.xp += gain;
        let msg = '✔ ¡Correcto! +' + gain + ' XP';
        if (clean && !st.mastered) {
          st.streak++; st.correct++;
          if (st.streak >= 3) { st.streak = 0; if (st.d < 3) { st.d++; msg += ' · ¡Subes a la dificultad ' + st.d + '!'; toast('🚀 Dificultad ' + st.d); } else { st.mastered = true; P.xp += 50; msg += ' · ¡Habilidad dominada! +50 XP'; toast('🏆 ¡Habilidad dominada!'); } }
        }
        save(); show('ok', msg + '<br>' + ex.sol); $('#nxt').style.display = ''; $('#chk').disabled = true; renderStats(); renderNav(sk.id);
        const lv = $('.lvl'); if (lv) lv.querySelector('.dots').textContent = '●'.repeat(st.streak) + '○'.repeat(3 - st.streak);
      } else {
        cur.tries++; if (!cur.lost) { cur.lost = true; st.streak = 0; save(); const d = $('.dots'); if (d) d.textContent = '○○○'; }
        show('no', '✘ Todavía no. Revisa tu procedimiento o pide una pista.');
      }
    };
    $('#hint').onclick = () => {
      const hs = [sk.formula, ex.hint || 'Resuélvelo paso a paso con la fórmula anterior. Si sigues atorado, mira la solución (no sumará racha).'];
      show('info', '💡 ' + hs[Math.min(cur.hints, hs.length - 1)]); cur.hints++;
    };
    $('#sol').onclick = () => { cur.revealed = true; show('info', '<b>Solución:</b> ' + ex.sol); $('#nxt').style.display = ''; };
    $('#tut').onclick = async () => {
      show('info', 'El tutor está pensando…');
      const t = await askTutor({ mode: 'hint', skill: sk.title, prompt: ex.prompt, userAnswer: getInp() || '', solution: ex.sol });
      show('info', '<div class="tutor">🤖 ' + esc(t) + '</div>');
    };
  }

  /* ---------- Tutor IA ---------- */
  async function askTutor(payload) {
    const url = window.TUTOR_ENDPOINT;
    if (!url) return 'El tutor IA aún no está conectado. Despliega api/tutor.js (ver README) y escribe su URL en window.TUTOR_ENDPOINT dentro de index.html. Mientras tanto usa 💡 Pista.';
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const j = await r.json(); return j.reply || 'El tutor no respondió. Intenta de nuevo.';
    } catch (e) { return 'No pude contactar al tutor. Revisa tu conexión.'; }
  }

  /* ---------- Retos de código (Pyodide) ---------- */
  let pyP = null;
  function getPy() {
    if (!pyP) pyP = new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';
      s.onload = () => window.loadPyodide().then(res, rej); s.onerror = () => { pyP = null; rej(new Error('No se pudo cargar Pyodide. ¿Estás sin conexión?')); };
      document.head.appendChild(s);
    });
    return pyP;
  }
  async function runTests(sk, code) {
    const py = await getPy(); const g = py.globals.get('dict')();
    py.runPython('import sys, io\n_buf = io.StringIO()\nsys.stdout = _buf');
    let ok = false, msg = '';
    try { await py.runPythonAsync(code, { globals: g }); await py.runPythonAsync(sk.code.tests, { globals: g }); ok = true; }
    catch (e) { msg = String(e.message || e).trim().split('\n').filter(Boolean).slice(-2).join('\n'); }
    const out = py.runPython('_buf.getvalue()'); g.destroy(); return { ok, out, msg };
  }
  function codePane(sk, el) {
    const keyc = 'code-' + sk.id; let saved = null; try { saved = localStorage.getItem(keyc); } catch (e) {}
    el.innerHTML = `<div class="card"><p>${sk.code.prompt}</p>
      <textarea id="code" spellcheck="false">${esc(saved || sk.code.starter)}</textarea>
      <div class="row"><button class="btn" id="run">▶ Ejecutar pruebas</button><button class="btn sec" id="rst">Restablecer</button><button class="btn sec" id="csol">Ver solución</button><button class="btn sec" id="ctut">🤖 Tutor IA</button>${S(sk.id).code ? '<b style="color:var(--ok)">✔ Reto superado</b>' : ''}</div>
      <p style="font-size:.85rem;color:var(--mut)">Python corre en tu navegador (Pyodide); la primera vez tarda unos segundos en cargar. Si escribes un ciclo infinito tendrás que recargar la página.</p>
      <div id="cout"></div></div>`;
    const ta = $('#code'), out = $('#cout');
    ta.addEventListener('keydown', (e) => { if (e.key === 'Tab') { e.preventDefault(); const p = ta.selectionStart; ta.setRangeText('    ', p, ta.selectionEnd, 'end'); } });
    ta.addEventListener('input', () => { try { localStorage.setItem(keyc, ta.value); } catch (e) {} });
    $('#rst').onclick = () => { ta.value = sk.code.starter; try { localStorage.removeItem(keyc); } catch (e) {} };
    $('#csol').onclick = () => { out.innerHTML = '<pre class="out">' + esc(sk.code.solution) + '</pre>'; };
    $('#ctut').onclick = async () => { out.innerHTML = '<pre class="out">El tutor está pensando…</pre>'; out.innerHTML = '<pre class="out tutor">🤖 ' + esc(await askTutor({ mode: 'code', skill: sk.title, prompt: sk.code.prompt, userAnswer: ta.value })) + '</pre>'; };
    $('#run').onclick = async () => {
      const b = $('#run'); b.disabled = true; out.innerHTML = '<pre class="out">Cargando Python y ejecutando…</pre>';
      try {
        const r = await runTests(sk, ta.value); touchDay();
        if (r.ok) { const st = S(sk.id); if (!st.code) { st.code = true; P.xp += 50; toast('🐍 ¡Reto superado! +50 XP'); } save(); renderStats(); out.innerHTML = '<pre class="out">✔ ¡Todas las pruebas pasaron!\n' + esc(r.out) + '</pre>'; }
        else out.innerHTML = '<pre class="out bad">✘ Falló una prueba:\n' + esc(r.msg) + '\n' + esc(r.out) + '</pre>';
      } catch (e) { out.innerHTML = '<pre class="out bad">' + esc(e.message) + '</pre>'; }
      b.disabled = false;
    };
  }

  /* ---------- Conexión con IA ---------- */
  function iaPane(sk, el) {
    el.innerHTML = `<div class="card ia"><h3>${esc(sk.ia.t)}</h3><p>${sk.ia.p}</p></div>
      <div class="card"><b>Para explorar:</b> prueba el reto de código${sk.code ? '' : ' de otras habilidades de la unidad'} y pregunta al tutor IA cómo se conecta este tema con un algoritmo que te interese.<div class="row"><button class="btn sec" id="itut">🤖 Pregúntale al tutor</button></div><div id="iout"></div></div>`;
    $('#itut').onclick = async () => { const o = $('#iout'); o.innerHTML = '<div class="fb info">Pensando…</div>'; const t = await askTutor({ mode: 'apply', skill: sk.title, prompt: 'Dame un ejemplo concreto y corto de IA donde se use este tema.' }); o.innerHTML = '<div class="fb info tutor">🤖 ' + esc(t) + '</div>'; };
  }

  /* ---------- Router ---------- */
  function route() {
    const m = location.hash.match(/^#\/skill\/(\w+)/); window.scrollTo(0, 0); $('#nav').classList.remove('open');
    if (m) renderSkill(m[1]); else { curSkill = null; renderHome(); }
  }
  window.addEventListener('hashchange', route);
  $('#menuBtn').onclick = () => $('#nav').classList.toggle('open');
  route();
})();
