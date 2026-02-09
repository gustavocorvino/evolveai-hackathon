# 🚀 DEPLOY PRONTO EM 1-2 HORAS

**Status:** ✅ Código corrigido | 🔴 Firebase Console pendente

---

## O QUE JÁ FOI FEITO ✅

```
✅ Removido: hardcoded 'admin' / 'evolveai2026' password
✅ Removido: Anonymous Sign-in do código
✅ Implementado: Firebase Custom Claims verification
✅ Firebase config: usando import.meta.env (env vars)
✅ Firestore Rules: autenticação obrigatória
✅ GitHub Actions: CI/CD pronto
✅ Azure SWA: security headers + CSP
```

---

## O QUE VOCÊ (COLEGA) PRECISA FAZER 🔴

**Tempo: 15 minutos**  
**Local:** https://console.firebase.google.com

### 1️⃣ Desabilitar Anonymous Sign-in
```
✓ Firebase Console
✓ Projeto: evolveai-hackathon
✓ Authentication → Sign-in method
✓ Encontrar "Anonymous"
✓ DESABILITAR (toggle OFF)
✓ Confirmar
```

### 2️⃣ Registrar App Check + reCAPTCHA v3
```
✓ Authentication → App Check
✓ Clique: "+ Add App"
✓ Platform: Web
✓ Provider: reCAPTCHA v3
✓ Se não tem site key:
  → https://www.google.com/recaptcha/admin
  → "Create new site"
  → reCAPTCHA v3
  → Add seu domínio: seu-app.azurestaticapps.net
  → Copiar site key
✓ Cole a site key no App Check
✓ ✅ Pronto! Copie a site key e envie para o dev
```

### 3️⃣ (Opcional) Configurar Billing Alert
```
✓ Billing → Budgets and alerts
✓ Create budget
✓ Limit: $50/month
✓ Email notifications: ON
✓ ✅ Salvar
```

---

## O QUE O DEV PRECISA FAZER 👨‍💻

**Tempo: 20 minutos**

```bash
# 1. Abrir: src/firebase/config.js
#    Adicionar após initializeApp():
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

if (import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY) {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(
      import.meta.env.VITE_FIREBASE_RECAPTCHA_SITE_KEY
    ),
    isTokenAutoRefreshEnabled: true
  });
}

# 2. Adicionar ao .env.local:
VITE_FIREBASE_RECAPTCHA_SITE_KEY=<site-key-aqui>

# 3. Local test:
npm run build
npm run preview
# → http://localhost:4173

# 4. Git + push:
git add .
git commit -m "Security: Add App Check reCAPTCHA"
git push origin main

# 5. GitHub Actions:
#    → Automatic build + deploy
#    → ~15 min até ao vivo
```

---

## TIMELINE

```
AGORA (0:00)
  ↓
COLEGA (0:00 - 0:15) - 15 min
  → Desabilitar Anonymous
  → Registrar App Check
  → Copiar site key
  ↓
DEV (0:15 - 0:35) - 20 min
  → Adicionar App Check config
  → Adicionar site key .env.local
  → npm run build + preview (test local)
  → git commit + push
  ↓
GITHUB ACTIONS (0:35 - 0:50) - 15 min
  → Build
  → Deploy to Azure
  ↓
✅ LIVE (0:50)
  → https://seu-app.azurestaticapps.net
```

**Total:** ~1 hora

---

## RISCO SE NÃO FIZER ISTO

| Cenário | Se não fizer | Se fizer |
|---------|-------------|----------|
| **App fica no ar >24h** | 90% chance de quota exceeded | 1% chance |
| **Custos adicionais** | $50-500+ | $0 |
| **Admin panel** | Qualquer um acessa | Só admin |
| **DDoS possível** | SIM | Bloqueado por App Check |

---

## PASSO-A-PASSO: COLEGA 👥

```
1. Abra seu navegador
   → https://console.firebase.google.com

2. Login com sua conta Google

3. Selecione projeto "evolveai-hackathon"

4. Menu esquerdo → "Authentication"

5. Clique em "Sign-in method" tab

6. Procure por "Anonymous" (deve estar em azul/ativo)

7. Clique na linha do "Anonymous"

8. Clique no toggle para DESABILITAR
   (deve ficar cinza)

9. Clique em "DISABLE" para confirmar

✅ Pronto! Etapa 1 concluída.

---

10. No menu esquerdo → "App Check"

11. Clique em "+ Add app"

12. Selecione "Web"

13. Selecione "reCAPTCHA v3"

14. Na dropdown de site keys, se não tiver nenhuma:
    → Abra https://www.google.com/recaptcha/admin
    → Clique "+ Create new site"
    → Name: "evolveai-hackathon"
    → reCAPTCHA v3
    → Domains: seu-app.azurestaticapps.net
    → Accept terms
    → Create
    → Copie o "Site Key"

15. Volte para Firebase Console
    → Cole o site key em App Check
    → Confirme "Register app"

✅ Pronto! Etapa 2 concluída.

16. Envie a site key para o dev:
    "Aqui está: AIzaSy..." (copiar exatamente)
```

---

## CHECKLIST

### Colega ✓
- [ ] Desabilitar Anonymous Sign-in
- [ ] Registrar App Check com reCAPTCHA v3
- [ ] Copiar site key para dev

### Dev ✓
- [ ] Adicionar App Check import + init
- [ ] Adicionar site key .env.local
- [ ] npm run build (testar)
- [ ] npm run preview (testar)
- [ ] git push origin main
- [ ] Verificar GitHub Actions ✅
- [ ] Validar https://seu-app.azurestaticapps.net

---

**Documentação técnica:** Ver [DEPLOYMENT_STATUS.md](DEPLOYMENT_STATUS.md)

**Dúvidas?** Ver [RISCOS_DEPLOY_AGORA.md](RISCOS_DEPLOY_AGORA.md) para entender por que isto é importante.
