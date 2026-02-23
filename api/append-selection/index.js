/**
 * Azure Function para adicionar seleção
 * Usa módulo https nativo do Node
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Helper para fazer requisições HTTP/HTTPS
function httpRequest(urlString, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const protocol = url.protocol === 'https:' ? https : http;
    
    const reqOptions = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = protocol.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          text: () => Promise.resolve(data),
          json: () => Promise.resolve(data ? JSON.parse(data) : null)
        });
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
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
    context.log.warn('BLOB_CONTAINER_SAS_URL não configurado');
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
    const body = req.body;
    
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
    const getRes = await httpRequest(blobUrl);
    if (getRes.ok) {
      const data = await getRes.json();
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
    const putRes = await httpRequest(blobUrl, {
      method: 'PUT',
      headers: {
        'x-ms-blob-type': 'BlockBlob',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ selections })
    });

    if (!putRes.ok) {
      const errorText = await putRes.text();
      throw new Error(`Blob write error: ${putRes.status} - ${errorText}`);
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
