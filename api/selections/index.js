/**
 * Azure Function para gerenciar seleções
 * MODO SIMPLIFICADO: Retorna resposta estática (sem Blob Storage)
 */

module.exports = async function (context, req) {
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

  // GET - Retorna seleções vazias (cada client usa localStorage)
  if (req.method === 'GET') {
    context.res = {
      status: 200,
      headers,
      body: { success: true, source: 'static', selections: {}, message: 'Usando localStorage local' }
    };
    return;
  }

  // POST/DELETE - Aceita mas não persiste (localStorage no client faz isso)
  context.res = {
    status: 200,
    headers,
    body: { success: true, source: 'static', message: 'Seleção salva localmente no navegador' }
  };
  return;
  
  // === CÓDIGO ABAIXO DESATIVADO - BLOB STORAGE NÃO CONFIGURADO ===
  const containerSas = process.env.BLOB_CONTAINER_SAS_URL;
  const blobName = process.env.SELECTIONS_BLOB_NAME || 'data/selections.json';

  // Fallback se Blob não configurado
  if (!containerSas) {
    context.log.warn('BLOB_CONTAINER_SAS_URL não configurado');
    
    if (req.method === 'GET') {
      context.res = {
        status: 200,
        headers,
        body: { success: true, source: 'fallback', selections: {} }
      };
      return;
    }
    
    context.res = {
      status: 503,
      headers,
      body: { error: 'Storage não configurado' }
    };
    return;
  }

  const idx = containerSas.indexOf('?');
  const baseContainerUrl = idx === -1 ? containerSas : containerSas.substring(0, idx);
  const sas = idx === -1 ? '' : containerSas.substring(idx + 1);
  const blobUrl = `${baseContainerUrl}/${blobName}${sas ? `?${sas}` : ''}`;

  try {
    // GET - Retorna todas as seleções
    if (req.method === 'GET') {
      const getRes = await fetch(blobUrl);
      
      if (getRes.status === 404) {
        context.res = {
          status: 200,
          headers,
          body: { success: true, selections: {} }
        };
        return;
      }
      
      if (!getRes.ok) {
        throw new Error(`Erro ao ler blob: ${getRes.status}`);
      }
      
      const data = await getRes.json();
      context.res = {
        status: 200,
        headers,
        body: { success: true, selections: data.selections || data }
      };
      return;
    }

    // POST - Adiciona/atualiza seleção
    if (req.method === 'POST') {
      const body = req.body;
      
      if (!body || !body.useCaseId || !body.teamName) {
        context.res = {
          status: 400,
          headers,
          body: { error: 'Body deve conter useCaseId e teamName' }
        };
        return;
      }

      // Buscar seleções existentes
      let existingSelections = {};
      const getRes = await fetch(blobUrl);
      if (getRes.status === 200) {
        const data = await getRes.json();
        existingSelections = data.selections || data || {};
      }

      // Verificar se já foi selecionado por outra equipe
      if (existingSelections[body.useCaseId] && 
          existingSelections[body.useCaseId].teamId !== body.teamId) {
        context.res = {
          status: 409,
          headers,
          body: { 
            error: 'Caso de uso já selecionado',
            selectedBy: existingSelections[body.useCaseId].teamName
          }
        };
        return;
      }

      // Verificar se equipe já selecionou outro caso
      const teamSelection = Object.entries(existingSelections)
        .find(([ucId, sel]) => sel.teamId === body.teamId && ucId !== body.useCaseId);
      
      if (teamSelection) {
        context.res = {
          status: 409,
          headers,
          body: { 
            error: 'Equipe já selecionou outro caso de uso',
            selectedUseCase: teamSelection[0]
          }
        };
        return;
      }

      // Adicionar nova seleção
      const newSelection = {
        teamId: body.teamId,
        teamName: body.teamName,
        email: body.email || '',
        useCaseTitle: body.useCaseTitle || '',
        timestamp: new Date().toISOString()
      };

      existingSelections[body.useCaseId] = newSelection;

      // Salvar no Blob
      const dataToSave = {
        selections: existingSelections,
        updatedAt: new Date().toISOString()
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
          message: 'Seleção registrada com sucesso',
          selection: newSelection
        }
      };
      return;
    }

    // DELETE - Remove uma seleção específica (liberar caso)
    if (req.method === 'DELETE') {
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
      let existingSelections = {};
      const getRes = await fetch(blobUrl);
      if (getRes.status === 200) {
        const data = await getRes.json();
        existingSelections = data.selections || data || {};
      }

      // Verificar se existe a seleção
      if (!existingSelections[body.useCaseId]) {
        context.res = {
          status: 404,
          headers,
          body: { error: 'Seleção não encontrada' }
        };
        return;
      }

      // Remover a seleção
      const removedSelection = existingSelections[body.useCaseId];
      delete existingSelections[body.useCaseId];

      // Salvar no Blob
      const dataToSave = {
        selections: existingSelections,
        updatedAt: new Date().toISOString()
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
          message: 'Seleção liberada com sucesso',
          removedSelection
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
