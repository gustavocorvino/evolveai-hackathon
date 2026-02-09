# append-selection Function

This Azure Function app reads/writes a CSV in Azure Blob Storage to store selection records (no DB required).

Files:
- `index.js` — HTTP handler (POST to append, GET to list JSON or redirect to download)
- `function.json` — Azure Functions binding

Environment
-----------
You need to configure a container-level SAS URL with read+write permissions and set it as an environment variable.

- `BLOB_CONTAINER_SAS_URL` (required)
  - Example: `https://<account>.blob.core.windows.net/<container>?sv=...&ss=bfqt...&sp=rwdl...&se=...&sig=...`
  - Permissions recommended: `r` (read), `w` (write), `c` (create), `l` (list)
  - The function will use this URL and append/read the blob name from `SELECTIONS_BLOB_NAME`.

- `SELECTIONS_BLOB_NAME` (optional)
  - Default: `selections/selection.csv`
  - Use a key with path to store the CSV inside the container.

Security notes
--------------
- The function expects the container SAS to allow read/write operations. Keep the SAS secret (store it in Azure Function Application Settings or GitHub Secrets).
- For production, protect the HTTP function (use function key or restrict to authenticated admins). Azure Functions will require a function key when deployed if configured.
- This approach is append-by-rewrite (reads the whole CSV and re-uploads). It is fine for small lists (hackathon). For larger scale, use Append Blobs or the Azure SDK to upload blocks.

How it works
------------
- POST `/api/append-selection` with JSON body `{ userId, name, email, selectionId, details, timestamp }` will:
  1. GET the blob (if exists)
  2. Append a CSV line (or create with header)
  3. PUT the full CSV back to blob storage

- GET `/api/append-selection` will return parsed CSV rows as JSON.
- GET `/api/append-selection?download=1` will redirect (302) to the blob SAS URL so the browser downloads the CSV directly.

Testing locally
---------------
If you have a valid `BLOB_CONTAINER_SAS_URL`, you can test the function locally after starting your dev server.

Start the frontend dev server (or host functions locally with Azure Functions Core Tools):

```bash
# From project root
npm install
npm run dev
# or if you run functions separately with func:
# func start --verbose
```

Sample POST (append a selection):

```bash
curl -X POST http://localhost:5173/api/append-selection \
  -H "Content-Type: application/json" \
  -d '{"userId":"u1","name":"Equipe X","email":"x@example.com","selectionId":"case-123","details":"Observacao","timestamp":"2026-02-09T12:00:00Z"}'
```

Sample GET (list selections JSON):

```bash
curl http://localhost:5173/api/append-selection
```

Sample GET (download CSV via redirect):

```bash
curl -I http://localhost:5173/api/append-selection?download=1
# Follow Location header to the blob SAS URL
```

Azure deployment notes
----------------------
- Add `BLOB_CONTAINER_SAS_URL` (Application Settings) to your Azure Function app configuration or to GitHub Secrets used by your deployment pipeline.
- Optionally set `SELECTIONS_BLOB_NAME` if you don't want the default path.
- Ensure the SAS token expiration is long enough for your use-case or rotate periodically.

Local fallback (optional)
-------------------------
- If you do not want to require a SAS for local testing, a fallback mode can write `./data/selections.csv` on the filesystem instead of the blob. This is not implemented yet — tell me if you want that and I'll add it.

Limitations
-----------
- Concurrent writes may overwrite each other if two requests arrive simultaneously. Acceptable for low volume.
- The CSV is stored as plain text; encrypt storage if required.

Next steps
----------
- Configure `BLOB_CONTAINER_SAS_URL` in Azure/GitHub Secrets.
- Deploy the function along with the frontend.
- Optionally add function-level authentication and local fallback support.
