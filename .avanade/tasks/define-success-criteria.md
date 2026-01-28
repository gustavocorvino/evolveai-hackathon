# Define Success Criteria Task

## Purpose

Establish clear, measurable success criteria that align stakeholders and guide project delivery toward achievable business outcomes.

## Process

### Step 1: Success Dimensions Discovery

Identify key dimensions of success through stakeholder engagement:

**Business Value Dimensions:**
1. What specific business outcomes are expected?
2. How will success be measured quantitatively?
3. What qualitative improvements are desired?
4. What is the target timeline for achieving these outcomes?
5. How does this project support broader business strategy?

**User Experience Dimensions:**
1. Who are the primary users and what are their success criteria?
2. What user experience improvements are expected?
3. How will user satisfaction be measured?
4. What adoption rates are considered successful?
5. What accessibility and usability standards must be met?

**Technical Dimensions:**
1. What performance standards must be achieved?
2. What availability and reliability requirements exist?
3. What security and compliance standards apply?
4. What scalability requirements are anticipated?
5. What integration success criteria are needed?

### Step 2: SMART Criteria Framework

Transform outcomes into SMART criteria:

**Specific**: Clearly defined and unambiguous
**Measurable**: Quantifiable with defined metrics
**Achievable**: Realistic given resources and constraints
**Relevant**: Aligned with business objectives
**Time-bound**: Clear deadlines and milestones

### Step 3: Success Criteria Definition

Create comprehensive success criteria framework:

```yaml
success_criteria:
  project_info:
    name: "[Project Name]"
    sponsor: "[Business Sponsor]"
    timeline: "[Project Timeline]"
    budget: "[Approved Budget]"

  business_success:
    primary_objectives:
      - objective: "[Primary business goal]"
        metric: "[How measured]"
        baseline: "[Current state]"
        target: "[Desired outcome]"
        timeline: "[When to achieve]"
        owner: "[Accountable person]"

    secondary_objectives:
      - objective: "[Secondary goal]"
        metric: "[Measurement method]"
        target: "[Target value]"
        timeline: "[Timeframe]"

  user_success:
    adoption_metrics:
      - metric: "User Adoption Rate"
        target: "[X% of target users within Y timeframe]"
        measurement: "[How tracked]"
      
      - metric: "User Satisfaction"
        target: "[X.X rating out of 5.0]"
        measurement: "[Survey method and frequency]"

    experience_metrics:
      - metric: "Task Completion Rate"
        target: "[X% completion rate]"
        baseline: "[Current rate]"
      
      - metric: "Time to Complete Core Tasks"
        target: "[Reduce by X% or achieve Y seconds]"
        measurement: "[User journey analytics]"

  technical_success:
    performance_metrics:
      - metric: "Response Time"
        target: "[< X seconds for Y% of requests]"
        measurement: "[Application monitoring]"
      
      - metric: "System Availability"
        target: "[99.X% uptime]"
        measurement: "[Infrastructure monitoring]"

    quality_metrics:
      - metric: "Defect Rate"
        target: "[< X defects per Y functionality]"
        measurement: "[Bug tracking system]"
      
      - metric: "Security Vulnerabilities"
        target: "[Zero critical, < X high severity]"
        measurement: "[Security scanning tools]"

  financial_success:
    cost_metrics:
      - metric: "Development Cost"
        target: "[Within X% of approved budget]"
        tracking: "[Financial reporting system]"
      
      - metric: "Operational Cost"
        target: "[< X per month/year]"
        measurement: "[Infrastructure cost tracking]"

    value_metrics:
      - metric: "Return on Investment (ROI)"
        target: "[X% ROI within Y months]"
        calculation: "[Benefit calculation method]"
      
      - metric: "Cost Savings"
        target: "[Save $X annually]"
        measurement: "[Process improvement tracking]"

  compliance_success:
    regulatory_requirements:
      - requirement: "[LGPD/GDPR/SOX/etc.]"
        criteria: "[Specific compliance measure]"
        validation: "[Audit/assessment method]"
      
      - requirement: "[Industry standard]"
        criteria: "[Compliance requirement]"
        validation: "[Certification process]"

  milestone_success:
    delivery_milestones:
      - milestone: "[Alpha Release]"
        date: "[Target Date]"
        criteria: "[Success definition]"
      
      - milestone: "[Beta Release]"
        date: "[Target Date]"
        criteria: "[Success definition]"
      
      - milestone: "[Production Release]"
        date: "[Target Date]"
        criteria: "[Success definition]"

  risk_thresholds:
    - risk: "[Major project risk]"
      threshold: "[Trigger point for escalation]"
      response: "[Planned response action]"
```

### Step 4: Measurement Framework

Establish measurement and tracking approach:

**Measurement Plan:**
1. **Data Sources**: Where metrics will be collected
2. **Collection Frequency**: How often measurements occur
3. **Reporting Schedule**: When and to whom results are reported
4. **Review Process**: Regular assessment and adjustment cycles
5. **Escalation Triggers**: When to raise concerns

**Dashboard Design:**
- Executive Dashboard: High-level KPIs for leadership
- Operational Dashboard: Detailed metrics for project team
- User Dashboard: User-focused metrics and feedback
- Technical Dashboard: System performance and quality metrics

### Step 5: Stakeholder Alignment

Facilitate agreement and commitment:

1. **Criteria Review Sessions**: Present proposed criteria to stakeholders
2. **Negotiation and Refinement**: Adjust based on feedback and constraints
3. **Formal Approval**: Obtain sign-off from key decision makers
4. **Communication Plan**: Ensure all team members understand criteria
5. **Change Control**: Establish process for modifying criteria

## Success Criteria Templates

### Business Application Project
```yaml
primary_success:
  - metric: "Business Process Efficiency"
    target: "30% reduction in processing time"
    baseline: "Current average: 45 minutes"
    measurement: "Process analytics dashboard"

  - metric: "User Productivity"
    target: "25% increase in tasks completed per day"
    measurement: "User activity tracking"

  - metric: "Cost Reduction"
    target: "$500K annual savings"
    calculation: "Reduced manual effort + system efficiency"
```

### Digital Transformation Initiative
```yaml
primary_success:
  - metric: "Digital Adoption"
    target: "90% of processes digitized within 6 months"
    measurement: "Process audit and user surveys"

  - metric: "Customer Satisfaction"
    target: "Increase NPS by 15 points"
    baseline: "Current NPS: 35"
    measurement: "Quarterly customer surveys"

  - metric: "Operational Efficiency"
    target: "40% reduction in manual touchpoints"
    measurement: "Process mapping and analytics"
```

### Infrastructure Modernization
```yaml
primary_success:
  - metric: "System Performance"
    target: "50% improvement in response times"
    baseline: "Current average: 3.2 seconds"
    measurement: "Application performance monitoring"

  - metric: "Reliability"
    target: "99.9% uptime (down from 97.5%)"
    measurement: "Infrastructure monitoring tools"

  - metric: "Security Posture"
    target: "Zero critical vulnerabilities"
    measurement: "Monthly security scans"
```

## Quality Assurance

**Criteria Validation Checklist:**
- [ ] All criteria are SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- [ ] Baselines established where applicable
- [ ] Measurement methods clearly defined
- [ ] Responsible parties identified
- [ ] Review and reporting schedule established
- [ ] Stakeholder agreement documented
- [ ] Change control process defined

**Common Pitfalls to Avoid:**
- Vague or immeasurable criteria
- Too many criteria (overwhelming)
- Unrealistic targets given constraints
- Missing stakeholder perspectives
- No baseline data for comparison
- Undefined measurement methods

## Integration Points

This task connects to:
- **Project Charter**: Define project success parameters
- **Requirements Definition**: Link features to success outcomes
- **Testing Strategy**: Validate against success criteria
- **Change Management**: Measure adoption and satisfaction
- **Project Closure**: Assess final success achievement

## Ongoing Management

**Regular Reviews:**
- Weekly: Progress against milestones
- Monthly: Full metrics dashboard review
- Quarterly: Strategic alignment assessment
- Project phases: Criteria refinement as needed

**Adaptation Process:**
- Monitor for changing business conditions
- Adjust targets based on learning and feedback
- Communicate changes to all stakeholders
- Maintain traceability of criteria evolution

## Success Indicators

- Clear alignment among stakeholders on what constitutes success
- Measurable progress toward defined targets
- Regular monitoring and reporting rhythm established
- Early warning system for potential issues
- Continuous improvement in measurement accuracy
- Strong correlation between project activities and success metrics