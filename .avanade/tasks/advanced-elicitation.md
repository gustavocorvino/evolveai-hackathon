# Advanced Elicitation Task

## Purpose

- Provide optional reflective and brainstorming actions to enhance content quality
- Enable deeper exploration of ideas through structured elicitation techniques
- Support iterative refinement and creative exploration

## Process

### Step 1: Context Assessment

Ask the user:

1. What specific topic/area needs deeper exploration?
2. What is the current level of understanding/detail?
3. What outcome or insight are you seeking?
4. Are there any constraints or specific requirements?

### Step 2: Technique Selection

Based on the context, select appropriate elicitation techniques:

**For Business Requirements:**
- Five Whys Analysis
- Stakeholder Impact Mapping
- Business Process Decomposition
- Value Stream Mapping

**For Technical Solutions:**
- Architecture Decision Records
- Trade-off Analysis
- Risk Assessment Matrix
- Technology Stack Evaluation

**For Creative Ideation:**
- Mind Mapping
- SCAMPER Method
- Lateral Thinking
- Assumption Challenging

**For Problem Definition:**
- Problem Tree Analysis
- Root Cause Analysis
- Issue Prioritization Matrix
- Context Diagrams

### Step 3: Guided Exploration

Execute the selected technique with structured questions:

#### Five Whys Example:
1. What is the problem? [Initial problem statement]
2. Why does this problem occur? [First layer]
3. Why does [first layer] happen? [Second layer]
4. Why does [second layer] happen? [Third layer]
5. Why does [third layer] happen? [Fourth layer]
6. Why does [fourth layer] happen? [Root cause]

#### SCAMPER Example:
- **Substitute**: What can be substituted or swapped?
- **Combine**: What can be combined or merged?
- **Adapt**: What can be adapted from elsewhere?
- **Modify**: What can be modified or emphasized?
- **Put to other uses**: How else can this be used?
- **Eliminate**: What can be removed or simplified?
- **Reverse**: What can be reversed or rearranged?

### Step 4: Insight Synthesis

Guide the user to:

1. **Identify Patterns**: What common themes emerge?
2. **Highlight Insights**: What new understanding was gained?
3. **Define Actions**: What concrete next steps are needed?
4. **Prioritize**: Which insights are most valuable?

### Step 5: Documentation

Create structured output with:

```yaml
elicitation_session:
  topic: "[Topic explored]"
  technique_used: "[Selected technique]"
  duration: "[Session length]"
  
insights:
  - insight: "[Key insight 1]"
    priority: "[High/Medium/Low]"
    action_required: "[Yes/No]"
    next_steps: "[Specific actions]"
  
  - insight: "[Key insight 2]"
    priority: "[High/Medium/Low]"
    action_required: "[Yes/No]"
    next_steps: "[Specific actions]"

follow_up:
  - "[Additional exploration needed]"
  - "[Areas for further investigation]"
  
recommendations:
  - "[Actionable recommendation 1]"
  - "[Actionable recommendation 2]"
```

## Elicitation Techniques Library

### Discovery Techniques

**1. Structured Interviews**
- Prepare open-ended questions
- Use active listening
- Probe for details with "how" and "why"
- Document assumptions and constraints

**2. Observation Sessions**
- Shadow users in their environment
- Note pain points and inefficiencies
- Identify unspoken needs
- Document context and environment

**3. Document Analysis**
- Review existing documentation
- Identify gaps and inconsistencies
- Extract implicit requirements
- Map dependencies and relationships

### Analysis Techniques

**1. Affinity Mapping**
- Group related ideas
- Identify themes and patterns
- Prioritize by importance
- Create visual clusters

**2. Impact/Effort Matrix**
- Assess implementation difficulty
- Evaluate business value
- Prioritize initiatives
- Guide resource allocation

**3. Dependency Mapping**
- Identify interdependencies
- Map critical path
- Assess risks and blockers
- Plan sequencing

### Validation Techniques

**1. Prototyping**
- Create low-fidelity mockups
- Test assumptions quickly
- Gather early feedback
- Iterate based on input

**2. Scenario Walkthroughs**
- Define user journeys
- Test edge cases
- Validate workflows
- Identify missing elements

**3. Assumption Testing**
- List all assumptions
- Rank by risk level
- Design validation experiments
- Document findings

## Best Practices

1. **Create Safe Space**: Encourage open exploration without judgment
2. **Ask Open Questions**: Use "what", "how", "why" instead of yes/no questions
3. **Stay Curious**: Follow interesting threads even if they seem tangential
4. **Document Everything**: Capture all ideas, even seemingly irrelevant ones
5. **Iterate Quickly**: Use multiple short sessions rather than marathon explorations
6. **Validate Insights**: Test assumptions before building on them

## Output

Generate a comprehensive elicitation report with:
- Session summary and context
- Detailed insights with priorities
- Action items with owners
- Follow-up recommendations
- Supporting artifacts (maps, diagrams, matrices)

## Integration

This task integrates with:
- **Knowledge Base**: Reference Avanade methodology and best practices
- **Brainstorming**: Feed insights into creative exploration sessions
- **Documentation**: Support project artifact creation
- **Planning**: Inform solution design and estimation