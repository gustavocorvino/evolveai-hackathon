/**
 * Azure Function para gerenciar seleções no Blob Storage
 * GET - Retorna todas as seleções
 * POST - Adiciona/atualiza uma seleção
 * DELETE - Remove uma seleção
 */

const https = require('https');
const { URL } = require('url');

// Helper para fazer requisições HTTPS
function httpsRequest(urlString, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    
    const reqOptions = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: options.headers || {}
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
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // CORS preflight
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers };
    return;
  }

  // Fallback se Blob não configurado
  if (!containerSas) {
    context.res = {
      status: 200,
      headers,
      body: { success: true, source: 'fallback', selections: {} }
    };
    return;
  }

  // Montar URL do blob
  const idx = containerSas.indexOf('?');
  const baseUrl = idx === -1 ? containerSas : containerSas.substring(0, idx);
  const sasToken = idx === -1 ? '' : containerSas.substring(idx);
  const blobUrl = `${baseUrl}/${blobName}${sasToken}`;

  try {
    // GET - Retorna todas as seleções
    if (req.method === 'GET') {
      const response = await httpsRequest(blobUrl);
      
      if (response.status === 404) {
        context.res = {
          status: 200,
          headers,
          body: { success: true, source: 'blob', selections: {} }
        };
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Blob read error: ${response.status}`);
      }
      
      const data = response.data ? JSON.parse(response.data) : {};
      context.res = {
        status: 200,
        headers,
        body: { success: true, source: 'blob', selections: data.selections || data || {} }
      };
      return;
    }

    // POST - Adiciona/atualiza seleção
    if (req.method === 'POST') {
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

      // Adicionar/atualizar seleção
      selections[body.useCaseId] = {
        visitorId: body.visitorId || body.visitorEmail || 'anonymous',
        visitorName: body.visitorName || 'Anônimo',
        visitorEmail: body.visitorEmail || '',
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
        body: { success: true, selections }
      };
      return;
    }

    // DELETE - Remove seleção
    if (req.method === 'DELETE') {
      const useCaseId = req.query.useCaseId || (req.body && req.body.useCaseId);
      
      if (!useCaseId) {
        context.res = {
          status: 400,
          headers,
          body: { error: 'useCaseId é obrigatório' }
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

      // Remover seleção
      delete selections[useCaseId];

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
        throw new Error(`Blob write error: ${putRes.status}`);
      }

      context.res = {
        status: 200,
        headers,
        body: { success: true, selections }
      };
      return;
    }

    context.res = {
      status: 405,
      headers,
      body: { error: 'Method not allowed' }
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
