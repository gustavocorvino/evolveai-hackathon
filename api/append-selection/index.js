// Node 18+ has native fetch

module.exports = async function (context, req) {
  const containerSas = process.env.BLOB_CONTAINER_SAS_URL; // e.g. https://<account>.blob.core.windows.net/<container>?<sas>
  const blobName = process.env.SELECTIONS_BLOB_NAME || 'selections/selection.csv';

  if (!containerSas) {
    context.log.error('BLOB_CONTAINER_SAS_URL not configured');
    context.res = {
      status: 500,
      body: { error: 'Storage not configured' }
    };
    return;
  }

  // parse container url and sas
  const idx = containerSas.indexOf('?');
  const baseContainerUrl = idx === -1 ? containerSas : containerSas.substring(0, idx);
  const sas = idx === -1 ? '' : containerSas.substring(idx + 1);
  const blobUrl = `${baseContainerUrl}/${blobName}${sas ? `?${sas}` : ''}`;

  try {
    if (req.method === 'POST') {
      const data = req.body || {};
      // Build CSV line from data object. Use keys order: timestamp, userId, name, email, selectionId, details
      const timestamp = data.timestamp || new Date().toISOString();
      const userId = (data.userId || '').toString();
      const name = (data.name || '').toString().replace(/"/g, '""');
      const email = (data.email || '').toString();
      const selectionId = (data.selectionId || '').toString();
      const details = (data.details || '').toString().replace(/"/g, '""');

      const line = `"${timestamp}","${userId}","${name}","${email}","${selectionId}","${details}"`;

      // Try GET existing blob
      let existing = '';
      const getRes = await fetch(blobUrl);
      if (getRes.status === 200) {
        existing = await getRes.text();
      }

      // If empty, add header
      const header = 'timestamp,userId,name,email,selectionId,details';
      const newContent = existing && existing.trim().length > 0 ? `${existing}\n${line}` : `${header}\n${line}`;

      // Upload with PUT and x-ms-blob-type: BlockBlob
      const putRes = await fetch(blobUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': 'text/csv'
        },
        body: newContent
      });

      if (!putRes.ok) {
        const msg = await putRes.text();
        context.log.error('Upload failed', putRes.status, msg);
        context.res = { status: 500, body: { error: 'Upload failed', detail: msg } };
        return;
      }

      context.res = { status: 200, body: { success: true } };
      return;
    }

    // GET: return JSON or redirect to blob for download
    if (req.method === 'GET') {
      if (req.query && req.query.download) {
        // Redirect to blob SAS URL so client can download directly
        context.res = {
          status: 302,
          headers: {
            Location: blobUrl
          }
        };
        return;
      }

      // fetch blob content
      const getRes = await fetch(blobUrl);
      if (getRes.status === 404) {
        context.res = { status: 200, body: [] };
        return;
      }
      if (!getRes.ok) {
        const txt = await getRes.text();
        context.log.error('Error reading blob', getRes.status, txt);
        context.res = { status: 500, body: { error: 'Failed to read storage', detail: txt } };
        return;
      }

      const csv = await getRes.text();
      // parse CSV to JSON
      const lines = csv.split(/\r?\n/).filter(Boolean);
      if (lines.length === 0) {
        context.res = { status: 200, body: [] };
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        // naive CSV parse: split by comma but handle quoted fields
        const values = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i];
          if (ch === '"') {
            if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = !inQuotes; }
            continue;
          }
          if (ch === ',' && !inQuotes) { values.push(cur); cur = ''; continue; }
          cur += ch;
        }
        values.push(cur);
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = (values[idx] || '').replace(/^"|"$/g, ''); });
        return obj;
      });

      context.res = { status: 200, body: rows };
      return;
    }

    context.res = { status: 405, body: { error: 'Method not allowed' } };
  } catch (err) {
    context.log.error(err);
    context.res = { status: 500, body: { error: err.message } };
  }
};
