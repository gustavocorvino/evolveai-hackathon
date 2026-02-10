# 🚀 EvolveAI Hackathon - Resumo para Demo

**URL da Aplicação:** https://thankful-wave-0d7e8281e.2.azurestaticapps.net  
**Repositório:** https://github.com/gustavocorvino/evolveai-hackathon

---

## ✅ Funcionalidades Implementadas

### 1. Landing Page (Registro de Equipes)
- Formulário de cadastro com nome da equipe e email
- Design moderno com animações (Framer Motion)
- Tema visual cyberpunk/neon

### 2. Galeria de Casos de Uso
- **Grid responsivo** com cards dos casos de uso
- **Filtros por categoria:** AI Assistants, Computer Vision, NLP, Predictive, Automation, Analytics
- **Barra de busca** por título/descrição
- **Sistema de seleção:** Cada equipe pode selecionar até 3 casos
- **Cards bloqueados:** Casos já selecionados por outras equipes aparecem desabilitados (cinza)
- **Modal de detalhes:** Ao clicar em um card, abre modal com descrição completa

### 3. Página de Sucesso
- Confirmação visual após seleção dos casos
- Lista dos casos escolhidos pela equipe

### 4. Painel Admin (`/admin`)
- **Visualização de seleções:** Tabela com todas as equipes e seus casos selecionados
- **Exportar CSV:** Botão para baixar relatório de seleções
- **Importar casos de uso:** Upload de arquivo CSV para adicionar novos casos
- **Liberar casos individualmente:** Botão "Liberar" em cada seleção para devolver caso ao pool

### 5. Infraestrutura
- **Hospedagem:** Azure Static Web Apps com CI/CD automático via GitHub Actions
- **Backend:** Azure Functions (Node.js) para APIs
- **Armazenamento:** Azure Blob Storage para persistência de dados
- **Fallback:** localStorage quando APIs não disponíveis

---

## ⚠️ Pendências / Melhorias Futuras

### 🔴 Alta Prioridade (Para Produção)

| Item | Descrição | Status |
|------|-----------|--------|
| **Validação de Email** | Restringir cadastro apenas para `@avanade.com` | ❌ Bug - não está funcionando corretamente |
| **Domínio Customizado** | Trocar URL do Azure para domínio personalizado | ❌ Não configurado |
| **Variáveis de Ambiente** | Configurar `BLOB_CONTAINER_SAS_URL` no Azure | ⚠️ Verificar se está ativo |

### 🟡 Média Prioridade (Nice to Have)

| Item | Descrição |
|------|-----------|
| **Timer/Countdown** | Adicionar cronômetro para deadline de seleção |
| **Notificações em tempo real** | Atualizar cards quando outro time seleciona |
| **Autenticação Admin** | Proteger página `/admin` com senha |
| **Edição de casos** | Permitir editar casos existentes no admin |

### 🟢 Baixa Prioridade (Futuro)

| Item | Descrição |
|------|-----------|
| **Dark/Light mode** | Toggle de tema |
| **Internacionalização** | Suporte a múltiplos idiomas |
| **Analytics** | Dashboard com métricas de uso |

---

## 📋 Formato CSV para Importação de Casos de Uso

Para importar novos casos via Admin, use este formato:

```csv
id,title,category,description,complexity,tags
ai-assistant-1,Assistente Virtual de RH,AI Assistants,Chatbot para responder dúvidas de funcionários,Médio,"chatbot,hr,nlp"
vision-1,Análise de Documentos,Computer Vision,OCR inteligente para processar documentos,Alto,"ocr,documents,automation"
```

**Campos obrigatórios:** `id`, `title`, `category`, `description`  
**Campos opcionais:** `complexity`, `tags`

---

## 🎯 Roteiro Sugerido para Demo (5 min)

1. **[30s]** Abrir landing page → Mostrar design e cadastrar equipe teste
2. **[1min]** Galeria → Demonstrar filtros, busca, e visualização de cards
3. **[1min]** Seleção → Selecionar 2-3 casos, mostrar bloqueio de cards já escolhidos
4. **[30s]** Sucesso → Mostrar confirmação
5. **[1min]** Admin → Mostrar tabela de seleções, exportar CSV
6. **[1min]** Admin → Demonstrar importação de CSV e botão de liberar caso
7. **[Opcional]** Mostrar GitHub Actions rodando deploy automático

---

## 🔧 Comandos Úteis

```bash
# Rodar localmente
npm install
npm run dev

# Build para produção
npm run build

# Deploy (automático via push para main)
git add -A && git commit -m "mensagem" && git push
```

---

## 📁 Estrutura Principal do Código

```
src/
├── pages/
│   ├── LandingPageSimple.jsx  ← Página de login
│   ├── GalleryPage.jsx        ← Galeria de casos
│   ├── AdminPage.jsx          ← Painel administrativo
│   └── SuccessPage.jsx        ← Confirmação
├── services/
│   ├── data.service.js        ← API + fallback localStorage
│   └── usecase.service.js     ← Lógica de casos de uso
├── components/
│   ├── UseCaseCard.jsx        ← Card individual
│   ├── UseCaseModal.jsx       ← Modal de detalhes
│   └── FilterBar.jsx          ← Filtros e busca
└── AppSimple.jsx              ← Roteamento principal
```

---

## 💬 Pontos para Feedback da Equipe

1. O fluxo de seleção está intuitivo?
2. As categorias de casos fazem sentido?
3. Quantos casos cada equipe deveria poder selecionar? (hoje: 3)
4. Precisa de algum campo adicional nos casos de uso?
5. O admin precisa de mais funcionalidades?

---

**Última atualização:** Fevereiro 2026  
**Desenvolvido para:** Hackathon Avanade Brasil
