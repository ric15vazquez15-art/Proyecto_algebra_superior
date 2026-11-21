// Función serverless (Vercel) para el tutor IA. La API key vive SOLO aquí, nunca en el navegador.
// Despliegue: sube la carpeta a Vercel, define la variable de entorno ANTHROPIC_API_KEY,
// y pon la URL (https://TU-PROYECTO.vercel.app/api/tutor) en window.TUTOR_ENDPOINT de index.html.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ reply: 'Método no permitido' });

  const { mode, skill, prompt, userAnswer, solution } = req.body || {};
  const system = [
    'Eres un tutor de Álgebra superior y geometría analítica para estudiantes de primer semestre de Ingeniería en Inteligencia Artificial.',
    'Responde en español, breve (máximo 120 palabras) y con tono amable.',
    'NUNCA reveles la respuesta final de un ejercicio: da una pista o haz una pregunta que guíe al alumno al siguiente paso.',
    'Si el alumno escribió código, señala el tipo de error y dónde mirar, sin escribir la solución completa.',
    'Si te piden una aplicación en IA, da un ejemplo concreto y corto.',
  ].join(' ');
  const user = `Modo: ${mode}\nTema: ${skill}\nEnunciado: ${String(prompt).slice(0, 1500)}\nRespuesta/código del alumno: ${String(userAnswer || '').slice(0, 3000)}\n(Solución de referencia, solo para ti: ${String(solution || '').slice(0, 800)})`;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-sonnet-5-5', max_tokens: 400, system, messages: [{ role: 'user', content: user }] }),
    });
    const data = await r.json();
    res.status(200).json({ reply: (data.content && data.content[0] && data.content[0].text) || 'No pude generar una respuesta.' });
  } catch (e) {
    res.status(500).json({ reply: 'Error del servidor del tutor.' });
  }
}
