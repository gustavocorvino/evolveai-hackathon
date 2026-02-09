# Configuração do Azure Blob Storage

## Visão Geral

Este projeto agora utiliza Azure Blob Storage para persistir dados dos casos de uso e seleções. Quando a API não está disponível, o sistema faz fallback para localStorage automaticamente.

## Estrutura dos Dados

```
blob-container/
├── usecases.json    # Lista de todos os casos de uso
└── selections.json  # Mapa de seleções (useCaseId -> dados da equipe)
```

## Configuração no Azure

### 1. Criar Storage Account

```powershell
# Via Azure CLI
az storage account create \
  --name hackathonstorage \
  --resource-group seu-resource-group \
  --location brazilsouth \
  --sku Standard_LRS
```

### 2. Criar Container

```powershell
az storage container create \
  --name hackathon-data \
  --account-name hackathonstorage \
  --public-access off
```

### 3. Gerar SAS Token

```powershell
# Gerar SAS com permissões de leitura/escrita
az storage container generate-sas \
  --name hackathon-data \
  --account-name hackathonstorage \
  --permissions rwdl \
  --expiry 2025-12-31 \
  --https-only \
  --output tsv
```

### 4. Configurar URL com SAS

A URL final deve ter o formato:
```
https://hackathonstorage.blob.core.windows.net/hackathon-data?sv=2022-11-02&ss=b&srt=co&sp=rwdlacx&...
```

### 5. Configurar no Azure Static Web Apps

No portal Azure, vá até seu Static Web App:
1. Configuration > Application settings
2. Adicionar: `BLOB_CONTAINER_SAS_URL` = sua URL com SAS

Ou via CLI:
```powershell
az staticwebapp appsettings set \
  --name aplicacaohackaton \
  --setting-names BLOB_CONTAINER_SAS_URL="https://..." \
  --resource-group seu-resource-group
```

## APIs Disponíveis

### GET /api/usecases
Retorna lista de casos de uso.

**Resposta:**
```json
{
  "useCases": [...],
  "source": "blob|cache|static",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### POST /api/usecases
Salva/substitui todos os casos de uso.

**Body:**
```json
{
  "useCases": [
    {
      "id": "uc001",
      "title": "Título",
      "category": "Industria|Praticas|Cases",
      "description": "Descrição",
      "details": "Detalhes"
    }
  ]
}
```

### GET /api/selections
Retorna mapa de seleções.

**Resposta:**
```json
{
  "selections": {
    "uc001": {
      "teamId": "team_xxx",
      "teamName": "Nome da Equipe",
      "email": "email@example.com",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  }
}
```

### POST /api/selections
Registra uma seleção.

**Body:**
```json
{
  "useCaseId": "uc001",
  "teamId": "team_xxx",
  "teamName": "Nome",
  "email": "email@example.com"
}
```

**Resposta de Conflito (409):**
```json
{
  "error": "Caso de uso já selecionado",
  "selectedBy": {...}
}
```

## Modo Fallback

Quando `BLOB_CONTAINER_SAS_URL` não está configurado ou o Blob está inacessível:

1. **Leitura**: Usa dados cacheados no localStorage, depois arquivo estático `/data/usecases.json`
2. **Escrita**: Salva apenas no localStorage (dados perdidos entre sessões/dispositivos)

## Upload de CSV (Admin)

O painel admin (`/admin`) permite importar casos de uso via CSV:

### Formato do CSV
```csv
titulo;categoria;descricao;detalhes
"Caso 1";"Industria";"Descrição";"Detalhes"
"Caso 2";"Praticas";"Descrição";"Detalhes"
```

### Colunas Suportadas
| Coluna | Alternativas | Obrigatório |
|--------|-------------|-------------|
| titulo | title, nome | ✅ |
| categoria | category | ❌ (default: Cases) |
| descricao | description | ❌ |
| detalhes | details | ❌ |
| id | - | ❌ (gerado automaticamente) |

O separador pode ser `,` ou `;`.

## Testando Localmente

Para testar as APIs localmente, use o Azure Static Web Apps CLI:

```bash
# Instalar SWA CLI
npm install -g @azure/static-web-apps-cli

# Criar arquivo local.settings.json em /api/
# com BLOB_CONTAINER_SAS_URL

# Executar com API
swa start dist --api-location api
```

## Troubleshooting

### "Blob Storage não configurado"
- Verifique se `BLOB_CONTAINER_SAS_URL` está configurado nas Application Settings
- Reinicie a aplicação após configurar

### "SAS Token expirado"
- Gere um novo SAS Token com data de expiração futura
- Atualize a configuração no Azure

### "CORS Error"
- O Static Web Apps já configura CORS automaticamente para APIs no diretório `/api`

### Dados não persistindo
- Se a API não está configurada, dados ficam apenas no localStorage
- Verifique o console do navegador para mensagens de warning
