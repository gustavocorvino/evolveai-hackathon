import { db } from './src/firebase/config.js';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Script para popular Firestore com 60 casos de uso de exemplo
 * Executar: node seed-firestore.js
 */

const useCases = [
  // INDÚSTRIA (20 casos)
  {
    title: "Otimização de Supply Chain com IA",
    description: "Desenvolver modelo preditivo para otimizar logística de distribuição em rede varejista com 500+ pontos de venda, reduzindo custos de transporte e melhorando tempo de entrega.",
    category: "Industria",
    subcategory: "Varejo",
  },
  {
    title: "Manutenção Preditiva em Equipamentos Industriais",
    description: "Implementar sistema de IoT + Machine Learning para prever falhas em máquinas de produção antes que ocorram, reduzindo downtime e custos de manutenção.",
    category: "Industria",
    subcategory: "Manufatura",
  },
  {
    title: "Sistema de Qualidade Visual com Computer Vision",
    description: "Detectar defeitos em peças manufaturadas usando visão computacional, substituindo inspeção manual e aumentando precisão para 99.5%.",
    category: "Industria",
    subcategory: "Controle de Qualidade",
  },
  {
    title: "Otimização de Consumo Energético em Fábricas",
    description: "Desenvolver sistema de monitoramento em tempo real para reduzir consumo elétrico em plantas industriais através de análise de padrões e automação.",
    category: "Industria",
    subcategory: "Energia",
  },
  {
    title: "Gestão Inteligente de Estoque com RFID",
    description: "Implementar rastreamento automático de inventário usando RFID e IA para prever demanda e evitar rupturas ou excesso de estoque.",
    category: "Industria",
    subcategory: "Logística",
  },
  {
    title: "Plataforma de Monitoramento de Frotas",
    description: "Sistema de telemetria e análise de comportamento de motoristas para reduzir consumo de combustível e acidentes em frota de 200+ veículos.",
    category: "Industria",
    subcategory: "Transporte",
  },
  {
    title: "Sistema de Recomendação para E-commerce B2B",
    description: "Implementar motor de recomendação personalizado para plataforma de vendas industriais, aumentando ticket médio e conversão.",
    category: "Industria",
    subcategory: "Vendas",
  },
  {
    title: "Automação de Processos de Compras (RPA)",
    description: "Desenvolver bots RPA para automatizar aprovações, cotações e pedidos de compras, reduzindo tempo de ciclo de procurement em 60%.",
    category: "Industria",
    subcategory: "Procurement",
  },
  {
    title: "Dashboard de KPIs Operacionais em Tempo Real",
    description: "Criar plataforma centralizada de visualização de indicadores de produção, qualidade e eficiência para tomada de decisão rápida.",
    category: "Industria",
    subcategory: "Analytics",
  },
  {
    title: "Sistema de Rastreabilidade de Produtos (Blockchain)",
    description: "Implementar rastreamento fim-a-fim de produtos usando blockchain para garantir autenticidade e compliance regulatório.",
    category: "Industria",
    subcategory: "Compliance",
  },
  {
    title: "Chatbot para Atendimento ao Cliente Industrial",
    description: "Desenvolver assistente virtual com NLP para responder dúvidas técnicas, processar pedidos e escalar casos complexos automaticamente.",
    category: "Industria",
    subcategory: "Customer Service",
  },
  {
    title: "Sistema de Agendamento Inteligente de Manutenção",
    description: "Otimizar calendário de manutenções preventivas baseado em uso real de equipamentos, minimizando paradas não planejadas.",
    category: "Industria",
    subcategory: "Operações",
  },
  {
    title: "Plataforma de Gestão de Projetos de Engenharia",
    description: "Sistema colaborativo para gerenciar projetos industriais complexos com integração CAD, controle de custos e timeline.",
    category: "Industria",
    subcategory: "Engenharia",
  },
  {
    title: "Sistema de Monitoramento Ambiental (Emissões)",
    description: "Monitorar e reportar emissões de gases em tempo real, garantindo compliance com regulações ambientais e reduzindo multas.",
    category: "Industria",
    subcategory: "Sustentabilidade",
  },
  {
    title: "Portal de Fornecedores com Análise de Performance",
    description: "Plataforma para avaliar e ranquear fornecedores baseado em qualidade, prazo e custo, facilitando decisões de sourcing.",
    category: "Industria",
    subcategory: "Supply Chain",
  },
  {
    title: "Sistema de Segurança Industrial com IoT",
    description: "Implementar sensores e alertas automáticos para detectar situações de risco (gases, temperatura, intrusão) em ambientes industriais.",
    category: "Industria",
    subcategory: "Segurança",
  },
  {
    title: "Plataforma de Treinamento Virtual (VR/AR)",
    description: "Desenvolver simulações imersivas para capacitar operadores em procedimentos complexos sem risco operacional.",
    category: "Industria",
    subcategory: "Treinamento",
  },
  {
    title: "Sistema de Pricing Dinâmico B2B",
    description: "Implementar modelo de precificação inteligente que ajusta preços baseado em demanda, competição e margem alvo.",
    category: "Industria",
    subcategory: "Revenue",
  },
  {
    title: "Portal de Self-Service para Clientes Industriais",
    description: "Plataforma web para clientes consultarem pedidos, emitirem notas fiscais e abrirem chamados técnicos sem intervenção humana.",
    category: "Industria",
    subcategory: "Customer Experience",
  },
  {
    title: "Sistema de Gestão de Resíduos Industriais",
    description: "Rastrear, classificar e otimizar descarte de resíduos conforme regulações ambientais, reduzindo custos e impacto ecológico.",
    category: "Industria",
    subcategory: "Meio Ambiente",
  },

  // PRÁTICAS (20 casos)
  {
    title: "Implementação de DevOps e CI/CD",
    description: "Estabelecer pipeline automatizado de integração e deploy contínuo para reduzir time-to-market de features em 50%.",
    category: "Praticas",
    subcategory: "DevOps",
  },
  {
    title: "Migração de Monolito para Microserviços",
    description: "Refatorar aplicação legada monolítica em arquitetura de microserviços, melhorando escalabilidade e manutenibilidade.",
    category: "Praticas",
    subcategory: "Arquitetura",
  },
  {
    title: "Implementação de Data Governance",
    description: "Estabelecer framework de governança de dados incluindo catalogação, qualidade e compliance com LGPD/GDPR.",
    category: "Praticas",
    subcategory: "Governança",
  },
  {
    title: "Adoção de Metodologia Ágil (Scrum/Kanban)",
    description: "Transformar equipes tradicionais em squads ágeis, implementando cerimônias e métricas de velocity e throughput.",
    category: "Praticas",
    subcategory: "Agile",
  },
  {
    title: "Implementação de Observability Stack",
    description: "Configurar monitoramento completo (logs, métricas, traces) usando Grafana, Prometheus e OpenTelemetry.",
    category: "Praticas",
    subcategory: "Observabilidade",
  },
  {
    title: "Programa de Automação de Testes (QA)",
    description: "Criar suite de testes automatizados (unit, integration, E2E) para reduzir bugs em produção em 70%.",
    category: "Praticas",
    subcategory: "Quality Assurance",
  },
  {
    title: "Estabelecimento de API-First Strategy",
    description: "Definir padrões de design de APIs (REST/GraphQL), documentação (OpenAPI) e versionamento para toda organização.",
    category: "Praticas",
    subcategory: "API Management",
  },
  {
    title: "Implementação de GitOps para Infraestrutura",
    description: "Gerenciar infraestrutura como código (IaC) usando Git como fonte única de verdade para ambientes cloud.",
    category: "Praticas",
    subcategory: "Infrastructure",
  },
  {
    title: "Programa de Code Review e Pair Programming",
    description: "Estabelecer cultura de revisão de código e programação em par para melhorar qualidade e compartilhar conhecimento.",
    category: "Praticas",
    subcategory: "Desenvolvimento",
  },
  {
    title: "Implementação de Security by Design",
    description: "Integrar práticas de segurança desde o início do SDLC, incluindo threat modeling e SAST/DAST.",
    category: "Praticas",
    subcategory: "Segurança",
  },
  {
    title: "Estratégia de Multi-Cloud",
    description: "Definir arquitetura e práticas para operar workloads em múltiplos cloud providers (AWS, Azure, GCP).",
    category: "Praticas",
    subcategory: "Cloud",
  },
  {
    title: "Implementação de Feature Flags",
    description: "Adotar sistema de feature toggles para deploy contínuo sem risco, permitindo rollback instantâneo.",
    category: "Praticas",
    subcategory: "Release Management",
  },
  {
    title: "Programa de Tech Debt Management",
    description: "Estabelecer processo estruturado para identificar, priorizar e eliminar débito técnico de forma sistemática.",
    category: "Praticas",
    subcategory: "Manutenibilidade",
  },
  {
    title: "Implementação de Chaos Engineering",
    description: "Criar práticas de teste de resiliência simulando falhas em produção para validar recovery automático.",
    category: "Praticas",
    subcategory: "Resiliência",
  },
  {
    title: "Adoção de Domain-Driven Design (DDD)",
    description: "Aplicar princípios de DDD para modelagem de software alinhada com domínio de negócio complexo.",
    category: "Praticas",
    subcategory: "Design",
  },
  {
    title: "Implementação de DataOps",
    description: "Automatizar pipelines de dados (ETL/ELT) com monitoramento de qualidade e lineage para analytics confiável.",
    category: "Praticas",
    subcategory: "Data Engineering",
  },
  {
    title: "Programa de Performance Engineering",
    description: "Estabelecer práticas de otimização de performance desde o design, incluindo load testing e profiling contínuo.",
    category: "Praticas",
    subcategory: "Performance",
  },
  {
    title: "Implementação de Event-Driven Architecture",
    description: "Migrar para arquitetura orientada a eventos usando message brokers (Kafka, RabbitMQ) para desacoplamento.",
    category: "Praticas",
    subcategory: "Integração",
  },
  {
    title: "Programa de Accessibility (A11y) First",
    description: "Garantir WCAG AA em todas as interfaces através de testes automatizados e auditorias periódicas.",
    category: "Praticas",
    subcategory: "Acessibilidade",
  },
  {
    title: "Implementação de Green Software Engineering",
    description: "Adotar práticas de desenvolvimento sustentável para reduzir consumo energético e pegada de carbono de software.",
    category: "Praticas",
    subcategory: "Sustentabilidade",
  },

  // CASES (20 casos)
  {
    title: "Transformação Digital de Banco Regional",
    description: "Case de migração completa de sistemas bancários legados para cloud, incluindo open banking e onboarding digital.",
    category: "Cases",
    subcategory: "Banking",
  },
  {
    title: "E-commerce Omnichannel para Varejo",
    description: "Implementação de plataforma unificada integrando lojas físicas, app mobile e web com inventory real-time.",
    category: "Cases",
    subcategory: "Retail",
  },
  {
    title: "Plataforma de Telemedicina Completa",
    description: "Sistema de consultas online, prontuário eletrônico e prescrição digital em conformidade com CFM.",
    category: "Cases",
    subcategory: "Healthcare",
  },
  {
    title: "Sistema de Gestão Escolar Integrado",
    description: "Plataforma SaaS para instituições de ensino com portal do aluno, gestão acadêmica e financeira.",
    category: "Cases",
    subcategory: "Education",
  },
  {
    title: "Marketplace de Serviços Profissionais",
    description: "Plataforma de match entre clientes e prestadores de serviço (freelancers) com pagamento e avaliação integrados.",
    category: "Cases",
    subcategory: "Gig Economy",
  },
  {
    title: "App de Mobilidade Urbana (Ride-sharing)",
    description: "Aplicativo mobile para compartilhamento de caronas com algoritmo de matching em tempo real e sistema de pagamento.",
    category: "Cases",
    subcategory: "Transportation",
  },
  {
    title: "Sistema de Gestão Hoteleira (PMS)",
    description: "Plataforma completa de gestão hoteleira com reservas, check-in digital, housekeeping e integração com OTAs.",
    category: "Cases",
    subcategory: "Hospitality",
  },
  {
    title: "Plataforma de Streaming de Vídeo (OTT)",
    description: "Serviço de vídeo sob demanda com CDN, sistema de recomendação e múltiplas formas de monetização.",
    category: "Cases",
    subcategory: "Media",
  },
  {
    title: "Sistema de ERP para Pequenas Empresas",
    description: "ERP modular e acessível com módulos de vendas, financeiro, estoque e fiscal integrados.",
    category: "Cases",
    subcategory: "SMB",
  },
  {
    title: "App de Delivery de Alimentos",
    description: "Marketplace de restaurantes com sistema de pedidos, logística de entrega e programa de fidelidade.",
    category: "Cases",
    subcategory: "Food Tech",
  },
  {
    title: "Plataforma de Investimentos (Fintech)",
    description: "Sistema de corretora digital com renda fixa, variável, fundos e robo-advisor para investimentos automatizados.",
    category: "Cases",
    subcategory: "Investment",
  },
  {
    title: "Sistema de CRM para Imobiliárias",
    description: "Plataforma de gestão de leads, propriedades, visitas e pipeline de vendas específica para mercado imobiliário.",
    category: "Cases",
    subcategory: "Real Estate",
  },
  {
    title: "Plataforma de E-learning Corporativo",
    description: "LMS com gamificação, trilhas de aprendizado adaptativas e analytics de engajamento para treinamentos internos.",
    category: "Cases",
    subcategory: "Corporate Training",
  },
  {
    title: "Sistema de Gestão de Clínicas (HIS)",
    description: "Plataforma completa para clínicas médicas com agendamento, prontuário, faturamento e integração com convênios.",
    category: "Cases",
    subcategory: "Medical",
  },
  {
    title: "App de Fitness e Nutrição",
    description: "Aplicativo de acompanhamento de exercícios e dieta com planos personalizados e integração com wearables.",
    category: "Cases",
    subcategory: "Health & Wellness",
  },
  {
    title: "Plataforma de Crowdfunding",
    description: "Sistema de financiamento coletivo com campanhas, pagamentos recorrentes e compliance com regulação financeira.",
    category: "Cases",
    subcategory: "Fundraising",
  },
  {
    title: "Sistema de Gestão de Eventos",
    description: "Plataforma end-to-end para eventos: inscrições, pagamento, credenciamento, app do evento e networking.",
    category: "Cases",
    subcategory: "Events",
  },
  {
    title: "Marketplace de Produtos Usados (C2C)",
    description: "Plataforma de compra e venda entre pessoas com sistema de pagamento seguro, frete e reputação.",
    category: "Cases",
    subcategory: "Secondhand",
  },
  {
    title: "Sistema de Gestão de Franquias",
    description: "Plataforma para franqueadores gerenciarem rede de franquias: royalties, compliance, supply chain e treinamento.",
    category: "Cases",
    subcategory: "Franchise",
  },
  {
    title: "App de Agendamento de Serviços de Beleza",
    description: "Marketplace conectando clientes e profissionais de beleza com agenda online, pagamento e programa de fidelidade.",
    category: "Cases",
    subcategory: "Beauty",
  },
];

async function seedFirestore() {
  console.log('🌱 Iniciando seed do Firestore...');
  console.log(`📦 Total de casos a serem criados: ${useCases.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < useCases.length; i++) {
    const useCase = useCases[i];
    
    try {
      await addDoc(collection(db, 'useCases'), {
        ...useCase,
        isAvailable: true,
        selectedByTeamId: null,
        selectedByTeamName: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      successCount++;
      console.log(`✅ [${i + 1}/${useCases.length}] ${useCase.title}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ [${i + 1}/${useCases.length}] Erro ao criar "${useCase.title}":`, error.message);
    }
  }
  
  console.log('\n🎉 Seed finalizado!');
  console.log(`✅ Sucessos: ${successCount}`);
  console.log(`❌ Erros: ${errorCount}`);
  console.log(`📊 Total: ${useCases.length}`);
}

// Execute seed
seedFirestore()
  .then(() => {
    console.log('\n✨ Processo concluído com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Erro fatal durante seed:', error);
    process.exit(1);
  });
