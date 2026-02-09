# ⚠️ ANÁLISE DE RISCOS - Deploy na Azure (Estado Atual)

## 🎯 PERGUNTA
Quais riscos se eu deployar AGORA mantendo a estrutura como está?

## ✅ O QUE JÁ ESTÁ BEM

```
✅ Firebase config com env vars (credenciais não expostas em git)
✅ Firestore rules implementadas (autenticação + autorização)
✅ GitHub Actions workflow com secrets (CI/CD seguro)
✅ .gitignore atualizado (.env.* ignorados)
✅ staticwebapp.config.json com security headers
✅ Azure SWA com HTTPS automático
✅ Vite build otimizado
```

---

## 🔴 RISCOS CRÍTICOS (Bloqueia deploy em produção)

### 1. Admin Panel com Credenciais Hardcoded
**Arquivo:** `src/pages/AdminPage.jsx` (linha ~16)

```javascript
// ❌ RISCO: Senha em plaintext no código
if (credentials.username === 'admin' && credentials.password === 'evolveai2026') {
```

**Impacto:**
- Qualquer pessoa com acesso ao repo (ou build) consegue acessar admin
- Qualquer pessoa com acesso a ferramentas de dev consegue ver no localStorage
- Se houver vazamento de source code, admin está comprometido

**Severidade:** 🔴 CRÍTICA  
**Probabilidade:** 🔴 ALTA (é código fonte)  
**Exploração:** ⚡ TRIVIAL (basta fazer login)  

**Mitigação:**
- [ ] Remover check hardcoded e forçar Firebase Custom Claims
- [ ] Ou desabilitar admin panel até ter autenticação real
- [ ] Tempo: 30 minutos

---

### 2. Sign-In Anônimo Habilitado (Provavelmente)
**Localização:** Firebase Console → Authentication → Sign-in method

**Impacto:**
- Usuários sem email conseguem criar contas infinitas
- Bots conseguem fazer mil contas em segundos
- Podem poluir banco de dados de seleções
- Quotas de Firestore podem estourar rapidamente

**Severidade:** 🔴 CRÍTICA  
**Probabilidade:** 🟠 MÉDIA (depende de não ter sido desabilitado)  
**Exploração:** ⚡ TRIVIAL (bota automático consegue explorar)  

**Mitigação:**
- [ ] Firebase Console → Authentication → desabilitar Anonymous
- [ ] Tempo: 2 minutos

---

### 3. API Key Pública Sem Proteção (App Check Ausente)
**Localização:** `src/firebase/config.js` (VITE_FIREBASE_API_KEY exposta no bundle)

**Impacto:**
- Bots conseguem fazer querys diretas para Firestore
- DDoS ao banco de dados
- Quotas podem estourar ($$$)
- Dados podem ser lidos/escritos por atacantes

**Severidade:** 🔴 CRÍTICA  
**Probabilidade:** 🟠 MÉDIA (requer conhecimento técnico, mas é público)  
**Exploração:** 🕐 DIAS (tempo para criar script de abuso)  

**Exemplo de ataque:**
```javascript
// Qualquer pessoa com sua API Key consegue fazer:
const db = getFirestore(app); // usando sua chave
const q = query(collection(db, 'teams'));
const snapshot = await getDocs(q); // vê TODOS os teams!
```

**Mitigação:**
- [ ] Ativar Firebase App Check (reCAPTCHA v3)
- [ ] Restringir API Key por HTTP referrer
- [ ] Tempo: 1 hora

---

## 🟠 RISCOS ALTOS (Degradação de segurança)

### 4. Credenciais Firebase Pessoais do Colega
**Contextualização:** As credenciais atuais pertencem a um colega

**Impacto:**
- Colega pode ser alvo de phishing/social engineering
- Se conta do colega é comprometida, projeto inteiro fica exposto
- Difícil rastrear quem fez mudanças (audit logs)
- Colega sai da equipe → credenciais presas com ele

**Severidade:** 🟠 ALTA  
**Probabilidade:** 🟠 MÉDIA (risk pessoal)  
**Exploração:** 🕐 HORAS  

**Mitigação:**
- [ ] Criar service account dedicada (não-pessoal)
- [ ] Colega não usa mais conta pessoal para ops do Firebase
- [ ] Tempo: 30 minutos (pelo colega)

---

### 5. Sem Rate Limiting no Frontend
**Localização:** Nenhum (não há proteção antes de Firestore)

**Impacto:**
- Um usuário malicioso consegue fazer 1000 seleções/sec
- Queimam quota de escrita rapidamente
- Podem bloquear usuários legítimos

**Severidade:** 🟠 ALTA  
**Probabilidade:** 🟠 MÉDIA (requer intenção maliciosa)  
**Exploração:** 🕐 MINUTOS  

**Mitigação:**
- [ ] App Check reduz 80% do abuso (robôs)
- [ ] Cloud Functions como gateway com throttling (futuro)
- [ ] Tempo: Imediato com App Check

---

### 6. Sem Monitoramento / Alertas
**Localização:** Cloud Console (não configurado)

**Impacto:**
- Não vai notar quota estourando até depois
- Não vai saber se há ataque em progresso
- Contas pessoais podem estar fazendo ops sem saber

**Severidade:** 🟠 ALTA  
**Probabilidade:** 🟡 MÉDIA (é sorte se problema acontecer)  
**Exploração:** N/A (detecta problema)  

**Mitigação:**
- [ ] Cloud Monitoring: criar alertas de quota
- [ ] Cloud Billing: criar budget alert
- [ ] Tempo: 20 minutos

---

## 🟡 RISCOS MÉDIOS (Compliance / Operational)

### 7. Sem Backup / Disaster Recovery
**Impacto:**
- Se Firestore for deletado acidentalmente, sem backup
- Google pode ter backups, mas restore é manual + tempo

**Severidade:** 🟡 MÉDIA  
**Exploração:** 🕐 DIAS (se acontecer acidente)  

**Mitigação:**
- [ ] Ativar Firestore backups automáticos
- [ ] Tempo: 5 minutos (Console)

---

### 8. Sem Logging / Audit Trail
**Impacto:**
- Não consegue rastrear quem deletou dados
- Compliance pode questionar

**Severidade:** 🟡 MÉDIA  
**Exploração:** N/A (forensics)  

**Mitigação:**
- [ ] Habilitar Cloud Audit Logs
- [ ] Tempo: 5 minutos

---

### 9. CORS / Referrer Não Restringido
**Impacto:**
- Um site malicioso consegue fazer requests do navegador do usuário para seu Firebase
- Steal session tokens

**Severidade:** 🟡 MÉDIA  
**Exploração:** 🕐 HORAS  

**Mitigação:**
- [ ] App Check + restrict API key por referrer
- [ ] Tempo: 10 minutos

---

## 🟢 RISCOS BAIXOS (Best practices)

### 10. Console Logs com Dados Sensíveis
**Impacto:** Desenvolvedores podem expor emails/IDs no console

**Severidade:** 🟢 BAIXA  
**Mitigação:** Remover `console.error()` com dados sensíveis

---

### 11. Sem CSP (Content Security Policy)
**Impacto:** Possível XSS (baixa probabilidade em React)

**Severidade:** 🟢 BAIXA  
**Mitigação:** staticwebapp.config.json já tem headers básicos

---

## 📊 MATRIX DE RISCO

```
┌──────────────────┬───────────┬─────────────┬────────────┐
│ Risco            │ Severidade│ Probabilidade│ Bloqueador?│
├──────────────────┼───────────┼─────────────┼────────────┤
│ Admin hardcoded  │ 🔴 CRÍTICA│ 🔴 ALTA     │ ✅ SIM     │
│ Anônimo habilitado│ 🔴 CRÍTICA│ 🟠 MÉDIA    │ ✅ SIM     │
│ API key sem check│ 🔴 CRÍTICA│ 🟠 MÉDIA    │ ⚠️ TALVEZ  │
│ Service pessoal  │ 🟠 ALTA   │ 🟠 MÉDIA    │ ⚠️ TALVEZ  │
│ Sem rate limit   │ 🟠 ALTA   │ 🟠 MÉDIA    │ ⚠️ TALVEZ  │
│ Sem monitoramento│ 🟠 ALTA   │ 🟡 MÉDIA    │ ❌ NÃO     │
│ Sem backup       │ 🟡 MÉDIA  │ 🟡 BAIXA    │ ❌ NÃO     │
│ Sem audit logs   │ 🟡 MÉDIA  │ 🟡 BAIXA    │ ❌ NÃO     │
│ CORS aberto      │ 🟡 MÉDIA  │ 🟡 BAIXA    │ ❌ NÃO     │
│ Console logs     │ 🟢 BAIXA  │ 🟡 BAIXA    │ ❌ NÃO     │
└──────────────────┴───────────┴─────────────┴────────────┘
```

---

## ✅ RECOMENDAÇÃO

### Opção A: Deploy AGORA com Ressalvas (Não Recomendo)
```
❌ Não recomendo

Riscos:
• Admin panel comprometido
• Possível DDoS ao banco
• Quotas podem estourar
• Sem visibilidade de problemas

Se insistir:
1. DEVE desabilitar admin panel (desabilitar rota)
2. DEVE desabilitar Sign-in Anônimo
3. DEVE ativar App Check (reCAPTCHA)
4. DEVE restringir API key
5. DEVE criar alertas de quota

Tempo: 1 hora
Risco remanescente: MÉDIO-ALTO
```

---

### Opção B: Deploy Seguro (Recomendado) ✅
```
✅ Recomendo

Pré-requisitos (colega faz):
1. Desabilitar Sign-in Anônimo (2 min)
2. Desabilitar Anonymous login (2 min)
3. Registrar app no App Check (reCAPTCHA) (15 min)
4. Criar service account dedicada (15 min)
5. Rotacionar API Key (10 min)
6. Criar budget alerts (5 min)
7. Habilitar Firestore backups (2 min)

Pré-requisitos (seu code):
1. Remover admin hardcoded, usar Custom Claims (30 min)
2. Adicionar App Check init ao Firebase config (15 min)
3. Testar localmente (30 min)

Tempo total: ~2 horas
Risco: BAIXO
```

---

## 🎯 CHECKLIST PRÉ-DEPLOY (Mínimo)

Se quer fazer deploy TODAY, PRECISA fazer:

```
COLEGA (Firebase Console):
  [ ] Desabilitar Sign-in Anônimo (2 min)
  [ ] Registrar App Check + ativar reCAPTCHA (15 min)
  [ ] Restringir API Key por referrer (5 min)
  [ ] Criar Cloud Billing alert (5 min)

VOCÊ (Código):
  [ ] Remover/desabilitar admin panel hardcoded (30 min)
  [ ] Testar login com Firebase Custom Claims (30 min)
  [ ] npm run build && npm run preview (10 min)
  [ ] Commit + push (1 min)

VALIDAÇÃO:
  [ ] GitHub Actions completa com sucesso (5 min)
  [ ] Deploy no Azure completa (5 min)
  [ ] Teste login em https://seu-app.azurestaticapps.com (5 min)

TEMPO TOTAL: ~2 horas
```

---

## 📋 SE IGNORA PRÉ-REQUISITOS

Se fizer deploy TODAY sem essas mudanças:

1. **24h depois:** Possível DDoS/abuso (alguém escreve script simples)
2. **48h depois:** Quota de Firestore pode estourar ($$$)
3. **1 semana:** Admin panel pode ser acessado por terceiros
4. **2 semanas:** Sem saber quem fez o que (sem audit logs)

**Custo potencial:**
- Quota estourada: $500-2000 (Firestore free tier é pequeno)
- Downtime: Hackathon comprometido
- Reputação: Competitors conseguem derrubar

---

## 🚀 PRÓXIMA AÇÃO

Escolha:

**A) Deploy SEGURO em ~2 horas:**
1. Colega faz 5 ações no Firebase Console (27 min)
2. Você remove admin hardcoded e adiciona App Check (1h15m)
3. Deploy automático no GitHub Actions (5 min)

**B) Deploy RÁPIDO AGORA com risco:**
1. Apenas `node setup-azure.js`
2. Deploy direto (45 min)
3. ⚠️ Mas com riscos críticos acima

Qual prefere? Se A, mando tarefas específicas para você e colega.
