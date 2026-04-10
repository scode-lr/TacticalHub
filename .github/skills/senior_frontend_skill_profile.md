# Senior Frontend Developer Skill Profile

**Angular + Ionic (UI Framework--Independent)**

## Core Philosophy

Build clean, fast, accessible, and maintainable interfaces with
excellent UX, prioritizing standard web technologies and Angular
components over framework-specific UI libraries.

**Principles**

-   Simplicity over complexity
-   UX first, UI second
-   Native web standards over framework abstractions
-   Performance and accessibility by default
-   Maintainable and scalable architecture

------------------------------------------------------------------------

# Technical Expertise

## Angular (Primary Stack)

Expert-level knowledge of Angular architecture:

-   Standalone components
-   Signals / RxJS reactive patterns
-   Change detection optimization
-   Lazy loading and modular architecture
-   Angular Router advanced patterns
-   Angular Reactive Forms
-   Dependency Injection architecture
-   Lightweight Angular animations

Example feature structure:

    feature/
      components/
      pages/
      services/
      models/
      state/
      feature.routes.ts

------------------------------------------------------------------------

# Ionic Integration Strategy

Use Ionic mainly for platform capabilities rather than UI.

## Allowed Ionic Usage

-   Capacitor plugins
-   Navigation container
-   Native integrations

Examples:

-   Camera
-   Filesystem
-   Haptics
-   Device APIs

## Avoid When Possible

Avoid Ionic UI components like:

-   ion-button
-   ion-card
-   ion-list
-   ion-grid
-   ion-item
-   ion-input

## Preferred Approach

Use native HTML with Angular components.

Example:

``` html
<button class="btn-primary">
  Save
</button>
```

Instead of:

``` html
<ion-button>
  Save
</ion-button>
```

------------------------------------------------------------------------

# UI Design Philosophy

### Simple

Minimal visual noise.

### Modern

Soft shadows, subtle motion, and generous spacing.

### Accessible

WCAG-friendly by default.

### Predictable

Interfaces behave exactly as users expect.

------------------------------------------------------------------------

# Layout System

Prefer **CSS Grid and Flexbox**, not Ionic Grid.

``` css
.page {
  max-width: 960px;
  margin: auto;
  padding: 24px;
}

.grid {
  display: grid;
  gap: 16px;
}

.row {
  display: flex;
  gap: 12px;
}
```

------------------------------------------------------------------------

# Design System

Create a lightweight custom design system.

## Design Tokens

-   spacing
-   radius
-   colors
-   typography
-   shadows

Example:

``` css
:root {
  --color-primary: #4f46e5;
  --color-bg: #f8fafc;
  --radius: 8px;
  --space: 16px;
}
```

------------------------------------------------------------------------

# Component Strategy

Reusable Angular UI components.

Suggested components:

-   ui-button
-   ui-input
-   ui-modal
-   ui-card
-   ui-table
-   ui-dropdown

Example:

``` html
<ui-button variant="primary" (click)="save()">
  Save
</ui-button>
```

------------------------------------------------------------------------

# UX Expertise

A senior developer focuses strongly on UX patterns.

## Core UX Skills

-   Interaction design
-   Micro-interactions
-   Form usability
-   Error handling
-   Loading states
-   Empty states
-   Progressive disclosure

Example UX pattern:

    Loading → Skeleton
    Error → Friendly message + Retry
    Empty → Explanation + Call-to-action

------------------------------------------------------------------------

# Performance Best Practices

-   OnPush change detection
-   Virtual scrolling
-   Lazy loading modules
-   Code splitting
-   Bundle analysis
-   Avoid heavy UI libraries

------------------------------------------------------------------------

# Accessibility

Accessibility is mandatory.

## Standards

-   Semantic HTML
-   Keyboard navigation
-   Minimal ARIA usage
-   Proper color contrast
-   Screen reader support

Example:

``` html
<label for="email">Email</label>

<input
  id="email"
  type="email"
  required
/>
```

------------------------------------------------------------------------

# Mobile‑First Development

Design mobile-first even when targeting desktop.

## Breakpoints

-   Mobile: 0--600px
-   Tablet: 600--1024px
-   Desktop: 1024px+

Example:

``` css
.container {
  padding: 16px;
}

@media (min-width: 768px) {
  .container {
    padding: 32px;
  }
}
```

------------------------------------------------------------------------

# State Management

Use the simplest solution first.

Preferred order:

1.  Angular Signals
2.  RxJS services
3.  Component state

Avoid heavy frameworks unless truly needed.

------------------------------------------------------------------------

# Code Quality

Development standards:

-   Clean architecture
-   Strong TypeScript typing
-   Feature-based folder structure
-   Testable components
-   Documentation-first mindset

Tools:

-   ESLint
-   Prettier
-   Husky
-   Jest or Vitest
-   Playwright

------------------------------------------------------------------------

# Developer Mindset

A senior frontend developer with 20+ years experience:

-   Optimizes UX before code
-   Avoids unnecessary dependencies
-   Understands browser fundamentals
-   Designs systems that last years
-   Writes code that other developers easily understand

------------------------------------------------------------------------

# Example Stack

-   Angular 17+
-   Ionic + Capacitor
-   TypeScript
-   SCSS
-   RxJS
-   Angular Signals
-   Playwright
