template:
  id: teaching-mode-response-template
  name: Teaching Mode Response Template
  version: 1.0
  output:
    format: markdown
    filename: response/teaching-mode.md
    title: "Avanade Method Teaching Response"

## 🎓 Formato de Resposta em Teaching Mode

Quando detectar **GitHub Copilot Mode**, retorne no seguinte formato estruturado:

```markdown
# Avanade Method: [Nome da Tarefa]

## 📦 Artifacts Necessários
Lista os artifacts que o GitHub Copilot deve buscar ou criar:
- Template YAML para [tipo específico]
- Checklist de [processo específico]
- Workflow de [processo específico]

## 🔧 Comandos Master Agent
Comandos que o GitHub Copilot pode usar para executar a tarefa:

### *task [nome-da-task]
```yaml
parameters:
  project_name: "Nome do projeto"
  requirement_type: "Tipo de requisito"
  complexity_level: "Nível de complexidade"
```

### *template [nome-do-template]
```yaml
context:
  project_type: "Tipo do projeto"
  technology_stack: "Stack tecnológica"
  business_domain: "Domínio de negócio"
```

### *checklist [nome-do-checklist]
```yaml
scope:
  phase: "Fase do projeto"
  deliverables: "Entregáveis esperados"
  quality_gates: "Gates de qualidade"
```

## 💡 Instruções de Execução

### Passo 1: Preparação
1. Identifique o contexto do projeto usando semantic_search
2. Colete requirements através de elicitação estruturada
3. Valide premissas com stakeholders

### Passo 2: Execução
1. Execute o comando apropriado do Master Agent
2. Aplique o template correspondente
3. Valide com checklist específico

### Passo 3: Validação
1. Revise outputs com critérios de qualidade
2. Colete feedback de stakeholders
3. Refine conforme necessário

## 🎯 Critérios de Qualidade

### Para Documentos
- ✅ Estrutura clara e consistente
- ✅ Informações completas e precisas
- ✅ Linguagem adequada ao público-alvo
- ✅ Validação com stakeholders

### Para Código
- ✅ Padrões de arquitetura seguidos
- ✅ Comentários e documentação
- ✅ Testes unitários incluídos
- ✅ Code review aprovado

### Para Processes
- ✅ Alinhamento com metodologia Avanade
- ✅ Rastreabilidade de requisitos
- ✅ Gates de qualidade atendidos
- ✅ Aprovações necessárias obtidas

## 🔄 Workflows Sugeridos

### Para Discovery
```yaml
workflow:
  - elicit_requirements: "Maria (Business)"
  - analyze_technical: "Wilson (Architect)"  
  - estimate_effort: "João (PM)"
  - validate_scope: "Stakeholders"
```

### Para Design
```yaml
workflow:
  - create_architecture: "Wilson (Architect)"
  - design_ui_ux: "Carla (UX)"
  - define_apis: "Tiago (Dev Lead)"
  - review_security: "Security Team"
```

### Para Implementation
```yaml
workflow:
  - setup_environment: "DevOps"
  - implement_features: "Dev Team"
  - execute_tests: "QA Team"
  - deploy_solution: "DevOps"
```

## 📚 Knowledge Base References

### Metodologia Avanade
- Fases: Discover & Envision → Design & Implement → Run & Evolve
- Agentes especializados: Maria, Wilson, João, Tiago, Carla
- Stack Microsoft-first: Azure, .NET, TypeScript, SQL Server

### Best Practices
- Elicitação interativa e iterativa
- Validação contínua com stakeholders  
- Documentação como código
- Automação de qualidade

### Quality Gates
- Cada fase tem critérios específicos de saída
- Aprovações requeridas antes de prosseguir
- Métricas de qualidade definidas
- Auditoria e compliance

## 🎪 Exemplo de Resposta Completa

```markdown
# Avanade Method: Criação de PRD

Vou ajudar você a criar um Product Requirements Document seguindo a metodologia Avanade.

## 📦 Artifacts que vou usar:
- Template: AVANADE_PRD_TEMPLATE_YAML
- Checklist: AVANADE_PRD_CHECKLIST_MD  
- Agent: Maria (Business Analyst)

## 🔧 Executando comando:
`*task create-prd`

## 💡 Processo:
1. **Elicitação** - Coletando requisitos com stakeholders
2. **Análise** - Estruturando informações coletadas  
3. **Documentação** - Criando PRD usando template
4. **Validação** - Revisando com checklist de qualidade

## 🎯 Resultado:
PRD completo com seções padronizadas Avanade, validado por checklist de qualidade e aprovado por stakeholders.

[Proceder com execução...]
```

## 🔍 Detecção de GitHub Copilot Mode

### Indicadores de Context:
- User menciona "GitHub Copilot" explicitamente
- Referências a VSCode, extensions, ou AI coding assistants
- Solicitações de "ensinar" ou "mostrar como fazer"
- Contexto de desenvolvimento/coding assistance

### Comportamento Apropriado:
- Responder em modo teaching
- Focar em comandos executáveis
- Incluir exemplos práticos
- Estruturar resposta para copy-paste

### Evitar:
- Executar diretamente as tarefas
- Retornar apenas teoria
- Usar linguagem muito técnica
- Omitir exemplos práticos
```