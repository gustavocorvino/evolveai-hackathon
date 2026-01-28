# Analyze Tech Stack Task

## Purpose

Evaluate and recommend optimal technology stacks that align with project requirements, organizational capabilities, and strategic technology directions.

## Process

### Step 1: Requirements Analysis

Gather comprehensive requirements across multiple dimensions:

**Functional Requirements:**
1. What are the core features and capabilities needed?
2. What performance requirements must be met?
3. What integration requirements exist?
4. What user experience standards are expected?
5. What data processing and storage needs exist?

**Non-Functional Requirements:**
1. What scalability requirements are anticipated?
2. What security and compliance standards apply?
3. What availability and reliability requirements exist?
4. What maintainability and supportability needs exist?
5. What deployment and operational requirements apply?

**Organizational Context:**
1. What is the current technology landscape?
2. What are the team's existing skills and capabilities?
3. What are the preferred vendor relationships?
4. What budget constraints exist for technology investments?
5. What strategic technology directions guide decisions?

### Step 2: Technology Landscape Mapping

Document current and target state:

```yaml
technology_analysis:
  project_info:
    name: "[Project Name]"
    type: "[Web App/Mobile App/API/Enterprise System]"
    complexity: "[Low/Medium/High]"
    timeline: "[Development Timeline]"
    team_size: "[Number of Developers]"

  current_landscape:
    existing_systems:
      - system: "[System Name]"
        technology: "[Tech Stack]"
        version: "[Version Info]"
        integration_required: "[Yes/No]"
        migration_needed: "[Yes/No]"
    
    infrastructure:
      hosting: "[On-premise/Cloud/Hybrid]"
      cloud_provider: "[AWS/Azure/GCP/Multi]"
      deployment_model: "[IaaS/PaaS/SaaS/Containerized]"
    
    team_capabilities:
      - skill: "[Technology/Framework]"
        level: "[Beginner/Intermediate/Advanced/Expert]"
        team_coverage: "[X out of Y team members]"

  requirements_matrix:
    functional:
      - requirement: "[Feature/Capability]"
        priority: "[High/Medium/Low]"
        complexity: "[Low/Medium/High]"
        tech_impact: "[Which tech components affected]"
    
    non_functional:
      performance:
        response_time: "[< X seconds]"
        throughput: "[Y requests/second]"
        concurrent_users: "[Z active users]"
      
      scalability:
        growth_expectation: "[X% user growth per year]"
        peak_load: "[Y times normal load]"
        geographic_distribution: "[Single region/Multi-region/Global]"
      
      security:
        data_sensitivity: "[Public/Internal/Confidential/Restricted]"
        compliance_requirements: "[LGPD/SOX/HIPAA/PCI-DSS]"
        authentication_needs: "[Basic/SSO/MFA/Zero-Trust]"
      
      availability:
        uptime_requirement: "[X% availability]"
        recovery_time: "[RTO: X hours]"
        data_loss_tolerance: "[RPO: Y hours]"
```

### Step 3: Technology Evaluation

Assess technology options using structured criteria:

**Frontend Technology Analysis:**
```yaml
frontend_options:
  - technology: "React"
    pros:
      - "Large ecosystem and community support"
      - "Excellent developer experience"
      - "Strong TypeScript integration"
      - "Rich component library ecosystem"
    cons:
      - "Steeper learning curve for new developers"
      - "Frequent ecosystem changes"
    fit_score: "[1-10]"
    team_readiness: "[1-10]"
    
  - technology: "Angular"
    pros:
      - "Full framework with opinionated structure"
      - "Excellent TypeScript support"
      - "Strong enterprise features"
      - "Comprehensive testing tools"
    cons:
      - "Complex for simple applications"
      - "Steeper learning curve"
    fit_score: "[1-10]"
    team_readiness: "[1-10]"
```

**Backend Technology Analysis:**
```yaml
backend_options:
  - technology: ".NET Core"
    pros:
      - "Strong Microsoft ecosystem integration"
      - "Excellent performance characteristics"
      - "Rich cloud services integration"
      - "Strong enterprise support"
    cons:
      - "Microsoft-centric approach"
      - "Less flexibility in some scenarios"
    fit_score: "[1-10]"
    team_readiness: "[1-10]"
    
  - technology: "Node.js"
    pros:
      - "JavaScript everywhere"
      - "Large npm ecosystem"
      - "Good for real-time applications"
      - "Fast development cycles"
    cons:
      - "Single-threaded limitations"
      - "Callback complexity for CPU-intensive tasks"
    fit_score: "[1-10]"
    team_readiness: "[1-10]"
```

### Step 4: Architecture Pattern Analysis

Evaluate architectural approaches:

**Monolithic vs Microservices:**
```yaml
architecture_patterns:
  monolithic:
    benefits:
      - "Simpler development and deployment initially"
      - "Easier debugging and testing"
      - "Better performance for simple scenarios"
    drawbacks:
      - "Scaling limitations"
      - "Technology lock-in"
      - "Complex deployments as system grows"
    recommended_for: "[Small to medium applications, MVP development]"
  
  microservices:
    benefits:
      - "Independent scaling and deployment"
      - "Technology diversity"
      - "Team autonomy"
    drawbacks:
      - "Operational complexity"
      - "Network latency and failure modes"
      - "Distributed system challenges"
    recommended_for: "[Large applications, multiple teams, high scalability needs]"
  
  modular_monolith:
    benefits:
      - "Clear module boundaries"
      - "Simpler operations than microservices"
      - "Evolution path to microservices"
    drawbacks:
      - "Still single deployment unit"
      - "Technology constraints"
    recommended_for: "[Medium applications, clear domain boundaries]"
```

### Step 5: Technology Stack Recommendation

Generate comprehensive recommendation:

```yaml
recommended_stack:
  architecture_approach: "[Monolithic/Microservices/Modular Monolith]"
  deployment_strategy: "[Cloud-native/Containerized/Traditional]"
  
  frontend:
    primary: "[Selected Technology]"
    reasoning: "[Why this choice]"
    alternatives_considered: "[Other options evaluated]"
    
  backend:
    primary: "[Selected Technology]"
    framework: "[Specific Framework]"
    reasoning: "[Why this choice]"
    
  database:
    primary: "[Database Technology]"
    type: "[Relational/NoSQL/Multi-model]"
    reasoning: "[Why this choice]"
    
  infrastructure:
    cloud_provider: "[Azure/AWS/GCP]"
    hosting_model: "[App Service/Container Apps/AKS/VMs]"
    reasoning: "[Why this approach]"
    
  DevOps:
    ci_cd: "[Azure DevOps/GitHub Actions]"
    monitoring: "[Application Insights/Other]"
    security: "[Azure Security Center/Tools]"

  risk_assessment:
    - risk: "[Technology Risk]"
      mitigation: "[How to address]"
      impact: "[High/Medium/Low]"
    
    - risk: "[Skill Gap Risk]"
      mitigation: "[Training/hiring plan]"
      impact: "[High/Medium/Low]"

  implementation_roadmap:
    phase_1:
      duration: "[Timeline]"
      focus: "[What to build]"
      technologies: "[Which tech to use]"
      
    phase_2:
      duration: "[Timeline]"
      focus: "[What to add]"
      technologies: "[Additional tech]"

  success_metrics:
    - metric: "Development Velocity"
      target: "[Features per sprint]"
      
    - metric: "System Performance"
      target: "[Response time/throughput]"
      
    - metric: "Operational Efficiency"
      target: "[Deployment frequency/MTTR]"
```

### Step 6: Decision Documentation

Create Architecture Decision Records (ADRs):

```yaml
adr_template:
  title: "[Decision Title]"
  status: "[Proposed/Accepted/Superseded]"
  context: "[What forces are at play]"
  decision: "[What we decided]"
  consequences: "[What becomes easier/harder]"
  alternatives_considered: "[Other options]"
  decision_date: "[YYYY-MM-DD]"
  participants: "[Who was involved]"
```

## Technology Selection Criteria

### Evaluation Framework

**Technical Criteria (40%):**
- Performance and scalability capabilities
- Security features and track record
- Integration capabilities
- Maintainability and code quality
- Testing and debugging support

**Organizational Criteria (30%):**
- Team skills and learning curve
- Support and community ecosystem
- Vendor relationship and roadmap
- License costs and constraints
- Strategic technology alignment

**Project Criteria (30%):**
- Time to market requirements
- Budget constraints
- Risk tolerance
- Complexity requirements
- Future evolution needs

### Scoring System

Rate each criterion from 1-10:
- 1-3: Poor fit or significant concerns
- 4-6: Adequate but with limitations
- 7-8: Good fit with minor concerns
- 9-10: Excellent fit with strong advantages

## Integration Points

This task connects to:
- **Architecture Design**: Inform detailed technical design
- **Effort Estimation**: Consider technology complexity in estimates
- **Team Planning**: Identify skill development needs
- **Risk Assessment**: Understand technology-related risks
- **Vendor Management**: Guide technology vendor relationships

## Quality Assurance

**Validation Checklist:**
- [ ] All requirements mapped to technology capabilities
- [ ] Team skill gaps identified and addressed
- [ ] Integration requirements validated
- [ ] Performance requirements verified
- [ ] Security and compliance needs met
- [ ] Scalability requirements addressed
- [ ] Cost implications understood
- [ ] Risk mitigation plans documented

## Success Indicators

- Clear rationale for technology choices
- Stakeholder alignment on technology direction
- Identified skill development plans
- Risk-aware technology decisions
- Sustainable technology architecture
- Strong foundation for implementation