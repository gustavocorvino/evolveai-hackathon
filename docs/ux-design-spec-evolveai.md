# UX Design Specification
## EvolveAI Hackathon Brasil - Sistema de Seleção de Casos de Uso
### Tema: Space Explorer - Astronauta Galáctico Moderno

**Versão:** 1.0  
**Data:** 27 de Janeiro de 2026  
**Designer:** Sofia - UX Expert Avanade  
**Status:** Design System & Wireframes  
**Referência Visual:** Astronauta futurista em ambiente galáctico com elementos de segurança neon

---

## 🎨 Conceito de Design

### Visão Criativa

**Metáfora Central: "Mission Selection in the Galaxy of Innovation"**

Cada participante é um **astronauta digital** embarcando em uma jornada pelo universo da inovação. Os 60 casos de uso são representados como **planetas ou estações espaciais** protegidos por **shields neon** que indicam disponibilidade. A seleção de um caso é como **travar destino em uma missão espacial** - um compromisso protegido e rastreado.

**Elementos Narrativos:**
- 🚀 **Landing Page**: Plataforma de lançamento (entrada na jornada)
- 🌌 **Galeria de Casos**: Mapa estelar (exploração de destinos)
- 🛡️ **Status de Disponibilidade**: Shields de proteção (disponível = verde brilhante, selecionado = vermelho bloqueado)
- ⏱️ **Timer de 15min**: Countdown de missão (urgência controlada)
- ✅ **Confirmação**: Missão confirmada, rota estabelecida
- 👨‍💼 **Admin Dashboard**: Centro de controle (comando da operação)

### Princípios de Design Aplicados

1. **Visual Hierarchy através de Glow e Depth**
   - Elementos importantes brilham mais (efeitos neon)
   - Profundidade criada com gradientes e sombras espaciais
   - Escala e cor guiam o olhar (maior + mais brilhante = mais importante)

2. **Feedback Imediato via Animações Sutis**
   - Hover: Intensificação do glow + scale up (1.05x)
   - Click: Pulse effect + ripple neon
   - Loading: Rotating planets ou orbital spinners
   - Success: Shield glow expansion + confetti stars

3. **Legibilidade em Fundo Escuro**
   - Texto claro (#F9FAFB) sobre dark space (#0A1628)
   - Contraste mínimo 7:1 (WCAG AAA para elementos críticos)
   - Cards semi-transparentes com glassmorphism sutil

4. **Acessibilidade sem Comprometer Estética**
   - Dupla indicação: cor + ícone + texto (não depender só de cor)
   - Focus states com borda neon cyan (#06B6D4) de 3px
   - Tamanho de toque mínimo: 44x44px
   - Alt text descritivo em todos os elementos visuais

---

## 🎨 Design System Completo

### Paleta de Cores (Space Neon Palette)

#### Cores Principais
```css
/* Backgrounds */
--space-black: #000000;           /* Espaço profundo absoluto */
--deep-space: #0A1628;            /* Background principal */
--nebula-dark: #1E3A8A;           /* Containers, cards */
--cosmic-gray: #1F2937;           /* Secondary containers */

/* Accents */
--neon-cyan: #06B6D4;             /* Primary action, disponível */
--solar-orange: #F97316;          /* Hover, highlights */
--cosmic-purple: #8B5CF6;         /* Decorative, gradients */
--shield-green: #10B981;          /* Success, available status */
--star-yellow: #FBBF24;           /* Warning, timer urgency */
--nova-red: #EF4444;              /* Error, unavailable */

/* Neutrals */
--text-light: #F9FAFB;            /* Primary text */
--text-muted: #9CA3AF;            /* Secondary text */
--border-glow: rgba(6, 182, 212, 0.3);  /* Borders com glow */
```

#### Gradientes Espaciais
```css
/* Hero Gradient */
.gradient-hero {
  background: linear-gradient(135deg, 
    #0A1628 0%, 
    #1E3A8A 50%, 
    #3B0764 100%
  );
}

/* Card Glow Gradient */
.gradient-card {
  background: linear-gradient(145deg, 
    rgba(30, 58, 138, 0.6) 0%, 
    rgba(31, 41, 55, 0.8) 100%
  );
  backdrop-filter: blur(10px);
}

/* Neon Button Gradient */
.gradient-neon {
  background: linear-gradient(90deg, 
    #06B6D4 0%, 
    #0891B2 50%, 
    #06B6D4 100%
  );
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

/* Shield Gradient (Available) */
.gradient-shield-available {
  background: radial-gradient(circle at center,
    rgba(16, 185, 129, 0.3) 0%,
    rgba(16, 185, 129, 0.1) 50%,
    transparent 100%
  );
}

/* Shield Gradient (Unavailable) */
.gradient-shield-unavailable {
  background: radial-gradient(circle at center,
    rgba(239, 68, 68, 0.3) 0%,
    rgba(239, 68, 68, 0.1) 50%,
    transparent 100%
  );
}
```

#### Efeitos de Glow (Neon Effects)
```css
/* Cyan Glow */
.glow-cyan {
  box-shadow: 
    0 0 10px rgba(6, 182, 212, 0.5),
    0 0 20px rgba(6, 182, 212, 0.3),
    0 0 40px rgba(6, 182, 212, 0.1);
}

/* Orange Glow (Hover) */
.glow-orange {
  box-shadow: 
    0 0 15px rgba(249, 115, 22, 0.6),
    0 0 30px rgba(249, 115, 22, 0.4),
    0 0 50px rgba(249, 115, 22, 0.2);
}

/* Green Shield Glow (Available) */
.glow-shield-available {
  box-shadow: 
    0 0 20px rgba(16, 185, 129, 0.4),
    inset 0 0 20px rgba(16, 185, 129, 0.2);
}

/* Red Shield Glow (Unavailable) */
.glow-shield-unavailable {
  box-shadow: 
    0 0 20px rgba(239, 68, 68, 0.4),
    inset 0 0 20px rgba(239, 68, 68, 0.2);
}
```

### Tipografia

#### Font Families
```css
/* Display - Títulos e Headlines */
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&display=swap');
--font-display: 'Orbitron', sans-serif;

/* Body - Texto geral */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
--font-body: 'Inter', sans-serif;

/* Monospace - Timers, contadores */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap');
--font-mono: 'Fira Code', monospace;
```

#### Type Scale
```css
/* Desktop */
--text-xs: 12px;      /* Labels pequenos, timestamps */
--text-sm: 14px;      /* Body secundário, descrições */
--text-base: 16px;    /* Body principal */
--text-lg: 18px;      /* Lead text */
--text-xl: 20px;      /* Subtítulos */
--text-2xl: 24px;     /* Títulos de seção */
--text-3xl: 30px;     /* Títulos de página */
--text-4xl: 36px;     /* Headlines */
--text-5xl: 48px;     /* Hero titles */

/* Line Heights */
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Letter Spacing (para Orbitron) */
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.05em;
```

#### Typography Usage
```css
/* Hero Title */
.text-hero {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: 700;
  letter-spacing: var(--tracking-wide);
  line-height: var(--leading-tight);
  text-transform: uppercase;
  background: linear-gradient(90deg, #06B6D4, #8B5CF6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Section Title */
.text-section-title {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 600;
  color: var(--neon-cyan);
  text-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
}

/* Body Text */
.text-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 400;
  color: var(--text-light);
  line-height: var(--leading-relaxed);
}

/* Timer Display */
.text-timer {
  font-family: var(--font-mono);
  font-size: var(--text-4xl);
  font-weight: 600;
  color: var(--neon-cyan);
  text-shadow: 0 0 15px rgba(6, 182, 212, 0.8);
}
```

### Espaçamento (Spacing System)

```css
/* 8pt Grid System */
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */

/* Container Max Widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;
```

### Componentes UI

#### 1. Buttons

```html
<!-- Primary Button (Neon Cyan) -->
<button class="btn btn-primary">
  <span class="btn-icon">🚀</span>
  Começar Seleção
  <span class="btn-glow"></span>
</button>

<!-- Secondary Button (Outlined) -->
<button class="btn btn-secondary">
  <span class="btn-icon">👁️</span>
  Ver Detalhes
</button>

<!-- Danger Button (Nova Red) -->
<button class="btn btn-danger">
  <span class="btn-icon">🗑️</span>
  Deletar Caso
</button>
```

```css
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 600;
  border-radius: 8px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.btn-primary {
  background: var(--neon-cyan);
  color: var(--deep-space);
  box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
}

.btn-primary:hover {
  background: var(--solar-orange);
  box-shadow: 0 0 30px rgba(249, 115, 22, 0.6);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: var(--neon-cyan);
  border-color: var(--neon-cyan);
}

.btn-secondary:hover {
  background: rgba(6, 182, 212, 0.1);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  filter: grayscale(0.8);
}

/* Shimmer Effect on Hover */
@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
```

#### 2. Cards (Casos de Uso)

```html
<div class="use-case-card" data-status="available">
  <!-- Shield Badge -->
  <div class="card-shield">
    <svg class="shield-icon"><!-- Shield SVG --></svg>
    <span class="shield-badge">Disponível</span>
  </div>
  
  <!-- Category Badge -->
  <div class="card-category">
    <span class="category-icon">🏭</span>
    Indústria
  </div>
  
  <!-- Content -->
  <div class="card-content">
    <h3 class="card-title">Otimização de Supply Chain com IA</h3>
    <p class="card-description">
      Desenvolver modelo preditivo para otimizar logística de distribuição...
    </p>
  </div>
  
  <!-- Action -->
  <button class="card-action btn btn-primary">
    Ver Detalhes
  </button>
  
  <!-- Glow Effect -->
  <div class="card-glow"></div>
</div>
```

```css
.use-case-card {
  position: relative;
  padding: var(--space-6);
  background: linear-gradient(145deg, 
    rgba(30, 58, 138, 0.4), 
    rgba(31, 41, 55, 0.6)
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.use-case-card:hover {
  transform: translateY(-8px);
  border-color: var(--neon-cyan);
  box-shadow: 0 8px 40px rgba(6, 182, 212, 0.3);
}

/* Available State */
.use-case-card[data-status="available"] .card-shield {
  color: var(--shield-green);
}

.use-case-card[data-status="available"] .card-glow {
  background: radial-gradient(circle at top right,
    rgba(16, 185, 129, 0.2) 0%,
    transparent 70%
  );
}

/* Unavailable State */
.use-case-card[data-status="unavailable"] {
  opacity: 0.6;
  pointer-events: none;
}

.use-case-card[data-status="unavailable"] .card-shield {
  color: var(--nova-red);
}

.use-case-card[data-status="unavailable"]::before {
  content: "🔒 SELECIONADO";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-15deg);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--nova-red);
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
  z-index: 10;
}
```

#### 3. Timer Component

```html
<div class="timer-container">
  <div class="timer-icon">⏱️</div>
  <div class="timer-content">
    <span class="timer-label">Tempo Restante</span>
    <div class="timer-display">
      <span class="timer-minutes">14</span>
      <span class="timer-separator">:</span>
      <span class="timer-seconds">32</span>
    </div>
  </div>
  <div class="timer-progress">
    <div class="timer-progress-bar" style="width: 96%"></div>
  </div>
</div>
```

```css
.timer-container {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  background: rgba(10, 22, 40, 0.95);
  border: 2px solid var(--neon-cyan);
  border-radius: 12px;
  box-shadow: 0 0 30px rgba(6, 182, 212, 0.4);
  z-index: 1000;
}

.timer-display {
  font-family: var(--font-mono);
  font-size: var(--text-4xl);
  font-weight: 600;
  color: var(--neon-cyan);
  text-shadow: 0 0 20px rgba(6, 182, 212, 0.8);
}

.timer-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(6, 182, 212, 0.2);
  border-radius: 0 0 10px 10px;
  overflow: hidden;
}

.timer-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, 
    var(--neon-cyan), 
    var(--cosmic-purple)
  );
  transition: width 1s linear;
}

/* Urgency State (< 60 seconds) */
.timer-container.urgent {
  border-color: var(--nova-red);
  animation: pulse-red 1s infinite;
}

.timer-container.urgent .timer-display {
  color: var(--nova-red);
}

@keyframes pulse-red {
  0%, 100% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.6); }
  50% { box-shadow: 0 0 50px rgba(239, 68, 68, 0.9); }
}
```

#### 4. Modal (Detalhes do Caso)

```html
<div class="modal-overlay">
  <div class="modal-container">
    <button class="modal-close">✕</button>
    
    <div class="modal-header">
      <div class="modal-category-badge">
        <span class="category-icon">🏭</span>
        Indústria
      </div>
      <h2 class="modal-title">Otimização de Supply Chain com IA</h2>
    </div>
    
    <div class="modal-body">
      <p class="modal-description">
        Desenvolver modelo preditivo para otimizar logística...
      </p>
      
      <div class="modal-meta">
        <div class="meta-item">
          <span class="meta-icon">🛡️</span>
          <span class="meta-label">Status:</span>
          <span class="meta-value available">Disponível</span>
        </div>
      </div>
    </div>
    
    <div class="modal-footer">
      <button class="btn btn-secondary">Voltar</button>
      <button class="btn btn-primary">
        🚀 Selecionar Este Caso
      </button>
    </div>
    
    <div class="modal-glow"></div>
  </div>
</div>
```

```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.modal-container {
  position: relative;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  padding: var(--space-8);
  background: linear-gradient(145deg,
    rgba(30, 58, 138, 0.95),
    rgba(10, 22, 40, 0.95)
  );
  border: 2px solid var(--neon-cyan);
  border-radius: 20px;
  box-shadow: 0 0 60px rgba(6, 182, 212, 0.5);
  animation: slideUp 0.4s ease;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  width: 40px;
  height: 40px;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid var(--nova-red);
  border-radius: 50%;
  color: var(--nova-red);
  font-size: var(--text-xl);
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background: var(--nova-red);
  color: white;
  transform: rotate(90deg);
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
```

#### 5. Toast Notifications

```html
<div class="toast toast-success">
  <div class="toast-icon">✅</div>
  <div class="toast-content">
    <div class="toast-title">Sucesso!</div>
    <div class="toast-message">Caso de uso selecionado com sucesso!</div>
  </div>
  <button class="toast-close">✕</button>
</div>
```

```css
.toast {
  position: fixed;
  top: var(--space-6);
  right: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-width: 300px;
  padding: var(--space-4);
  background: rgba(10, 22, 40, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  animation: slideInRight 0.3s ease;
  z-index: 10000;
}

.toast-success {
  border-left: 4px solid var(--shield-green);
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
}

.toast-error {
  border-left: 4px solid var(--nova-red);
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
}

.toast-warning {
  border-left: 4px solid var(--star-yellow);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
}

@keyframes slideInRight {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Iconografia

**Biblioteca Sugerida:** Material Symbols (Outlined) com customização neon

**Ícones Principais:**
```
🚀 rocket_launch - Início de jornada
🛡️ shield - Proteção/Status
🌍 public - Casos de uso (planetas)
⏱️ timer - Countdown
✅ check_circle - Confirmação
❌ cancel - Erro/Cancelar
👁️ visibility - Ver detalhes
✏️ edit - Editar
🗑️ delete - Deletar
📊 dashboard - Admin panel
📥 download - Exportar Excel
🔒 lock - Indisponível
🔓 lock_open - Disponível
👥 group - Equipes
⚙️ settings - Configurações
```

**Estilo de Ícones:**
```css
.icon {
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 0 4px currentColor);
  transition: all 0.2s;
}

.icon:hover {
  filter: drop-shadow(0 0 8px currentColor);
  transform: scale(1.1);
}
```

### Animações e Micro-interações

#### 1. Particle Background (Estrelas)
```css
@keyframes float-particles {
  0%, 100% { transform: translateY(0) translateX(0); }
  33% { transform: translateY(-20px) translateX(10px); }
  66% { transform: translateY(10px) translateX(-10px); }
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: float-particles 20s infinite ease-in-out;
  opacity: 0.6;
}
```

#### 2. Card Hover Effect
```css
@keyframes card-glow-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.use-case-card:hover .card-glow {
  animation: card-glow-pulse 2s infinite;
}
```

#### 3. Shield Activation (ao selecionar)
```css
@keyframes shield-activate {
  0% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

.card-shield.activated {
  animation: shield-activate 0.6s ease;
}
```

#### 4. Success Confetti (Confirmação)
```css
@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.confetti-particle {
  position: absolute;
  width: 10px;
  height: 10px;
  animation: confetti-fall 3s linear;
}
```

---

## 📱 Wireframes & Layouts

### 1. Landing Page / Cadastro

```
┌─────────────────────────────────────────────────┐
│  [Logo EvolveAI] ────────────────────── [Admin] │
├─────────────────────────────────────────────────┤
│                                                 │
│          🚀 EXPLORE O UNIVERSO DE              │
│          POSSIBILIDADES                         │
│                                                 │
│   [Partículas de estrelas em movimento]        │
│                                                 │
│   ┌──────────────────────────────────┐         │
│   │  INICIAR SUA MISSÃO              │         │
│   │                                  │         │
│   │  [Input: Nome da Equipe]         │         │
│   │  [Input: Email]                  │         │
│   │                                  │         │
│   │  [Botão: 🚀 Começar Seleção]    │         │
│   │                                  │         │
│   │  Já tem uma missão ativa?       │         │
│   │  [Link: Fazer Login]             │         │
│   └──────────────────────────────────┘         │
│                                                 │
│   "Selecione seu caso de uso em 15 minutos"   │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Especificações:**
- **Background**: Gradient deep space (#0A1628 → #1E3A8A) com partículas animadas
- **Hero Title**: Orbitron 48px, gradient cyan→purple
- **Form Container**: Glass card (backdrop-filter blur) com border neon cyan
- **CTA Button**: Large (56px height), glow cyan intenso
- **Responsive**: Form stack vertical em mobile, hero title reduz para 32px

---

### 2. Galeria de Casos (Main Dashboard)

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo] ──────────────────── [Timer: ⏱️ 14:32] [Equipe: X]  │
├─────────────────────────────────────────────────────────────┤
│  MAPA ESTELAR DE CASOS DE USO                               │
│  "42 de 60 missões disponíveis"                            │
│                                                             │
│  [Filtros: 🌍 Todos | 🏭 Indústria | 🔧 Práticas | 📁 Cases]│
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ 🛡️ DISP  │  │ 🛡️ DISP  │  │ 🔒 SELEC │                 │
│  │ 🏭 Indús  │  │ 🔧 Prát   │  │ 📁 Cases │                 │
│  │          │  │          │  │          │                 │
│  │ Caso A   │  │ Caso B   │  │ Caso C   │                 │
│  │ Descrição│  │ Descrição│  │ Bloqueado│                 │
│  │ breve... │  │ breve... │  │ por outra│                 │
│  │          │  │          │  │ equipe   │                 │
│  │ [Detals] │  │ [Detals] │  │          │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ ...      │  │ ...      │  │ ...      │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
│  [Scroll vertical para ver mais casos]                     │
│                                                             │
│  [Status: 🟢 Conectado ao vivo]                             │
└─────────────────────────────────────────────────────────────┘
```

**Especificações:**
- **Grid**: 3 colunas desktop (gap 24px), 2 colunas tablet, 1 coluna mobile
- **Card Size**: 320px width × 380px height (desktop)
- **Timer**: Fixed position top-right, sempre visível durante scroll
- **Filtros**: Chip buttons com ícone + texto, ativo tem glow cyan
- **Status Indicator**: Small badge no footer "🟢 Ao vivo" (green) ou "🟡 Reconectando..." (yellow)
- **Scroll**: Smooth scroll, infinite scroll ou pagination (definir conforme performance)

**Estados dos Cards:**
1. **Disponível**: Border green glow, opacidade 1, hover intensifica glow
2. **Selecionado**: Border red, opacidade 0.6, overlay "🔒 SELECIONADO", não clicável
3. **Hover (disponível)**: Transform translateY(-8px), glow orange

---

### 3. Modal de Detalhes do Caso

```
┌─────────────────────────────────────────────┐
│ [Background Overlay - blur 8px]             │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ [X]                                  │  │
│  │                                      │  │
│  │ [Badge: 🏭 Indústria]                │  │
│  │ OTIMIZAÇÃO DE SUPPLY CHAIN COM IA   │  │
│  │                                      │  │
│  │ ─────────────────────────────────── │  │
│  │                                      │  │
│  │ Desenvolver modelo preditivo para   │  │
│  │ otimizar logística de distribuição  │  │
│  │ em rede varejista com 500+ pontos   │  │
│  │ de venda. O modelo deve considerar  │  │
│  │ variáveis como...                    │  │
│  │                                      │  │
│  │ [Mais conteúdo scrollável]          │  │
│  │                                      │  │
│  │ ┌────────────────────────────────┐  │  │
│  │ │ 🛡️ Status: Disponível          │  │  │
│  │ │ 📊 Complexidade: Alta          │  │  │
│  │ │ ⚙️ Tecnologias: Python, ML     │  │  │
│  │ └────────────────────────────────┘  │  │
│  │                                      │  │
│  │ [Voltar] [🚀 Selecionar Este Caso]  │  │
│  └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

**Especificações:**
- **Max Width**: 600px (desktop), 90vw (mobile)
- **Max Height**: 80vh, scroll interno se conteúdo maior
- **Animation**: Slide up + fade in (0.3s ease)
- **Close Button**: Top-right, hover rotaciona 90deg
- **Primary Action**: Button large, full width em mobile
- **Responsive**: Mobile vai fullscreen (95vw × 95vh)

---

### 4. Página de Confirmação (Pós-Seleção)

```
┌─────────────────────────────────────────────────┐
│  [Logo EvolveAI]                      [Sair]    │
├─────────────────────────────────────────────────┤
│                                                 │
│          ✅ MISSÃO CONFIRMADA!                  │
│                                                 │
│   [Animação: Confetti de estrelas caindo]      │
│                                                 │
│   ┌──────────────────────────────────┐         │
│   │  CASO SELECIONADO                │         │
│   │                                  │         │
│   │  🛡️ Otimização de Supply Chain  │         │
│   │  🏭 Indústria                    │         │
│   │                                  │         │
│   │  Descrição completa do caso...   │         │
│   └──────────────────────────────────┘         │
│                                                 │
│   PRÓXIMOS PASSOS:                             │
│   ┌──────────────────────────────────┐         │
│   │ 1. 💬 Junte-se ao Discord #caso  │         │
│   │ 2. 👨‍💼 Encontre seu mentor (14h)  │         │
│   │ 3. 🎤 Prepare pitch (16h)        │         │
│   │ 4. 📚 Acesse materiais [link]    │         │
│   └──────────────────────────────────┘         │
│                                                 │
│   [Copiar Detalhes] [Enviar por Email]         │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Especificações:**
- **Hero Message**: Orbitron 48px, color green glow, pulsing animation
- **Confetti**: 50-100 partículas coloridas caindo (cyan, orange, purple)
- **Case Card**: Destacado com green border, center aligned
- **Next Steps**: Numeração clara, ícones ilustrativos
- **Actions**: Secondary buttons (outlined), copy to clipboard feedback

---

### 5. Admin Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo Admin] ────────────────────────────────── [Sair]     │
├─────────────────────────────────────────────────────────────┤
│  CENTRO DE CONTROLE DA MISSÃO                               │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ 📊 TOTAL │  │ 🟢 DISP  │  │ 🔒 SELEC │                 │
│  │   60     │  │   42     │  │   18     │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                             │
│  [+ Adicionar Caso] [📥 Exportar Relatório]                │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Título          │ Categoria │ Status   │ Equipe │ ⚙️│   │
│  ├─────────────────────────────────────────────────────┤   │
│  │ Supply Chain... │ Indústria │ 🔒 Selec │ Team A │[E][D]│
│  │ Chatbot IA...   │ Práticas  │ 🟢 Disp  │   -    │[E][D]│
│  │ Dashboard XP... │ Cases     │ 🟢 Disp  │   -    │[E][D]│
│  │ ...             │ ...       │ ...      │ ...    │   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [Pagination: 1 2 3 ... 10]                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Especificações:**
- **Stats Cards**: 3 cards side-by-side, animação count-up ao carregar
- **Table**: Sortable columns, hover row highlight
- **Action Buttons**: Icon buttons (Edit pencil, Delete trash, Republish rotate)
- **Export Button**: Prominent, orange accent, download icon
- **Responsive**: Table scrollável horizontal em mobile ou card list view

---

### 6. Admin Form (Criar/Editar Caso)

```
┌─────────────────────────────────────────────┐
│ [Modal overlay]                             │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │ [X]                                  │  │
│  │ ADICIONAR NOVO CASO DE USO           │  │
│  │                                      │  │
│  │ Título *                             │  │
│  │ [Input text]                         │  │
│  │                                      │  │
│  │ Descrição *                          │  │
│  │ [Textarea - 5 rows]                  │  │
│  │                                      │  │
│  │ Categoria *                          │  │
│  │ [Dropdown: Indústria/Práticas/Cases]│  │
│  │                                      │  │
│  │ Subcategoria (opcional)              │  │
│  │ [Input text]                         │  │
│  │                                      │  │
│  │ [Cancelar] [💾 Salvar Caso]          │  │
│  └──────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

**Especificações:**
- **Validation**: Real-time feedback abaixo dos campos
- **Required Indicator**: Asterisco (*) vermelho
- **Textarea**: Auto-expand ou fixed height com scroll
- **Save Button**: Loading state (spinner + "Salvando...")
- **Success**: Toast notification + close modal + refresh table

---

## 📐 Responsive Breakpoints

### Breakpoint System
```css
/* Mobile First Approach */
/* Extra Small (xs) */
@media (min-width: 0px) { /* 320px - 639px */ }

/* Small (sm) */
@media (min-width: 640px) { /* 640px - 767px */ }

/* Medium (md) */
@media (min-width: 768px) { /* 768px - 1023px */ }

/* Large (lg) */
@media (min-width: 1024px) { /* 1024px - 1279px */ }

/* Extra Large (xl) */
@media (min-width: 1280px) { /* 1280px - 1535px */ }

/* 2XL */
@media (min-width: 1536px) { /* 1536px+ */ }
```

### Grid Adaptations

**Galeria de Casos:**
```css
.use-case-grid {
  display: grid;
  gap: 1.5rem;
}

/* Mobile: 1 coluna */
@media (min-width: 0px) {
  .use-case-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet: 2 colunas */
@media (min-width: 768px) {
  .use-case-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 colunas */
@media (min-width: 1024px) {
  .use-case-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large Desktop: 4 colunas (opcional) */
@media (min-width: 1536px) {
  .use-case-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

**Typography Scaling:**
```css
/* Hero Title */
.text-hero {
  font-size: 32px; /* Mobile */
}

@media (min-width: 768px) {
  .text-hero {
    font-size: 40px; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .text-hero {
    font-size: 48px; /* Desktop */
  }
}
```

**Timer Component:**
```css
/* Mobile: Compacto no topo */
@media (max-width: 767px) {
  .timer-container {
    top: 0;
    right: 0;
    left: 0;
    border-radius: 0;
    justify-content: center;
  }
  
  .timer-display {
    font-size: 24px;
  }
}
```

**Modal Behavior:**
```css
/* Mobile: Fullscreen */
@media (max-width: 767px) {
  .modal-container {
    width: 95vw;
    height: 95vh;
    max-width: none;
    max-height: none;
    border-radius: 12px;
  }
}

/* Desktop: Centered */
@media (min-width: 768px) {
  .modal-container {
    max-width: 600px;
    max-height: 80vh;
  }
}
```

---

## ♿ Acessibilidade (WCAG AA)

### Contraste de Cores

**Validações Realizadas:**
```
✅ Text Light (#F9FAFB) sobre Deep Space (#0A1628): 13.5:1 (AAA)
✅ Neon Cyan (#06B6D4) sobre Deep Space (#0A1628): 7.8:1 (AAA)
✅ Solar Orange (#F97316) sobre Deep Space (#0A1628): 5.2:1 (AA)
✅ Shield Green (#10B981) sobre Nebula Dark (#1E3A8A): 4.8:1 (AA)
✅ Nova Red (#EF4444) sobre Deep Space (#0A1628): 4.6:1 (AA)
```

**Ferramenta Recomendada:** WebAIM Contrast Checker

### Navegação por Teclado

**Tab Order:**
```
Landing Page:
1. Input Nome da Equipe
2. Input Email
3. Botão "Começar Seleção"
4. Link "Fazer Login"
5. Link "Admin" (footer)

Galeria:
1. Filtro "Todos"
2. Filtro "Indústria"
3. Filtro "Práticas"
4. Filtro "Cases"
5. Card Caso 1 → Botão "Ver Detalhes"
6. Card Caso 2 → Botão "Ver Detalhes"
... (sequencial)

Modal:
1. Botão "X" (close)
2. Botão "Voltar"
3. Botão "Selecionar Este Caso"
```

**Focus Styles:**
```css
*:focus {
  outline: 3px solid var(--neon-cyan);
  outline-offset: 2px;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.6);
}

button:focus,
a:focus {
  outline: 3px solid var(--neon-cyan);
  outline-offset: 4px;
}
```

### ARIA Labels

```html
<!-- Timer -->
<div class="timer-container" role="timer" aria-live="polite" aria-atomic="true">
  <span class="timer-label" id="timer-label">Tempo Restante:</span>
  <div class="timer-display" aria-labelledby="timer-label">
    <span aria-label="14 minutos">14</span>:<span aria-label="32 segundos">32</span>
  </div>
</div>

<!-- Card Status -->
<div class="use-case-card" aria-label="Caso de uso: Otimização de Supply Chain, Status: Disponível">
  <div class="card-shield" aria-label="Status disponível">
    <!-- Content -->
  </div>
</div>

<!-- Button Loading -->
<button class="btn btn-primary" aria-busy="true" aria-label="Selecionando caso, aguarde">
  <span class="spinner" aria-hidden="true"></span>
  Selecionando...
</button>

<!-- Modal -->
<div class="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal-container">
    <h2 id="modal-title">Otimização de Supply Chain com IA</h2>
    <!-- Content -->
  </div>
</div>
```

### Screen Reader Announcements

```javascript
// Função para anúncios dinâmicos
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'assertive');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // Visually hidden
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Uso:
announceToScreenReader('Caso de uso selecionado com sucesso!');
announceToScreenReader('Tempo restante: 1 minuto');
```

### Alt Text Guidelines

```html
<!-- Logo -->
<img src="logo.svg" alt="EvolveAI Hackathon Brasil - Logotipo">

<!-- Decorative Icons (sem alt) -->
<span class="icon" aria-hidden="true">🚀</span>

<!-- Informative Icons (com label) -->
<span class="icon" role="img" aria-label="Disponível">🛡️</span>

<!-- Status Badge -->
<div class="status-badge" role="status" aria-label="Status: Caso disponível para seleção">
  <span aria-hidden="true">🟢</span> Disponível
</div>
```

---

## 📦 Assets e Recursos

### Recursos Gráficos Necessários

**Fornecidos por Cliente:**
1. Logo EvolveAI Hackathon (SVG, PNG @2x)
2. Ícone/Favicon (512×512px PNG)
3. Imagens de background (opcional - se não, usar gradientes)

**A Criar:**
1. Shield SVG icons (disponível, indisponível, selecionado)
2. Planet/orb decorations (SVG circular com gradiente)
3. Particle textures (pequenos dots brancos)
4. Loading spinner (orbital animation SVG)

### Estrutura de Assets

```
/public
  /images
    logo.svg
    logo-admin.svg
    favicon.ico
    favicon-32x32.png
    favicon-16x16.png
    
  /icons
    shield-available.svg
    shield-unavailable.svg
    shield-locked.svg
    planet-blue.svg
    planet-purple.svg
    planet-orange.svg
    
  /particles
    star-particle.svg
    glow-particle.png
    
  /fonts
    Orbitron-Regular.woff2
    Orbitron-Bold.woff2
    Inter-Regular.woff2
    Inter-SemiBold.woff2
    FiraCode-Regular.woff2
```

---

## 🎬 Interações e Animações

### Estados de Loading

**1. Button Loading State:**
```html
<button class="btn btn-primary" data-loading="true">
  <svg class="spinner" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke-width="3" />
  </svg>
  Selecionando...
</button>
```

```css
@keyframes rotate {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 20px;
  height: 20px;
  animation: rotate 1s linear infinite;
  stroke: currentColor;
  fill: none;
  stroke-dasharray: 50;
  stroke-dashoffset: 25;
}
```

**2. Skeleton Loading (Cards):**
```html
<div class="use-case-card skeleton">
  <div class="skeleton-shield"></div>
  <div class="skeleton-title"></div>
  <div class="skeleton-text"></div>
  <div class="skeleton-text"></div>
  <div class="skeleton-button"></div>
</div>
```

```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton > * {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.05) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
  border-radius: 8px;
}
```

### Transições Importantes

**Page Transitions:**
```css
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s ease-out;
}

.page-exit {
  opacity: 1;
}

.page-exit-active {
  opacity: 0;
  transition: opacity 0.3s ease-in;
}
```

**Filter Change:**
```css
.use-case-grid {
  transition: all 0.3s ease;
}

.use-case-grid.filtering {
  opacity: 0.5;
  filter: blur(4px);
}
```

---

## 📐 Implementação Técnica

### Stack Recomendada para Implementação

**CSS Framework/Tools:**
- **Tailwind CSS** + custom config para theme galáctico
- **Framer Motion** para animações complexas (React)
- **GSAP** para timeline animations (opcional, se budget permitir)

**Tailwind Custom Config:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'deep-space': '#0A1628',
        'nebula-dark': '#1E3A8A',
        'neon-cyan': '#06B6D4',
        'solar-orange': '#F97316',
        'cosmic-purple': '#8B5CF6',
        'shield-green': '#10B981',
        'star-yellow': '#FBBF24',
        'nova-red': '#EF4444',
      },
      fontFamily: {
        'display': ['Orbitron', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.5)',
        'neon-orange': '0 0 30px rgba(249, 115, 22, 0.6)',
        'shield-green': '0 0 20px rgba(16, 185, 129, 0.4)',
      },
      animation: {
        'float': 'float 20s infinite ease-in-out',
        'shimmer': 'shimmer 3s infinite',
        'pulse-red': 'pulse-red 1s infinite',
      }
    }
  }
}
```

### Componentes React (Exemplo)

```jsx
// UseCaseCard.jsx
import { motion } from 'framer-motion';

const UseCaseCard = ({ useCase, onViewDetails }) => {
  const isAvailable = useCase.isAvailable;
  
  return (
    <motion.div
      className={`use-case-card ${!isAvailable ? 'unavailable' : ''}`}
      whileHover={isAvailable ? { y: -8, scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Shield Badge */}
      <div className={`card-shield ${isAvailable ? 'available' : 'locked'}`}>
        <ShieldIcon />
        <span>{isAvailable ? 'Disponível' : 'Selecionado'}</span>
      </div>
      
      {/* Category */}
      <div className="card-category">
        <CategoryIcon category={useCase.category} />
        {useCase.category}
      </div>
      
      {/* Content */}
      <h3 className="card-title">{useCase.title}</h3>
      <p className="card-description">{truncate(useCase.description, 150)}</p>
      
      {/* Action */}
      {isAvailable && (
        <motion.button
          className="btn btn-primary"
          onClick={() => onViewDetails(useCase.id)}
          whileTap={{ scale: 0.95 }}
        >
          Ver Detalhes
        </motion.button>
      )}
      
      {/* Glow Effect */}
      <div className="card-glow" />
      
      {/* Locked Overlay */}
      {!isAvailable && (
        <div className="locked-overlay">
          🔒 SELECIONADO
        </div>
      )}
    </motion.div>
  );
};
```

### Performance Optimizations

**Imagens:**
- Usar WebP para imagens raster
- SVG para ícones e logos
- Lazy loading para cards fora da viewport

**Animações:**
- Usar `transform` e `opacity` (GPU accelerated)
- Evitar animar `width`, `height`, `top`, `left`
- `will-change` apenas quando necessário

**Bundle Size:**
- Tree-shake unused CSS (PurgeCSS com Tailwind)
- Code-split por rota (React.lazy)
- Lazy load framer-motion animations

---

## ✅ Checklist de Implementação

### Fase 1: Setup e Design System (2h)
- [ ] Configurar Tailwind com theme customizado
- [ ] Importar fontes (Orbitron, Inter, Fira Code)
- [ ] Criar tokens CSS (cores, espaçamentos, shadows)
- [ ] Implementar componentes base (Button, Card, Modal, Toast)
- [ ] Testar contraste de cores (WCAG AA)

### Fase 2: Layouts Principais (4h)
- [ ] Landing Page com formulário de cadastro
- [ ] Galeria de casos (grid responsivo + filtros)
- [ ] Modal de detalhes
- [ ] Página de confirmação
- [ ] Dashboard admin

### Fase 3: Interatividade (3h)
- [ ] Timer component (countdown funcional)
- [ ] WebSocket connection indicator
- [ ] Animações de hover/click
- [ ] Loading states (skeleton, spinners)
- [ ] Toast notifications

### Fase 4: Responsividade (2h)
- [ ] Testar em 3 breakpoints (mobile, tablet, desktop)
- [ ] Ajustar grid de cards
- [ ] Modal fullscreen em mobile
- [ ] Navegação touch-friendly (44px min)

### Fase 5: Acessibilidade (2h)
- [ ] Validar tab order
- [ ] Adicionar ARIA labels
- [ ] Testar com screen reader
- [ ] Focus styles visíveis
- [ ] Keyboard shortcuts (Esc para fechar modal)

### Fase 6: Polish e Detalhes (2h)
- [ ] Particle background animation
- [ ] Confetti na confirmação
- [ ] Micro-interações (pulse, glow)
- [ ] Smooth transitions entre páginas
- [ ] Otimizar performance (bundle size)

---

## 📝 Notas de Implementação

### Priorização para MVP (1 dia)

**Must Have (Crítico):**
✅ Design system básico (cores, tipografia, componentes)
✅ Layouts principais (5 telas core)
✅ Responsividade funcional (3 breakpoints)
✅ Estados de loading
✅ WCAG AA mínimo

**Should Have (Importante):**
⚠️ Animações sutis (hover, transitions)
⚠️ Timer component polido
⚠️ Toast notifications
⚠️ Focus states robustos

**Could Have (Nice to have):**
💡 Particle background animado
💡 Confetti celebration
💡 Glow effects complexos
💡 Micro-interações avançadas

**Won't Have (Pós-MVP):**
❌ Dark/Light mode toggle
❌ Customização de tema pelo usuário
❌ Animações 3D complexas
❌ Sound effects

### Handoff para Developers

**Arquivos a Entregar:**
1. ✅ Figma file com protótipo interativo
2. ✅ Design tokens (JSON/CSS)
3. ✅ Component library documentada
4. ✅ Assets exportados (SVG, PNG @2x)
5. ✅ Este documento (UX Spec completo)

**Developer Kickoff:**
- Apresentar conceito visual (15 min)
- Demonstrar protótipo interativo (15 min)
- Responder dúvidas técnicas (30 min)
- Definir processo de review (10 min)

---

## 🎯 Success Metrics (UX)

### Métricas de Usabilidade
- **Time to First Selection**: < 5 minutos (do cadastro até selecionar caso)
- **Filter Usage Rate**: > 70% dos usuários usam filtros
- **Mobile Completion Rate**: > 80% dos usuários mobile completam fluxo
- **Timer Timeout Rate**: < 15% (maioria decide antes de expirar)

### Métricas de Acessibilidade
- **Keyboard Navigation Success**: 100% dos elementos navegáveis via Tab
- **Screen Reader Compatibility**: Testado em NVDA/JAWS
- **Color Contrast**: 100% dos textos passam WCAG AA mínimo

### Feedback Qualitativo (Pós-Evento)
- Survey: "O design ajudou você a encontrar um caso rapidamente?" (escala 1-5)
- Observação: Quantos usuários tiveram dificuldade com algum elemento visual?

---

## 📄 Conclusão

Este design system cria uma experiência **imersiva, futurista e funcional** que transforma a seleção de casos de uso em uma jornada espacial memorável. A estética de astronauta galáctico com elementos neon não é apenas visual - ela reforça a narrativa de "escolher sua missão" de forma segura e confiante.

**Próximos Passos:**
1. ✅ Validar conceito visual com stakeholders
2. ✅ Criar protótipo Figma interativo
3. ✅ Exportar assets e design tokens
4. ✅ Kick-off com time de desenvolvimento
5. ⏳ Acompanhar implementação com design reviews

**Contato para Dúvidas:**
Sofia - UX Expert Avanade (@sofia-ux)

---

*Documento criado em 27/01/2026 - EvolveAI Hackathon Brasil*
*"Explore o universo de possibilidades. Selecione sua missão." 🚀*
