// Archivo: /api/trends.js
const trends = require('google-trends-api');

export default async function handler(request, response) {
  const keywords = request.query.q;
  const geo = request.query.geo || 'ES'; // Permite especificar geo, por defecto 'ES'

  if (!keywords) {
    return response.status(400).json({ error: 'El parámetro "q" con las keywords es obligatorio.' });
  }

  try {
    const results = await trends.interestOverTime({
      keyword: keywords.split(','),
      startTime: new Date(Date.now() - (7 * 24 * 60 * 60 * 1000)), // Últimos 7 días
      geo: geo,
    });

    // Añadimos cabeceras para permitir el acceso desde cualquier origen (CORS)
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    return response.status(200).json(JSON.parse(results));

  } catch (err) {
    return response.status(500).json({ error: err.message });
  }
}
