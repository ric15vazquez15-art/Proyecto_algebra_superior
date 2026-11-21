/* Contenido del temario: Álgebra superior y geometría analítica (UAEM, Ing. en IA)
   Cada habilidad tiene: lección, generador de ejercicios por nivel de dificultad (1-3),
   reto de código opcional (Python en el navegador) y conexión con IA. */
(function (root) {
  const C = root.Core, T = String.raw;
  const { fact, comb, perm, fmt, tv, dot, norm, cross, triple, off, sh, cs } = C;
  const E = (prompt, kind, answer, sol, o) => Object.assign({ prompt, kind, answer, sol }, o || {});

  const UNITS = [
    { n: 1, title: 'Conjuntos y análisis combinatorio', icon: '∪', desc: 'Conjuntos, relaciones y técnicas de conteo: la base de los algoritmos de conteo y frecuencias.', geo: null },
    { n: 2, title: 'Sucesiones y series', icon: 'Σ', desc: 'Sucesiones, notación sigma y convergencia: modelan datos y aproximan funciones.', geo: 'graphing' },
    { n: 3, title: 'Geometría en el plano y en el espacio', icon: '◔', desc: 'Rectas, circunferencias, cónicas y transformaciones: ubicar y mover objetos en el espacio.', geo: 'graphing' },
    { n: 4, title: 'Álgebra vectorial', icon: '→', desc: 'Vectores, producto escalar y vectorial, áreas y volúmenes: el lenguaje de los embeddings.', geo: '3d' },
  ];

  const SKILLS = [
    /* ================= UNIDAD 1 ================= */
    {
      id: 'conj', unit: 1, tema: '1.1', title: 'Operaciones con conjuntos y cardinalidad',
      lesson: T`<p>Un <b>conjunto</b> es una colección de elementos distintos. Las operaciones básicas son la unión $A\cup B$, la intersección $A\cap B$, la diferencia $A\setminus B$ y el complemento $A^c$. La <b>cardinalidad</b> $|A|$ es el número de elementos.</p>
<p>Principio de inclusión–exclusión:</p>
<p>$$|A\cup B|=|A|+|B|-|A\cap B|$$</p>
<p>Para tres conjuntos:</p>
<p>$$|A\cup B\cup C|=|A|+|B|+|C|-|A\cap B|-|A\cap C|-|B\cap C|+|A\cap B\cap C|$$</p>`,
      formula: T`$|A\cup B|=|A|+|B|-|A\cap B|$ (restamos lo que contamos dos veces).`,
      gen(d, R) {
        if (d === 1) { const a = R.int(8, 20), b = R.int(8, 20), c = R.int(1, Math.min(a, b) - 2);
          return E(T`Si $|A|=${a}$, $|B|=${b}$ y $|A\cap B|=${c}$, ¿cuánto vale $|A\cup B|$?`, 'num', a + b - c, T`$${a}+${b}-${c}=${a + b - c}$`); }
        if (d === 2) { const a = R.int(10, 25), b = R.int(10, 25), c = R.int(10, 25), ab = R.int(2, 6), ac = R.int(2, 6), bc = R.int(2, 6), abc = R.int(1, 2);
          const r = a + b + c - ab - ac - bc + abc;
          return E(T`Se tiene $|A|=${a}$, $|B|=${b}$, $|C|=${c}$, $|A\cap B|=${ab}$, $|A\cap C|=${ac}$, $|B\cap C|=${bc}$ y $|A\cap B\cap C|=${abc}$. Calcula $|A\cup B\cup C|$.`, 'num', r,
            T`$${a}+${b}+${c}-${ab}-${ac}-${bc}+${abc}=${r}$`); }
        const N = R.int(80, 120), x = R.int(25, 40), y = R.int(25, 40), z = R.int(5, 15), r = N - (x + y - z);
        return E(T`En un grupo de ${N} estudiantes, ${x} practican fútbol, ${y} practican natación y ${z} practican ambos deportes. ¿Cuántos no practican ninguno?`, 'num', r,
          T`Practican alguno: $${x}+${y}-${z}=${x + y - z}$. Ninguno: $${N}-${x + y - z}=${r}$`);
      },
      code: {
        prompt: 'Escribe <code>conjunto_potencia(s)</code> que devuelva una lista con <b>todos los subconjuntos</b> de <code>s</code> (como <code>frozenset</code>). Un conjunto de $n$ elementos debe producir $2^n$ subconjuntos.',
        starter: 'from itertools import combinations\n\ndef conjunto_potencia(s):\n    # Tu código aquí\n    pass\n',
        tests: "r = conjunto_potencia({1, 2, 3})\nassert len(r) == 8, 'Un conjunto de 3 elementos tiene 8 subconjuntos'\nassert frozenset() in r, 'Falta el conjunto vacío'\nassert frozenset({1, 2, 3}) in r, 'Falta el conjunto completo'\nassert len(set(r)) == len(r), 'Hay subconjuntos repetidos'\nassert len(conjunto_potencia(set())) == 1\nassert len(conjunto_potencia(set(range(10)))) == 1024\nprint('OK')\n",
        solution: 'from itertools import combinations\n\ndef conjunto_potencia(s):\n    return [frozenset(c) for k in range(len(s) + 1) for c in combinations(s, k)]\n',
      },
      ia: { t: 'Del conteo a las funciones de características', p: 'Cada subconjunto de un conjunto de $n$ atributos es una posible combinación de <i>features</i>. Como hay $2^n$, probar todas es inviable cuando $n$ crece: por eso existen la selección de atributos y los métodos de búsqueda heurística. La inclusión–exclusión aparece al contar documentos que contienen ciertas palabras (búsqueda y filtrado).' },
    },
    {
      id: 'potencia', unit: 1, tema: '1.1.4–1.1.8', title: 'Conjunto potencia y producto cartesiano',
      lesson: T`<p>El <b>conjunto potencia</b> $\mathcal P(A)$ es el conjunto de todos los subconjuntos de $A$ (incluye $\varnothing$ y $A$). Si $|A|=n$ entonces</p>
<p>$$|\mathcal P(A)|=2^n$$</p>
<p>El número de subconjuntos de tamaño $k$ es $\binom{n}{k}$. El <b>producto cartesiano</b> $A\times B=\{(a,b):a\in A,\ b\in B\}$ cumple $|A\times B|=|A|\cdot|B|$. Toda <b>relación</b> de $A$ en $B$ es un subconjunto de $A\times B$.</p>`,
      formula: T`$|\mathcal P(A)|=2^{|A|}$, $|A\times B|=|A||B|$, subconjuntos de tamaño $k$: $\binom{n}{k}$.`,
      gen(d, R) {
        if (d === 1) { const n = R.int(3, 8); return E(T`¿Cuántos subconjuntos tiene un conjunto con $${n}$ elementos?`, 'num', 2 ** n, T`$2^{${n}}=${2 ** n}$`); }
        if (d === 2) { const n = R.int(5, 9), k = R.int(2, 4); return E(T`¿Cuántos subconjuntos de exactamente $${k}$ elementos tiene un conjunto de $${n}$ elementos?`, 'num', comb(n, k), T`$\binom{${n}}{${k}}=${comb(n, k)}$`); }
        const a = R.int(2, 3), b = R.int(2, 3);
        return E(T`Si $|A|=${a}$ y $|B|=${b}$, ¿cuántas relaciones distintas de $A$ en $B$ existen? (Una relación es cualquier subconjunto de $A\times B$.)`, 'num', 2 ** (a * b), T`$|A\times B|=${a * b}$, así que hay $2^{${a * b}}=${2 ** (a * b)}$ relaciones.`);
      },
      code: null,
      ia: { t: 'Relaciones y grafos de conocimiento', p: 'Una relación es un subconjunto de un producto cartesiano. Los <i>grafos de conocimiento</i> y las bases de datos relacionales guardan exactamente eso: tripletas (sujeto, relación, objeto) dentro de $S\times R\times O$. El producto cartesiano también explica por qué las cuadrículas de hiperparámetros crecen tan rápido.' },
    },
    {
      id: 'conteo', unit: 1, tema: '1.2', title: 'Técnicas de conteo',
      lesson: T`<p><b>Principio multiplicativo:</b> si un proceso tiene pasos con $n_1, n_2,\dots,n_k$ opciones, hay $n_1n_2\cdots n_k$ resultados.</p>
<p>$$P(n,k)=\frac{n!}{(n-k)!}\qquad \binom{n}{k}=\frac{n!}{k!\,(n-k)!}$$</p>
<p>$P(n,k)$ cuenta arreglos donde <i>importa el orden</i>; $\binom nk$ cuando <i>no importa</i>. Con elementos repetidos, las permutaciones distintas son $\dfrac{n!}{n_1!\,n_2!\cdots}$.</p>`,
      formula: T`$P(n,k)=\frac{n!}{(n-k)!}$ si importa el orden; $\binom nk$ si no importa; repetidos: $\frac{n!}{n_1!n_2!\cdots}$.`,
      gen(d, R) {
        if (d === 1) { const a = R.int(3, 6), b = R.int(2, 5), c = R.int(2, 4);
          return E(T`Una persona tiene ${a} camisas, ${b} pantalones y ${c} pares de zapatos. ¿Cuántos atuendos distintos puede formar?`, 'num', a * b * c, T`$${a}\cdot${b}\cdot${c}=${a * b * c}$`); }
        if (d === 2) { const n = R.int(6, 12);
          return E(T`De un grupo de ${n} personas se eligen presidente, secretario y tesorero (cargos distintos). ¿De cuántas formas?`, 'num', perm(n, 3), T`Importa el orden: $P(${n},3)=${n}\cdot${n - 1}\cdot${n - 2}=${perm(n, 3)}$`); }
        const w = R.pick(['ANANA', 'BANANA', 'LLAMA', 'ALGEBRA', 'MISSISSIPPI', 'PEPE', 'ABRACADABRA']);
        const cnt = {}; for (const ch of w) cnt[ch] = (cnt[ch] || 0) + 1;
        let r = fact(w.length); for (const k in cnt) r /= fact(cnt[k]);
        const den = Object.values(cnt).filter((x) => x > 1).map((x) => x + '!').join('\\,');
        return E(T`¿Cuántas "palabras" distintas (con o sin sentido) se pueden formar reordenando todas las letras de ${w}?`, 'num', r, T`$\dfrac{${w.length}!}{${den}}=${r}$`);
      },
      code: {
        prompt: 'Implementa <code>combinaciones(n, k)</code> que calcule $\\binom nk$ <b>sin usar</b> <code>math.comb</code> ni factoriales gigantes. Pista: multiplica y divide paso a paso, $\\binom nk=\\prod_{i=1}^{k}\\frac{n-k+i}{i}$.',
        starter: 'def combinaciones(n, k):\n    # Tu código aquí\n    pass\n',
        tests: "assert combinaciones(5, 2) == 10\nassert combinaciones(10, 0) == 1\nassert combinaciones(10, 10) == 1\nassert combinaciones(20, 3) == 1140\nassert combinaciones(30, 15) == 155117520, 'Cuidado con los enteros: usa // al dividir'\nprint('OK')\n",
        solution: 'def combinaciones(n, k):\n    res = 1\n    for i in range(1, k + 1):\n        res = res * (n - k + i) // i\n    return res\n',
      },
      ia: { t: 'Explosión combinatoria', p: 'Contar configuraciones explica por qué algunos problemas de IA son difíciles: el número de rutas de un viajero ($n!$) o de arquitecturas posibles de una red crece más rápido que cualquier computadora. También sustenta métricas: el número de pares de datos a comparar en <i>clustering</i> es $\binom n2$.' },
    },

    /* ================= UNIDAD 2 ================= */
    {
      id: 'arit', unit: 2, tema: '2.1, 2.3.1', title: 'Sucesiones y series aritméticas',
      lesson: T`<p>Una <b>sucesión</b> es una lista ordenada $a_1,a_2,a_3,\dots$. En una <b>sucesión aritmética</b> cada término suma una diferencia constante $d$:</p>
<p>$$a_n=a_1+(n-1)d\qquad S_n=\sum_{k=1}^{n}a_k=\frac{n\,(a_1+a_n)}{2}$$</p>
<p>Una sucesión es <b>recurrente</b> si cada término depende de los anteriores, por ejemplo Fibonacci: $F_n=F_{n-1}+F_{n-2}$.</p>`,
      formula: T`$a_n=a_1+(n-1)d$ y $S_n=\frac{n(a_1+a_n)}{2}$.`,
      gen(d, R) {
        const a1 = R.int(-5, 10), r = R.int(2, 7);
        if (d === 1) { const n = R.int(8, 20); return E(T`En una sucesión aritmética $a_1=${a1}$ y $d=${r}$. Calcula $a_{${n}}$.`, 'num', a1 + (n - 1) * r, T`$${a1}+${n - 1}\cdot${r}=${a1 + (n - 1) * r}$`); }
        if (d === 2) { const n = R.int(10, 30), s = (n * (2 * a1 + (n - 1) * r)) / 2;
          return E(T`Calcula la suma de los primeros ${n} términos de la sucesión aritmética con $a_1=${a1}$ y $d=${r}$.`, 'num', s, T`$S_n=\frac{n}{2}(2a_1+(n-1)d)=\frac{${n}}{2}(${2 * a1}+${(n - 1) * r})=${s}$`); }
        return E(T`Una sucesión aritmética empieza así: $${a1},\ ${a1 + r},\ ${a1 + 2 * r},\ ${a1 + 3 * r},\dots$ Escribe el término general $a_n$ en términos de $n$.`, 'expr', (n) => a1 + (n - 1) * r,
          T`$a_n=${a1}+(n-1)\cdot${r}$, que equivale a $${r}n${cs(a1 - r)}$`, { placeholder: 'ej. 3+2*(n-1)' });
      },
      code: {
        prompt: 'Escribe <code>suma_aritmetica(a1, d, n)</code> (suma de los primeros $n$ términos, usando la fórmula, sin ciclos) y <code>fibonacci(n)</code> con $F_1=F_2=1$ (una sucesión recurrente).',
        starter: 'def suma_aritmetica(a1, d, n):\n    pass\n\ndef fibonacci(n):\n    pass\n',
        tests: "assert suma_aritmetica(3, 2, 10) == 120\nassert suma_aritmetica(1, 1, 100) == 5050\nassert fibonacci(1) == 1 and fibonacci(2) == 1\nassert fibonacci(10) == 55\nassert fibonacci(30) == 832040\nprint('OK')\n",
        solution: 'def suma_aritmetica(a1, d, n):\n    return n * (2 * a1 + (n - 1) * d) // 2\n\ndef fibonacci(n):\n    a, b = 1, 1\n    for _ in range(n - 2):\n        a, b = b, a + b\n    return b if n > 1 else a\n',
      },
      ia: { t: 'Sucesiones como series de tiempo', p: 'Una serie de tiempo (ventas, sensores, precios) es una sucesión. Las sucesiones recurrentes son la idea detrás de las <b>redes recurrentes</b> (RNN): cada estado depende del anterior, $h_t=f(h_{t-1},x_t)$. La tasa de aprendizaje con decaimiento aritmético o geométrico es otra sucesión que usarás al entrenar modelos.' },
    },
    {
      id: 'geom', unit: 2, tema: '2.3.2', title: 'Series geométricas',
      lesson: T`<p>En una <b>sucesión geométrica</b> cada término se multiplica por una razón $r$: $a_n=a_1r^{\,n-1}$. Su suma parcial es</p>
<p>$$S_n=a_1\frac{1-r^{n}}{1-r}\quad(r\ne1)$$</p>
<p>Si $|r|<1$ la serie infinita <b>converge</b>:</p>
<p>$$\sum_{n=0}^{\infty}a_1r^{n}=\frac{a_1}{1-r}$$</p>`,
      formula: T`$a_n=a_1r^{n-1}$, $S_n=a_1\frac{1-r^n}{1-r}$ y, si $|r|<1$, $S_\infty=\frac{a_1}{1-r}$.`,
      gen(d, R) {
        if (d === 1) { const a1 = R.int(1, 5), r = R.pick([2, 3, -2]), n = R.int(4, 7);
          return E(T`En una sucesión geométrica $a_1=${a1}$ y $r=${r}$. Calcula $a_{${n}}$.`, 'num', a1 * r ** (n - 1), T`$${a1}\cdot(${r})^{${n - 1}}=${a1 * r ** (n - 1)}$`); }
        if (d === 2) { const a1 = R.int(1, 9), [p, q] = R.pick([[1, 2], [1, 3], [1, 4], [2, 3], [-1, 2]]), r = p / q, s = a1 / (1 - r);
          return E(T`Calcula la suma de la serie infinita $${a1}+${a1}\left(\frac{${p}}{${q}}\right)+${a1}\left(\frac{${p}}{${q}}\right)^2+\cdots$ (redondea a 2 decimales).`, 'num', s,
            T`$\dfrac{${a1}}{1-\frac{${p}}{${q}}}=${fmt(s)}$`, { tol: 0.01 }); }
        const a1 = R.int(1, 4), r = R.pick([2, 3]), n = R.int(5, 9), s = (a1 * (r ** n - 1)) / (r - 1);
        return E(T`Calcula la suma de los primeros ${n} términos de la sucesión geométrica con $a_1=${a1}$ y $r=${r}$.`, 'num', s, T`$${a1}\cdot\dfrac{${r}^{${n}}-1}{${r}-1}=${s}$`);
      },
      code: {
        prompt: 'Implementa <code>suma_parcial(a, r, n)</code> (suma de los primeros $n$ términos con un ciclo) y <code>terminos_necesarios(a, r, eps)</code>: el menor $n$ tal que la suma parcial está a menos de <code>eps</code> de la suma infinita $a/(1-r)$. Así verás la convergencia numéricamente.',
        starter: 'def suma_parcial(a, r, n):\n    pass\n\ndef terminos_necesarios(a, r, eps):\n    pass\n',
        tests: "assert suma_parcial(1, 0.5, 3) == 1.75\nassert abs(suma_parcial(2, 1/3, 50) - 3) < 1e-9\nassert terminos_necesarios(1, 0.5, 0.001) == 11, 'Compara |a/(1-r) - S_n| con eps'\nassert terminos_necesarios(1, 0.1, 1e-6) == 7\nprint('OK')\n",
        solution: 'def suma_parcial(a, r, n):\n    total, termino = 0, a\n    for _ in range(n):\n        total += termino\n        termino *= r\n    return total\n\ndef terminos_necesarios(a, r, eps):\n    limite = a / (1 - r)\n    n = 1\n    while abs(limite - suma_parcial(a, r, n)) >= eps:\n        n += 1\n    return n\n',
      },
      ia: { t: 'Descuentos, decaimiento y gradiente', p: 'En aprendizaje por refuerzo el retorno descontado $\\sum_t\\gamma^t r_t$ es una serie geométrica: converge a $\\frac{r}{1-\\gamma}$ si $0\\le\\gamma<1$. El <i>learning-rate decay</i> exponencial y la media móvil exponencial (Adam, momentum) también son sucesiones geométricas.' },
    },
    {
      id: 'conv', unit: 2, tema: '2.2', title: 'Convergencia de series: criterio del cociente',
      lesson: T`<p>Una serie $\sum a_n$ <b>converge</b> si sus sumas parciales tienden a un número finito. Criterios:</p>
<p><b>Cociente:</b> sea $L=\lim_{n\to\infty}\left|\dfrac{a_{n+1}}{a_n}\right|$. Si $L<1$ converge; si $L>1$ diverge; si $L=1$ el criterio no decide.</p>
<p><b>Raíz:</b> $L=\lim\sqrt[n]{|a_n|}$ con la misma regla. <b>Integral:</b> si $f$ es positiva y decreciente, $\sum f(n)$ y $\int f$ convergen o divergen juntas.</p>
<p>Notación sigma: $\sum_{k=1}^{n}a_k=a_1+\cdots+a_n$; es lineal: $\sum(ca_k+b_k)=c\sum a_k+\sum b_k$.</p>`,
      formula: T`Cociente: $L=\lim|a_{n+1}/a_n|$; $L<1$ converge, $L>1$ diverge.`,
      gen(d, R) {
        if (d === 1) { const r = R.pick([0.3, -0.5, 1, 1.5, -2, 0.9]); const ok = Math.abs(r) < 1;
          return E(T`¿La serie geométrica $\sum_{n=0}^{\infty}(${r})^n$ converge o diverge?`, 'mc', ok ? 0 : 1, T`Converge si $|r|<1$. Aquí $|r|=${Math.abs(r)}$.`, { options: ['Converge', 'Diverge'] }); }
        if (d === 2) { const k = R.int(2, 5);
          const t = R.pick([
            { tex: T`\frac{${k}^n}{n!}`, ok: true, why: T`$L=\lim\frac{${k}}{n+1}=0<1$` },
            { tex: T`\frac{n!}{${k}^n}`, ok: false, why: T`$L=\lim\frac{n+1}{${k}}=\infty>1$` },
            { tex: T`\frac{n^2}{${k + 1}^n}`, ok: true, why: T`$L=\frac{1}{${k + 1}}<1$` },
            { tex: T`\frac{${k + 2}^n}{2^n}`, ok: false, why: T`$L=\frac{${k + 2}}{2}>1$` },
          ]);
          return E(T`Con el criterio del cociente, ¿la serie $\sum a_n$ con $a_n=${t.tex}$ converge o diverge?`, 'mc', t.ok ? 0 : 1, t.why, { options: ['Converge', 'Diverge'] }); }
        const k = R.int(1, 5); let m = R.int(2, 9); if (m === k) m += 1;
        return E(T`Para $a_n=\dfrac{n\cdot ${k}^n}{${m}^n}$, calcula $L=\lim\left|\dfrac{a_{n+1}}{a_n}\right|$ (2 decimales).`, 'num', k / m,
          T`$\frac{a_{n+1}}{a_n}=\frac{n+1}{n}\cdot\frac{${k}}{${m}}\to\frac{${k}}{${m}}=${fmt(k / m)}$`, { tol: 0.01 });
      },
      code: null,
      ia: { t: '¿Cuándo converge un algoritmo iterativo?', p: 'Entrenar un modelo es generar una sucesión de parámetros $\\theta_1,\\theta_2,\\dots$ con descenso de gradiente. Saber si converge (y qué tan rápido, comparando cocientes de errores sucesivos) es el mismo razonamiento del criterio del cociente. Las series de potencias aproximan funciones como $e^x$ o $\\sin x$ en bibliotecas numéricas.' },
    },

    /* ================= UNIDAD 3 ================= */
    {
      id: 'dist', unit: 3, tema: '3.1', title: 'Distancia entre puntos y punto medio',
      lesson: T`<p>En el plano cartesiano la distancia entre $P_1(x_1,y_1)$ y $P_2(x_2,y_2)$ es</p>
<p>$$d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$$</p>
<p>y el punto medio es $M=\left(\dfrac{x_1+x_2}{2},\dfrac{y_1+y_2}{2}\right)$. En el espacio se agrega $(z_2-z_1)^2$.</p>`,
      formula: T`$d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$ y $M=\left(\frac{x_1+x_2}{2},\frac{y_1+y_2}{2}\right)$.`,
      gen(d, R) {
        if (d === 1) { const t = R.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), m = R.int(1, 2), x1 = R.int(-5, 5), y1 = R.int(-5, 5), dx = t[0] * m * R.sign(), dy = t[1] * m * R.sign();
          return E(T`Calcula la distancia entre $P(${x1},${y1})$ y $Q(${x1 + dx},${y1 + dy})$.`, 'num', t[2] * m, T`$\sqrt{${dx}^2+${dy}^2}=\sqrt{${dx * dx + dy * dy}}=${t[2] * m}$`); }
        if (d === 2) { let x1, y1, x2, y2; do { x1 = R.int(-6, 6); y1 = R.int(-6, 6); x2 = R.int(-6, 6); y2 = R.int(-6, 6); } while (x1 === x2 && y1 === y2);
          const s = Math.hypot(x2 - x1, y2 - y1);
          return E(T`Calcula la distancia entre $A(${x1},${y1})$ y $B(${x2},${y2})$. Redondea a 2 decimales.`, 'num', s, T`$\sqrt{${(x2 - x1) ** 2}+${(y2 - y1) ** 2}}\approx${fmt(s)}$`, { tol: 0.01 }); }
        const x1 = R.int(-8, 8), y1 = R.int(-8, 8), x2 = R.int(-8, 8), y2 = R.int(-8, 8);
        return E(T`Encuentra el punto medio del segmento con extremos $A(${x1},${y1})$ y $B(${x2},${y2})$. Responde como (x, y).`, 'vec', [(x1 + x2) / 2, (y1 + y2) / 2], T`$\left(\frac{${x1}+${x2}}{2},\frac{${y1}+${y2}}{2}\right)$`, { tol: 0.01, placeholder: '(x, y)' });
      },
      code: {
        prompt: 'Escribe <code>distancia(p, q)</code> para puntos de <b>cualquier dimensión</b> (tuplas) y <code>punto_medio(p, q)</code> que devuelva una tupla.',
        starter: 'import math\n\ndef distancia(p, q):\n    pass\n\ndef punto_medio(p, q):\n    pass\n',
        tests: "assert distancia((0, 0), (3, 4)) == 5\nassert distancia((1, 2, 3), (4, 6, 3)) == 5\nassert abs(distancia((0, 0, 0, 0), (1, 1, 1, 1)) - 2) < 1e-9\nassert tuple(punto_medio((0, 0), (4, 6))) == (2, 3)\nassert tuple(punto_medio((1, 1, 1), (3, 5, 7))) == (2, 3, 4)\nprint('OK')\n",
        solution: 'import math\n\ndef distancia(p, q):\n    return math.sqrt(sum((a - b) ** 2 for a, b in zip(p, q)))\n\ndef punto_medio(p, q):\n    return tuple((a + b) / 2 for a, b in zip(p, q))\n',
      },
      ia: { t: 'k-vecinos y clustering', p: 'El algoritmo <b>k-NN</b> clasifica un dato según la clase de los puntos más cercanos, y <b>k-means</b> agrupa asignando cada punto al centroide más cercano. Ambos son, en el fondo, la fórmula de distancia aplicada en un espacio de muchas dimensiones; el centroide es un "punto medio" de muchos puntos.' },
    },
    {
      id: 'recta', unit: 3, tema: '3.2', title: 'Ecuaciones de la recta',
      lesson: T`<p>Pendiente: $m=\dfrac{y_2-y_1}{x_2-x_1}$. Formas de la recta:</p>
<p>$$y-y_1=m(x-x_1)\ \text{(punto-pendiente)}\qquad y=mx+b\qquad Ax+By+C=0$$</p>
<p>Dos rectas son <b>paralelas</b> si $m_1=m_2$ y <b>perpendiculares</b> si $m_1m_2=-1$. Resolver un sistema de dos ecuaciones lineales equivale a hallar el punto donde se cortan las rectas.</p>`,
      formula: T`$m=\frac{\Delta y}{\Delta x}$, $y-y_1=m(x-x_1)$; perpendiculares: $m_1m_2=-1$.`,
      gen(d, R) {
        if (d === 1) { const m = R.nz(-4, 4), x1 = R.int(-4, 4), y1 = R.int(-4, 4), dx = R.int(1, 4);
          return E(T`Calcula la pendiente de la recta que pasa por $P(${x1},${y1})$ y $Q(${x1 + dx},${y1 + m * dx})$.`, 'num', m, T`$m=\frac{${m * dx}}{${dx}}=${m}$`); }
        if (d === 2) { const m = R.nz(-4, 4), x0 = R.int(-4, 4), y0 = R.int(-6, 6);
          return E(T`La recta $y=mx+b$ tiene pendiente $m=${m}$ y pasa por $(${x0},${y0})$. ¿Cuánto vale $b$?`, 'num', y0 - m * x0, T`$b=y_0-mx_0=${y0}-(${m})(${x0})=${y0 - m * x0}$`); }
        const m = R.pick([2, 4, -2, -4]), b = R.int(-5, 5), x0 = m * R.int(1, 3), y0 = R.int(-5, 5);
        return E(T`Sea $L:\ y=${m}x${cs(b)}$. ¿Cuál es la ordenada al origen de la recta perpendicular a $L$ que pasa por $(${x0},${y0})$?`, 'num', y0 + x0 / m,
          T`Pendiente perpendicular: $-\frac1{${m}}$. $b=y_0+\frac{x_0}{m}=${y0}+\frac{${x0}}{${m}}=${y0 + x0 / m}$`);
      },
      code: {
        prompt: 'Una recta $w\\cdot x+b=0$ separa el plano en dos lados: es un <b>clasificador lineal</b> (el perceptrón). Implementa <code>clasificar(w, b, x)</code> (devuelve 1 si $w\\cdot x+b\\ge0$, si no 0) y <code>distancia_a_recta(w, b, x)</code> = $|w\\cdot x+b|/\\|w\\|$.',
        starter: 'import math\n\ndef clasificar(w, b, x):\n    pass\n\ndef distancia_a_recta(w, b, x):\n    pass\n',
        tests: "assert clasificar((1, 1), -3, (2, 2)) == 1\nassert clasificar((1, 1), -3, (0, 0)) == 0\nassert clasificar((1, 1), -3, (1, 2)) == 1, 'Sobre la recta cuenta como 1'\nassert abs(distancia_a_recta((3, 4), -10, (0, 0)) - 2) < 1e-9\nassert abs(distancia_a_recta((1, 0), 0, (5, 7)) - 5) < 1e-9\nprint('OK')\n",
        solution: 'import math\n\ndef clasificar(w, b, x):\n    return 1 if sum(wi * xi for wi, xi in zip(w, x)) + b >= 0 else 0\n\ndef distancia_a_recta(w, b, x):\n    return abs(sum(wi * xi for wi, xi in zip(w, x)) + b) / math.sqrt(sum(wi * wi for wi in w))\n',
      },
      ia: { t: 'La recta es una neurona', p: 'La ecuación $Ax+By+C=0$ es un <b>perceptrón</b>: pesos $w=(A,B)$ y sesgo $C$. Regresión lineal ajusta una recta a datos, y las máquinas de vectores de soporte (SVM) buscan la recta que separa clases con el mayor margen, medido con la distancia de un punto a una recta.' },
    },
    {
      id: 'dpr', unit: 3, tema: '3.2.4', title: 'Distancia de un punto a una recta',
      lesson: T`<p>La distancia del punto $P(x_0,y_0)$ a la recta $Ax+By+C=0$ es</p>
<p>$$d=\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}$$</p>
<p>Entre dos rectas paralelas $Ax+By+C_1=0$ y $Ax+By+C_2=0$: $d=\dfrac{|C_1-C_2|}{\sqrt{A^2+B^2}}$.</p>`,
      formula: T`$d=\frac{|Ax_0+By_0+C|}{\sqrt{A^2+B^2}}$.`,
      gen(d, R) {
        if (d === 1) { const k = R.int(-5, 5), y0 = R.int(-5, 5);
          return E(T`Calcula la distancia del punto $(${R.int(-4, 4)},${y0})$ a la recta horizontal $y=${k}$.`, 'num', Math.abs(y0 - k), T`Solo importa la vertical: $|${y0}-${k}|=${Math.abs(y0 - k)}$`); }
        if (d === 2) { const C = R.nz(-10, 10), x0 = R.int(-4, 4), y0 = R.int(-4, 4), v = Math.abs(3 * x0 + 4 * y0 + C) / 5;
          return E(T`Calcula la distancia del punto $(${x0},${y0})$ a la recta $3x+4y${cs(C)}=0$ (2 decimales).`, 'num', v, T`$\frac{|3(${x0})+4(${y0})${cs(C)}|}{5}=${fmt(v)}$`, { tol: 0.01 }); }
        const [A, B] = R.pick([[3, 4], [5, 12], [6, 8]]), C1 = R.int(-10, 10); let C2 = R.int(-10, 10); if (C2 === C1) C2 += 5;
        const v = Math.abs(C1 - C2) / Math.hypot(A, B);
        return E(T`Calcula la distancia entre las rectas paralelas $${A}x+${B}y${cs(C1)}=0$ y $${A}x+${B}y${cs(C2)}=0$ (2 decimales).`, 'num', v, T`$\frac{|${C1}-(${C2})|}{\sqrt{${A * A + B * B}}}=${fmt(v)}$`, { tol: 0.01 });
      },
      code: null,
      ia: { t: 'El margen de una SVM', p: 'En una máquina de vectores de soporte el <b>margen</b> es el doble de la distancia de los puntos más cercanos a la recta (o hiperplano) de decisión. Maximizar el margen significa maximizar esta distancia; por eso la fórmula de $d$ es la que aparece al deducir el problema de optimización de la SVM.' },
    },
    {
      id: 'circ', unit: 3, tema: '3.3', title: 'Circunferencias',
      lesson: T`<p>Circunferencia de centro $(h,k)$ y radio $r$:</p>
<p>$$(x-h)^2+(y-k)^2=r^2$$</p>
<p>Forma general: $x^2+y^2+Dx+Ey+F=0$ con $h=-\tfrac D2$, $k=-\tfrac E2$ y $r^2=h^2+k^2-F$ (completando cuadrados). En polares, una circunferencia centrada en el origen es $\rho=r$.</p>`,
      formula: T`$(x-h)^2+(y-k)^2=r^2$; en la forma general $h=-D/2$, $k=-E/2$, $r^2=h^2+k^2-F$.`,
      gen(d, R) {
        const h = R.nz(-6, 6), k = R.nz(-6, 6), r = R.int(2, 9);
        const D = -2 * h, Ee = -2 * k, F = h * h + k * k - r * r;
        const gen = T`x^2+y^2${cs(D)}x${cs(Ee)}y${cs(F)}=0`;
        if (d === 1) return E(T`¿Cuál es el centro de la circunferencia $${sh(h, 'x')}^2+${sh(k, 'y')}^2=${r * r}$?`, 'vec', [h, k], T`Centro $(h,k)=(${h},${k})$`, { placeholder: '(h, k)' });
        if (d === 2) return E(T`Halla el centro de la circunferencia $${gen}$.`, 'vec', [h, k], T`$h=-\frac{D}{2}=${h}$, $k=-\frac{E}{2}=${k}$`, { placeholder: '(h, k)' });
        return E(T`Halla el radio de la circunferencia $${gen}$.`, 'num', r, T`Centro $(${h},${k})$; $r^2=${h * h}+${k * k}-(${F})=${r * r}$, así que $r=${r}$`);
      },
      code: null,
      ia: { t: 'Regiones de decisión y detección', p: 'Una circunferencia es el conjunto de puntos a distancia constante: un clasificador de "dentro/fuera" con frontera circular. Los detectores de objetos usan círculos y elipses para delimitar regiones, y los métodos de kernel RBF generan fronteras curvas a partir de distancias.' },
    },
    {
      id: 'parab', unit: 3, tema: '3.4.1', title: 'La parábola',
      lesson: T`<p>La <b>parábola</b> es el conjunto de puntos equidistantes de un foco $F$ y una recta directriz. Con vértice en el origen:</p>
<p>$$y^2=4px\ \ (\text{foco }(p,0))\qquad x^2=4py\ \ (\text{foco }(0,p))$$</p>
<p>Con vértice $(h,k)$: $(y-k)^2=4p(x-h)$, foco $(h+p,\,k)$. Si $p<0$ la parábola abre en sentido contrario.</p>`,
      formula: T`$y^2=4px$: foco $(p,0)$. $x^2=4py$: foco $(0,p)$. $(y-k)^2=4p(x-h)$: foco $(h+p,k)$.`,
      gen(d, R) {
        const p = R.nz(-5, 5);
        if (d === 1) return E(T`La parábola $y^2=${4 * p}x$ tiene foco en $(p,0)$. ¿Cuánto vale $p$?`, 'num', p, T`$4p=${4 * p}\Rightarrow p=${p}$`);
        if (d === 2) return E(T`Halla las coordenadas del foco de la parábola $x^2=${4 * p}y$.`, 'vec', [0, p], T`$4p=${4 * p}$, así que el foco es $(0,${p})$`, { placeholder: '(x, y)' });
        const h = R.int(-4, 4), k = R.int(-4, 4);
        return E(T`Halla el foco de la parábola $(y${off(k)})^2=${4 * p}${sh(h, 'x')}$.`, 'vec', [h + p, k], T`Vértice $(${h},${k})$, $4p=${4 * p}$, $p=${p}$. Foco: $(h+p,k)=(${h + p},${k})$`, { placeholder: '(x, y)' });
      },
      code: null,
      ia: { t: 'Parábolas en optimización', p: 'Cerca de un mínimo, una función suave se parece a una parábola (aproximación de Taylor de 2.º orden). Por eso la función de pérdida cuadrática $(y-\\hat y)^2$ es una parábola y el descenso de gradiente "baja" hasta su vértice. Las antenas y los reflectores parabólicos usan la propiedad del foco.' },
    },
    {
      id: 'elipse', unit: 3, tema: '3.4.2', title: 'La elipse',
      lesson: T`<p>La <b>elipse</b> es el conjunto de puntos cuya suma de distancias a dos focos es constante ($2a$). Con centro en el origen y $a>b$:</p>
<p>$$\frac{x^2}{a^2}+\frac{y^2}{b^2}=1,\qquad c^2=a^2-b^2,\qquad e=\frac ca<1$$</p>
<p>Los focos están en $(\pm c,0)$ y el área es $\pi ab$.</p>`,
      formula: T`$\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$, $c=\sqrt{a^2-b^2}$, $e=c/a$.`,
      gen(d, R) {
        if (d === 1) { const a = R.int(4, 9), b = R.int(2, a - 1);
          return E(T`En la elipse $\dfrac{x^2}{${a * a}}+\dfrac{y^2}{${b * b}}=1$, ¿cuánto mide el semieje mayor $a$?`, 'num', a, T`$a^2=${a * a}\Rightarrow a=${a}$`); }
        const [a, b, c] = R.pick([[5, 4, 3], [13, 12, 5], [5, 3, 4], [10, 8, 6], [10, 6, 8], [17, 15, 8]]);
        if (d === 2) return E(T`En la elipse $\dfrac{x^2}{${a * a}}+\dfrac{y^2}{${b * b}}=1$, ¿a qué distancia $c$ del centro están los focos?`, 'num', c, T`$c=\sqrt{${a * a}-${b * b}}=${c}$`);
        return E(T`Calcula la excentricidad de la elipse $\dfrac{x^2}{${a * a}}+\dfrac{y^2}{${b * b}}=1$ (2 decimales).`, 'num', c / a, T`$e=\frac ca=\frac{${c}}{${a}}=${fmt(c / a)}$`, { tol: 0.01 });
      },
      code: {
        prompt: 'Implementa <code>excentricidad(a, b)</code> (con $a>b$) y <code>en_elipse(x, y, a, b, tol=1e-9)</code> que diga si el punto está <b>sobre</b> la elipse $\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1$.',
        starter: 'import math\n\ndef excentricidad(a, b):\n    pass\n\ndef en_elipse(x, y, a, b, tol=1e-9):\n    pass\n',
        tests: "assert abs(excentricidad(5, 3) - 0.8) < 1e-9\nassert excentricidad(4, 4) == 0, 'Una circunferencia tiene e = 0'\nassert en_elipse(5, 0, 5, 3) is True\nassert en_elipse(0, 3, 5, 3) is True\nassert en_elipse(3, 2.4, 5, 3) is True\nassert en_elipse(1, 1, 5, 3) is False\nprint('OK')\n",
        solution: 'import math\n\ndef excentricidad(a, b):\n    return math.sqrt(a * a - b * b) / a\n\ndef en_elipse(x, y, a, b, tol=1e-9):\n    return abs(x * x / (a * a) + y * y / (b * b) - 1) <= tol\n',
      },
      ia: { t: 'Elipses en datos: covarianza y PCA', p: 'Los datos con distribución normal forman nubes elípticas: los ejes de la elipse son las direcciones del <b>PCA</b> y sus longitudes miden la varianza. Además, las órbitas planetarias son elipses y los filtros de seguimiento (Kalman) usan elipses de incertidumbre.' },
    },
    {
      id: 'transf', unit: 3, tema: '3.5', title: 'Transformaciones geométricas',
      lesson: T`<p>Transformaciones del plano:</p>
<ul><li><b>Traslación:</b> $(x,y)\mapsto(x+t_x,\,y+t_y)$</li>
<li><b>Reflexión</b> en el eje $x$: $(x,y)\mapsto(x,-y)$; en el eje $y$: $(-x,y)$; en $y=x$: $(y,x)$</li>
<li><b>Rotación</b> un ángulo $\theta$ respecto al origen:</li></ul>
<p>$$\begin{pmatrix}x'\\y'\end{pmatrix}=\begin{pmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}$$</p>
<p>La <b>homotecia</b> de razón $k$ multiplica ambas coordenadas por $k$.</p>`,
      formula: T`Rotación $90^\circ$: $(x,y)\mapsto(-y,x)$; $180^\circ$: $(-x,-y)$; $270^\circ$: $(y,-x)$.`,
      gen(d, R) {
        const x = R.int(-6, 6), y = R.int(-6, 6);
        if (d === 1) { const tx = R.int(-5, 5), ty = R.int(-5, 5);
          return E(T`Traslada el punto $(${x},${y})$ con el vector $(${tx},${ty})$. ¿Cuál es el punto resultante?`, 'vec', [x + tx, y + ty], T`$(${x}+${tx},\ ${y}+${ty})$`, { placeholder: '(x, y)' }); }
        if (d === 2) { const o = R.pick([['el eje $x$', [x, -y]], ['el eje $y$', [-x, y]], ['la recta $y=x$', [y, x]]]);
          return E(T`Refleja el punto $(${x},${y})$ respecto a ${o[0]}. ¿Cuál es la imagen?`, 'vec', o[1], T`Reflexión: $(${o[1][0]},${o[1][1]})$`, { placeholder: '(x, y)' }); }
        const g = R.pick([[90, [-y, x]], [180, [-x, -y]], [270, [y, -x]]]);
        return E(T`Rota el punto $(${x},${y})$ un ángulo de $${g[0]}^\circ$ en sentido antihorario alrededor del origen.`, 'vec', g[1], T`Con la matriz de rotación: $(${g[1][0]},${g[1][1]})$`, { placeholder: '(x, y)' });
      },
      code: {
        prompt: 'Implementa <code>trasladar(p, t)</code> y <code>rotar(p, grados)</code> (antihorario, alrededor del origen, usando $\\cos$ y $\\sin$). Así funcionan las transformaciones de imágenes en visión por computadora.',
        starter: 'import math\n\ndef trasladar(p, t):\n    pass\n\ndef rotar(p, grados):\n    pass\n',
        tests: "assert tuple(trasladar((1, 2), (3, -1))) == (4, 1)\nr = rotar((1, 0), 90)\nassert abs(r[0]) < 1e-9 and abs(r[1] - 1) < 1e-9, 'Rotar (1,0) 90 grados da (0,1)'\nr = rotar((2, 3), 180)\nassert abs(r[0] + 2) < 1e-9 and abs(r[1] + 3) < 1e-9\nr = rotar((1, 1), 45)\nassert abs(r[0]) < 1e-9 and abs(r[1] - 2 ** 0.5) < 1e-9\nprint('OK')\n",
        solution: 'import math\n\ndef trasladar(p, t):\n    return (p[0] + t[0], p[1] + t[1])\n\ndef rotar(p, grados):\n    a = math.radians(grados)\n    return (p[0] * math.cos(a) - p[1] * math.sin(a), p[0] * math.sin(a) + p[1] * math.cos(a))\n',
      },
      ia: { t: 'Aumento de datos y visión por computadora', p: 'Para entrenar modelos de imágenes se aplican rotaciones, reflexiones, traslaciones y escalas a las fotos (<i>data augmentation</i>) y así tener más ejemplos. Todas son transformaciones del plano como las que acabas de calcular, aplicadas a cada píxel mediante una matriz.' },
    },

    /* ================= UNIDAD 4 ================= */
    {
      id: 'ops', unit: 4, tema: '4.1, 4.3.1', title: 'Operaciones con vectores y vectores unitarios',
      lesson: T`<p>Un vector $\vec v=(v_1,\dots,v_n)$ se suma y se resta componente a componente, y se multiplica por un escalar: $c\vec v=(cv_1,\dots,cv_n)$. Su <b>norma</b> es $\|\vec v\|=\sqrt{v_1^2+\cdots+v_n^2}$ y el <b>vector unitario</b> en su dirección es</p>
<p>$$\hat v=\frac{\vec v}{\|\vec v\|}$$</p>`,
      formula: T`$\vec u\pm\vec v$ componente a componente; $\hat v=\vec v/\|\vec v\|$.`,
      gen(d, R) {
        if (d === 1) { const u = [R.int(-6, 6), R.int(-6, 6)], v = [R.int(-6, 6), R.int(-6, 6)];
          return E(T`Si $\vec u=${tv(u)}$ y $\vec v=${tv(v)}$, calcula $\vec u+\vec v$.`, 'vec', [u[0] + v[0], u[1] + v[1]], T`$(${u[0]}+${v[0]},\ ${u[1]}+${v[1]})$`, { placeholder: '(x, y)' }); }
        if (d === 2) { const u = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], v = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], s = R.int(2, 3), t = R.int(2, 3);
          return E(T`Si $\vec u=${tv(u)}$ y $\vec v=${tv(v)}$, calcula $${s}\vec u-${t}\vec v$.`, 'vec', u.map((x, i) => s * x - t * v[i]), T`$${s}\vec u=${tv(u.map((x) => s * x))}$ y $${t}\vec v=${tv(v.map((x) => t * x))}$`, { placeholder: '(x, y, z)' }); }
        const v0 = R.pick([[2, 3, 6], [1, 4, 8], [2, 6, 9], [3, 4, 12]]), n = norm(v0), v = v0.map((x) => x * R.sign());
        return E(T`Halla el vector unitario en la dirección de $\vec v=${tv(v)}$ (2 decimales por componente).`, 'vec', v.map((x) => x / n), T`$\|\vec v\|=${n}$, así que $\hat v=\frac1{${n}}${tv(v)}$`, { tol: 0.01, placeholder: '(x, y, z)' });
      },
      code: null,
      ia: { t: 'Vectores = datos', p: 'En IA todo dato es un vector: una imagen de $28\\times28$ es un vector de 784 números; una palabra, un <i>embedding</i> de cientos de componentes. Normalizar (dividir por la norma) es un paso estándar de preprocesamiento: hace que solo importe la dirección, no la magnitud.' },
    },
    {
      id: 'punto', unit: 4, tema: '4.1.2.4, 4.2', title: 'Producto escalar y ortogonalidad',
      lesson: T`<p>El <b>producto escalar</b> de $\vec u$ y $\vec v$ es</p>
<p>$$\vec u\cdot\vec v=u_1v_1+\cdots+u_nv_n=\|\vec u\|\,\|\vec v\|\cos\theta$$</p>
<p>Dos vectores son <b>ortogonales</b> (perpendiculares) si y solo si $\vec u\cdot\vec v=0$.</p>`,
      formula: T`$\vec u\cdot\vec v=\sum u_iv_i$; ortogonales $\Leftrightarrow\ \vec u\cdot\vec v=0$.`,
      gen(d, R) {
        if (d === 1) { const u = [R.int(-5, 5), R.int(-5, 5)], v = [R.int(-5, 5), R.int(-5, 5)];
          return E(T`Calcula $\vec u\cdot\vec v$ si $\vec u=${tv(u)}$ y $\vec v=${tv(v)}$.`, 'num', dot(u, v), T`$${u[0]}\cdot${v[0]}+${u[1]}\cdot${v[1]}=${dot(u, v)}$`); }
        if (d === 2) { const u = [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)], v = [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)];
          return E(T`Calcula $\vec u\cdot\vec v$ si $\vec u=${tv(u)}$ y $\vec v=${tv(v)}$.`, 'num', dot(u, v), T`Suma de productos componente a componente: $${dot(u, v)}$`); }
        const b = R.int(-3, 3), k = R.int(-4, 4), dd = R.int(-3, 3), e = R.nz(-3, 3), c = -(b * dd + k * e);
        return E(T`¿Para qué valor de $k$ son ortogonales $\vec u=(1,${b},k)$ y $\vec v=(${c},${dd},${e})$?`, 'num', k, T`$${c}+${b * dd}+${e}k=0\Rightarrow k=${k}$`);
      },
      code: {
        prompt: 'Implementa <code>producto_punto(u, v)</code>, <code>norma(u)</code> y <code>similitud_coseno(u, v)</code> $=\\dfrac{u\\cdot v}{\\|u\\|\\|v\\|}$. Esta última es la medida que usan los buscadores semánticos y los modelos de lenguaje para comparar textos.',
        starter: 'import math\n\ndef producto_punto(u, v):\n    pass\n\ndef norma(u):\n    pass\n\ndef similitud_coseno(u, v):\n    pass\n',
        tests: "assert producto_punto((1, 2, 3), (4, 5, 6)) == 32\nassert norma((3, 4)) == 5\nassert similitud_coseno((1, 0), (0, 1)) == 0\nassert abs(similitud_coseno((1, 1), (2, 2)) - 1) < 1e-9\nassert abs(similitud_coseno((1, 2, 3), (-1, -2, -3)) + 1) < 1e-9\nprint('OK')\n",
        solution: 'import math\n\ndef producto_punto(u, v):\n    return sum(a * b for a, b in zip(u, v))\n\ndef norma(u):\n    return math.sqrt(producto_punto(u, u))\n\ndef similitud_coseno(u, v):\n    return producto_punto(u, v) / (norma(u) * norma(v))\n',
      },
      ia: { t: 'Similitud coseno y embeddings', p: 'Un modelo de lenguaje convierte cada texto en un vector (<i>embedding</i>). Dos textos se parecen cuando el <b>coseno</b> del ángulo entre sus vectores es cercano a 1. Cada neurona de una red calcula un producto escalar $w\\cdot x+b$, así que una red neuronal es, en esencia, productos escalares encadenados.' },
    },
    {
      id: 'angulo', unit: 4, tema: '4.2, 4.3.2', title: 'Magnitud y ángulo entre vectores',
      lesson: T`<p>De la fórmula del producto escalar se despeja el ángulo:</p>
<p>$$\cos\theta=\frac{\vec u\cdot\vec v}{\|\vec u\|\,\|\vec v\|}$$</p>
<p>Si $\vec u\cdot\vec v>0$ el ángulo es <b>agudo</b>; si es $<0$, <b>obtuso</b>; si es $0$, <b>recto</b>. Los <b>ángulos directores</b> de $\vec v$ son los que forma con los ejes: $\cos\alpha=\frac{v_x}{\|\vec v\|}$, etc.</p>`,
      formula: T`$\cos\theta=\frac{\vec u\cdot\vec v}{\|\vec u\|\|\vec v\|}$; el signo del producto escalar decide si el ángulo es agudo, recto u obtuso.`,
      gen(d, R) {
        if (d === 1) { const t = R.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), s = R.sign(), s2 = R.sign();
          return E(T`Calcula la magnitud de $\vec v=(${s * t[0]},${s2 * t[1]})$.`, 'num', t[2], T`$\sqrt{${t[0] ** 2}+${t[1] ** 2}}=${t[2]}$`); }
        if (d === 2) { let u = [R.nz(-5, 5), R.nz(-5, 5)], v;
          if (R.rand() < 0.3) { const m = R.nz(-3, 3); v = [-u[1] * m, u[0] * m]; } else v = [R.nz(-5, 5), R.nz(-5, 5)];
          const p = dot(u, v);
          return E(T`Sean $\vec u=${tv(u)}$ y $\vec v=${tv(v)}$. El ángulo entre ellos es...`, 'mc', p > 0 ? 0 : p < 0 ? 1 : 2, T`$\vec u\cdot\vec v=${p}$`, { options: ['Agudo', 'Obtuso', 'Recto (son ortogonales)'] }); }
        const k = R.int(1, 5), m = R.int(1, 5), c = R.pick([[[k, 0], [m, m]], [[k, 0], [-m, m]], [[k, k], [-m, m]]]);
        const ang = (Math.acos(dot(c[0], c[1]) / (norm(c[0]) * norm(c[1]))) * 180) / Math.PI;
        return E(T`Calcula el ángulo en grados entre $\vec u=${tv(c[0])}$ y $\vec v=${tv(c[1])}$.`, 'num', ang, T`$\cos\theta=\frac{${dot(c[0], c[1])}}{${fmt(norm(c[0]) * norm(c[1]))}}$, así que $\theta=${fmt(ang)}^\circ$`, { tol: 0.5 });
      },
      code: null,
      ia: { t: 'Ángulos y cosenos en búsqueda semántica', p: 'La <b>distancia coseno</b> $1-\\cos\\theta$ se usa para recuperar documentos, recomendar productos y comparar rostros. Mide ángulos, no longitudes, así que ignora si un documento es más largo que otro.' },
    },
    {
      id: 'proy', unit: 4, tema: '4.3.3', title: 'Proyección ortogonal y componente',
      lesson: T`<p>La <b>componente</b> escalar de $\vec v$ sobre $\vec u$ y la <b>proyección</b> vectorial son</p>
<p>$$\text{comp}_{\vec u}\vec v=\frac{\vec u\cdot\vec v}{\|\vec u\|}\qquad \text{proy}_{\vec u}\vec v=\frac{\vec u\cdot\vec v}{\vec u\cdot\vec u}\,\vec u$$</p>
<p>Proyectar es "quedarse con la parte de $\vec v$ que va en la dirección de $\vec u$".</p>`,
      formula: T`$\text{comp}=\frac{u\cdot v}{\|u\|}$ y $\text{proy}=\frac{u\cdot v}{u\cdot u}\,u$.`,
      gen(d, R) {
        if (d === 1) { const u = R.pick([[3, 4], [5, 12]]), v = [R.int(-5, 5), R.int(-5, 5)], c = dot(u, v) / norm(u);
          return E(T`Calcula la componente escalar de $\vec v=${tv(v)}$ sobre $\vec u=${tv(u)}$ (2 decimales).`, 'num', c, T`$\frac{${dot(u, v)}}{${norm(u)}}=${fmt(c)}$`, { tol: 0.01 }); }
        if (d === 2) { const u = R.pick([[1, 0], [0, 2], [1, 1], [2, 2], [3, 4]]), v = [R.int(-5, 5), R.int(-5, 5)], k = dot(u, v) / dot(u, u);
          return E(T`Calcula $\text{proy}_{\vec u}\vec v$ si $\vec u=${tv(u)}$ y $\vec v=${tv(v)}$ (2 decimales).`, 'vec', u.map((x) => k * x), T`$\frac{${dot(u, v)}}{${dot(u, u)}}${tv(u)}$`, { tol: 0.01, placeholder: '(x, y)' }); }
        const u = R.pick([[1, 2, 2], [2, 3, 6], [1, 1, 1], [2, 2, 1]]), v = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], k = dot(u, v) / dot(u, u);
        return E(T`Calcula $\text{proy}_{\vec u}\vec v$ si $\vec u=${tv(u)}$ y $\vec v=${tv(v)}$ (2 decimales).`, 'vec', u.map((x) => k * x), T`$\frac{${dot(u, v)}}{${dot(u, u)}}${tv(u)}$`, { tol: 0.01, placeholder: '(x, y, z)' });
      },
      code: {
        prompt: 'Implementa <code>proyeccion(u, v)</code> que devuelva (como tupla) la proyección ortogonal de $v$ sobre $u$. Es la operación básica del <b>método de Gram–Schmidt</b> y de los mínimos cuadrados.',
        starter: 'def proyeccion(u, v):\n    pass\n',
        tests: "def casi(a, b):\n    return len(a) == len(b) and all(abs(x - y) < 1e-9 for x, y in zip(a, b))\nassert casi(proyeccion((1, 0), (3, 4)), (3, 0))\nassert casi(proyeccion((1, 1), (2, 0)), (1, 1))\nassert casi(proyeccion((0, 2, 0), (5, 7, 1)), (0, 7, 0))\nassert casi(proyeccion((1, 2, 2), (0, 0, 0)), (0, 0, 0))\nprint('OK')\n",
        solution: 'def proyeccion(u, v):\n    k = sum(a * b for a, b in zip(u, v)) / sum(a * a for a in u)\n    return tuple(k * a for a in u)\n',
      },
      ia: { t: 'Mínimos cuadrados y PCA', p: 'Ajustar una recta a datos por mínimos cuadrados es <b>proyectar</b> el vector de resultados sobre el espacio generado por las variables. El PCA proyecta los datos sobre las direcciones de mayor varianza para reducir dimensiones sin perder lo esencial.' },
    },
    {
      id: 'cruz', unit: 4, tema: '4.1.2.4', title: 'Producto vectorial',
      lesson: T`<p>En $\mathbb R^3$ el <b>producto vectorial</b> $\vec u\times\vec v$ es un vector perpendicular a ambos:</p>
<p>$$\vec u\times\vec v=\begin{vmatrix}\hat\imath&\hat\jmath&\hat k\\u_1&u_2&u_3\\v_1&v_2&v_3\end{vmatrix}=(u_2v_3-u_3v_2,\ u_3v_1-u_1v_3,\ u_1v_2-u_2v_1)$$</p>
<p>Su magnitud es $\|\vec u\|\|\vec v\|\sin\theta$ y es <b>anticonmutativo</b>: $\vec v\times\vec u=-(\vec u\times\vec v)$.</p>`,
      formula: T`$\vec u\times\vec v=(u_2v_3-u_3v_2,\ u_3v_1-u_1v_3,\ u_1v_2-u_2v_1)$.`,
      gen(d, R) {
        if (d === 1) { const u = [R.int(-5, 5), R.int(-5, 5)], v = [R.int(-5, 5), R.int(-5, 5)];
          return E(T`Para $\vec u=${tv(u)}$ y $\vec v=${tv(v)}$ vistos en $\mathbb R^3$ con $z=0$, el producto $\vec u\times\vec v$ solo tiene componente $z$. ¿Cuánto vale?`, 'num', u[0] * v[1] - u[1] * v[0], T`$u_1v_2-u_2v_1=${u[0] * v[1] - u[1] * v[0]}$`); }
        if (d === 2) { const u = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)], v = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)];
          return E(T`Calcula $\vec u\times\vec v$ si $\vec u=${tv(u)}$ y $\vec v=${tv(v)}$.`, 'vec', cross(u, v), T`Con el determinante: $${tv(cross(u, v))}$`, { placeholder: '(x, y, z)' }); }
        let w; do { w = [R.int(-5, 5), R.int(-5, 5), R.int(-5, 5)]; } while (w.every((x) => x === 0));
        return E(T`Si $\vec u\times\vec v=${tv(w)}$, ¿cuánto vale $\vec v\times\vec u$?`, 'vec', w.map((x) => -x), T`Anticonmutatividad: $\vec v\times\vec u=-(\vec u\times\vec v)$`, { placeholder: '(x, y, z)' });
      },
      code: {
        prompt: 'Implementa <code>producto_cruz(u, v)</code> en $\\mathbb R^3$ y <code>area_triangulo(a, b, c)</code> con tres puntos del espacio (usa $\\tfrac12\\|\\overrightarrow{AB}\\times\\overrightarrow{AC}\\|$).',
        starter: 'import math\n\ndef producto_cruz(u, v):\n    pass\n\ndef area_triangulo(a, b, c):\n    pass\n',
        tests: "assert tuple(producto_cruz((1, 0, 0), (0, 1, 0))) == (0, 0, 1)\nassert tuple(producto_cruz((1, 2, 3), (4, 5, 6))) == (-3, 6, -3)\nassert abs(area_triangulo((0, 0, 0), (4, 0, 0), (0, 3, 0)) - 6) < 1e-9\nassert abs(area_triangulo((1, 1, 1), (2, 1, 1), (1, 2, 1)) - 0.5) < 1e-9\nprint('OK')\n",
        solution: 'import math\n\ndef producto_cruz(u, v):\n    return (u[1]*v[2] - u[2]*v[1], u[2]*v[0] - u[0]*v[2], u[0]*v[1] - u[1]*v[0])\n\ndef area_triangulo(a, b, c):\n    ab = tuple(y - x for x, y in zip(a, b))\n    ac = tuple(y - x for x, y in zip(a, c))\n    w = producto_cruz(ab, ac)\n    return 0.5 * math.sqrt(sum(x * x for x in w))\n',
      },
      ia: { t: 'Normales en gráficos 3D y robótica', p: 'En gráficos por computadora y visión 3D el vector normal de una superficie se obtiene con el producto vectorial de dos aristas; sirve para calcular la iluminación. En robótica el producto vectorial describe rotaciones y torques.' },
    },
    {
      id: 'areas', unit: 4, tema: '4.4', title: 'Área de triángulos y paralelogramos',
      lesson: T`<p>El área del paralelogramo que generan $\vec u$ y $\vec v$ es $\|\vec u\times\vec v\|$ (en el plano, $|u_1v_2-u_2v_1|$) y la del triángulo es la mitad:</p>
<p>$$A_{\text{par}}=\|\vec u\times\vec v\|\qquad A_{\triangle ABC}=\tfrac12\|\overrightarrow{AB}\times\overrightarrow{AC}\|$$</p>`,
      formula: T`$A_{\text{paralelogramo}}=\|\vec u\times\vec v\|$, $A_{\triangle}=\frac12\|\overrightarrow{AB}\times\overrightarrow{AC}\|$.`,
      gen(d, R) {
        const det = (u, v) => u[0] * v[1] - u[1] * v[0];
        if (d === 1) { let u, v; do { u = [R.int(-5, 5), R.int(-5, 5)]; v = [R.int(-5, 5), R.int(-5, 5)]; } while (det(u, v) === 0);
          return E(T`Calcula el área del paralelogramo generado por $\vec u=${tv(u)}$ y $\vec v=${tv(v)}$.`, 'num', Math.abs(det(u, v)), T`$|${u[0]}\cdot${v[1]}-${u[1]}\cdot${v[0]}|=${Math.abs(det(u, v))}$`); }
        if (d === 2) { let A, B, Cc, a; do { A = [R.int(-4, 4), R.int(-4, 4)]; B = [R.int(-4, 4), R.int(-4, 4)]; Cc = [R.int(-4, 4), R.int(-4, 4)]; a = Math.abs(det([B[0] - A[0], B[1] - A[1]], [Cc[0] - A[0], Cc[1] - A[1]])) / 2; } while (a === 0);
          return E(T`Calcula el área del triángulo de vértices $A${tv(A)}$, $B${tv(B)}$ y $C${tv(Cc)}$.`, 'num', a, T`$\tfrac12|\overrightarrow{AB}\times\overrightarrow{AC}|=${fmt(a)}$`, { tol: 0.01 }); }
        let A, B, Cc, a; do { A = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)]; B = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)]; Cc = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)];
          a = norm(cross(B.map((x, i) => x - A[i]), Cc.map((x, i) => x - A[i]))) / 2; } while (a === 0);
        return E(T`Calcula el área del triángulo de vértices $A${tv(A)}$, $B${tv(B)}$ y $C${tv(Cc)}$ en el espacio (2 decimales).`, 'num', a, T`$\tfrac12\|\overrightarrow{AB}\times\overrightarrow{AC}\|\approx${fmt(a)}$`, { tol: 0.01 });
      },
      code: null,
      ia: { t: 'Áreas y mallas 3D', p: 'Los modelos 3D se guardan como mallas de miles de triángulos; el área de cada uno (con el producto vectorial) se usa para estimar la superficie de un objeto, repartir puntos al muestrear nubes de puntos o calcular la fuerza de la luz en un render.' },
    },
    {
      id: 'vol', unit: 4, tema: '4.5, 4.6', title: 'Volumen de paralelepípedos',
      lesson: T`<p>El volumen del paralelepípedo generado por $\vec u,\vec v,\vec w$ es el valor absoluto del <b>producto mixto</b>:</p>
<p>$$V=|\vec u\cdot(\vec v\times\vec w)|=\left|\det\begin{pmatrix}u_1&u_2&u_3\\v_1&v_2&v_3\\w_1&w_2&w_3\end{pmatrix}\right|$$</p>
<p>El tetraedro que forman tiene volumen $V/6$. Si $V=0$ los tres vectores están en un mismo plano.</p>`,
      formula: T`$V=|\vec u\cdot(\vec v\times\vec w)|$; tetraedro: $V/6$.`,
      gen(d, R) {
        if (d === 1) { const a = R.int(1, 5), b = R.int(1, 5), c = R.int(1, 5);
          return E(T`Calcula el volumen del paralelepípedo generado por $\vec u=(${a},0,0)$, $\vec v=(0,${b},0)$ y $\vec w=(0,0,${c})$.`, 'num', a * b * c, T`Es una caja: $${a}\cdot${b}\cdot${c}=${a * b * c}$`); }
        let u, v, w, t;
        do { u = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)]; v = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)]; w = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)]; t = Math.abs(triple(u, v, w)); } while (t === 0);
        if (d === 2) return E(T`Calcula el volumen del paralelepípedo generado por $\vec u=${tv(u)}$, $\vec v=${tv(v)}$ y $\vec w=${tv(w)}$.`, 'num', t, T`$|\vec u\cdot(\vec v\times\vec w)|=${t}$`);
        return E(T`Calcula el volumen del tetraedro cuyas aristas desde un vértice son $\vec u=${tv(u)}$, $\vec v=${tv(v)}$ y $\vec w=${tv(w)}$ (2 decimales).`, 'num', t / 6, T`$\frac16|\vec u\cdot(\vec v\times\vec w)|=\frac{${t}}{6}=${fmt(t / 6)}$`, { tol: 0.01 });
      },
      code: {
        prompt: 'Implementa <code>volumen_paralelepipedo(u, v, w)</code> usando el determinante $3\\times3$ (producto mixto). Después, con tu función, verifica si cuatro puntos son <b>coplanares</b> (volumen 0).',
        starter: 'def volumen_paralelepipedo(u, v, w):\n    pass\n',
        tests: "assert volumen_paralelepipedo((1, 0, 0), (0, 2, 0), (0, 0, 3)) == 6\nassert volumen_paralelepipedo((1, 2, 3), (0, 1, 4), (5, 6, 0)) == 1\nassert volumen_paralelepipedo((1, 0, 0), (0, 1, 0), (1, 1, 0)) == 0, 'Son coplanares'\nassert volumen_paralelepipedo((0, 0, 3), (0, 2, 0), (1, 0, 0)) == 6, 'El volumen no es negativo'\nprint('OK')\n",
        solution: 'def volumen_paralelepipedo(u, v, w):\n    d = (u[0] * (v[1] * w[2] - v[2] * w[1])\n         - u[1] * (v[0] * w[2] - v[2] * w[0])\n         + u[2] * (v[0] * w[1] - v[1] * w[0]))\n    return abs(d)\n',
      },
      ia: { t: 'Determinantes y transformaciones de volumen', p: 'El determinante mide cuánto una transformación lineal estira o encoge el volumen. Aparece en los <i>normalizing flows</i> (modelos generativos), en el cambio de variables de las integrales y en detectar si un conjunto de variables es linealmente dependiente.' },
    },
  ];

  UNITS.forEach((u) => (u.skills = SKILLS.filter((s) => s.unit === u.n).map((s) => s.id)));
  root.PLAT = { UNITS, SKILLS };
  if (typeof module !== 'undefined') module.exports = root.PLAT;
})(typeof window !== 'undefined' ? window : globalThis);
