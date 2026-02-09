# ⏳ O QUE VOCÊ FAZ AGORA (Enquanto colega trabalha)

## 🔄 Timeline

```
AGORA (0:00)
├─ ✅ Você: App Check code já pronto
├─ 🔴 Colega: Começa Firebase Console
└─ ⏱️ Tempo: ~15 min

ENQUANTO COLEGA TRABALHA (0:00 - 0:15)
├─ Você: Tarefas 1-4 abaixo
└─ ⏱️ Tempo: ~20 min

QUANDO COLEGA TERMINA (0:15)
├─ Você: Tarefa 5 (atualizar site key)
├─ Você: Tarefa 6 (build + preview test)
└─ ⏱️ Tempo: ~15 min

DEPOIS DO BUILD OK (0:30)
├─ Você: Tarefa 7 (git commit + push)
└─ GitHub Actions: Deploy automático (+15 min)

✅ LIVE (0:45 total)
```

---

## ✅ TAREFA 1: Revisar código no VS Code

**Tempo: 5 min**

```bash
Abra: VS Code (Hacka Brazuca folder)

1. Arquivo: src/firebase/config.js
   ✓ Scroll para linha ~4
   ✓ Veja: import { initializeAppCheck, ReCaptchaV3Provider }
   ✓ Scroll para linha ~125
   ✓ Veja: initializeAppCheck(app, { ... })
   ✓ Entenda: Código pronto para App Check!

2. Arquivo: src/pages/AdminPage.jsx
   ✓ Linha 1: import { ... useEffect } (novo)
   ✓ Linha 17: checkAdminStatus() (novo)
   ✓ Linha 20: useEffect hook (novo)
   ✓ Procure por: "admin" ou "evolveai2026"
   ✓ Resultado: Não encontrar = ✅ Seguro!

3. Arquivo: .env.example
   ✓ Linha ~11: VITE_FIREBASE_RECAPTCHA_SITE_KEY
   ✓ Veja: novo template adicionado
```

---

## ✅ TAREFA 2: Verificar git status

**Tempo: 2 min**

```bash
# No VS Code, abra Terminal (Ctrl + `)
# Ou abra PowerShell na pasta do projeto

cd 'c:\Users\gustavo.o.corvino\OneDrive - Avanade\Documents\Hacka Brazuca'

# Verificar mudanças:
git status

# ESPERADO:
# Modified: src/firebase/config.js
# Modified: src/pages/AdminPage.jsx
# Modified: .env.example
```

---

## ✅ TAREFA 3: Revisar mudanças em detalhe

**Tempo: 5 min**

```bash
# Ver exatamente o que mudou:
git diff src/firebase/config.js

# Procure por:
# + import { initializeAppCheck, ReCaptchaV3Provider }
# + initializeAppCheck(app, {
# Resultado esperado: Linhas em verde (adicionadas)

git diff src/pages/AdminPage.jsx

# Procure por:
# - import { signInAnonymously }
# - const [credentials, ...
# - const handleLogin
# Resultado esperado: Linhas em vermelho (removidas)

# + useEffect(() => {
# + checkAdminStatus()
# Resultado esperado: Linhas em verde (adicionadas)

git diff .env.example

# Procure por:
# + VITE_FIREBASE_RECAPTCHA_SITE_KEY
```

---

## ✅ TAREFA 4: Preparar .env.local (placeholder)

**Tempo: 3 min**

Se você ainda não tem `.env.local` na raiz do projeto:

```bash
# Via Terminal PowerShell:
# Copiar arquivo template
Copy-Item '.env.example' '.env.local'

# Ou manualmente:
# 1. Em VS Code, clique direito em Explorer
# 2. New File
# 3. Nome: .env.local
# 4. Colar conteúdo de .env.example
```

**Conteúdo inicial de .env.local:**
```
VITE_FIREBASE_API_KEY=seu_api_key_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain_aqui
VITE_FIREBASE_PROJECT_ID=evolveai-hackathon
VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket_aqui
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_id_aqui
VITE_FIREBASE_APP_ID=seu_app_id_aqui

# DEIXAR VAZIO POR ENQUANTO - colega vai passar a site key
VITE_FIREBASE_RECAPTCHA_SITE_KEY=

# Comentar por enquanto
# VITE_ADMIN_USERNAME=admin
# VITE_ADMIN_PASSWORD=...
```

⚠️ **Importante:** `.env.local` NÃO vai ser commitado (está em .gitignore ✅)

---

## ✅ TAREFA 5: Quando colega avisa (site key pronto)

**Tempo: 2 min**

Colega vai enviar: "Site key pronto: AIzaSy..."

```bash
# Abra .env.local no VS Code

# Procure por:
VITE_FIREBASE_RECAPTCHA_SITE_KEY=

# Atualize para:
VITE_FIREBASE_RECAPTCHA_SITE_KEY=AIzaSy_xxxxxxxxxxxxx_aqui

# Salve: Ctrl+S
```

---

## ✅ TAREFA 6: Build + Preview (depois que colega termina)

**Tempo: 15 min**

Antes disto, **INSTALE Node.js se não tem:**

```bash
# Verificar se Node.js está instalado:
node --version

# Se NÃO estiver instalado:
# Vá em: https://nodejs.org/ → Download LTS (v20+)
# Instale normalmente
# Reinicie PowerShell/Terminal
```

**Depois de Node.js pronto:**

```bash
cd 'c:\Users\gustavo.o.corvino\OneDrive - Avanade\Documents\Hacka Brazuca'

# Limpar cache (seguro)
npm run build:clean  # ou: rm -r node_modules .vite dist

# Instalar dependências
npm install

# Build para verificar erros
npm run build

# ESPERADO:
# ✓ xxx modules resolved
# ✓ No errors
# ✓ dist/ folder criada com arquivos

# Preview (simular produção)
npm run preview

# RESULTADO:
# Local: http://localhost:4173/
# Abra no navegador:
#  - Página inicial carrega ✅
#  - Admin page mostra "Acesso Restrito" ✅
#  - reCAPTCHA badge no canto inferior direito ✅
#  - Sem erros no console ✅
```

---

## ✅ TAREFA 7: Git commit + push

**Tempo: 5 min**

```bash
cd 'c:\Users\gustavo.o.corvino\OneDrive - Avanade\Documents\Hacka Brazuca'

# Ver mudanças finais
git status

# Add all changes
git add .

# Commit com mensagem
git commit -m "Security: Add App Check with reCAPTCHA v3 initialization"

# Push to main
git push origin main

# ESPERADO:
# ✓ 3 files changed
# ✓ branch 'main' set to track 'origin/main'
```

---

## 🤖 GitHub Actions (AUTOMÁTICO)

Depois que você faz `git push`:

```
1. GitHub Actions dispara automaticamente
   → Vê o workflow: .github/workflows/azure-static-web-apps-deploy.yml

2. Workflow executa:
   → npm ci (install dependencies)
   → npm run build (build Vite)
   → Deploy to Azure SWA

3. Tempo: ~10-15 minutos

4. Resultado: App ao vivo em https://seu-app.azurestaticapps.net
```

---

## 📊 CHECKLIST RESUMIDO

```
☐ 1. Revisar código (src/firebase/config.js, AdminPage.jsx)
☐ 2. git status (verificar mudanças)
☐ 3. git diff (revisar linhas exatas)
☐ 4. Copiar .env.local (com placeholder site key)
☐ 5. [ESPERA COLEGA] Quando site key pratar → atualizar .env.local
☐ 6. npm install
☐ 7. npm run build (verificar sucesso)
☐ 8. npm run preview (testar local)
☐ 9. git commit + push
☐ 10. Verificar GitHub Actions na dashboard (verde ✅)
```

---

## ⏱️ TEMPO TOTAL

- **Tarefas 1-4:** 15 min (ENQUANTO colega trabalha)
- **Tarefas 5-9:** 15 min (DEPOIS colega enviar site key)
- **GitHub Actions:** 15 min (automático, você descansa)
- **TOTAL até ao vivo:** ~45 min

---

## 🆘 Se algo der errado

### npm run build falha
```bash
# Tentar limpar cache:
rm -r node_modules .vite
npm install
npm run build
```

### npm run preview não funciona
```bash
# Verificar porta 4173 está livre:
lsof -i :4173  # Mac/Linux
netstat -ano | findstr :4173  # Windows

# Se ocupada, mudar porta em vite.config.js:
# server: { port: 5174 }
```

### Git push falha
```bash
# Verificar branch:
git branch

# Deve ser 'main' ou 'master'
# Se não tiver: 
git branch -M main
git push -u origin main
```

---

**Entendeu? Pronto para começar as tarefas 1-4?**
