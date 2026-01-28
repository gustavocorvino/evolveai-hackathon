# Copilot Instructions - Person Management System (GEFCD001)

## Project Overview

This is a **demonstration-focused React web application** for managing person records (individuals and companies) using mock data and local storage. The system prioritizes modern frontend patterns, Brazilian document validation, and responsive design.

**Key Context:** This is a workshop/prototype project, not production software. Focus on clean React patterns, component modularity, and client-side functionality with simulated data.

## Architecture & Tech Stack

### Frontend Architecture
- **Framework**: React 18 with Context API + useReducer for state management
- **UI Library**: Material-UI (MUI) v5 with styled-components
- **Validation**: Formik + Yup for form handling
- **Data**: Mock JSON files + localStorage persistence (no real backend)
- **Structure**: Component-based modular architecture

### Project Structure Convention
```
src/
├── components/           # Feature-organized components
│   ├── common/          # Shared UI components (Header, Footer, Layout)
│   ├── person/          # Person-specific components (Form, List, Card)
│   ├── address/         # Address management components
│   └── phone/           # Phone management components
├── services/            # Mock data services and business logic
├── hooks/               # Custom React hooks (usePersonData, useValidation)
├── types/               # JavaScript type definitions and constants
├── data/                # Mock JSON datasets
└── utils/               # Utility functions (validators, formatters)
```

## Core Data Model & Validation Patterns

### Person Entity Structure
- **Person Types**: `'F'` (Individual/Física) or `'J'` (Company/Jurídica)
- **Required Fields**: Dynamic based on person type
- **Relationships**: One-to-many with addresses and phones via `personId` foreign key

### Critical Validation Rules
- **CPF Validation**: Full algorithm with check digits (see `utils/cpfValidator.js`)
- **CNPJ Validation**: Industry-standard algorithm (see `utils/cnpjValidator.js`)
- **Age Validation**: Birth date must result in valid age for individuals
- **Uniqueness**: Prevent duplicate CPF/CNPJ across all persons

### Document Formatting Convention
Always format documents with masks: CPF as `123.456.789-00`, CNPJ as `12.345.678/0001-90`

## Development Patterns & Conventions

### Service Layer Pattern
All data operations go through service classes:
```javascript
// Example service usage
const personService = new PersonService();
await personService.createPerson(personData);
```

Services handle:
- Mock data initialization from JSON files
- localStorage persistence simulation
- ID generation and validation
- CRUD operations with error handling

### Form Validation Pattern
Use Formik + Yup with custom validators:
- Always validate CPF/CNPJ using the utility functions
- Apply conditional required fields based on person type
- Show real-time validation feedback

### State Management Pattern
Use Context API for shared state:
- Person data context for CRUD operations
- Validation context for form states
- Navigation context for routing/breadcrumbs

## Mock Data & Testing Strategy

### Mock Data Approach
- Initial data loads from JSON files in `src/data/`
- Runtime changes persist to localStorage
- Service layer abstracts storage mechanism
- Include realistic Brazilian names, addresses, and phone numbers

### Local Storage Keys
- `persons` - Main person data array
- `addresses` - Address data by person
- `phones` - Phone data by person

### Testing Focus Areas
1. **Validation Logic**: Test CPF/CNPJ algorithms extensively
2. **Form Interactions**: Test conditional field requirements
3. **Data Persistence**: Verify localStorage operations
4. **Responsive Behavior**: Test mobile/tablet layouts

## Component Development Guidelines

### Component Organization
- Group by feature (person, address, phone) not by type (forms, lists)
- Keep components focused on single responsibility
- Use composition over inheritance for shared functionality

### Styling Convention
- Primary: Material-UI components and theme system
- Custom styles: styled-components for component-specific styling
- Responsive: Mobile-first approach with MUI breakpoints
- Colors: Use theme colors, especially for validation states

### Error Handling Pattern
- User-facing errors: Show in form validation messages
- Technical errors: Console log for debugging
- No crash-prone operations (always have fallbacks)

## Integration Points & Dependencies

### External Integrations (Simulated)
- **CEP Service**: Mock Brazilian postal code lookup
- **City/State Data**: Static JSON data for Brazilian locations
- **Profession Codes**: Mock professional categories

### Key Dependencies
- Material-UI for consistent UI components
- Formik/Yup for form management and validation
- React Router for navigation
- No external API dependencies

## Workshop & Development Focus

### Priority Features (GEFCD001 Scope)
1. Person registration form with type selection
2. Address management with CEP lookup simulation
3. Phone number management with type classification
4. Real-time validation with Brazilian document rules
5. Responsive design for demonstration purposes

### Development Workflow
1. **Component First**: Start with component structure
2. **Mock Data**: Use realistic Brazilian sample data
3. **Validation Layer**: Implement CPF/CNPJ validation early
4. **Service Layer**: Abstract data operations
5. **Integration**: Wire components through services

### Common Pitfalls to Avoid
- Don't create real backend expectations (this is mock-only)
- Don't over-engineer the validation (client-side focus)
- Don't ignore Brazilian document format requirements
- Don't forget responsive design for mobile demonstration
- Don't skip localStorage persistence simulation

## Commands & Quick Actions

### Key File Locations for Context
- Business logic: `src/services/`
- Validation rules: `src/utils/`
- Mock data: `src/data/`
- Component patterns: `src/components/person/PersonForm.jsx`

### Testing Commands
Since this is a demo project, manual testing is primary:
- Focus on form validation flows
- Test responsive behavior across devices
- Verify localStorage persistence between sessions

When implementing features, always consider the educational/demonstration aspect - code should be clear, well-commented, and showcase modern React patterns.