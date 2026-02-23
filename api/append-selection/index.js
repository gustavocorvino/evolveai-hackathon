/**
 * Azure Function para adicionar seleção
 * POST - Adiciona uma seleção ao Blob Storage
 */

const https = require('https');
const { URL } = require('url');

// Helper para fazer requisições HTTPS
function httpsRequest(urlString, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    
    // Calcular Content-Length para evitar Transfer-Encoding: chunked
    const bodyBuffer = options.body ? Buffer.from(options.body, 'utf8') : null;
    
    const reqHeaders = { ...options.headers };
    if (bodyBuffer) {
      reqHeaders['Content-Length'] = bodyBuffer.length;
    }
    
    const reqOptions = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: reqHeaders
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          data: data
        });
      });
    });

    req.on('error', reject);
    
    if (bodyBuffer) {
      req.write(bodyBuffer);
    }
    req.end();
  });
}

module.exports = async function (context, req) {
  const containerSas = process.env.BLOB_CONTAINER_SAS_URL;
  const blobName = 'selections.json';

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // CORS preflight
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers };
    return;
  }

  if (req.method !== 'POST') {
    context.res = { status: 405, headers, body: { error: 'Method not allowed' } };
    return;
  }

  // Fallback se Blob não configurado
  if (!containerSas) {
    context.res = {
      status: 200,
      headers,
      body: { success: true, source: 'fallback', message: 'Storage não configurado' }
    };
    return;
  }

  // Montar URL do blob
  const idx = containerSas.indexOf('?');
  const baseUrl = idx === -1 ? containerSas : containerSas.substring(0, idx);
  const sasToken = idx === -1 ? '' : containerSas.substring(idx);
  const blobUrl = `${baseUrl}/${blobName}${sasToken}`;

  try {
    // Parsear body (pode vir como string ou objeto)
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }
    
    if (!body || !body.useCaseId) {
      context.res = {
        status: 400,
        headers,
        body: { error: 'Body deve conter useCaseId' }
      };
      return;
    }

    // Buscar seleções existentes
    let selections = {};
    const getRes = await httpsRequest(blobUrl);
    if (getRes.ok && getRes.data) {
      const data = JSON.parse(getRes.data);
      selections = data.selections || data || {};
    }

    // Adicionar seleção
    selections[body.useCaseId] = {
      visitorId: body.visitorId || body.visitorEmail || 'anonymous',
      visitorName: body.visitorName || body.name || 'Anônimo',
      visitorEmail: body.visitorEmail || body.email || '',
      timestamp: new Date().toISOString()
    };

    // Salvar no blob
    const putRes = await httpsRequest(blobUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ selections })
    });

    if (!putRes.ok) {
      throw new Error(`Blob write error: ${putRes.status} - ${putRes.data}`);
    }

    context.res = {
      status: 200,
      headers,
      body: { success: true, source: 'blob', message: 'Seleção salva com sucesso' }
    };

  } catch (error) {
    context.log.error('Erro:', error.message);
    context.res = {
      status: 500,
      headers,
      body: { error: error.message }
    };
  }
};
