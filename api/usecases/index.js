/**
 * Azure Function para casos de uso
 * GET - Retorna indicação para usar arquivo estático
 * 
 * Os casos de uso são carregados de /data/usecases.json (arquivo estático)
 * Esta API existe apenas para compatibilidade
 */

module.exports = async function (context, req) {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // CORS preflight
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers };
    return;
  }

  // GET - Indica para usar arquivo estático
  if (req.method === 'GET') {
    context.res = {
      status: 200,
      headers,
      body: {
        success: true,
        source: 'static',
        message: 'Use /data/usecases.json para carregar os casos de uso',
        useCases: []
      }
    };
    return;
  }

  context.res = {
    status: 405,
    headers,
    body: { error: 'Method not allowed' }
  };
};
