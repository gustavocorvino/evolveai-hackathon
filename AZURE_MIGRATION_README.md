# 🏗️ Migração Azure Static Web Apps - Resumo Executivo

## 📋 Documentação Completa

Esta migração envolve **4 documentos principais** criados para você:

### 1. 📚 [AZURE_MIGRATION_PLAN.md](AZURE_MIGRATION_PLAN.md)
**Conteúdo**: Plano estratégico de migração
- Arquitetura Azure vs Vercel
- Componentes necessários
- Cronograma de 5 fases
- Troubleshooting comum

**Use quando**: Precisa entender a arquitetura geral

---

### 2. 🚀 [AZURE_DEPLOYMENT_GUIDE.md](AZURE_DEPLOYMENT_GUIDE.md)
**Conteúdo**: Guia prático passo a passo
- 5 fases de implementação detalhadas
- Comandos prontos para copiar/colar
- Testes de validação
- Checklist final

**Use quando**: Está implementando a migração

---

### 3. 🔒 [SECURITY_FIXES.md](SECURITY_FIXES.md)
**Conteúdo**: Vulnerabilidades corrigidas
- 11 vulnerabilidades resolvidas
- Antes/depois de cada correção
- Checklist de segurança
- Próximas melhorias

**Use quando**: Quer entender as correções de segurança

---

### 4. ⚙️ Arquivos de Configuração Criados

```
.env.example                          # Template de variáveis
.github/workflows/
  └── azure-static-web-apps-deploy.yml  # CI/CD GitHub Actions
staticwebapp.config.json              # Configuração Azure SWA
firestore.rules                       # Regras de segurança Firestore
setup-azure.js                        # Script de setup interativo
src/firebase/config.js                # Config Firebase com env vars (ATUALIZADO)
```

---

## 🎯 Próximas Ações (Recomendadas)

### ✨ PHASE 1: Setup Local (Hoje - 20 min)

```bash
# 1. Executar setup script
node setup-azure.js

# 2. Testar localmente
npm run dev

# 3. Testar build
npm run build && npm run preview
```

✅ **Seu objetivo**: Aplicação roda perfeitamente em localhost

---

### 🔐 PHASE 2: GitHub Secrets (Hoje - 10 min)

1. Ir para: `https://github.com/seu-usuario/seu-repo/settings/secrets/actions`
2. Criar 6 secrets (valores de `.env.local`):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

✅ **Seu objetivo**: Todos os 6 secrets criados

---

### 🌐 PHASE 3: Azure Setup (Hoje - 15 min)

```powershell
# 1. Login Azure
az login

# 2. Criar Resource Group
az group create --name evolveai-rg --location eastus

# 3. Criar Static Web App
az staticwebapp create `
  --name evolveai-hackathon-swa `
  --resource-group evolveai-rg `
  --source https://github.com/seu-usuario/seu-repo `
  --location eastus `
  --branch main `
  --app-location "src" `
  --output-location "dist" `
  --token SEU_GITHUB_TOKEN
```

✅ **Seu objetivo**: Static Web App criado no Azure

---

### 🚀 PHASE 4: Deploy (Automático)

```bash
# 1. Commit changes
git add .
git commit -m "feat: migração para Azure Static Web Apps"
git push origin main

# 2. GitHub Actions inicia automaticamente
# Monitorar em: https://github.com/seu-usuario/seu-repo/actions
```

✅ **Seu objetivo**: Deploy sucesso no Azure

---

### ✨ PHASE 5: Validação (10 min)

```powershell
# Obter URL da aplicação
az staticwebapp show `
  --name evolveai-hackathon-swa `
  --resource-group evolveai-rg `
  --query "defaultHostname"

# Resultado: https://seu-app.azurestaticapps.com
```

- [ ] Acessar https://seu-app.azurestaticapps.com
- [ ] Testar login/seleção de caso de uso
- [ ] Verificar que Firestore funciona
- [ ] Testar responsivo (mobile)

✅ **Seu objetivo**: Aplicação rodando em produção no Azure

---

## 🆘 Precisa de Ajuda?

### Se o build falhar no GitHub Actions
1. Verificar [AZURE_DEPLOYMENT_GUIDE.md → Troubleshooting](AZURE_DEPLOYMENT_GUIDE.md#troubleshooting)
2. Confirmar que todos os 6 GitHub Secrets existem
3. Verificar logs em: GitHub Actions → workflow

### Se Firebase não conecta
1. Testar `.env.local` localmente: `npm run dev`
2. Verificar se valores em GitHub Secrets batem com `.env.local`
3. Listar secrets: `gh secret list`

### Se precisa recuperar de erro
```bash
# Ver histórico de deploys
az staticwebapp show \
  --name evolveai-hackathon-swa \
  --resource-group evolveai-rg

# Ver logs detalhados
az staticwebapp logs \
  --name evolveai-hackathon-swa \
  --resource-group evolveai-rg
```

---

## 📊 Diferenças Vercel → Azure SWA

| Feature | Vercel | Azure SWA |
|---------|--------|----------|
| **Build** | Automático de git | GitHub Actions (customizável) |
| **Env Vars** | UI do Vercel | GitHub Secrets |
| **Free Tier** | Generoso | Muito generoso (500MB) |
| **Custom Domain** | Nativo | Via DNS |
| **Edge Functions** | Disponível | Em preview |
| **Database** | Integração fácil | Firebase/Cosmos |
| **Performance** | Excelente | Excelente |

---

## 🎓 Estrutura de Migração Completa

```
ANTES (Vercel)
├── .env.production (credenciais expostas ❌)
├── src/firebase/config.js (hardcoded 🔐)
└── vercel.json

DEPOIS (Azure)
├── .env.local (local apenas, gitignored ✅)
├── .env.example (template)
├── src/firebase/config.js (env vars ✅)
├── staticwebapp.config.json (config Azure)
├── firestore.rules (regras seguras)
├── .github/workflows/azure-*.yml (CI/CD)
└── GitHub Secrets (credenciais seguras)
```

---

## ✅ Checklist de Conclusão

- [ ] **Setup.js executado**: `.env.local` criado
- [ ] **Testado localmente**: `npm run dev` e `npm run preview` OK
- [ ] **GitHub Secrets**: 6 secrets criados
- [ ] **Código commitado**: `.env.local` ignorado em git
- [ ] **Azure CLI**: Instalado e logado
- [ ] **Static Web App**: Criado via CLI
- [ ] **GitHub Actions**: Executou com sucesso
- [ ] **App acessível**: https://seu-app.azurestaticapps.com carrega
- [ ] **Funcionalidades**: Login, seleção, Firestore funcionam
- [ ] **Security**: Nenhuma credencial em git

---

## 📞 Comandos Úteis de Referência

```bash
# Local
npm run dev                    # Dev server
npm run build                  # Build produção
npm run preview                # Testar build local

# Azure
az login                       # Login Azure
az group create ...            # Criar resource group
az staticwebapp create ...     # Criar SWA
az staticwebapp show ...       # Ver detalhes
az staticwebapp logs ...       # Ver logs

# GitHub
gh secret list                 # Listar secrets
git push origin main           # Trigger deploy
```

---

## 🎯 Roadmap Pós-Migração

1. **Week 1**: Migração completa + validação
2. **Week 2**: Custom domain + certificado SSL
3. **Week 3**: Monitoring com Application Insights
4. **Week 4**: Admin auth com Firebase Custom Claims
5. **Week 5**: Backup automático Firestore

---

## 📚 Recursos Externos

- [Azure Static Web Apps Docs](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)

---

**Criado em**: 06/02/2026  
**Projeto**: EvolveAI Hackathon  
**Status**: ✅ Pronto para migração  

Para começar, execute: `node setup-azure.js` 🚀
