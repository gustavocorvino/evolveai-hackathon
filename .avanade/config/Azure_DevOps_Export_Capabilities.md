# Azure DevOps - Export e Hierarquia de Work Items

## 📋 Visão Geral
Documentação completa sobre as capacidades de exportação de arquivos markdown como work items no Azure DevOps e estrutura hierárquica da plataforma.

---

## 🏗️ Hierarquia do Azure DevOps

### Estrutura Hierárquica Padrão
```
Initiative (Portfólio)
├── Epic (Portfólio) 
    ├── Feature (Portfólio)
        ├── User Story (Requirements)
            ├── Task (Implementação)
            └── Bug (Defeitos)
```

### Tipos de Work Items por Processo

#### **Agile Process**
- **Portfolio Backlog**: Epic → Feature
- **Requirements Backlog**: User Story
- **Task Backlog**: Task
- **Bug Tracking**: Bug

#### **Scrum Process** 
- **Portfolio Backlog**: Epic → Feature
- **Requirements Backlog**: Product Backlog Item (PBI)
- **Task Backlog**: Task
- **Bug Tracking**: Bug

#### **CMMI Process**
- **Portfolio Backlog**: Epic → Feature
- **Requirements Backlog**: Requirement
- **Task Backlog**: Task
- **Bug Tracking**: Bug

### Relacionamentos de Hierarquia

```xml
<!-- Configuração XML de Portfolio Backlogs -->
<PortfolioBacklog category="Microsoft.EpicCategory" 
                  parent="Microsoft.InitiativeCategory" 
                  pluralName="Epics" 
                  singularName="Epic">
</PortfolioBacklog>

<PortfolioBacklog category="Microsoft.FeatureCategory" 
                  parent="Microsoft.EpicCategory" 
                  pluralName="Features" 
                  singularName="Feature">
</PortfolioBacklog>
```

---

## 🚀 Capacidades de Export para Azure DevOps

### ✅ **SIM - É Possível Exportar Markdown como Work Items**

O Azure DevOps oferece múltiplas formas de criar work items programaticamente a partir de conteúdo markdown:

### **1. REST API - Criação Programática**

#### Endpoint Principal
```http
POST https://dev.azure.com/{organization}/{project}/_apis/wit/workitems/${type}?api-version=7.2
```

#### Headers Necessários
```http
Authorization: Bearer {access_token}
Content-Type: application/json-patch+json
```

#### Formato JSON-Patch para Criação
```json
[
  {
    "op": "add",
    "path": "/fields/System.Title",
    "value": "Título do Work Item"
  },
  {
    "op": "add",
    "path": "/fields/System.Description",
    "value": "Conteúdo markdown convertido para HTML"
  },
  {
    "op": "add",
    "path": "/fields/System.AreaPath", 
    "value": "NomeProject\\Area"
  },
  {
    "op": "add",
    "path": "/fields/System.IterationPath",
    "value": "NomeProject\\Sprint 1"
  }
]
```

### **2. Tipos de Work Items Suportados**

#### **Epics**
```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json-patch+json" \
  "https://dev.azure.com/$ORG/$PROJECT/_apis/wit/workitems/\$Epic?api-version=7.2" \
  -d '[{"op":"add","path":"/fields/System.Title","value":"Epic Title"}]'
```

#### **Features** 
```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json-patch+json" \
  "https://dev.azure.com/$ORG/$PROJECT/_apis/wit/workitems/\$Feature?api-version=7.2" \
  -d '[{"op":"add","path":"/fields/System.Title","value":"Feature Title"}]'
```

#### **User Stories/Product Backlog Items**
```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json-patch+json" \
  "https://dev.azure.com/$ORG/$PROJECT/_apis/wit/workitems/\$User%20Story?api-version=7.2" \
  -d '[{"op":"add","path":"/fields/System.Title","value":"Story Title"}]'
```

#### **Tasks**
```bash
curl -X PATCH \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json-patch+json" \
  "https://dev.azure.com/$ORG/$PROJECT/_apis/wit/workitems/\$Task?api-version=7.2" \
  -d '[{"op":"add","path":"/fields/System.Title","value":"Task Title"}]'
```

---

## 🔗 Criação de Relacionamentos Hierárquicos

### **Linkando Work Items Parent-Child**

#### Adicionar Link de Parent
```json
[
  {
    "op": "add",
    "path": "/relations/-",
    "value": {
      "rel": "System.LinkTypes.Hierarchy-Reverse",
      "url": "https://dev.azure.com/{organization}/_apis/wit/workItems/{parentId}",
      "attributes": {
        "comment": "Link to parent Epic"
      }
    }
  }
]
```

#### Adicionar Link de Child
```json
[
  {
    "op": "add", 
    "path": "/relations/-",
    "value": {
      "rel": "System.LinkTypes.Hierarchy-Forward",
      "url": "https://dev.azure.com/{organization}/_apis/wit/workItems/{childId}",
      "attributes": {
        "comment": "Link to child Feature"
      }
    }
  }
]
```

---

## 💾 Implementações Práticas

### **PowerShell Script para Export**

```powershell
# Função para converter Markdown para Work Item
function Export-MarkdownToWorkItem {
    param(
        [string]$MarkdownFile,
        [string]$WorkItemType,
        [string]$Organization,
        [string]$Project,
        [string]$AccessToken
    )
    
    # Ler conteúdo markdown
    $content = Get-Content $MarkdownFile -Raw
    $title = ($content -split '\n')[0] -replace '^#+\s*', ''
    
    # Headers para API
    $headers = @{
        'Authorization' = "Bearer $AccessToken"
        'Content-Type' = 'application/json-patch+json'
    }
    
    # Body da requisição
    $body = @(
        @{
            op = "add"
            path = "/fields/System.Title"
            value = $title
        },
        @{
            op = "add"
            path = "/fields/System.Description"
            value = $content
        }
    ) | ConvertTo-Json
    
    # URI da API
    $uri = "https://dev.azure.com/$Organization/$Project/_apis/wit/workitems/`$$WorkItemType?api-version=7.2"
    
    # Criar work item
    try {
        $response = Invoke-RestMethod -Uri $uri -Method Patch -Headers $headers -Body $body
        Write-Host "✅ Work Item criado: ID $($response.id) - $($response.fields.'System.Title')"
        return $response.id
    }
    catch {
        Write-Error "❌ Erro ao criar work item: $($_.Exception.Message)"
    }
}

# Exemplo de uso
Export-MarkdownToWorkItem -MarkdownFile "epic.md" -WorkItemType "Epic" -Organization "myorg" -Project "myproject" -AccessToken $env:AZURE_DEVOPS_TOKEN
```

### **C# Implementation**

```csharp
using Microsoft.TeamFoundation.WorkItemTracking.WebApi;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;
using Microsoft.VisualStudio.Services.WebApi.Patch.Json;

public class MarkdownToWorkItemExporter
{
    private readonly WorkItemTrackingHttpClient _witClient;
    
    public async Task<int> ExportMarkdownAsWorkItemAsync(
        string markdownContent, 
        string workItemType, 
        string project)
    {
        var title = ExtractTitleFromMarkdown(markdownContent);
        
        var patchDocument = new JsonPatchDocument
        {
            new JsonPatchOperation
            {
                Operation = Operation.Add,
                Path = "/fields/System.Title",
                Value = title
            },
            new JsonPatchOperation
            {
                Operation = Operation.Add,
                Path = "/fields/System.Description",
                Value = markdownContent
            }
        };
        
        var workItem = await _witClient.CreateWorkItemAsync(
            patchDocument, 
            project, 
            workItemType
        );
        
        return workItem.Id.Value;
    }
    
    private string ExtractTitleFromMarkdown(string content)
    {
        var lines = content.Split('\n');
        var firstLine = lines[0];
        return firstLine.TrimStart('#', ' ');
    }
}
```

---

## 🔄 Workflow Completo de Export

### **1. Preparação do Ambiente**
```bash
# Instalar Azure CLI
az extension add --name azure-devops

# Configurar organização padrão
az devops configure --defaults organization=https://dev.azure.com/myorg project=myproject
```

### **2. Autenticação**
```bash
# Via PAT (Personal Access Token)
export AZURE_DEVOPS_EXT_PAT=your_pat_token

# Via Azure Login
az login
```

### **3. Criação via CLI**
```bash
# Criar Epic
az boards work-item create \
  --title "Epic: Digital Transformation" \
  --type Epic \
  --description "$(cat epic.md)"

# Criar Feature linkada ao Epic
az boards work-item create \
  --title "Feature: User Authentication" \
  --type Feature \
  --description "$(cat feature.md)" \
  --parent 123
```

### **4. Batch Export de Múltiplos Arquivos**

```powershell
# Script para exportar múltiplos markdowns
$markdownFiles = @{
    "Initiative.md" = "Epic"
    "Epic.md" = "Epic" 
    "Feature.md" = "Feature"
    "UserStory.md" = "User Story"
    "Task.md" = "Task"
}

$workItemIds = @()

foreach ($file in $markdownFiles.GetEnumerator()) {
    if (Test-Path $file.Key) {
        $id = Export-MarkdownToWorkItem -MarkdownFile $file.Key -WorkItemType $file.Value -Organization $org -Project $project -AccessToken $token
        $workItemIds += $id
    }
}

Write-Host "✅ Total de Work Items criados: $($workItemIds.Count)"
```

---

## 📊 Campos Suportados para Export

### **Campos System (Padrão)**
- `System.Title` - Título do work item
- `System.Description` - Descrição (suporta HTML/Markdown) 
- `System.State` - Estado (New, Active, Resolved, Closed)
- `System.AssignedTo` - Responsável
- `System.AreaPath` - Área do projeto
- `System.IterationPath` - Sprint/Iteração
- `System.Tags` - Tags separadas por ;

### **Campos Específicos por Tipo**

#### **Epic**
- `Microsoft.VSTS.Common.BusinessValue` - Valor de negócio
- `Microsoft.VSTS.Scheduling.StartDate` - Data início
- `Microsoft.VSTS.Scheduling.TargetDate` - Data alvo

#### **Feature**  
- `Microsoft.VSTS.Common.BusinessValue` - Valor de negócio
- `Microsoft.VSTS.Scheduling.StartDate` - Data início
- `Microsoft.VSTS.Scheduling.TargetDate` - Data alvo

#### **User Story**
- `Microsoft.VSTS.Scheduling.StoryPoints` - Story Points
- `Microsoft.VSTS.Common.Priority` - Prioridade (1-4)
- `Microsoft.VSTS.Common.ValueArea` - Área de valor

#### **Task**
- `Microsoft.VSTS.Scheduling.RemainingWork` - Trabalho restante (horas)
- `Microsoft.VSTS.Common.Activity` - Atividade (Development, Testing, etc.)

---

## 🛠️ Ferramentas e Integrações

### **Azure DevOps CLI**
```bash
# Instalar extensão
az extension add --name azure-devops

# Criar work items
az boards work-item create --title "Task" --type Task
```

### **PowerShell Module**
```powershell
# Instalar módulo
Install-Module -Name VSTeam

# Conectar
Set-VSTeamAccount -Account https://dev.azure.com/myorg -PersonalAccessToken $pat
```

### **Node.js SDK**
```javascript
const azdev = require("azure-devops-node-api");

const orgUrl = "https://dev.azure.com/yourorg";
const token = process.env.AZURE_DEVOPS_TOKEN;
const authHandler = azdev.getPersonalAccessTokenHandler(token);
const connection = new azdev.WebApi(orgUrl, authHandler);
```

---

## 🔐 Permissões Necessárias

### **Work Item Management**
- ✅ `View work items in this node` 
- ✅ `Edit work items in this node`
- ✅ `Create work items in this node`
- ✅ `Delete and restore work items`

### **API Access**
- ✅ Personal Access Token com scopo: `Work Items (Read & Write)`
- ✅ Microsoft Entra ID App Registration com permissões adequadas

---

## 📈 Monitoramento e Validação

### **Verificar Work Items Criados**
```bash
# Listar work items recém-criados
az boards query --wiql "SELECT [System.Id], [System.Title] FROM WorkItems WHERE [System.CreatedDate] > @today-1"
```

### **Query WIQL para Hierarquia**
```sql
SELECT [System.Id], [System.Title], [System.WorkItemType] 
FROM WorkItems 
WHERE [System.WorkItemType] IN ('Epic', 'Feature', 'User Story', 'Task')
  AND [System.CreatedDate] >= @today-7
ORDER BY [System.CreatedDate] DESC
```

---

## ⚠️ Limitações e Considerações

### **Rate Limits**
- Azure DevOps REST API: ~200 requests/minute
- Implementar retry logic para bulk operations

### **Tamanho de Conteúdo**
- System.Description: Máximo ~1MB
- Para arquivos grandes, considerar usar attachments

### **Formatação Markdown**
- Azure DevOps suporta HTML limitado
- Converter markdown para HTML antes do upload
- Testar renderização na interface web

---

## 🎯 Conclusão

**✅ RESPOSTA: SIM** - O Azure DevOps permite total exportação de arquivos markdown como work items através de:

1. **REST APIs** para criação programática 
2. **Múltiplos tipos de work items** (Epic, Feature, User Story, Task, etc.)
3. **Hierarquia completa** com relacionamentos parent-child
4. **Ferramentas robustas** (CLI, PowerShell, SDKs)
5. **Automação de batch** para múltiplos arquivos
6. **Integração nativa** com markdown/HTML

O processo é **totalmente suportado e recomendado** para migração de documentação e planejamento estruturado.

---

*Documento gerado por Alex DevOps - Azure DevOps Platform Specialist*  
*Data: $(Get-Date -Format 'dd/MM/yyyy HH:mm')*