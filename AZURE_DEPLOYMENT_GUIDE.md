# 📚 Guia Prático - Migração para Azure Static Web Apps

## ✅ FASE 1: Preparação Local (15-20 minutos)

### Passo 1.1: Instalar Azure CLI
```powershell
# Windows (PowerShell)
Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile AzureCLI.msi
Start-Process msiexec.exe -ArgumentList '/i', 'AzureCLI.msi'
```

**Ou baixar manualmente**: https://aka.ms/installazurecliwindows

Verificar instalação:
```powershell
az --version
```

### Passo 1.2: Configurar .env.local

```bash
# Executar o setup script (preenchedor automático)
node setup-azure.js
```

Ou criar manualmente `.env.local`:
```env
VITE_FIREBASE_API_KEY=AIzaSyBbXZMlarLWvw9dsbutTlBloesq_gkprxs
VITE_FIREBASE_AUTH_DOMAIN=evolveai-hackathon.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=evolveai-hackathon
VITE_FIREBASE_STORAGE_BUCKET=evolveai-hackathon.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=806986913757
VITE_FIREBASE_APP_ID=1:806986913757:web:f0013fef6fa0c83f2c0834
```

### Passo 1.3: Testar Localmente

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Em outro terminal, buildar para produção
npm run build

# Testar a build de produção
npm run preview
```

**Resultado esperado**: Aplicação roda em `http://localhost:5173`

---

## 🔐 FASE 2: Configurar GitHub Secrets (5-10 minutos)

### Passo 2.1: Copiar Token do Azure

```powershell
# Fazer login na Azure
az login

# Obter informações de acesso
az account show
```

### Passo 2.2: Adicionar Secrets no GitHub

1. Ir para: **https://github.com/seu-usuario/seu-repo/settings/secrets/actions**

2. Clique em **"New repository secret"**

3. Criar cada secret (cópia-cola de `.env.local`):

| Nome | Valor |
|------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyBbXZMlarLWvw...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `evolveai-hackathon.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `evolveai-hackathon` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `evolveai-hackathon.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `806986913757` |
| `VITE_FIREBASE_APP_ID` | `1:806986913757:web:...` |

✅ Confirme que todos os 6 secrets estão criados.

---

## 🌐 FASE 3: Criar Azure Static Web App (10-15 minutos)

### Passo 3.1: Login na Azure (via CLI)

```powershell
az login
```

Isso abrirá o navegador para autenticação.

### Passo 3.2: Criar Grupo de Recursos

```powershell
az group create `
  --name evolveai-rg `
  --location eastus
```

### Passo 3.3: Criar Static Web App

```powershell
# Gerar GitHub Token: https://github.com/settings/tokens
# Escopo necessário: repo, workflow

az staticwebapp create `
  --name evolveai-hackathon-swa `
  --resource-group evolveai-rg `
  --source https://github.com/seu-usuario/seu-repo `
  --location eastus `
  --branch main `
  --app-location "src" `
  --output-location "dist" `
  --token SEU_GITHUB_TOKEN_AQUI
```

**Resultado esperado**: Comando cria automaticamente:
- Recurso Azure Static Web App
- GitHub Actions workflow (ou atualiza)
- Deployment automático para `main` branch

---

## 🚀 FASE 4: Primeiro Deploy (Automático)

### Passo 4.1: Fazer Commit e Push

```bash
# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "feat: migração para Azure Static Web Apps"

# Push para main
git push origin main
```

### Passo 4.2: Monitorar Deploy

**Opção A: Via GitHub**
1. Ir para: **https://github.com/seu-usuario/seu-repo/actions**
2. Clicar em workflow "Azure Static Web Apps CI/CD"
3. Ver build em tempo real

**Opção B: Via Azure CLI**
```powershell
# Ver status do deploy
az staticwebapp show `
  --name evolveai-hackathon-swa `
  --resource-group evolveai-rg

# Ver logs
az staticwebapp logs `
  --name evolveai-hackathon-swa `
  --resource-group evolveai-rg
```

---

## ✨ FASE 5: Validação e Go-Live (10-15 minutos)

### Passo 5.1: Acessar a Aplicação

1. Após deploy concluir, obter URL:
```powershell
az staticwebapp show `
  --name evolveai-hackathon-swa `
  --resource-group evolveai-rg `
  --query "defaultHostname"
```

2. Abrir no navegador: **https://[seu-swa].azurestaticapps.com**

### Passo 5.2: Testes Funcionais

- [ ] Página de login carrega
- [ ] Login com equipe funciona
- [ ] Seleção de caso de uso funciona
- [ ] Dados persistem no Firestore
- [ ] Página admin carrega
- [ ] Responsivo (mobile/tablet)

### Passo 5.3: Performance (Lighthouse)

```bash
# Instalar Lighthouse CLI
npm install -g @lhci/cli@latest

# Testar URL de produção
lighthouse https://[seu-swa].azurestaticapps.com --view
```

**Valores esperados**:
- Performance: > 80
- Accessibility: > 90
- Best Practices: > 80
- SEO: > 90

---

## 🔧 Troubleshooting

### ❌ Build falha no GitHub Actions

**Solução 1**: Verificar secrets
```bash
# Confirmar que todos os 6 secrets estão configurados no GitHub
# Settings → Secrets and variables → Actions
```

**Solução 2**: Testar build local
```bash
npm run build
npm run preview
```

**Solução 3**: Verificar logs
- GitHub: **Actions → workflow → build job**
- Azure: `az staticwebapp logs --name evolveai-hackathon-swa --resource-group evolveai-rg`

---

### ❌ Firebase não conecta em produção

**Causas comuns**:
1. Secrets não configurados → Verificar GitHub Secrets
2. CORS não permitido → Adicionar origem no Firebase Console
3. Credenciais erradas → Validar contra `.env.local`

**Debug**:
```javascript
// Abrir Console do Navegador (F12)
// Verificar se variáveis estão carregadas:
console.log(import.meta.env.VITE_FIREBASE_PROJECT_ID)
```

---

### ❌ Admin page inacessível

**Problema**: Rota `/admin` retorna 403

**Solução**:
1. Remover role requirement de `staticwebapp.config.json`
2. Ou implementar autenticação Firebase Custom Claims

---

## 📊 Dashboard Azure

Após deploy, monitorar:

1. **Portal Azure**: https://portal.azure.com
2. Procurar por: **evolveai-hackathon-swa**
3. Opções úteis:
   - **Overview**: Status e URL
   - **Builds**: Histórico de deploys
   - **Configuration**: Variáveis de ambiente
   - **Monitoring**: Performance e erros

---

## 🎯 Checklist Final

- [ ] .env.local criado localmente
- [ ] 6 GitHub Secrets configurados
- [ ] Código commitado e pushed
- [ ] Azure Static Web App criado
- [ ] GitHub Actions workflow executado com sucesso
- [ ] Aplicação acessível em https://[seu-swa].azurestaticapps.com
- [ ] Firebase conecta e funciona
- [ ] Admin page acessível
- [ ] Lighthouse score > 80
- [ ] Migração de Vercel → Azure concluída ✅

---

## 📞 Próximos Passos

1. **Custom Domain** (opcional):
   ```powershell
   az staticwebapp custom-domain register `
     --name evolveai-hackathon-swa `
     --resource-group evolveai-rg `
     --domain-name seu-dominio.com
   ```

2. **Monitoramento**: Configurar Application Insights
3. **Backup**: Ativar replicação de Firestore
4. **Performance**: Implementar caching com Azure CDN

