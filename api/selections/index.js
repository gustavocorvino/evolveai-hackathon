/**
 * Azure Function para seleções - versão mínima para debug
 */

module.exports = async function (context, req) {
  context.res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: {
      success: true,
      source: 'debug',
      message: 'API funcionando',
      hasEnvVar: !!process.env.BLOB_CONTAINER_SAS_URL,
      method: req.method
    }
  };
};
