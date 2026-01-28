# Estimate Development Effort Task

## Purpose

Provide accurate, well-reasoned development effort estimates that support project planning, budgeting, and resource allocation decisions.

## Process

### Step 1: Scope Analysis

Break down the project into estimatable components:

**Functional Decomposition:**
1. What are the major feature sets or modules?
2. What are the core user journeys and workflows?
3. What integration points and external dependencies exist?
4. What data models and business logic are required?
5. What user interfaces and experiences need development?

**Technical Decomposition:**
1. What architectural components are needed?
2. What infrastructure and DevOps setup is required?
3. What security and compliance implementation is needed?
4. What testing and quality assurance work is involved?
5. What documentation and training materials are required?

### Step 2: Work Breakdown Structure

Create detailed work breakdown structure:

```yaml
effort_estimation:
  project_info:
    name: "[Project Name]"
    estimation_date: "[YYYY-MM-DD]"
    estimator: "[Name and Role]"
    estimation_method: "[Method Used]"
    confidence_level: "[High/Medium/Low]"

  assumptions:
    team_assumptions:
      - "Team of [X] developers with [skill level]"
      - "Standard 8-hour working days"
      - "[Technology] experience level: [Beginner/Intermediate/Advanced]"
      - "Requirements stability: [Stable/Some changes/Frequent changes]"
    
    project_assumptions:
      - "Clear requirements and acceptance criteria"
      - "Regular stakeholder availability"
      - "Infrastructure provisioning included/excluded"
      - "Third-party integrations: [Number and complexity]"

  work_breakdown:
    discovery_and_planning:
      requirements_analysis:
        effort_hours: "[Hours]"
        description: "Detailed requirements gathering and analysis"
        complexity: "[Low/Medium/High]"
        risk_factor: "[1.0-2.0]"
      
      technical_design:
        effort_hours: "[Hours]"
        description: "Architecture and technical design"
        complexity: "[Low/Medium/High]"
        risk_factor: "[1.0-2.0]"
      
      project_setup:
        effort_hours: "[Hours]"
        description: "Development environment and project scaffolding"
        complexity: "[Low/Medium/High]"

    frontend_development:
      ui_components:
        effort_hours: "[Hours]"
        description: "Reusable UI components and design system"
        complexity: "[Low/Medium/High]"
        risk_factor: "[1.0-2.0]"
      
      user_interfaces:
        - feature: "[Feature Name]"
          screens_count: "[Number]"
          complexity: "[Simple/Medium/Complex]"
          effort_hours: "[Hours per screen * count]"
          notes: "[Special considerations]"
      
      state_management:
        effort_hours: "[Hours]"
        description: "Application state management implementation"
        complexity: "[Low/Medium/High]"

    backend_development:
      api_development:
        - endpoint_group: "[API Group Name]"
          endpoints_count: "[Number]"
          complexity: "[Simple/Medium/Complex]"
          effort_hours: "[Hours]"
          authentication: "[Required/Not Required]"
      
      business_logic:
        - module: "[Business Module]"
          complexity: "[Simple/Medium/Complex]"
          effort_hours: "[Hours]"
          dependencies: "[External systems/services]"
      
      data_layer:
        database_design:
          effort_hours: "[Hours]"
          description: "Database schema and optimization"
        data_access:
          effort_hours: "[Hours]"
          description: "ORM setup and data access patterns"
        migrations:
          effort_hours: "[Hours]"
          description: "Database migration scripts"

    integration_development:
      - integration: "[Third-party Service/System]"
        type: "[REST API/SOAP/File Transfer/Database]"
        complexity: "[Simple/Medium/Complex]"
        effort_hours: "[Hours]"
        authentication_type: "[OAuth/API Key/Certificate]"
        data_transformation: "[Yes/No]"

    testing_and_quality:
      unit_testing:
        coverage_target: "[X%]"
        effort_hours: "[Hours]"
        description: "Unit test development and maintenance"
      
      integration_testing:
        effort_hours: "[Hours]"
        description: "API and service integration testing"
      
      e2e_testing:
        critical_paths: "[Number of user journeys]"
        effort_hours: "[Hours]"
        description: "End-to-end automated testing"
      
      performance_testing:
        effort_hours: "[Hours]"
        description: "Load and performance testing setup"
      
      security_testing:
        effort_hours: "[Hours]"
        description: "Security vulnerability testing"

    infrastructure_and_devops:
      ci_cd_setup:
        effort_hours: "[Hours]"
        description: "Build, test, and deployment pipeline"
      
      infrastructure_as_code:
        effort_hours: "[Hours]"
        description: "Infrastructure provisioning automation"
      
      monitoring_setup:
        effort_hours: "[Hours]"
        description: "Application and infrastructure monitoring"
      
      security_hardening:
        effort_hours: "[Hours]"
        description: "Security configuration and hardening"

    documentation_and_training:
      technical_documentation:
        effort_hours: "[Hours]"
        description: "Architecture, API, and developer documentation"
      
      user_documentation:
        effort_hours: "[Hours]"
        description: "User guides and training materials"
      
      operational_documentation:
        effort_hours: "[Hours]"
        description: "Deployment and operational procedures"

  estimation_summary:
    development_phases:
      discovery_and_planning:
        total_hours: "[Hours]"
        percentage: "[% of total]"
        
      implementation:
        frontend_hours: "[Hours]"
        backend_hours: "[Hours]"
        integration_hours: "[Hours]"
        total_hours: "[Hours]"
        percentage: "[% of total]"
        
      testing_and_quality:
        total_hours: "[Hours]"
        percentage: "[% of total]"
        
      infrastructure_and_devops:
        total_hours: "[Hours]"
        percentage: "[% of total]"
        
      documentation:
        total_hours: "[Hours]"
        percentage: "[% of total]"

    total_effort:
      base_estimate_hours: "[Total hours]"
      contingency_percentage: "[15-25%]"
      contingency_hours: "[Contingency hours]"
      final_estimate_hours: "[Total + contingency]"
      
    resource_allocation:
      - role: "Senior Developer"
        percentage: "[% of effort]"
        hours: "[Hours]"
        
      - role: "Mid-level Developer"
        percentage: "[% of effort]"
        hours: "[Hours]"
        
      - role: "QA Engineer"
        percentage: "[% of effort]"
        hours: "[Hours]"

    timeline_estimate:
      team_size: "[Number of people]"
      velocity_factor: "[0.6-0.8 for productive hours]"
      calendar_months: "[Estimated duration]"
      sprints: "[Number of 2-week sprints]"
```

### Step 3: Estimation Techniques

Apply appropriate estimation methods:

**Story Point Estimation:**
- Break features into user stories
- Assign story points using Fibonacci sequence
- Apply team velocity to convert to time
- Use historical data for calibration

**Function Point Analysis:**
- Count inputs, outputs, files, interfaces, inquiries
- Apply complexity weights
- Calculate unadjusted function points
- Apply technical complexity factor

**Analogous Estimation:**
- Identify similar past projects
- Adjust for size, complexity, and technology differences
- Apply lessons learned from previous projects
- Validate assumptions and differences

**Three-Point Estimation:**
- Optimistic estimate (best case)
- Most likely estimate (normal case)
- Pessimistic estimate (worst case)
- Calculate weighted average: (O + 4M + P) / 6

### Step 4: Risk and Contingency Analysis

Account for uncertainty and risks:

```yaml
risk_analysis:
  technical_risks:
    - risk: "New technology learning curve"
      probability: "[High/Medium/Low]"
      impact: "[High/Medium/Low]"
      mitigation: "[Risk response plan]"
      effort_buffer: "[Additional hours/percentage]"
  
  project_risks:
    - risk: "Requirements volatility"
      probability: "[High/Medium/Low]"
      impact: "[High/Medium/Low]"
      mitigation: "[Agile approach, frequent feedback]"
      effort_buffer: "[Additional hours/percentage]"
  
  external_risks:
    - risk: "Third-party service dependencies"
      probability: "[High/Medium/Low]"
      impact: "[High/Medium/Low]"
      mitigation: "[Service alternatives, mocking]"
      effort_buffer: "[Additional hours/percentage]"

contingency_planning:
  base_contingency: "15% (typical project uncertainty)"
  additional_contingencies:
    - factor: "Technology newness"
      percentage: "[5-15%]"
      reasoning: "[Why this factor applies]"
    
    - factor: "Team experience"
      percentage: "[5-15%]"
      reasoning: "[Impact of team skill level]"
  
  total_contingency: "[Total percentage]"
  reasoning: "[Overall contingency justification]"
```

### Step 5: Validation and Review

Validate estimates through multiple approaches:

**Sanity Checks:**
- Compare with industry benchmarks
- Validate against similar project experience
- Review effort distribution across categories
- Check resource allocation reasonableness

**Stakeholder Review:**
- Present estimates to technical team
- Review with project stakeholders
- Validate assumptions and constraints
- Document feedback and adjustments

**Estimation Confidence:**
- High: ±10-15% (well-understood requirements, experienced team)
- Medium: ±20-30% (some unknowns, mixed team experience)
- Low: ±40-50% (many unknowns, new technology/team)

## Estimation Templates

### Web Application Project
```yaml
typical_breakdown:
  frontend: "35-40% of development effort"
  backend: "40-45% of development effort"
  integration: "10-15% of development effort"
  testing: "20-25% of total effort"
  devops: "10-15% of total effort"
  documentation: "5-10% of total effort"
```

### API-First Project
```yaml
typical_breakdown:
  api_development: "50-55% of development effort"
  business_logic: "30-35% of development effort"
  integration: "15-20% of development effort"
  testing: "25-30% of total effort"
  devops: "15-20% of total effort"
  documentation: "10-15% of total effort"
```

### Data Migration Project
```yaml
typical_breakdown:
  data_analysis: "20-25% of total effort"
  extraction_tools: "25-30% of development effort"
  transformation_logic: "30-35% of development effort"
  validation_testing: "30-35% of total effort"
  performance_optimization: "15-20% of total effort"
  rollback_procedures: "10-15% of total effort"
```

## Quality Assurance

**Estimation Review Checklist:**
- [ ] All major features and components identified
- [ ] Technical complexity appropriately assessed
- [ ] Integration efforts properly estimated
- [ ] Testing and quality work included
- [ ] Infrastructure and DevOps work accounted for
- [ ] Documentation and training effort included
- [ ] Risk factors identified and addressed
- [ ] Contingency appropriately applied
- [ ] Resource allocation realistic
- [ ] Timeline expectations reasonable

## Integration Points

This task connects to:
- **Project Planning**: Support sprint and release planning
- **Resource Management**: Guide team sizing and skill requirements
- **Budget Planning**: Inform financial planning and approval
- **Risk Management**: Identify effort-related risks
- **Scope Management**: Support scope change impact analysis

## Success Indicators

- Estimates used successfully for project planning
- Actual effort within acceptable variance of estimates
- Stakeholder confidence in estimate accuracy
- Clear understanding of estimate assumptions
- Regular estimate updates as project progresses
- Lessons learned captured for future estimation improvement