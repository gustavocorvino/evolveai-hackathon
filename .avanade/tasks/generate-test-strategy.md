# Generate Test Strategy Task

## Purpose

Develop comprehensive testing strategies that ensure software quality, minimize risks, and support continuous delivery objectives.

## Process

### Step 1: Context Analysis

Understand the testing context and requirements:

**Application Context:**
1. What type of application is being tested (web, mobile, API, desktop)?
2. What are the critical business functions and user workflows?
3. What is the expected user base and usage patterns?
4. What are the performance and reliability requirements?
5. What are the security and compliance requirements?

**Technical Context:**
1. What is the application architecture and technology stack?
2. What are the integration points and external dependencies?
3. What environments are available for testing?
4. What testing tools and frameworks are available?
5. What automation capabilities exist or need development?

**Project Context:**
1. What is the development methodology (Agile, Waterfall, DevOps)?
2. What are the timeline and release schedule constraints?
3. What testing resources and skills are available?
4. What is the risk tolerance and quality requirements?
5. What regulatory or compliance testing is required?

### Step 2: Risk Assessment

Identify and prioritize testing risks:

```yaml
test_strategy:
  project_info:
    name: "[Project Name]"
    application_type: "[Web App/Mobile App/API/Enterprise System]"
    development_methodology: "[Agile/Waterfall/DevOps]"
    release_timeline: "[Timeline]"
    quality_requirements: "[High/Medium/Standard]"

  risk_assessment:
    business_risks:
      - risk: "Revenue loss from system downtime"
        impact: "[High/Medium/Low]"
        probability: "[High/Medium/Low]"
        testing_focus: "[Availability, Performance, Recovery]"
      
      - risk: "Data loss or corruption"
        impact: "[High/Medium/Low]"
        probability: "[High/Medium/Low]"
        testing_focus: "[Data integrity, Backup/restore]"

    technical_risks:
      - risk: "Integration failures with external systems"
        impact: "[High/Medium/Low]"
        probability: "[High/Medium/Low]"
        testing_focus: "[Integration testing, Service virtualization]"
      
      - risk: "Performance degradation under load"
        impact: "[High/Medium/Low]"
        probability: "[High/Medium/Low]"
        testing_focus: "[Load testing, Performance monitoring]"

    security_risks:
      - risk: "Unauthorized access to sensitive data"
        impact: "[High/Medium/Low]"
        probability: "[High/Medium/Low]"
        testing_focus: "[Security testing, Penetration testing]"
      
      - risk: "SQL injection or XSS vulnerabilities"
        impact: "[High/Medium/Low]"
        probability: "[High/Medium/Low]"
        testing_focus: "[Security scanning, Code review]"

  quality_objectives:
    functional_quality:
      - objective: "Feature functionality works as specified"
        target: "[99% of acceptance criteria met]"
        measurement: "[Automated test pass rate]"
      
      - objective: "User workflows complete successfully"
        target: "[100% of critical paths working]"
        measurement: "[End-to-end test results]"

    non_functional_quality:
      performance:
        response_time: "[< X seconds for Y% of requests]"
        throughput: "[Z transactions per second]"
        concurrent_users: "[A users without degradation]"
      
      reliability:
        availability: "[99.X% uptime]"
        error_rate: "[< Y% failed requests]"
        recovery_time: "[< Z minutes for system recovery]"
      
      security:
        vulnerability_tolerance: "[Zero critical, < X high severity]"
        data_protection: "[100% LGPD/GDPR compliance]"
        access_control: "[100% unauthorized access prevention]"
```

### Step 3: Test Level Strategy

Define testing approach across different levels:

```yaml
test_levels:
  unit_testing:
    scope: "Individual components, functions, and methods"
    coverage_target: "[80-90% code coverage]"
    automation_level: "[100% automated]"
    tools: "[Jest/JUnit/MSTest/pytest]"
    responsibility: "[Development team]"
    frequency: "[Every commit/build]"
    
    focus_areas:
      - "Business logic validation"
      - "Error handling scenarios"
      - "Edge cases and boundary conditions"
      - "Data validation and transformation"
    
    entry_criteria:
      - "Code complete and reviewed"
      - "Unit test cases designed"
      - "Test environment setup"
    
    exit_criteria:
      - "All unit tests passing"
      - "Coverage target achieved"
      - "No critical defects"

  integration_testing:
    scope: "Component interactions and data flow"
    automation_level: "[80-90% automated]"
    tools: "[Postman/RestAssured/Cypress/Playwright]"
    responsibility: "[Development and QA teams]"
    frequency: "[Daily builds and feature completion]"
    
    focus_areas:
      - "API contract validation"
      - "Database integration"
      - "Third-party service integration"
      - "Message queue processing"
      - "Authentication and authorization flows"
    
    test_types:
      api_testing:
        approach: "[Contract-first testing]"
        validation: "[Request/response format, error codes, data integrity]"
        tools: "[OpenAPI/Swagger validation]"
      
      database_testing:
        approach: "[Data-driven testing]"
        validation: "[CRUD operations, constraints, triggers]"
        tools: "[Database testing frameworks]"

  system_testing:
    scope: "Complete integrated system functionality"
    automation_level: "[60-70% automated]"
    tools: "[Selenium/Cypress/Playwright/Mobile testing tools]"
    responsibility: "[QA team]"
    frequency: "[Sprint completion and release candidates]"
    
    focus_areas:
      - "End-to-end user workflows"
      - "Cross-browser compatibility"
      - "Mobile responsiveness"
      - "Business rule validation"
      - "User interface functionality"

  acceptance_testing:
    scope: "Business requirements and user acceptance"
    automation_level: "[40-50% automated for regression]"
    tools: "[BDD frameworks, manual testing]"
    responsibility: "[Business analysts and end users]"
    frequency: "[Feature completion and release preparation]"
    
    approach:
      - "User story acceptance criteria validation"
      - "Business scenario testing"
      - "Usability and user experience testing"
      - "Accessibility compliance testing"
```

### Step 4: Specialized Testing Strategies

Define approaches for non-functional and specialized testing:

```yaml
specialized_testing:
  performance_testing:
    strategy: "[Shift-left performance testing]"
    tools: "[JMeter/LoadRunner/Gatling/K6]"
    environments: "[Performance test environment]"
    
    test_types:
      load_testing:
        objective: "Validate normal expected load"
        approach: "[Simulate typical user load]"
        success_criteria: "[Response time < X, throughput > Y]"
      
      stress_testing:
        objective: "Identify system breaking point"
        approach: "[Gradually increase load beyond normal]"
        success_criteria: "[Graceful degradation, recovery]"
      
      spike_testing:
        objective: "Validate sudden load increases"
        approach: "[Sudden traffic spikes simulation]"
        success_criteria: "[System stability during spikes]"
      
      endurance_testing:
        objective: "Long-term stability validation"
        approach: "[Extended load over time]"
        success_criteria: "[No memory leaks, stable performance]"

  security_testing:
    strategy: "[Security by design and continuous testing]"
    tools: "[OWASP ZAP/Burp Suite/SonarQube/Veracode]"
    frequency: "[Every release and on schedule]"
    
    test_types:
      vulnerability_scanning:
        approach: "[Automated scanning in CI/CD]"
        tools: "[SAST/DAST tools]"
        frequency: "[Every build]"
      
      penetration_testing:
        approach: "[Professional security assessment]"
        frequency: "[Quarterly or before major releases]"
        scope: "[Application and infrastructure]"
      
      authentication_testing:
        approach: "[Identity and access management validation]"
        focus: "[SSO, MFA, role-based access]"
      
      data_protection_testing:
        approach: "[LGPD/GDPR compliance validation]"
        focus: "[Data encryption, privacy controls]"

  usability_testing:
    strategy: "[User-centered design validation]"
    methods: "[User interviews, usability testing, A/B testing]"
    tools: "[Hotjar/UserTesting/Maze]"
    
    focus_areas:
      - "User interface intuitive design"
      - "Accessibility compliance (WCAG 2.1)"
      - "Mobile user experience"
      - "User journey optimization"

  compatibility_testing:
    browser_compatibility:
      scope: "[Chrome, Firefox, Safari, Edge]"
      versions: "[Current and N-1 versions]"
      automation: "[Cross-browser automation]"
    
    mobile_compatibility:
      scope: "[iOS and Android devices]"
      approach: "[Responsive design validation]"
      tools: "[Device farms, emulators]"

  disaster_recovery_testing:
    approach: "[Planned outage simulation]"
    frequency: "[Quarterly]"
    validation:
      - "Backup and restore procedures"
      - "Failover mechanisms"
      - "Data recovery integrity"
      - "Recovery time objectives (RTO)"
```

### Step 5: Test Automation Strategy

Define automation approach and implementation:

```yaml
automation_strategy:
  automation_pyramid:
    unit_tests:
      percentage: "[70-80% of total tests]"
      characteristics: "Fast, isolated, focused"
      maintenance: "Low maintenance, high value"
    
    integration_tests:
      percentage: "[15-20% of total tests]"
      characteristics: "Medium speed, component interactions"
      maintenance: "Medium maintenance, high value"
    
    ui_tests:
      percentage: "[5-10% of total tests]"
      characteristics: "Slower, end-to-end scenarios"
      maintenance: "High maintenance, critical paths only"

  automation_tools_and_frameworks:
    frontend_automation:
      tool: "[Cypress/Playwright/Selenium]"
      framework: "[Page Object Model/Component Testing]"
      language: "[JavaScript/TypeScript/C#/Java]"
    
    api_automation:
      tool: "[RestAssured/Postman/Insomnia]"
      framework: "[Contract-first testing]"
      language: "[Java/JavaScript/Python]"
    
    mobile_automation:
      tool: "[Appium/Detox/Maestro]"
      framework: "[Screen Object Model]"
      platforms: "[iOS/Android]"

  ci_cd_integration:
    trigger_points:
      - "Pull request validation"
      - "Daily regression testing"
      - "Release candidate validation"
      - "Production deployment verification"
    
    test_execution_stages:
      - stage: "Unit and Integration Tests"
        duration: "[< 10 minutes]"
        failure_action: "Block merge/deployment"
      
      - stage: "System and E2E Tests"
        duration: "[< 30 minutes]"
        failure_action: "Block deployment, notify team"
      
      - stage: "Performance and Security Tests"
        duration: "[< 60 minutes]"
        failure_action: "Quality gate evaluation"

  maintenance_strategy:
    test_data_management:
      approach: "[Test data creation and cleanup automation]"
      tools: "[Data factories, synthetic data generation]"
    
    environment_management:
      approach: "[Infrastructure as code, containerization]"
      tools: "[Docker, Kubernetes, Terraform]"
    
    test_reporting:
      dashboards: "[Real-time test results and trends]"
      notifications: "[Slack/Teams integration for failures]"
      metrics: "[Test coverage, execution time, flakiness]"
```

### Step 6: Test Management and Governance

Establish testing processes and governance:

```yaml
test_management:
  test_planning:
    test_cases_design:
      approach: "[Behavior-driven development (BDD)]"
      format: "[Given-When-Then scenarios]"
      review_process: "[Peer review and stakeholder approval]"
    
    test_data_strategy:
      production_data: "[Anonymized/synthetic data use]"
      data_refresh: "[Regular test data refresh cycles]"
      data_privacy: "[LGPD/GDPR compliance in test data]"

  defect_management:
    severity_classification:
      critical: "[System unavailable, data loss]"
      high: "[Major functionality broken]"
      medium: "[Minor functionality issues]"
      low: "[Cosmetic or enhancement requests]"
    
    resolution_targets:
      critical: "[4 hours]"
      high: "[1 business day]"
      medium: "[3 business days]"
      low: "[Next release cycle]"

  quality_gates:
    - gate: "Feature Development Complete"
      criteria: 
        - "All unit tests passing"
        - "Integration tests passing"
        - "Code coverage > 80%"
    
    - gate: "Sprint/Iteration Complete"
      criteria:
        - "All acceptance criteria met"
        - "System tests passing"
        - "No critical defects"
    
    - gate: "Release Ready"
      criteria:
        - "All planned tests executed"
        - "Performance benchmarks met"
        - "Security scan passed"
        - "User acceptance completed"

  metrics_and_reporting:
    quality_metrics:
      - metric: "Defect Density"
        calculation: "[Defects per function point]"
        target: "[< X defects per function point]"
      
      - metric: "Test Coverage"
        calculation: "[Lines/branches covered by tests]"
        target: "[> 80% code coverage]"
      
      - metric: "Test Execution Efficiency"
        calculation: "[Automated vs manual test ratio]"
        target: "[> 70% automation]"
    
    process_metrics:
      - metric: "Defect Detection Rate"
        calculation: "[Defects found in testing vs production]"
        target: "[> 90% defects found before production]"
      
      - metric: "Test Case Effectiveness"
        calculation: "[Test cases finding defects vs total]"
        target: "[Continuous improvement tracking]"
```

## Test Strategy Templates

### Agile/DevOps Project
```yaml
agile_strategy:
  approach: "Continuous testing integrated with development"
  automation_focus: "High automation for fast feedback"
  test_types: "Unit → Integration → System → Acceptance"
  frequency: "Every sprint/iteration"
  quality_gates: "Definition of Done includes testing"
```

### Enterprise Application
```yaml
enterprise_strategy:
  approach: "Risk-based testing with formal processes"
  compliance_focus: "Regulatory and security requirements"
  test_types: "Full test pyramid with specialized testing"
  documentation: "Comprehensive test documentation"
  governance: "Formal review and approval processes"
```

### API-First Project
```yaml
api_strategy:
  approach: "Contract-first testing and service virtualization"
  automation_focus: "API testing automation priority"
  test_types: "Contract → Integration → Consumer → Performance"
  tools: "API testing specialized tools"
  monitoring: "Production API monitoring integration"
```

## Success Indicators

- Clear testing approach aligned with project goals
- Appropriate automation strategy for project context
- Risk-based test prioritization implemented
- Quality gates supporting continuous delivery
- Metrics-driven testing improvement process
- Team alignment on quality standards and processes