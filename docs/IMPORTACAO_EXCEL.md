# 📊 Importação de Casos de Uso via Excel

## Como Usar

1. **Baixar Template**
   - No painel admin, clique em "📥 Baixar Template"
   - Um arquivo Excel será baixado com exemplos

2. **Preencher Planilha**
   - Abra o arquivo no Excel/Google Sheets
   - Preencha os dados seguindo o formato abaixo

3. **Importar**
   - No painel admin, clique em "📤 Importar Excel"
   - Selecione seu arquivo preenchido
   - Aguarde a confirmação

## Formato da Planilha

### Colunas Obrigatórias

| Coluna | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| **titulo** | Texto | Nome do caso de uso | "Automação de Processos Industriais" |
| **descricao** | Texto | Descrição detalhada | "Implementação de IA para otimizar..." |
| **categoria** | Texto | Deve ser exatamente: `Industria`, `Praticas` ou `Cases` | "Industria" |
| **subcategoria** | Texto | **Obrigatório para Industria e Praticas**, opcional para Cases | Ver tabela abaixo |

### Subcategoria por Tipo

#### Se categoria = `Industria` (obrigatório)
Especifique qual indústria:
- Manufatura, Saúde, Varejo, Financeiro, Energia, Telecom, Educação, Logística, Agrícola, etc.

#### Se categoria = `Praticas` (obrigatório)
Especifique qual prática:
- DevOps, Agile, Cloud, Segurança, Data & AI, Modernização, IoT, Blockchain, etc.

#### Se categoria = `Cases` (opcional)
Pode especificar o setor do cliente:
- Financeiro, Varejo, Saúde, etc.

### Colunas Opcionais

| Coluna | Tipo | Descrição | Exemplo |
|--------|------|-----------|---------|
| **detalhes** | Texto | Informações adicionais mostradas após seleção | "Requisitos: Python, Azure ML..." |

## Regras de Validação

✅ **Obrigatório:**
- Título não pode estar vazio
- Descrição não pode estar vazia
- Categoria deve ser: `Industria`, `Praticas` ou `Cases` (case-sensitive)
- **Subcategoria é obrigatória** quando categoria = `Industria` ou `Praticas`

⚠️ **Opcional:**
- Detalhes (deixe vazio se não houver)
- Subcategoria apenas para categoria `Cases`

## Nomes de Colunas Aceitos

O sistema aceita nomes em **português** e **inglês**:

- `titulo` ou `title`
- `descricao` ou `description`
- `detalhes` ou `details`
- `categoria` ou `category`
- `subcategoria` ou `subcategory`

## Exemplo de Planilha Válida

```
| titulo                              | descricao                           | detalhes                    | categoria  | subcategoria |
|-------------------------------------|-------------------------------------|-----------------------------|------------|--------------|
| Automação Industrial com IA         | Sistema de IA para otimizar...      | Requisitos: Python, Azure   | Industria  | Manufatura   |
| Telemedicina e Prontuário Digital   | Plataforma completa de saúde...     | HIPAA compliant             | Industria  | Saúde        |
| E-commerce Omnichannel              | Sistema integrado online/físico...  |                             | Industria  | Varejo       |
| Implementação DevOps Azure          | Pipeline CI/CD completo...          | Azure DevOps, Terraform     | Praticas   | DevOps       |
| Migração para Cloud Azure           | Lift-and-shift + modernização...    |                             | Praticas   | Cloud        |
| Segurança e Compliance              | Framework de segurança corporativa..| ISO 27001, LGPD             | Praticas   | Segurança    |
| Case: Banco ABC Open Banking        | Implementação completa...           | Cliente: Banco ABC          | Cases      | Financeiro   |
| Case: Varejo XYZ Digital            | Transformação digital...            | Cliente: Varejo XYZ         | Cases      |              |
```

## Categorias Disponíveis

### 🏭 Industria
Casos relacionados a diferentes setores industriais. **Subcategoria obrigatória.**

**Exemplos de subcategorias:**
- Manufatura, Saúde, Varejo, Financeiro, Energia, Telecom, Educação, Logística, Agrícola, Construção, Automotivo, Farmacêutico, Alimentício

### ⚙️ Praticas
Práticas e metodologias de desenvolvimento/tecnologia. **Subcategoria obrigatória.**

**Exemplos de subcategorias:**
- DevOps, Agile, Cloud, Segurança, Data & AI, Modernização, IoT, Blockchain, Machine Learning, Microservices, Kubernetes, Observabilidade

### 💼 Cases
Casos de sucesso de clientes. **Subcategoria opcional** (use para indicar setor do cliente se desejar).

## Mensagens de Erro Comuns

### "Campo 'titulo' é obrigatório"
- Certifique-se de que todas as linhas têm um título preenchido

### "Campo 'categoria' é obrigatório"
- Todas as linhas devem ter uma categoria

### "Categoria 'XXX' inválida"
- Use exatamente: `Industria`, `Praticas` ou `Cases`
- Atenção à capitalização (primeira letra maiúscula)

### "Campo 'subcategoria' é obrigatório para categoria 'Industria'"
- Quando usar categoria `Industria`, você DEVE especificar qual indústria (ex: Saúde, Varejo, Manufatura)

### "Campo 'subcategoria' é obrigatório para categoria 'Praticas'"
- Quando usar categoria `Praticas`, você DEVE especificar qual prática (ex: DevOps, Cloud, Segurança)

### "Nenhum caso de uso válido encontrado"
- Verifique se há dados na planilha
- Confirme que as colunas têm os nomes corretos

## Dicas

💡 **Use o template**: Sempre baixe o template para ter o formato correto

💡 **Teste com poucos casos**: Importe 2-3 casos primeiro para validar o formato

💡 **Copie de outras fontes**: Você pode copiar dados de outras planilhas e colar no template

💡 **Backup**: Antes de importar muitos casos, exporte o CSV atual dos casos existentes

## Limitações

- Máximo de ~1000 casos por importação (limite do Firestore batch)
- Arquivo deve ser .xlsx ou .xls
- Não importa casos duplicados automaticamente (você deve verificar manualmente)

## Suporte

Se encontrar problemas:
1. Verifique o console do navegador (F12) para erros detalhados
2. Baixe novamente o template e compare com seu arquivo
3. Certifique-se de que as categorias estão escritas corretamente
