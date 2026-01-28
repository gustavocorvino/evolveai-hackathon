# Product Requirements Document (PRD)
## EvolveAI Hackathon Brasil - Sistema de Seleção de Casos de Uso

**Versão:** 1.0  
**Data:** 27 de Janeiro de 2026  
**Autor:** João - PM Avanade  
**Status:** Draft para Revisão  
**Projeto:** Plataforma de Seleção de Casos de Uso

---

## 📊 Change Log

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 2026-01-27 | 1.0 | Versão inicial da PRD baseada no Discovery | João - PM Avanade |

---

## 🎯 Goals and Background Context

### Goals

- **Automatizar o Processo de Seleção**: Eliminar processos manuais de atribuição de casos de uso, permitindo que 300 equipes escolham autonomamente entre 60 casos disponíveis
- **Garantir Integridade das Seleções**: Implementar controle de concorrência para evitar que múltiplas equipes selecionem o mesmo caso de uso
- **Proporcionar Experiência Intuitiva**: Criar interface tipo "cardápio" que permite navegação fácil e decisão informada em até 15 minutos
- **Habilitar Gestão Administrativa**: Fornecer dashboard para organizadores gerenciarem casos de uso, monitorarem seleções em tempo real e exportarem relatórios
- **Entregar MVP em 1 Dia**: Desenvolver e deployar solução funcional com stack tecnológica simples e ágil para uso imediato no hackathon

### Background Context

O EvolveAI Hackathon Brasil reunirá aproximadamente 300 equipes que precisarão escolher casos de uso para desenvolver durante o evento. Atualmente, esse processo seria manual e propenso a erros (duplicações, falta de visibilidade, dificuldade de controle). Com apenas 60 casos disponíveis e alta concorrência, é crítico ter um sistema automatizado que:

1. Mostre disponibilidade em tempo real
2. Bloqueie casos já selecionados instantaneamente
3. Permita que organizadores gerenciem o processo de forma centralizada
4. Libere casos automaticamente se equipes não completarem seleção em 15 minutos

A aplicação atua como um "marketplace" de casos de uso, onde cada equipe entra, explora opções organizadas por categoria (Indústria, Práticas, Cases), e reserva seu caso de forma segura. O prazo extremamente curto de desenvolvimento (1 dia) exige stack tecnológica familiar, arquitetura simples (Monolith), e foco absoluto no MVP.

---

## ✅ Requirements

### Functional Requirements

**FR1: Cadastro de Equipes**
- Sistema deve permitir cadastro de equipe com nome (mínimo 3 caracteres) e email válido
- Validação de formato de email obrigatória
- Combinação nome+email cria identificador único da equipe
- Sistema deve permitir que equipe retorne usando mesmo nome+email (recuperação de sessão)

**FR2: Visualização de Casos de Uso em Galeria**
- Sistema deve exibir todos os 60 casos de uso em formato de cards visuais
- Cada card deve mostrar: Título, Descrição, Categoria (Indústria/Práticas/Cases)
- Sistema deve indicar visualmente disponibilidade: "Disponível" (verde) ou "Selecionado" (cinza/bloqueado)
- Sistema deve oferecer filtros por categoria funcionais
- Interface deve ser responsiva para desktop, tablet e mobile

**FR3: Seleção de Caso de Uso com Timer**
- Sistema deve iniciar timer de 15 minutos ao acessar página de seleção
- Timer deve ser visível e em countdown para o usuário
- Sistema deve bloquear caso selecionado instantaneamente para todas as outras equipes (via WebSocket ou polling < 3s)
- Após 15 minutos sem confirmação, caso deve retornar automaticamente para estado disponível
- Equipe só pode selecionar 1 caso de uso
- Sistema deve exibir mensagem de confirmação "Caso de Uso Selecionado!" contendo detalhes do caso e próximos passos do hackathon

**FR4: Sincronização de Disponibilidade em Tempo Real**
- Sistema deve sincronizar status de disponibilidade entre todos os usuários conectados
- Latência máxima de 3 segundos para refletir mudança de status
- Quando caso é selecionado, deve aparecer como indisponível para todos os outros usuários simultaneamente
- Quando timer expira sem confirmação, caso deve voltar a disponível para todos

**FR5: Autenticação e Painel Administrativo**
- Sistema deve ter área administrativa protegida por autenticação (usuário/senha)
- Admins devem conseguir fazer CRUD completo de casos de uso:
  - Criar novo caso de uso
  - Editar caso existente (título, descrição, categoria)
  - Deletar caso
  - Republicar caso (tornar disponível novamente mesmo que já tenha sido selecionado)
- Dashboard admin deve mostrar:
  - Total de casos cadastrados
  - Quantidade de casos disponíveis
  - Quantidade de casos selecionados
  - Lista de seleções (Equipe + Caso + Timestamp)

**FR6: Exportação de Relatórios**
- Sistema deve permitir exportação de relatório em formato Excel via botão no dashboard admin
- Relatório deve conter colunas: Nome da Equipe, Email, Caso Selecionado, Categoria do Caso, Timestamp da Seleção
- Arquivo deve ser nomeado automaticamente: `relatorio-selecoes-YYYYMMDD-HHMM.xlsx`
- Download deve ser imediato ao clicar no botão

**FR7: Recuperação de Acesso de Equipe**
- Equipe que já fez cadastro deve conseguir fazer login novamente com nome+email
- Sistema deve recuperar status da equipe:
  - Se já selecionou caso: mostrar caso escolhido + próximos passos
  - Se não selecionou: retornar para galeria de casos com timer reiniciado
- Sistema deve manter histórico de seleção mesmo após logout

### Non-Functional Requirements

**NFR1: Performance sob Carga Concorrente**
- Sistema deve suportar 300 acessos simultâneos sem degradação
- Tempo de resposta (p95) para operações CRUD: < 2 segundos
- Atualização de disponibilidade deve ser propagada em < 3 segundos via WebSocket ou polling eficiente
- Banco de dados deve usar transações com locks para prevenir race conditions em seleções

**NFR2: Disponibilidade e Confiabilidade**
- Sistema deve ter uptime de 99.9% durante período do evento
- Sistema deve ser testado com ferramenta de load testing (k6, Artillery ou similar) para simular 300+ usuários antes do evento
- Plano de contingência deve estar documentado (backup deploy, rollback rápido)

**NFR3: Usabilidade e Experiência do Usuário**
- Interface deve ser intuitiva, sem necessidade de treinamento ou manual
- Sistema deve ser responsivo para desktop (1920x1080), tablet (768x1024) e mobile (375x667)
- Feedback visual claro para todas as ações (loading states, confirmações, erros)
- Timer de 15 minutos deve ser visível e destacado para evitar timeouts inesperados
- Filtros de categoria devem ter resposta instantânea (< 500ms)

**NFR4: Segurança**
- Área administrativa deve usar autenticação JWT com senha hasheada (bcrypt)
- Sistema deve proteger contra seleções duplicadas usando transações database e locks pessimistas
- Logs de auditoria devem registrar todas as seleções com timestamp e IP (para troubleshooting)
- Validação de input em todos os formulários (sanitização contra XSS/SQL Injection)

**NFR5: Escalabilidade e Manutenibilidade**
- Arquitetura deve permitir escalar de 60 para 100+ casos sem refatoração
- Banco de dados deve ser dimensionado para 500 equipes (margem de segurança de 66%)
- Código deve ser limpo, comentado e seguir padrões da linguagem escolhida
- Variáveis de configuração devem ser externalizadas (timer, quantidade de casos, credenciais admin)

**NFR6: Deploy e Infraestrutura Simples**
- Infraestrutura deve ser minimalista e gratuita/barata (uso de free tiers quando possível)
- Deploy deve ser automatizado via CI/CD básico (GitHub Actions ou similar)
- Ambiente deve ter monitoramento básico (logs acessíveis, health checks)
- Rollback deve ser possível em < 5 minutos se necessário

---

## 🎨 User Interface Design Goals

### Overall UX Vision

A interface deve transmitir **clareza, rapidez e profissionalismo**, refletindo o espírito tecnológico do EvolveAI Hackathon. A experiência deve ser similar a um "marketplace de oportunidades" onde participantes navegam, exploram e escolhem seu desafio de forma confiante.

**Princípios de Design:**
- **Escaneabilidade**: Cards grandes e visuais que permitem avaliar múltiplos casos rapidamente
- **Clareza de Status**: Distinção visual imediata entre disponível/indisponível
- **Urgência Positiva**: Timer de 15 minutos visível mas não estressante (countdown em destaque sem ser alarmista)
- **Feedback Imediato**: Toda ação resulta em resposta visual instantânea (loading, success, error states)
- **Profissionalismo**: Design limpo e moderno que inspira confiança no sistema

### Key Interaction Paradigms

1. **Exploração Progressiva**: Usuário primeiro vê overview (cards), depois detalhe (modal/página de detalhe), depois confirma (ação final)
2. **Filtragem por Categoria**: Chips ou tabs para filtrar entre Indústria/Práticas/Cases sem recarregar página
3. **Busca Visual**: Cards com hierarquia tipográfica clara (Título em destaque, Descrição secundária)
4. **Confirmação Explícita**: Botão "Selecionar Este Caso" requer clique intencional, exibe modal de confirmação antes de travar
5. **Estado de Loading**: Spinners ou skeleton screens durante operações assíncronas

### Core Screens and Views

1. **Landing Page / Cadastro**
   - Formulário simples e centralizado (Nome da Equipe + Email)
   - Branding do EvolveAI Hackathon no topo
   - CTA claro: "Começar Seleção"

2. **Galeria de Casos de Uso (Main Dashboard)**
   - Grid de cards responsivo (3 colunas desktop, 2 tablet, 1 mobile)
   - Timer de 15 minutos fixo no topo ou sidebar
   - Filtros de categoria em destaque
   - Counter: "X de 60 casos disponíveis"

3. **Modal/Página de Detalhe do Caso**
   - Título e descrição expandida
   - Categoria e subcategoria
   - Botão de ação: "Selecionar Este Caso" (se disponível) ou "Já Selecionado" (se indisponível)
   - Link de voltar para galeria

4. **Página de Confirmação**
   - Mensagem de sucesso destacada: "🎉 Caso de Uso Selecionado!"
   - Detalhes do caso escolhido
   - Seção de próximos passos (instruções do hackathon)
   - Botão para copiar detalhes ou enviar por email

5. **Login Admin**
   - Formulário simples (usuário/senha)
   - Link discreto no footer da landing page ("/admin")

6. **Dashboard Admin**
   - Estatísticas em cards: Total Casos / Disponíveis / Selecionados
   - Tabela de seleções (sortável e filtrável)
   - Botões de ação: Exportar Excel, Gerenciar Casos
   - Seção de CRUD de casos com formulário inline ou modal

### Accessibility

**WCAG AA Compliance**
- Contraste de cores mínimo 4.5:1 para texto
- Todos os elementos interativos devem ser acessíveis via teclado (Tab navigation)
- Labels descritivos em todos os formulários
- Estados de foco visíveis
- Imagens decorativas com alt vazio, imagens informativas com alt descritivo

### Branding

**EvolveAI Hackathon Brasil - Tema Galáctico Futurista**

**Conceito Visual:** Astronauta moderno explorando o universo de possibilidades. O sistema representa uma "jornada espacial" onde cada caso de uso é um destino a ser explorado e protegido (shields de segurança). Estética sci-fi com elementos neon, HUDs tecnológicos, e visual de alta tecnologia espacial.

**Paleta de Cores (Space Neon Palette):**
- **Primária - Deep Space Blue**: #0A1628 (background principal - espaço profundo)
- **Secundária - Nebula Blue**: #1E3A8A (elementos secundários)
- **Accent 1 - Neon Cyan**: #06B6D4 (disponível, ações principais, glow effects)
- **Accent 2 - Solar Orange**: #F97316 (hover states, alertas positivos, destaques)
- **Accent 3 - Cosmic Purple**: #8B5CF6 (elementos decorativos, gradientes)
- **Success - Shield Green**: #10B981 (caso disponível, confirmações)
- **Warning - Star Yellow**: #FBBF24 (timer em urgência, avisos)
- **Error - Nova Red**: #EF4444 (erros, caso indisponível)
- **Neutral Dark**: #1F2937 (cards, containers)
- **Neutral Light**: #F9FAFB (texto, overlays)

**Elementos Visuais Característicos:**
- **Shield Badges**: Escudos neon para indicar status de proteção/seleção
- **Glow Effects**: Efeitos de brilho neon em elementos interativos
- **Particle Effects**: Estrelas e partículas em background (sutil, não intrusivo)
- **HUD Elements**: Interfaces estilo heads-up display (bordas, linhas tecnológicas)
- **Planet Orbs**: Elementos circulares decorativos representando casos de uso
- **Gradients**: Gradientes entre cyan/purple/orange para profundidade

**Tipografia:**
- **Display (Títulos)**: Orbitron ou Exo 2 (futurista, angular)
- **Body (Texto)**: Inter ou Space Grotesk (legível, moderna)
- **Monospace (Dados)**: Fira Code ou JetBrains Mono (timers, contadores)

**Iconografia:**
- Shield (proteção/seleção)
- Rocket (início de jornada)
- Planet/Globe (casos de uso)
- Lock/Unlock (disponibilidade)
- Clock/Timer (countdown)
- Dashboard/Control Panel (admin)
- Material Symbols (outline style com glow effect)

**Tom de Voz**: Inspirador, futurista, aventureiro - "Explore o universo de possibilidades, selecione sua missão!"

### Target Device and Platforms

**Web Responsive (todas as plataformas)**
- Desktop: 1920x1080 (experiência primária, mais espaço para visualizar múltiplos cards)
- Tablet: 768x1024 (experiência intermediária, grid reduzido)
- Mobile: 375x667 (experiência simplificada, navegação vertical)
- Navegadores suportados: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 🛠️ Technical Assumptions

### Repository Structure

**Monorepo (Single Repository)**

Escolha de Monorepo para simplificar desenvolvimento em prazo curto (1 dia). Frontend e Backend no mesmo repositório facilita:
- Compartilhamento de tipos/interfaces (TypeScript)
- Deploy conjunto simplificado
- Menor overhead de coordenação entre repositórios
- Histórico unificado de mudanças

Estrutura sugerida:
```
/
├── frontend/          # React + Vite
├── backend/           # Node.js + Express
├── shared/            # Tipos compartilhados
├── docs/              # Documentação (PRD, Discovery)
└── .github/workflows/ # CI/CD
```

### Service Architecture

**Monolith (Backend Único + Frontend SPA)**

Escolha de arquitetura monolítica para MVP de 1 dia:
- **Backend**: Single Node.js/Express application com todas as rotas
- **Frontend**: Single Page Application (React) servido estaticamente
- **Database**: PostgreSQL ou MongoDB (single instance)
- **WebSocket**: Socket.io integrado no mesmo servidor Express

**Justificativa:**
- Simplicidade de deploy (1 backend, 1 frontend)
- Menor overhead operacional
- Transações database mais simples (evitar saga pattern)
- Escala suficiente para 300 usuários concorrentes
- Reduz complexidade de comunicação inter-serviços

**Componentes do Monolith:**
```
Backend Services (dentro do mesmo processo):
- Auth Service (JWT para admin)
- Team Service (CRUD de equipes)
- UseCase Service (CRUD de casos)
- Selection Service (lógica de seleção + timer)
- Export Service (geração de Excel)
- WebSocket Service (broadcast de updates)
```

### Testing Requirements

**Unit Testing + Critical Integration Tests**

Dado o prazo de 1 dia, foco em:
- **Unit Tests**: Lógica crítica de negócio (validação de seleção, timer, locks)
- **Integration Tests**: Endpoints críticos (POST /select, GET /use-cases, Admin auth)
- **Manual Testing**: UX flows, responsividade, race conditions
- **Load Testing**: Ferramenta externa (k6 ou Artillery) para simular 300+ usuários

**Não incluir no MVP:**
- E2E testing completo (Cypress/Playwright) - insuficiente tempo
- TDD rigoroso - desenvolvimento rápido com testes posteriores em pontos críticos
- Coverage 100% - focar em testes de alta criticidade

**Convenção de métodos de teste:**
- Nomear testes descritivamente: `test_selection_prevents_duplicate_when_concurrent`
- Incluir setup/teardown para database entre testes

### Stack Tecnológica Detalhada

#### Frontend
- **Framework**: React 18 + Vite
- **State Management**: Context API + useReducer (evitar Redux para agilidade)
- **UI Library**: Material-UI (MUI) v5 ou Tailwind CSS + HeadlessUI
- **HTTP Client**: Axios
- **WebSocket Client**: Socket.io-client
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router v6

#### Backend
- **Runtime**: Node.js 18+ LTS
- **Framework**: Express.js 4.x
- **ORM**: Prisma (PostgreSQL) ou Mongoose (MongoDB)
- **Authentication**: jsonwebtoken (JWT) + bcrypt
- **WebSocket**: Socket.io
- **Excel Generation**: exceljs
- **Validation**: Zod (compartilhado com frontend)
- **Logging**: Winston ou Pino

#### Database
**Opção Primária: PostgreSQL**
- ACID-compliant (previne race conditions com SELECT FOR UPDATE)
- Relacional (FK constraints garantem integridade)
- Free tier: Render, Railway, ElephantSQL

**Opção Secundária: MongoDB (se prazo extremamente crítico)**
- Schema-less (mudanças rápidas)
- Free tier: MongoDB Atlas
- Trade-off: Precisa implementar locks manualmente (optimistic locking)

#### Hosting & Deployment
- **Frontend**: Vercel (deploy automático via Git push)
- **Backend**: Render ou Railway (free tier, deploy container/Node)
- **Database**: Serviço managed (Render Postgres, MongoDB Atlas)
- **CI/CD**: GitHub Actions (lint + test + deploy)

### Additional Technical Assumptions and Requests

1. **Environment Variables**: Todas as credenciais e configurações em `.env` (nunca commitar)
   - `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD`, `TIMER_DURATION_MS`

2. **CORS Configuration**: Frontend e Backend em domínios diferentes (Vercel + Render), configurar CORS explicitamente

3. **WebSocket Fallback**: Socket.io deve ter fallback para long-polling caso WebSocket seja bloqueado

4. **Database Migrations**: Prisma Migrate ou scripts SQL versionados para setup inicial

5. **Seed Data**: Script de seed para popular 60 casos de uso iniciais (dados fornecidos por organizadores)

6. **Health Check Endpoint**: `/health` para monitoramento de uptime

7. **Rate Limiting**: Limitar tentativas de login admin (express-rate-limit) para evitar brute force

8. **Error Handling**: Middleware global de erro no Express, log de erros estruturado

9. **TypeScript**: Usar TypeScript no backend e frontend para compartilhar tipos (ex: `UseCaseDTO`, `TeamDTO`)

10. **Git Workflow**: Feature branches + Pull Requests para code review rápido, proteger branch `main`

---

## 📋 Epic List

### Epic 1: Foundation & Core Infrastructure
**Goal:** Estabelecer fundação do projeto (setup monorepo, banco de dados, CI/CD básico) e implementar funcionalidade canary (health check + landing page estática) para validar pipeline de deploy funcionando end-to-end.

### Epic 2: Sistema de Casos de Uso e Gestão Administrativa
**Goal:** Implementar CRUD completo de casos de uso no backend, criar área administrativa protegida com autenticação JWT, e habilitar organizadores a cadastrar os 60 casos iniciais via interface visual.

### Epic 3: Cadastro de Equipes e Galeria de Seleção
**Goal:** Permitir que participantes se cadastrem, visualizem galeria de casos de uso em tempo real (com filtros por categoria), e entendam o status de disponibilidade antes de selecionar.

### Epic 4: Seleção de Casos com Timer e Sincronização Real-Time
**Goal:** Implementar lógica crítica de seleção com timer de 15 minutos, controle de concorrência (race condition protection), e sincronização de disponibilidade via WebSocket para garantir que cada caso seja selecionado por apenas uma equipe.

### Epic 5: Relatórios Administrativos e Melhorias de UX
**Goal:** Adicionar exportação de relatórios em Excel, dashboard de estatísticas para admins, e refinamentos de UX (feedback visual, responsividade, mensagens de confirmação) para preparar o sistema para o evento.

---

## 📦 Epic Details

### Epic 1: Foundation & Core Infrastructure

**Expanded Goal:**  
Estabelecer a base técnica do projeto criando estrutura monorepo, configurando banco de dados com modelo de dados inicial, implementando CI/CD para deploy automatizado, e entregando funcionalidade canary simples (health check endpoint + landing page estática) que valida que todo o pipeline de desenvolvimento até produção está funcionando corretamente.

---

#### Story 1.1: Setup do Monorepo e Estrutura de Projeto

**As a** desenvolvedor,  
**I want** estrutura inicial do monorepo com frontend (React/Vite) e backend (Node/Express) configurados,  
**so that** toda a equipe possa começar a desenvolver features imediatamente sem friction de setup.

**Acceptance Criteria:**
1. Repositório Git criado com estrutura de pastas: `/frontend`, `/backend`, `/shared`, `/docs`, `/.github/workflows`
2. Frontend inicializado com Vite + React + TypeScript, rodando em `localhost:5173` com hot reload
3. Backend inicializado com Express + TypeScript, rodando em `localhost:3000` com nodemon
4. `package.json` na raiz com scripts: `npm run dev:frontend`, `npm run dev:backend`, `npm run dev` (ambos em paralelo)
5. `.gitignore` configurado para `node_modules`, `.env`, `dist`, `build`
6. `README.md` com instruções de setup e comandos básicos

---

#### Story 1.2: Configuração do Banco de Dados e Modelo de Dados

**As a** desenvolvedor,  
**I want** banco de dados PostgreSQL configurado com schema inicial (entidades Team, UseCase, Admin, SelectionLog),  
**so that** posso começar a implementar APIs que persistem dados.

**Acceptance Criteria:**
1. Prisma ORM instalado e configurado com PostgreSQL
2. Schema Prisma definido com 4 modelos:
   - `Team` (id, name, email, selectedUseCaseId, selectionTimestamp, timerStartedAt, createdAt)
   - `UseCase` (id, title, description, category, isAvailable, selectedByTeamId, createdAt, updatedAt)
   - `Admin` (id, username, passwordHash, createdAt)
   - `SelectionLog` (id, teamId, useCaseId, action, timestamp)
3. Migrations executadas com sucesso: `npx prisma migrate dev`
4. Seed script criado para popular 1 admin de teste e 5 casos de uso de exemplo
5. Database URL configurada via variável de ambiente `DATABASE_URL`
6. Prisma Client gerado e importável no backend

---

#### Story 1.3: Health Check Endpoint e Deploy Pipeline

**As a** engenheiro DevOps,  
**I want** endpoint `/health` no backend e CI/CD configurado para deploy automático,  
**so that** posso validar que infraestrutura está funcionando e deployments futuros serão automatizados.

**Acceptance Criteria:**
1. Endpoint `GET /health` retorna `{ status: "ok", timestamp: ISO8601 }` com status 200
2. GitHub Actions workflow criado (`.github/workflows/deploy.yml`) que:
   - Roda em push para branch `main`
   - Executa `npm install` e `npm run build` para frontend e backend
   - Executa testes básicos (se existirem)
3. Frontend deployado em Vercel (ou similar) acessível via URL pública
4. Backend deployado em Render (ou similar) acessível via URL pública
5. Database migrado no ambiente de produção
6. Variáveis de ambiente configuradas no serviço de hosting (DATABASE_URL, JWT_SECRET, etc.)

---

#### Story 1.4: Landing Page Estática (Canary)

**As a** participante do hackathon,  
**I want** landing page simples com formulário de cadastro (não funcional ainda),  
**so that** posso ver a identidade visual da aplicação e a equipe pode validar deploy do frontend.

**Acceptance Criteria:**
1. Página inicial (`/`) exibe:
   - Logo do EvolveAI Hackathon (placeholder se logo não disponível)
   - Título: "Seleção de Casos de Uso - EvolveAI Hackathon Brasil"
   - Formulário com 2 campos: "Nome da Equipe" e "Email" (ainda não funcional)
   - Botão "Começar Seleção" (ainda não funcional)
2. Design responsivo funciona em desktop, tablet e mobile
3. Cores da paleta definida aplicadas (azul #0066CC, verde #00CC66)
4. Footer com link discreto "Admin" apontando para `/admin` (página não implementada ainda)
5. Página carrega em < 2 segundos

---

### Epic 2: Sistema de Casos de Uso e Gestão Administrativa

**Expanded Goal:**  
Criar backend robusto para gerenciar casos de uso (CRUD completo com validações), implementar autenticação segura para área administrativa (JWT + senha hasheada), e desenvolver interface administrativa que permite organizadores cadastrarem, editarem, deletarem e republicarem os 60 casos de uso de forma eficiente antes do evento.

---

#### Story 2.1: API de CRUD de Casos de Uso (Backend)

**As a** desenvolvedor backend,  
**I want** endpoints REST para criar, ler, atualizar e deletar casos de uso,  
**so that** a área administrativa possa gerenciar os 60 casos do hackathon.

**Acceptance Criteria:**
1. Endpoints implementados:
   - `POST /api/use-cases` - Criar caso (requer auth admin)
   - `GET /api/use-cases` - Listar todos os casos (público)
   - `GET /api/use-cases/:id` - Obter caso específico (público)
   - `PATCH /api/use-cases/:id` - Atualizar caso (requer auth admin)
   - `DELETE /api/use-cases/:id` - Deletar caso (requer auth admin)
   - `PATCH /api/use-cases/:id/republish` - Republicar caso (tornar disponível novamente, requer auth admin)
2. Validações no body de criação/atualização:
   - `title`: string obrigatória, 5-200 caracteres
   - `description`: string obrigatória, 20-2000 caracteres
   - `category`: enum obrigatório ["Industria", "Praticas", "Cases"]
3. Endpoint `GET /api/use-cases` retorna array de objetos com estrutura: `{ id, title, description, category, isAvailable, selectedByTeamId }`
4. Endpoint de republicação reseta `isAvailable=true` e `selectedByTeamId=null`
5. Todos os endpoints retornam JSON com status HTTP apropriado (200, 201, 400, 404, 500)

---

#### Story 2.2: Autenticação JWT para Administradores

**As a** organizador do hackathon (admin),  
**I want** sistema de login seguro com JWT,  
**so that** somente admins autorizados possam acessar funcionalidades administrativas.

**Acceptance Criteria:**
1. Endpoint `POST /api/admin/login` implementado:
   - Recebe `{ username, password }`
   - Valida credenciais contra tabela `Admin` (senha hasheada com bcrypt)
   - Retorna `{ token, expiresIn }` (JWT válido por 24 horas) se credenciais corretas
   - Retorna status 401 com `{ error: "Credenciais inválidas" }` se incorretas
2. Middleware `authMiddleware` criado que:
   - Valida JWT no header `Authorization: Bearer <token>`
   - Extrai e anexa `adminId` ao objeto `req` se válido
   - Retorna 401 se token inválido ou ausente
3. Endpoints de CRUD de casos de uso (`POST`, `PATCH`, `DELETE`) protegidos com `authMiddleware`
4. Variável de ambiente `JWT_SECRET` usada para assinar tokens
5. Seed script atualizado para criar admin padrão: `username: "admin", password: "hackathon2026"` (hasheado)

---

#### Story 2.3: Interface de Login Admin (Frontend)

**As a** organizador,  
**I want** página de login administrativa simples e funcional,  
**so that** posso autenticar e acessar dashboard de gestão de casos.

**Acceptance Criteria:**
1. Rota `/admin` criada no React Router exibindo página de login
2. Formulário de login contém:
   - Campo "Usuário" (text input)
   - Campo "Senha" (password input)
   - Botão "Entrar"
3. Ao submeter, faz POST para `/api/admin/login` e armazena JWT no localStorage
4. Se login bem-sucedido, redireciona para `/admin/dashboard`
5. Se login falhar, exibe mensagem de erro: "Usuário ou senha incorretos"
6. Loading state exibido durante requisição (botão desabilitado + spinner)
7. Design consistente com landing page (cores, tipografia, responsividade)

---

#### Story 2.4: Dashboard Admin - Visualização de Casos

**As a** organizador,  
**I want** dashboard administrativo que lista todos os casos de uso cadastrados,  
**so that** posso visualizar rapidamente o status de cada caso.

**Acceptance Criteria:**
1. Rota `/admin/dashboard` protegida (redireciona para `/admin` se não autenticado)
2. Dashboard exibe no topo:
   - Cards com estatísticas: "Total de Casos", "Disponíveis", "Selecionados" (valores atualizados em tempo real)
   - Botão "Adicionar Novo Caso"
   - Botão "Exportar Relatório Excel" (ainda não funcional, implementado em Epic 5)
3. Tabela de casos de uso exibe colunas:
   - Título
   - Categoria
   - Status (badge verde "Disponível" ou cinza "Selecionado")
   - Equipe que selecionou (se aplicável)
   - Ações: botões "Editar" e "Deletar" e "Republicar" (se selecionado)
4. Ao carregar, faz GET `/api/use-cases` e popula tabela
5. Tabela responsiva (stack vertical em mobile)
6. Header com logo e botão "Sair" (limpa localStorage e redireciona para `/admin`)

---

#### Story 2.5: Dashboard Admin - Criar e Editar Casos

**As a** organizador,  
**I want** formulário modal para criar e editar casos de uso,  
**so that** posso cadastrar os 60 casos antes do evento.

**Acceptance Criteria:**
1. Botão "Adicionar Novo Caso" abre modal com formulário:
   - Campo "Título" (text input, obrigatório)
   - Campo "Descrição" (textarea, obrigatório)
   - Dropdown "Categoria" (Indústria/Práticas/Cases, obrigatório)
   - Botões "Cancelar" e "Salvar"
2. Ao clicar "Salvar", faz POST `/api/use-cases` com JWT no header
3. Se sucesso, fecha modal, atualiza tabela e exibe toast "Caso criado com sucesso!"
4. Se erro de validação (400), exibe mensagens de erro abaixo dos campos
5. Botão "Editar" na tabela abre mesmo modal pré-preenchido com dados do caso
6. Ao salvar edição, faz PATCH `/api/use-cases/:id`
7. Validação de formulário no frontend (campos obrigatórios, limites de caracteres)
8. Loading state durante requisição (botão "Salvar" desabilitado)

---

#### Story 2.6: Dashboard Admin - Deletar e Republicar Casos

**As a** organizador,  
**I want** capacidade de deletar casos não utilizados e republicar casos já selecionados,  
**so that** posso corrigir erros ou reabrir casos se necessário.

**Acceptance Criteria:**
1. Botão "Deletar" na tabela exibe modal de confirmação: "Tem certeza que deseja deletar este caso? Esta ação não pode ser desfeita."
2. Ao confirmar, faz DELETE `/api/use-cases/:id` com JWT
3. Se sucesso, remove linha da tabela e exibe toast "Caso deletado com sucesso!"
4. Botão "Republicar" só aparece se caso estiver no status "Selecionado"
5. Ao clicar "Republicar", exibe confirmação: "Republicar este caso? Ele voltará a ficar disponível para seleção."
6. Ao confirmar, faz PATCH `/api/use-cases/:id/republish`
7. Se sucesso, atualiza status na tabela para "Disponível" e limpa campo "Equipe"
8. Tratamento de erro: se operação falhar, exibe toast de erro com mensagem do backend

---

### Epic 3: Cadastro de Equipes e Galeria de Seleção

**Expanded Goal:**  
Habilitar participantes a se cadastrarem com nome da equipe e email, implementar recuperação de sessão (login para equipes que já se cadastraram), criar galeria visual de cards dos 60 casos de uso com filtros por categoria, e garantir que status de disponibilidade seja exibido claramente em tempo real.

---

#### Story 3.1: API de Cadastro e Login de Equipes

**As a** desenvolvedor backend,  
**I want** endpoints para cadastrar e fazer login de equipes,  
**so that** participantes possam criar conta e retornar ao sistema posteriormente.

**Acceptance Criteria:**
1. Endpoint `POST /api/teams/register` implementado:
   - Recebe `{ name, email }`
   - Valida: name ≥ 3 caracteres, email em formato válido
   - Verifica se combinação name+email já existe
   - Se não existe, cria registro na tabela `Team` e retorna `{ teamId, token }` (JWT simples com teamId)
   - Se já existe, retorna erro 409 "Equipe já cadastrada. Faça login."
2. Endpoint `POST /api/teams/login` implementado:
   - Recebe `{ name, email }`
   - Busca equipe na tabela `Team` com name+email
   - Se encontrado, retorna `{ teamId, token, selectedUseCaseId }` (null se não selecionou ainda)
   - Se não encontrado, retorna 404 "Equipe não encontrada"
3. JWT de equipe válido por 24 horas, contém payload `{ teamId, type: "team" }`
4. Validação de email usa regex padrão RFC 5322 simplificado

---

#### Story 3.2: Página de Cadastro de Equipe (Frontend)

**As a** participante,  
**I want** formulário de cadastro funcional na landing page,  
**so that** posso criar minha conta e começar a selecionar caso de uso.

**Acceptance Criteria:**
1. Formulário na landing page (`/`) agora funcional:
   - Campo "Nome da Equipe" (validação: mínimo 3 caracteres)
   - Campo "Email" (validação: formato de email)
   - Botão "Começar Seleção"
2. Ao submeter, faz POST `/api/teams/register`
3. Se sucesso (201), armazena JWT no localStorage e redireciona para `/galeria`
4. Se erro 409 (equipe já existe), exibe link: "Equipe já cadastrada? Faça login aqui"
5. Link "Faça login aqui" abre modal de login com mesmos campos
6. Modal de login faz POST `/api/teams/login` e redireciona para `/galeria` se sucesso
7. Se equipe já selecionou caso (login retorna selectedUseCaseId), redireciona para `/confirmacao`
8. Validação de formulário em tempo real (feedback abaixo dos campos)
9. Loading state durante requisição

---

#### Story 3.3: API de Listagem de Casos de Uso com Filtros

**As a** desenvolvedor backend,  
**I want** endpoint GET `/api/use-cases` com suporte a query params para filtrar por categoria,  
**so that** frontend possa implementar filtros funcionais na galeria.

**Acceptance Criteria:**
1. Endpoint `GET /api/use-cases` aceita query param opcional `?category=Industria|Praticas|Cases`
2. Se category fornecido, retorna apenas casos dessa categoria
3. Se category não fornecido, retorna todos os casos
4. Response sempre inclui campos: `id, title, description, category, isAvailable`
5. Performance: query retorna em < 500ms para 60+ casos
6. Casos ordenados alfabeticamente por título

---

#### Story 3.4: Galeria de Casos de Uso com Cards Visuais

**As a** participante,  
**I want** ver todos os casos de uso em formato de cards visuais organizados,  
**so that** posso explorar as opções e entender o que cada caso envolve.

**Acceptance Criteria:**
1. Rota `/galeria` protegida (redireciona para `/` se não autenticado)
2. Layout de grid responsivo:
   - Desktop: 3 colunas
   - Tablet: 2 colunas
   - Mobile: 1 coluna
3. Cada card de caso exibe:
   - Badge de categoria no topo (cores diferentes: Indústria=azul, Práticas=verde, Cases=roxo)
   - Título em destaque
   - Descrição truncada (máximo 150 caracteres + "...")
   - Badge de status: "Disponível" (verde) ou "Selecionado" (cinza)
   - Botão "Ver Detalhes" se disponível, ou texto "Indisponível" se selecionado
4. Cards de casos selecionados têm opacidade reduzida (0.6) e não são clicáveis
5. Ao carregar, faz GET `/api/use-cases` e renderiza cards
6. Loading skeleton exibido enquanto carrega dados

---

#### Story 3.5: Filtros de Categoria na Galeria

**As a** participante,  
**I want** filtrar casos de uso por categoria (Indústria, Práticas, Cases),  
**so that** posso focar nas áreas que me interessam.

**Acceptance Criteria:**
1. Barra de filtros acima da galeria com chips/tabs:
   - "Todos" (padrão selecionado)
   - "Indústria"
   - "Práticas"
   - "Cases"
2. Ao clicar em filtro, atualiza query param da URL: `/galeria?category=Industria`
3. Faz nova requisição GET `/api/use-cases?category=Industria` e re-renderiza galeria
4. Contador atualizado: "X casos disponíveis" (reflete filtro aplicado)
5. Transição suave ao trocar filtros (fade in/out dos cards)
6. Filtro selecionado visualmente destacado (cor primária, underline ou background)

---

#### Story 3.6: Modal de Detalhes do Caso de Uso

**As a** participante,  
**I want** ver detalhes completos de um caso de uso antes de selecionar,  
**so that** posso tomar decisão informada.

**Acceptance Criteria:**
1. Botão "Ver Detalhes" no card abre modal centralizado
2. Modal exibe:
   - Título completo
   - Descrição completa (sem truncamento)
   - Categoria e subcategoria (se aplicável)
   - Botão primário: "Selecionar Este Caso" (verde, destacado)
   - Botão secundário: "Voltar" (fecha modal)
3. Botão "Selecionar Este Caso" só habilitado se caso estiver disponível
4. Modal responsivo (fullscreen em mobile)
5. Ao clicar fora do modal ou em "Voltar", fecha sem ação
6. Modal acessível via teclado (Esc fecha modal)

---

### Epic 4: Seleção de Casos com Timer e Sincronização Real-Time

**Expanded Goal:**  
Implementar a lógica crítica de seleção de casos de uso com timer de 15 minutos gerenciado no backend, proteção contra race conditions usando transações database com locks pessimistas, sincronização em tempo real via WebSocket para propagar mudanças de disponibilidade instantaneamente para todos os usuários conectados, e auto-liberação de casos se timer expirar sem confirmação.

---

#### Story 4.1: API de Seleção de Caso com Race Condition Protection

**As a** desenvolvedor backend,  
**I want** endpoint POST `/api/use-cases/:id/select` com transação database e lock pessimista,  
**so that** apenas uma equipe possa selecionar cada caso mesmo com acessos simultâneos.

**Acceptance Criteria:**
1. Endpoint `POST /api/use-cases/:id/select` implementado (requer JWT de equipe)
2. Lógica de seleção em transação database:
   - Faz SELECT FOR UPDATE no registro do UseCase (lock pessimista)
   - Verifica se `isAvailable == true`
   - Se não disponível, rollback e retorna 409 "Caso já foi selecionado"
   - Se disponível, atualiza: `isAvailable=false`, `selectedByTeamId=teamId`
   - Atualiza Team: `selectedUseCaseId=useCaseId`, `selectionTimestamp=NOW()`
   - Cria log em SelectionLog: `{ teamId, useCaseId, action: 'SELECTED' }`
   - Commit da transação
3. Retorna 200 com `{ success: true, useCase: {...}, message: "Caso selecionado com sucesso!" }`
4. Após commit, emite evento WebSocket para todos os clientes: `{ event: 'use-case-selected', useCaseId }`
5. Testa race condition: 2 requisições simultâneas para o mesmo caso, apenas 1 deve ter sucesso

---

#### Story 4.2: Timer de 15 Minutos no Backend

**As a** desenvolvedor backend,  
**I want** sistema de timer gerenciado no backend que libera caso automaticamente após 15 minutos,  
**so that** casos não fiquem travados indefinidamente se equipe não completar seleção.

**Acceptance Criteria:**
1. Ao fazer POST `/api/use-cases/:id/select`, atualiza `Team.timerStartedAt = NOW()`
2. Job recorrente (cron ou setInterval a cada 60 segundos) que:
   - Busca todas as equipes com `timerStartedAt NOT NULL` e `selectedUseCaseId NOT NULL`
   - Para cada equipe, calcula `elapsedTime = NOW() - timerStartedAt`
   - Se `elapsedTime > 15 minutos` e `selectionTimestamp == NULL` (não confirmou):
     - Libera caso: `UseCase.isAvailable = true`, `UseCase.selectedByTeamId = null`
     - Limpa timer da equipe: `Team.timerStartedAt = null`, `Team.selectedUseCaseId = null`
     - Cria log: `{ teamId, useCaseId, action: 'TIMEOUT' }`
     - Emite WebSocket: `{ event: 'use-case-available', useCaseId }`
3. Endpoint `GET /api/teams/timer` (requer JWT de equipe):
   - Retorna `{ timerStartedAt, remainingSeconds }` para frontend exibir countdown
4. Se equipe já confirmou (`selectionTimestamp NOT NULL`), timer não aplica

---

#### Story 4.3: WebSocket Server para Sincronização Real-Time

**As a** desenvolvedor backend,  
**I want** servidor WebSocket (Socket.io) que emite eventos de mudança de disponibilidade,  
**so that** todos os clientes vejam atualizações em tempo real.

**Acceptance Criteria:**
1. Socket.io integrado no servidor Express (mesmo processo, mesma porta)
2. Eventos emitidos pelo backend:
   - `use-case-selected` - payload: `{ useCaseId }` (quando caso é selecionado)
   - `use-case-available` - payload: `{ useCaseId }` (quando caso é liberado por timeout ou republicação)
3. Clientes se conectam via namespace padrão `/`
4. Backend loga número de clientes conectados (para debug)
5. Configuração de CORS permite conexão do frontend (Vercel origin)
6. Fallback para long-polling se WebSocket não disponível

---

#### Story 4.4: WebSocket Client e Auto-Refresh de Disponibilidade (Frontend)

**As a** participante,  
**I want** ver status de disponibilidade atualizar automaticamente na galeria,  
**so that** não preciso recarregar página para ver se casos ficaram indisponíveis.

**Acceptance Criteria:**
1. Socket.io-client instalado e conectado ao backend ao entrar na rota `/galeria`
2. Frontend escuta eventos:
   - `use-case-selected`: atualiza estado do caso para `isAvailable=false` na galeria
   - `use-case-available`: atualiza estado do caso para `isAvailable=true` na galeria
3. Ao receber evento, atualiza card visualmente sem re-fetch completo (apenas altera estado do caso específico)
4. Indicador visual de "conectado" no footer (pequeno badge verde "Ao vivo")
5. Se desconectar, exibe badge amarelo "Reconectando..." e tenta reconectar
6. Desconecta WebSocket ao sair da rota `/galeria` (cleanup)

---

#### Story 4.5: Timer Countdown Visível no Frontend

**As a** participante,  
**I want** ver countdown de 15 minutos no topo da galeria,  
**so that** sei quanto tempo tenho para decidir antes do timer expirar.

**Acceptance Criteria:**
1. Componente Timer fixo no topo da página `/galeria`
2. Ao montar componente, faz GET `/api/teams/timer` para obter `timerStartedAt` e calcular `remainingSeconds`
3. Exibe countdown formatado: "Tempo restante: 14:32" (minutos:segundos)
4. Countdown atualiza a cada segundo (setInterval local)
5. Quando `remainingSeconds <= 60`, timer fica vermelho (urgência)
6. Quando `remainingSeconds == 0`:
   - Exibe toast: "Tempo esgotado! Selecione novamente se desejar."
   - Caso reservado é liberado automaticamente pelo backend
   - Frontend pode fazer novo GET `/api/use-cases` para refresh dos cards
7. Timer só exibido se equipe tem `timerStartedAt NOT NULL` (backend retorna null se não iniciou timer)

---

#### Story 4.6: Página de Confirmação de Seleção

**As a** participante,  
**I want** página de confirmação após selecionar caso,  
**so that** vejo claramente que minha seleção foi bem-sucedida e entendo próximos passos.

**Acceptance Criteria:**
1. Rota `/confirmacao` criada (protegida, requer JWT de equipe)
2. Ao carregar, faz GET `/api/teams/me` (novo endpoint) que retorna:
   - `{ teamName, email, selectedUseCase: { title, description, category } }`
3. Página exibe:
   - Ícone de sucesso (checkmark verde grande)
   - Mensagem: "🎉 Caso de Uso Selecionado com Sucesso!"
   - Card destacado com detalhes do caso selecionado
   - Seção "Próximos Passos" com instruções markdown (fornecidas por organizadores, hardcoded no frontend ou vindo de endpoint)
4. Botão "Copiar Detalhes" que copia título+descrição para clipboard
5. Botão "Sair" que limpa localStorage e redireciona para `/`
6. Se equipe não selecionou caso ainda (GET retorna `selectedUseCaseId == null`), redireciona para `/galeria`
7. Design celebratório (confetti animation opcional, cores vibrantes)

---

### Epic 5: Relatórios Administrativos e Melhorias de UX

**Expanded Goal:**  
Adicionar exportação de relatórios em formato Excel para admins visualizarem todas as seleções (equipe + caso + timestamp), implementar dashboard de estatísticas em tempo real, e realizar refinamentos finais de UX (feedback visual, responsividade, loading states, mensagens de erro) para garantir que sistema esteja polido e pronto para o evento com 300 equipes.

---

#### Story 5.1: API de Exportação de Relatório Excel

**As a** desenvolvedor backend,  
**I want** endpoint GET `/api/admin/export/selections` que gera arquivo Excel,  
**so that** admins possam baixar relatório completo de seleções.

**Acceptance Criteria:**
1. Endpoint `GET /api/admin/export/selections` implementado (requer JWT admin)
2. Busca todos os registros de `Team` onde `selectedUseCaseId NOT NULL`
3. Para cada equipe, faz join com `UseCase` para obter título e categoria
4. Usa biblioteca `exceljs` para gerar arquivo Excel com colunas:
   - Nome da Equipe
   - Email
   - Caso Selecionado (título)
   - Categoria do Caso
   - Timestamp da Seleção (formato ISO 8601 ou DD/MM/YYYY HH:mm)
5. Nome do arquivo: `relatorio-selecoes-YYYYMMDD-HHMM.xlsx` (timestamp atual)
6. Retorna arquivo com headers:
   - `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
   - `Content-Disposition: attachment; filename="relatorio-selecoes-20260127-1430.xlsx"`
7. Se nenhuma seleção ainda, retorna Excel vazio com headers

---

#### Story 5.2: Botão de Exportação no Dashboard Admin

**As a** organizador,  
**I want** botão de exportação funcional no dashboard que baixa relatório Excel,  
**so that** posso compartilhar lista de seleções com equipe organizadora.

**Acceptance Criteria:**
1. Botão "Exportar Relatório Excel" no topo do dashboard `/admin/dashboard`
2. Ao clicar, faz GET `/api/admin/export/selections` com JWT no header
3. Response blob convertido para download automático do arquivo
4. Feedback visual durante download (botão desabilitado + spinner + texto "Gerando...")
5. Após download, exibe toast "Relatório exportado com sucesso!"
6. Se erro (ex: 500), exibe toast de erro "Erro ao gerar relatório. Tente novamente."
7. Botão estilizado com ícone de download

---

#### Story 5.3: Dashboard de Estatísticas Real-Time

**As a** organizador,  
**I want** cards de estatísticas no topo do dashboard atualizados em tempo real,  
**so that** posso acompanhar progresso de seleções durante o evento.

**Acceptance Criteria:**
1. Dashboard `/admin/dashboard` conecta ao WebSocket do backend
2. Cards de estatísticas no topo exibem:
   - "Total de Casos": contagem total de UseCase
   - "Disponíveis": contagem de UseCase onde `isAvailable=true`
   - "Selecionados": contagem de UseCase onde `isAvailable=false`
3. Ao receber eventos WebSocket (`use-case-selected`, `use-case-available`), atualiza contadores automaticamente
4. Backend emite evento adicional `stats-updated` com payload `{ total, available, selected }` a cada mudança
5. Cards visualmente destacados (ícones, cores diferentes para cada métrica)
6. Animação de transição ao atualizar números (count-up effect)

---

#### Story 5.4: Melhorias de UX - Loading States e Feedback Visual

**As a** usuário (participante ou admin),  
**I want** feedback visual claro para todas as ações e carregamentos,  
**so that** entendo o que está acontecendo e não fico confuso durante esperas.

**Acceptance Criteria:**
1. Loading skeletons implementados em:
   - Galeria de casos (cards skeleton enquanto carrega)
   - Tabela admin (skeleton rows enquanto carrega)
2. Loading spinners em:
   - Botões de formulário durante submit (botão desabilitado + spinner)
   - Modal de detalhes ao abrir (spinner centralizado)
3. Toast notifications (biblioteca react-toastify ou similar):
   - Sucesso: fundo verde, ícone checkmark
   - Erro: fundo vermelho, ícone X
   - Info: fundo azul, ícone i
4. Disabled states visuais:
   - Botão "Selecionar Este Caso" cinza se indisponível
   - Cards de casos selecionados com opacidade reduzida
5. Animações de transição suaves (fade in/out, slide) em modals e toasts
6. Cursor pointer em elementos clicáveis, cursor not-allowed em desabilitados

---

#### Story 5.5: Responsividade e Mobile Optimization

**As a** participante usando smartphone,  
**I want** interface totalmente funcional em mobile,  
**so that** posso selecionar caso de uso mesmo se não tiver acesso a desktop.

**Acceptance Criteria:**
1. Todos os breakpoints testados:
   - Mobile: 375x667 (iPhone SE)
   - Tablet: 768x1024 (iPad)
   - Desktop: 1920x1080
2. Galeria de casos:
   - Mobile: 1 coluna, scroll vertical
   - Tablet: 2 colunas
   - Desktop: 3 colunas
3. Modal de detalhes:
   - Mobile: fullscreen overlay
   - Desktop: centralizado, max-width 600px
4. Dashboard admin:
   - Mobile: tabela scrollável horizontalmente ou stack vertical de cards
   - Desktop: tabela padrão
5. Formulários:
   - Inputs com tamanho mínimo de 44x44px (touch target size)
   - Labels sempre visíveis (não usar apenas placeholders)
6. Navegação:
   - Hamburger menu em mobile (se houver múltiplas rotas)
7. Testado em Chrome mobile, Safari iOS, Firefox Android

---

#### Story 5.6: Tratamento de Erros e Mensagens de Validação

**As a** usuário,  
**I want** mensagens de erro claras e acionáveis quando algo dá errado,  
**so that** sei como corrigir problemas e continuar usando o sistema.

**Acceptance Criteria:**
1. Validação de formulários mostra erro abaixo do campo:
   - "Nome da equipe deve ter pelo menos 3 caracteres"
   - "Email inválido"
   - "Este campo é obrigatório"
2. Erros de API exibidos em toasts com mensagens user-friendly:
   - 409 "Caso já foi selecionado": toast "Este caso foi selecionado por outra equipe. Escolha outro caso."
   - 401 "Não autenticado": redireciona para login com toast "Sessão expirada. Faça login novamente."
   - 500 "Erro interno": toast "Algo deu errado. Tente novamente em alguns instantes."
3. Fallback UI se WebSocket desconectar:
   - Badge "Desconectado" no footer
   - Polling automático a cada 5 segundos como fallback para atualizar disponibilidade
4. Página de erro 404 customizada:
   - Mensagem "Página não encontrada"
   - Botão "Voltar para Início"
5. Network errors tratados:
   - Toast "Verifique sua conexão com a internet"
   - Botão "Tentar Novamente" em componentes críticos

---

## 📊 Checklist Results Report

*[Esta seção será populada após execução do checklist de validação da PRD]*

**Pendente:** Executar `pm-checklist.md` para validar:
- ✅ Todos os requisitos funcionais mapeados para stories
- ✅ Stories sequenciais e sem dependências circulares
- ✅ Critérios de aceitação testáveis
- ✅ Escopo técnico alinhado com prazo de 1 dia
- ✅ Cobertura de casos de erro e edge cases

---

## 🚀 Next Steps

### UX Expert Prompt

```markdown
@sofia-ux Preciso que você crie o design completo da interface para o Sistema de Seleção de Casos de Uso do EvolveAI Hackathon Brasil.

📋 CONTEXTO DO PROJETO:
- Aplicação web para 300 equipes selecionarem entre 60 casos de uso
- Timer de 15 minutos para seleção
- Sistema de disponibilidade em tempo real (WebSocket)
- 2 perfis: Participantes (equipes) e Administradores (organizadores)
- Prazo de desenvolvimento: 1 dia (design deve ser pragmático e implementável)

📖 DOCUMENTAÇÃO PARA REVISAR:
- Seção "User Interface Design Goals" desta PRD (Overall UX Vision, Key Interaction Paradigms, Branding)
- Seção "Core Screens and Views" (6 telas principais especificadas)
- Epic 3, 4 e 5 (Stories de frontend com critérios de aceitação detalhados)
- Non-Functional Requirements NFR3 (Usabilidade e responsividade)

🎨 ENTREGÁVEIS OBRIGATÓRIOS:

1. **Wireframes Low-Fidelity** (Figma/Sketch)
   - Landing Page com Cadastro/Login
   - Galeria de Casos (grid de cards com filtros)
   - Modal de Detalhes do Caso
   - Página de Confirmação
   - Dashboard Admin (lista + formulários)
   - Anotações de interação e fluxo

2. **Design System Simplificado**
   - Paleta de Cores: Primária (#0066CC), Verde Disponível (#00CC66), Cinza Indisponível (#CCCCCC)
   - Tipografia: Sans-serif moderna (Inter/Roboto)
   - Componentes-chave: Button, Card, Input, Modal, Badge, Toast, Timer
   - Estados: Default, Hover, Active, Disabled, Loading
   - Ícones: Set consistente (Material Icons ou Heroicons)

3. **Protótipo Interativo de Alta Fidelidade** (Figma/Adobe XD)
   - Fluxo completo do participante: Cadastro → Galeria → Seleção → Confirmação
   - Fluxo admin: Login → Dashboard → Criar/Editar Caso → Exportar Relatório
   - Transições e micro-animações documentadas
   - Estados de loading e erro
   - Timer countdown visível

4. **Especificações de Responsividade**
   - Breakpoints: Mobile (375px), Tablet (768px), Desktop (1920px)
   - Grid de cards: 1 coluna (mobile) / 2 colunas (tablet) / 3 colunas (desktop)
   - Comportamento de modais (fullscreen mobile, centralizado desktop)
   - Touch targets mínimos: 44x44px

5. **Guia de Acessibilidade (WCAG AA)**
   - Contraste de cores validado (mínimo 4.5:1)
   - Estados de foco visíveis para navegação por teclado
   - Labels descritivos em formulários
   - Alt text para imagens informativas

🎯 PONTOS CRÍTICOS DE ATENÇÃO:

- **Timer Visível**: Countdown de 15 minutos deve ser proeminente mas não estressante
- **Status de Disponibilidade**: Diferenciação visual CLARA entre disponível/selecionado (cores + opacidade + texto)
- **Feedback Imediato**: Loading states, toasts de confirmação/erro, animações de transição
- **Simplicidade**: Design deve ser implementável rapidamente (evitar over-design)
- **Real-Time Updates**: Indicador visual de conexão WebSocket ("Ao vivo", "Reconectando...")

📦 FORMATO DE ENTREGA:

- Arquivo Figma compartilhado com permissões de visualização
- PDF exportado com anotações de especificações
- Assets exportados: Logos, ícones (SVG), imagens (PNG/WebP otimizadas)
- Arquivo de Design Tokens (JSON/CSS) com cores, tamanhos, espaçamentos

⏱️ PRAZO: 4-6 horas
🔴 PRIORIDADE: ALTA - Necessário para iniciar desenvolvimento frontend

📌 DEPENDÊNCIAS: Nenhuma (pode iniciar imediatamente com base nesta PRD)

❓ DÚVIDAS: Envie para João (@joao-pm) ou revise seção "User Interface Design Goals" da PRD
```

---

### Architect Prompt

```markdown
@wilson-architect Preciso que você crie a arquitetura técnica completa e detalhada para o Sistema de Seleção de Casos de Uso do EvolveAI Hackathon Brasil.

📋 CONTEXTO DO PROJETO:
- Sistema web para gerenciar seleção de 60 casos de uso por 300 equipes simultâneas
- Requisitos críticos: Race condition protection, Timer de 15min, Sincronização real-time
- Stack definida: React + Vite / Node.js + Express / PostgreSQL + Prisma / Socket.io
- Arquitetura: Monolith (frontend SPA + backend único)
- Hosting: Vercel (frontend) + Render/Railway (backend) + Managed DB
- Prazo de desenvolvimento: 1 dia (arquitetura deve ser simples e implementável rapidamente)

📖 DOCUMENTAÇÃO PARA REVISAR:
- Seção "Technical Assumptions" desta PRD (Stack completa, decisões técnicas)
- Seção "Requirements" (7 Functional + 6 Non-Functional Requirements)
- Modelo de Dados no Discovery: Entidades Team, UseCase, Admin, SelectionLog
- Epic 1, 2, 4 (Stories de backend com lógica crítica de seleção e timer)
- NFR1 (Performance: 300 acessos simultâneos, < 2s response time)

🏗️ ENTREGÁVEIS OBRIGATÓRIOS:

1. **Diagrama de Arquitetura (C4 Model)**
   - **Context Diagram**: Sistema, usuários (participantes, admins), serviços externos (nenhum)
   - **Container Diagram**: Frontend SPA, Backend API, Database, WebSocket Server
   - **Component Diagram**: Serviços internos do backend (AuthService, TeamService, UseCaseService, SelectionService, ExportService, WebSocketService)
   - Fluxos de dados e comunicação entre containers

2. **Schema de Banco de Dados Completo**
   - **ERD (Entity Relationship Diagram)** com 4 tabelas:
     - `teams`: id (PK), name, email (UNIQUE), selected_use_case_id (FK), selection_timestamp, timer_started_at, created_at
     - `use_cases`: id (PK), title, description, category (ENUM), is_available (BOOLEAN), selected_by_team_id (FK), created_at, updated_at
     - `admins`: id (PK), username (UNIQUE), password_hash, created_at
     - `selection_logs`: id (PK), team_id (FK), use_case_id (FK), action (ENUM: RESERVED, SELECTED, TIMEOUT, RELEASED), timestamp
   - **Prisma Schema completo** (schema.prisma) pronto para uso
   - **Migrations SQL** para setup inicial
   - Índices otimizados: UNIQUE constraint em (teams.name, teams.email), INDEX em use_cases.is_available

3. **Especificação de APIs REST (OpenAPI 3.0 / Swagger)**
   - **Public Endpoints**:
     - POST /api/teams/register
     - POST /api/teams/login
     - GET /api/teams/me
     - GET /api/teams/timer
     - GET /api/use-cases (com query param ?category)
     - GET /api/use-cases/:id
     - POST /api/use-cases/:id/select
   - **Admin Endpoints**:
     - POST /api/admin/login
     - GET /api/admin/use-cases
     - POST /api/admin/use-cases
     - PATCH /api/admin/use-cases/:id
     - DELETE /api/admin/use-cases/:id
     - PATCH /api/admin/use-cases/:id/republish
     - GET /api/admin/export/selections
   - Request/Response schemas com validação (Zod)
   - Status codes e error handling

4. **Estratégia de WebSocket (Socket.io)**
   - **Eventos emitidos pelo servidor**:
     - `use-case-selected` - payload: { useCaseId }
     - `use-case-available` - payload: { useCaseId }
     - `stats-updated` - payload: { total, available, selected }
   - **Eventos recebidos do cliente**: (se aplicável)
   - Namespace: `/` (default)
   - Autenticação de conexão WebSocket (JWT em handshake query)
   - Rooms/Broadcasting strategy
   - Fallback para long-polling
   - Configuração de CORS

5. **Diagrama de Fluxo de Seleção com Race Condition Protection**
   - **Sequence Diagram** detalhado:
     - Equipe A e Equipe B tentam selecionar o mesmo caso simultaneamente
     - Transação database com SELECT FOR UPDATE (lock pessimista)
     - Apenas uma equipe consegue (200), outra recebe 409 Conflict
     - WebSocket broadcast após commit bem-sucedido
   - Pseudo-código da lógica crítica:
     ```
     BEGIN TRANSACTION;
       SELECT * FROM use_cases WHERE id = X FOR UPDATE;
       IF is_available == true THEN
         UPDATE use_cases SET is_available = false, selected_by_team_id = Y;
         UPDATE teams SET selected_use_case_id = X, selection_timestamp = NOW();
         INSERT INTO selection_logs (...);
         COMMIT;
         EMIT WebSocket('use-case-selected', { useCaseId: X });
       ELSE
         ROLLBACK;
         RETURN 409;
       END IF;
     ```

6. **Sistema de Timer e Job Recorrente**
   - **Diagrama de fluxo do timer**:
     - POST /select inicia timer (timer_started_at = NOW())
     - Job cron (node-cron) roda a cada 60 segundos
     - Busca equipes com timer ativo há > 15 min sem selectionTimestamp
     - Libera caso: is_available = true, selected_by_team_id = null
     - Emite WebSocket('use-case-available')
   - Implementação sugerida: node-cron ou setInterval
   - Estratégia de cleanup (evitar memory leaks)

7. **Plano de Deploy e Infraestrutura**
   - **Frontend (Vercel)**:
     - Build command: `npm run build` (Vite)
     - Output directory: `dist/`
     - Environment variables: `VITE_API_URL`, `VITE_WS_URL`
     - Domain: `hackathon-cases.vercel.app` (exemplo)
   - **Backend (Render/Railway)**:
     - Build command: `npm run build` (TypeScript → JavaScript)
     - Start command: `npm run start:prod`
     - Environment variables: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD_DEFAULT`, `PORT`, `CORS_ORIGIN`
     - Health check endpoint: `/health`
   - **Database (Render PostgreSQL / MongoDB Atlas)**:
     - Managed service (free tier)
     - Connection pooling configurado
     - Backup automático diário
   - **CI/CD (GitHub Actions)**:
     - Workflow: Lint → Test → Build → Deploy
     - Auto-deploy em push para branch `main`
     - Rollback manual se necessário

8. **Estratégia de Testes**
   - **Unit Tests** (Jest):
     - Lógica de validação (email, nome, category enum)
     - Funções utilitárias (calculateRemainingTime, hashPassword)
     - Target: 70%+ coverage em lógica crítica
   - **Integration Tests** (Supertest + Testcontainers):
     - POST /api/use-cases/:id/select (cenário de sucesso)
     - Race condition test (2 requisições simultâneas, apenas 1 sucesso)
     - POST /api/admin/login (autenticação)
     - GET /api/use-cases (listagem e filtros)
   - **Load Testing** (k6 ou Artillery):
     - Simular 300 usuários simultâneos acessando galeria
     - Simular 50 seleções simultâneas (race condition stress test)
     - Validar response time p95 < 2 segundos
     - Script k6 pronto para executar
   - **Manual Testing Checklist**:
     - Fluxo completo de participante (happy path)
     - Fluxo admin (CRUD de casos + exportação)
     - Responsividade em 3 breakpoints
     - WebSocket disconnect/reconnect

9. **Segurança e Error Handling**
   - **Autenticação**:
     - JWT assinado com HS256, secret de 256+ bits
     - Password hashing: bcrypt com salt rounds = 10
     - Token expiration: 24 horas
   - **Validação de Input**:
     - Zod schemas para todos os endpoints
     - Sanitização contra XSS (express-validator)
     - Rate limiting em /api/admin/login (express-rate-limit: 5 tentativas / 15min)
   - **Error Handling Middleware**:
     - Global error handler no Express
     - Log estruturado (Winston/Pino) com níveis: error, warn, info
     - Never leak stack traces em produção
   - **CORS Configuration**:
     - Permitir apenas origin do frontend Vercel
     - Credentials: true (para cookies se necessário)

📦 FORMATO DE ENTREGA:

- Documento Markdown: `docs/architecture-evolveai-hackathon.md`
- Diagramas: Exportar imagens PNG/SVG (usar Draw.io, Mermaid, Lucidchart)
- Prisma Schema: `prisma/schema.prisma` (arquivo pronto)
- OpenAPI Spec: `docs/api-spec.yaml` (Swagger)
- Scripts de teste: `tests/load-test.k6.js`
- README técnico: Instruções de setup local, comandos, variáveis de ambiente

⏱️ PRAZO: 6-8 horas
🔴 PRIORIDADE: CRÍTICA - Bloqueante para desenvolvimento (devs precisam da arquitetura para começar)

📌 DEPENDÊNCIAS: Nenhuma (pode iniciar imediatamente com base nesta PRD)

❓ DÚVIDAS: Envie para João (@joao-pm) ou revise seções "Technical Assumptions" e "Requirements" da PRD
```

---

## ✅ PRD Sign-off

**Autor:** João - PM Avanade  
**Versão:** 1.0  
**Data:** 27 de Janeiro de 2026  

**Status:** 🟢 **READY FOR TECHNICAL REVIEW**

**Próximas Ações:**
1. 🚀 **INICIADO** - Prompts criados para UX Designer (@sofia-ux) e Architect (@wilson-architect)
2. ⏳ Aguardar entrega de wireframes e design system (4-6h)
3. ⏳ Aguardar entrega de arquitetura técnica e API specs (6-8h)
4. ⏳ Executar checklist de qualidade da PRD
5. ⏳ Obter aprovação de stakeholders (organizadores do hackathon)
6. ⏳ Kickoff de desenvolvimento com @tiago-dev após arquitetura pronta

---

*Documento gerado seguindo Avanade PRD Template v2.0 e Agile Best Practices*
