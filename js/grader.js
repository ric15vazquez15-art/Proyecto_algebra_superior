/* Núcleo: aleatoriedad con semilla, utilidades matemáticas y calificador de respuestas */
(function (root) {
  const Core = {};

  // Generador pseudoaleatorio con semilla (cada alumno/intento obtiene variantes distintas y reproducibles)
  Core.mulberry32 = function (a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  Core.makeR = function (seed) {
    const r = Core.mulberry32(seed);
    return {
      rand: r,
      int: (a, b) => a + Math.floor(r() * (b - a + 1)),
      pick: (arr) => arr[Math.floor(r() * arr.length)],
      sign: () => (r() < 0.5 ? -1 : 1),
      nz: (a, b) => { let x = 0; while (x === 0) x = a + Math.floor(r() * (b - a + 1)); return x; },
    };
  };

  // Utilidades
  Core.gcd = (a, b) => (b ? Core.gcd(b, a % b) : Math.abs(a));
  Core.fact = (n) => (n <= 1 ? 1 : n * Core.fact(n - 1));
  Core.perm = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r *= n - i; return r; };
  Core.comb = (n, k) => { k = Math.min(k, n - k); let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
  Core.fmt = (x) => (Number.isInteger(x) ? String(x) : String(+x.toFixed(2)));
  Core.tv = (v) => '(' + v.map(Core.fmt).join(', ') + ')';
  Core.dot = (u, v) => u.reduce((s, x, i) => s + x * v[i], 0);
  Core.norm = (u) => Math.sqrt(Core.dot(u, u));
  Core.cross = (u, v) => [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  Core.triple = (u, v, w) => Core.dot(u, Core.cross(v, w));
  Core.off = (v) => (v === 0 ? '' : v > 0 ? '-' + v : '+' + -v);           // para (x - h)
  Core.sh = (v, name) => (v === 0 ? name : '(' + name + Core.off(v) + ')');
  Core.cs = (c) => (c > 0 ? '+' + c : c < 0 ? String(c) : '');             // constante con signo

  // Evaluador seguro de expresiones: solo números, n, + - * / ^ ( ) sqrt pi
  Core.safeEval = function (s, vars) {
    let e = String(s).toLowerCase().replace(/\^/g, '**').replace(/√/g, 'sqrt').replace(/π/g, 'pi')
      .replace(/[×·]/g, '*').replace(/−/g, '-');
    if (e.replace(/sqrt|pi|n|[0-9.+\-*/() \t]/g, '') !== '') throw new Error('bad');
    e = e.replace(/(\d|\))\s*(n|\(|sqrt|pi)/g, '$1*$2').replace(/(n|pi)\s*(\d|\()/g, '$1*$2');
    e = e.replace(/sqrt/g, 'Math.sqrt').replace(/pi/g, 'Math.PI');
    const v = new Function('n', '"use strict";return (' + e + ');')((vars || {}).n);
    if (typeof v !== 'number' || !isFinite(v)) throw new Error('bad');
    return v;
  };

  const BAD = 'No pude interpretar tu respuesta. Usa números, n, + - * / ^, paréntesis, sqrt(…) y pi.';

  // Califica la respuesta del alumno. ex.kind: num | vec | expr | mc
  Core.check = function (ex, inp) {
    try {
      if (ex.kind === 'mc') {
        if (inp === null || inp === undefined || inp === '') return { ok: false, error: 'Elige una opción.' };
        return { ok: Number(inp) === ex.answer };
      }
      if (inp === null || inp === undefined || String(inp).trim() === '') return { ok: false, error: 'Escribe una respuesta.' };
      const tol = ex.tol === undefined ? 1e-6 : ex.tol;
      if (ex.kind === 'num') {
        const x = Core.safeEval(String(inp).replace(/,/g, '.'), {});
        return { ok: Math.abs(x - ex.answer) <= tol };
      }
      if (ex.kind === 'vec') {
        const parts = String(inp).replace(/[()\[\]⟨⟩<>]/g, '').split(/[;,]/).map((s) => s.trim()).filter((s) => s !== '');
        if (parts.length !== ex.answer.length)
          return { ok: false, error: 'Tu respuesta debe tener ' + ex.answer.length + ' componentes separadas por comas, por ejemplo (1, 2).' };
        const vals = parts.map((p) => Core.safeEval(p, {}));
        return { ok: vals.every((v, i) => Math.abs(v - ex.answer[i]) <= tol) };
      }
      if (ex.kind === 'expr') {
        const s = String(inp).replace(/^\s*a\s*_?\s*\{?\s*n\s*\}?\s*=\s*/i, '');
        for (let n = 1; n <= 8; n++) {
          if (Math.abs(Core.safeEval(s, { n }) - ex.answer(n)) > 1e-6) return { ok: false };
        }
        return { ok: true };
      }
    } catch (e) {
      return { ok: false, error: BAD };
    }
    return { ok: false };
  };

  root.Core = Core;
  if (typeof module !== 'undefined') module.exports = Core;
})(typeof window !== 'undefined' ? window : globalThis);
