# MCP Demo - IDE Setup and Figma Integration Script

## Document 1: IDE Figma Integration Flow (Word Format)

---

# Starting the Demo: IDE Setup with Figma Links

## 1. Opening - Setting the Context (3 minutes)

### Initial Setup Speech

**[SPEECH]**
"Thank you [Host Name]! Hello everyone, I'm thrilled to be here today to show you something that has fundamentally changed how our team approaches frontend development.

Today, I'll show you how we've reduced that process of converting Figma designs to React components from hours to minutes while actually improving code quality and consistency.

--Our Approach Overview
What makes our approach unique is the combination of three key technologies:

1. UUI MCP (Model Context Protocol)
"First, we use MCP - think of it as giving AI a deep understanding of our entire design system and component library. It's like having a senior developer who knows every component, every pattern, and every best practice sitting next to you."

2. UUI Custom Rules
"Second, we've created custom rules that ensure the AI doesn't just generate generic code - it generates code that looks like YOUR team wrote it. These rules enforce:

Your naming conventions
Your state management patterns
Your error handling approaches
Your performance optimizations"

3. Figma MCP Integration
"And third, we've connected Figma directly to our AI workflow. The AI can actually 'see' and understand your Figma designs, reading not just the visual layout but understanding the component structure, the design tokens, and the intended interactions."

What We'll Build Today
"In the next 90 minutes, I'll build a complete entity management system with:

A responsive layout with navigation
An intuitive 'Add' button interface
A sophisticated modal form with validation
A feature-rich data table with sorting, filtering, and inline editing
All working together as a cohesive application
And here's the kicker - every line of code will be production-ready, fully typed with TypeScript, accessible, and following our team's best practices."

### Showing the Empty State

**[SPEECH]**
"As you can see, I have Cursor IDE open with a completely empty project. But here's where the magic begins - instead of manually looking at designs and coding from scratch, we're going to connect directly to our Figma designs."

---

## 2. Figma Links Setup (5 minutes)

### Introducing the Figma File

**[SPEECH]**
"First, let me show you our Figma design file.
*[Open browser with Figma]*

This is our complete Entity Management System design with:
- Application layout and navigation
- Entity listing page with Add button
- Creation/Edit modal with form
- Data table with all interactions
- Mobile responsive versions

Now, instead of keeping this in a separate tab and constantly switching back and forth, watch this..."

### Collecting Figma Links

**[SPEECH]**
"I'm going to collect the Figma links for each major component. In Figma, I'll right-click and copy the link for each screen."

**[DEMONSTRATE]**
1. *Right-click on Layout frame* → Copy link
2. *Right-click on Entities Page frame* → Copy link
3. *Right-click on Modal frame* → Copy link
4. *Right-click on Table frame* → Copy link

**[SPEECH]**
"Now I have direct links to each design. Let me create a development plan using these links."

---

## 3. Creating Development Plan in IDE (7 minutes)

### Setting Up the Plan File

**[SPEECH]**
"Back in Cursor, I'll create our development plan that references these Figma designs directly."

**[CREATE FILE: `development-plan.md`]**

**[TYPE IN IDE]**
```markdown
# Entity Management System - Development Plan

## Figma Design Links
- Full Design System: [paste main Figma file link]
- Layout Component: [paste layout link]
- Entities Page: [paste entities page link]
- Entity Modal: [paste modal link]
- Entities Table: [paste table link]

## Development Phases

### Phase 1: Project Setup (5 min)
- Initialize React + TypeScript + Vite
- Install UUI component library
- Configure MCP rules
- Set up routing

### Phase 2: Layout Foundation (5 min)
- Create Layout component from: [layout Figma link]
- Implement responsive header/footer
- Add navigation structure
- Integrate with routing

### Phase 3: Entities Page (10 min)
- Create EntitiesPage from: [entities page Figma link]
- Implement Add button
- Add empty state
- Prepare modal integration

### Phase 4: Entity Modal (15 min)
- Create EntityModal from: [modal Figma link]
- Build form with validation
- Handle create/edit modes
- Connect to page

### Phase 5: Data Table (20 min)
- Create EntitiesTable from: [table Figma link]
- Add sorting and filtering
- Implement inline editing
- Add pagination

### Phase 6: Integration (10 min)
- Connect all components
- Add state management
- Implement persistence
- Final testing
```

**[SPEECH - While typing]**
"Notice how I'm creating a clear roadmap that directly references each Figma design. This isn't just documentation - Cursor's AI can actually follow these links and understand the designs."

### Explaining the AI Context

**[SPEECH]**
"Now here's the powerful part - let me show you how we give the AI context about our Figma designs."

**[CREATE FILE: `.cursorrules`]**

**[TYPE IN IDE]**
```
You are an expert React developer with access to Figma designs.

When I reference a Figma link, you should:
1. Understand the visual design and layout
2. Identify the components and their properties
3. Match the styling exactly using our UUI design system
4. Implement all interactions shown in the design

Project Context:
- We're building an Entity Management System
- Using React + TypeScript + Vite
- UUI component library for all UI elements
- Following atomic design principles
- Mobile-first responsive approach

Figma Integration Rules:
- Always check Figma links for design specifications
- Use exact spacing and sizing from Figma
- Implement all states (hover, active, disabled) shown
- Match colors using our design tokens
- Preserve responsive behavior

Code Quality Standards:
- Full TypeScript coverage with proper types
- Component files in PascalCase
- Hooks for logic separation
- Proper error handling
- Loading states for async operations
- Accessibility features (ARIA labels, keyboard nav)
```

**[SPEECH]**
"These rules tell the AI exactly how to interpret our Figma designs and translate them into code that matches our standards."

---

## 4. Demonstrating Figma-Driven Development (5 minutes)

### Starting with AI Context

**[SPEECH]**
"Now let me show you the magic of having Figma links directly in our development flow. I'll ask the AI to analyze our design and create a development strategy."

**[PROMPT TO TYPE]**
```
Analyze the Figma designs linked in development-plan.md and create a detailed implementation strategy. For each component, identify:
1. Required UUI components
2. State management needs
3. Key interactions to implement
4. Responsive breakpoints
5. Potential challenges
```

**[SPEECH WHILE AI RESPONDS]**
"Watch as the AI actually examines our Figma designs and creates a technical implementation plan. It's identifying:
- Which UUI components map to our Figma elements
- What state we'll need to manage
- Interactive features from the designs
- Responsive requirements

This level of design-to-code intelligence is unprecedented."

### Creating Component Structure

**[SPEECH]**
"Based on the Figma analysis, let's have the AI set up our component structure."

**[PROMPT TO TYPE]**
```
Based on the Figma designs, create the initial project structure with:
- Folder structure for all components
- TypeScript interfaces for our entities
- Route configuration
- Component stubs with TODO comments referencing specific Figma sections
```

**[SPEECH]**
"Notice how the AI is creating a structure that directly maps to our Figma organization. Each component stub includes a reference to its design source."

---

## 5. First Implementation with Figma Reference (5 minutes)

### Starting Development

**[SPEECH]**
"Now let's see how Figma-driven development works in practice. I'll start with our Layout component."

**[PROMPT TO TYPE]**
```
Implement the Layout component based on the Figma design at [paste layout link].
Focus on:
- Exact header structure with logo, nav, and user profile
- Sticky header behavior with shadow on scroll
- Footer with links matching Figma
- Responsive mobile menu
- Use UUI components throughout
```

**[SPEECH WHILE AI GENERATES]**
"The AI is now looking at our actual Figma design and generating code that matches it exactly. See how it's:
- Using the correct spacing values
- Implementing the sticky behavior we designed
- Matching our color scheme
- Creating the responsive version

This isn't generic code - it's specifically tailored to our design."

### Verifying Against Figma

**[SPEECH]**
"Let me run this and show you the side-by-side comparison."

**[RUN: `npm run dev`]**

**[SPEECH - Split screen with Figma and browser]**
"Look at this - on the left is our Figma design, on the right is the generated code. The spacing, colors, typography - everything matches perfectly. And we achieved this in minutes, not hours."

---

## 6. Explaining the Workflow Benefits (3 minutes)

### Design-to-Code Accuracy

**[SPEECH]**
"What we've just demonstrated solves several major pain points:

1. **No more interpretation errors** - The AI sees exactly what the designer intended
2. **Consistent implementation** - Every developer using these links gets the same result
3. **Design updates** - When Figma changes, we can regenerate affected components
4. **Documentation** - The Figma links serve as living documentation

This is true design-to-code automation."

### Team Collaboration

**[SPEECH]**
"For teams, this approach means:
- Designers can update Figma and developers instantly see changes
- No more 'that's not what I designed' conversations
- Faster iteration cycles
- Better alignment between design and development

Let me show you one more powerful feature..."

### Change Management Demo

**[SPEECH]**
"What happens when designs change? Let me demonstrate."

**[PROMPT TO TYPE]**
```
The header design in Figma has been updated with a search bar in the center navigation. Update the Layout component to match the new design while preserving all existing functionality.
```

**[SPEECH]**
"The AI understands both the old and new designs, making updates surgical and precise. No more manual hunting for what changed."

---

## 7. Transitioning to Full Demo (2 minutes)

### Summary of Setup

**[SPEECH]**
"So what we've established here is:
1. Direct connection between Figma and our IDE
2. AI that understands and implements our designs
3. A clear development plan with design references
4. The ability to generate accurate code from designs

This foundation enables everything else I'm about to show you."

### Moving Forward

**[SPEECH]**
"Now that you understand how we connect design to development, let me build out the complete application. We'll follow our development plan, implementing each component with the same Figma-driven approach.

Starting with our project initialization..."

**[PROMPT TO TYPE]**
```
Initialize the project according to Phase 1 of our development plan. Create a React + TypeScript + Vite project with UUI components and all necessary dependencies.
```

**[SPEECH]**
"And we're off! Watch as we build a complete application in record time, with every component matching our Figma designs perfectly..."

---

# Document 2: Quick Reference - Figma Integration Commands (Markdown)

---

# Figma Integration Quick Reference

## Essential Figma Commands

### Initial Setup
```
Analyze the Figma designs linked in development-plan.md and create a detailed implementation strategy.
```

### Component Implementation
```
Implement [ComponentName] based on the Figma design at [Figma link].
Match all visual properties, spacing, and interactions exactly.
```

### Design Verification
```
Compare the implemented [ComponentName] with its Figma design and identify any discrepancies.
```

### Update from Figma
```
The Figma design for [ComponentName] has been updated. Analyze the changes and update the implementation accordingly.
```

### Responsive Check
```
Verify that [ComponentName] matches the Figma design at all breakpoints: mobile (375px), tablet (768px), and desktop (1440px).
```

## Figma Link Patterns

### Component Links
```markdown
- Layout: https://www.figma.com/file/xxx/Entity-System?node-id=1:100
- Entities Page: https://www.figma.com/file/xxx/Entity-System?node-id=1:200
- Modal: https://www.figma.com/file/xxx/Entity-System?node-id=1:300
- Table: https://www.figma.com/file/xxx/Entity-System?node-id=1:400
```

### Development Plan Template
```markdown
## Phase X: [Component Name] (X min)
- Create [Component] from: [Figma link]
- Key features: [list from Figma]
- States: [hover, active, disabled, etc.]
- Responsive: [breakpoints needed]
```

## Speech Snippets for Figma Integration

### Introducing Figma Connection
- "Instead of manually translating designs..."
- "Direct link between design and code..."
- "The AI can see what the designer intended..."
- "No more interpretation errors..."

### During Implementation
- "Notice how it matches the Figma spacing..."
- "The AI is reading the design tokens..."
- "See the exact color values from Figma..."
- "Even the interactions are preserved..."

### Showing Results
- "Compare this to the Figma design..."
- "Pixel-perfect implementation..."
- "Exactly what the designer created..."
- "And it took just minutes..."

## Troubleshooting Figma Integration

### If Figma Access Fails
```
For this demo, I'll reference the Figma screenshots I've prepared. The process remains the same - the AI understands the design requirements.
```

### If Design Details Are Unclear
```
Analyze the Figma design more carefully, focusing on [specific aspect]. What are the exact spacing values and component properties?
```

### If Implementation Doesn't Match
```
The implementation doesn't match Figma. Please adjust:
- Spacing to match Figma's [X]px
- Colors to use our design token for [element]
- Font size to match Figma's [Y]px
```

## Key Benefits to Emphasize

1. **Accuracy**: "No more guessing designer intent"
2. **Speed**: "From Figma to code in minutes"
3. **Consistency**: "Every developer gets same result"
4. **Maintenance**: "Easy updates when designs change"
5. **Collaboration**: "Designers and developers in sync"

---

This approach sets a strong foundation for your demo by showing the direct connection between design and development. The audience will immediately understand the value proposition before you even start building components!