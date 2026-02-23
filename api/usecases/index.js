/**
 * Azure Function para retornar casos de uso
 * MODO SIMPLIFICADO: Redireciona para arquivo estático
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

  // GET - Redireciona para arquivo estático
  if (req.method === 'GET') {
    context.res = {
      status: 200,
      headers,
      body: {
        success: true,
        source: 'static',
        message: 'Use /data/usecases.json para dados. API retorna vazio.',
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
  return;
  
  // === CÓDIGO ABAIXO DESATIVADO - BLOB STORAGE NÃO CONFIGURADO ===
  const containerSas = process.env.BLOB_CONTAINER_SAS_URL;
  const blobName = process.env.USECASES_BLOB_NAME || 'data/usecases.json';

  // Se Blob não configurado, usar dados estáticos de fallback
  if (!containerSas) {
    context.log.warn('BLOB_CONTAINER_SAS_URL não configurado - usando modo fallback');
    
    if (req.method === 'GET') {
      // Retorna dados de exemplo
      context.res = {
        status: 200,
        headers,
        body: {
          success: true,
          source: 'fallback',
          message: 'Blob Storage não configurado. Configure BLOB_CONTAINER_SAS_URL.',
          useCases: []
        }
      };
      return;
    }
    
    if (req.method === 'POST') {
      context.res = {
        status: 503,
        headers,
        body: { 
          error: 'Storage não configurado',
          message: 'Configure BLOB_CONTAINER_SAS_URL nas Application Settings'
        }
      };
      return;
    }
  }
        throw new Error(`Erro ao ler blob: ${getRes.status}`);
      }
      
      const data = await getRes.json();
      context.res = {
        status: 200,
        headers,
        body: { success: true, useCases: data.useCases || data }
      };
      return;
    }

    // POST - Substitui todos os casos de uso
    if (req.method === 'POST') {
      const body = req.body;
      
      if (!body || !body.useCases || !Array.isArray(body.useCases)) {
        context.res = {
          status: 400,
          headers,
          body: { error: 'Body deve conter array "useCases"' }
        };
        return;
      }

      // Validar estrutura dos casos de uso
      const useCases = body.useCases.map((uc, index) => ({
        id: uc.id || `uc${String(index + 1).padStart(3, '0')}`,
        title: uc.title || uc.titulo || '',
        category: uc.category || uc.categoria || 'Cases',
        description: uc.description || uc.descricao || '',
        details: uc.details || uc.detalhes || '',
        isAvailable: true,
        createdAt: uc.createdAt || new Date().toISOString()
      }));

      // Salvar no Blob
      const dataToSave = {
        useCases,
        updatedAt: new Date().toISOString(),
        totalCount: useCases.length
      };

      const putRes = await fetch(blobUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSave, null, 2)
      });

      if (!putRes.ok) {
        const msg = await putRes.text();
        throw new Error(`Erro ao salvar: ${msg}`);
      }

      context.res = {
        status: 200,
        headers,
        body: { 
          success: true, 
          message: `${useCases.length} casos de uso salvos com sucesso`,
          useCases 
        }
      };
      return;
    }

    context.res = { status: 405, headers, body: { error: 'Método não permitido' } };

  } catch (err) {
    context.log.error('Erro:', err);
    context.res = {
      status: 500,
      headers,
      body: { error: err.message }
    };
  }
};
