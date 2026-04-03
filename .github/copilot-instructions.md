# GitHub Copilot Instructions for TacticalHub

## 🎯 Project Context
Angular 17+ Ionic application for football/sports team management. Multi-tenant support (TacticalHub, Voltrega CF).

## 📝 English Grammar Corrections
When responding to prompts written in English, provide grammar and spelling corrections at the end of your response if errors are found. Format: "✍️ **Grammar note:** [error] → [correction]". Keep it to one paragraph maximum.

## 🚫 Code Comments Policy
DO NOT write comments in code. Code should be self-documenting through clear naming and structure. No comments allowed except for:
- JSDoc for public APIs/interfaces
- Complex algorithm explanations (rare cases only)

## 🚫 Console Logs Policy
DO NOT use console.log, console.warn, console.error or any console methods in production code. Use proper logging services or remove debug logs before committing.

## � Code Reverting Policy
NEVER revert user's manual changes. ALWAYS read the current file contents before making any edits. If the user has made manual changes, build upon them - don't undo them. When in doubt, ask the user before changing something that might overwrite their work.

## �🚨 CRITICAL RULES - ENFORCE STRICTLY

### CSS Variables - NEVER HARDCODE COLORS
**ALWAYS use CSS variables. NEVER use hardcoded hex, rgb, or color names.**

```scss
// ✅ CORRECT - Always do this
background: var(--background-primary, #ffffff);
color: var(--text-primary, #111827);
border: 1px solid var(--border-light, #e5e7eb);

// ❌ WRONG - Never suggest this
background: #ffffff;
color: black;
border: 1px solid #e5e7eb;
```

### Required CSS Variables
```scss
// Backgrounds
var(--background-primary, #ffffff)      // White backgrounds
var(--background-secondary, #f8f9fa)    // Light gray backgrounds
var(--background-tertiary, #e9ecef)     // Darker gray

// Text Colors
var(--text-primary, #111827)            // Main text
var(--text-secondary, #6b7280)          // Secondary text
var(--text-light, #adb5bd)              // Light/disabled text

// Borders
var(--border-light, #e5e7eb)            // All borders
var(--border-medium, #ced4da)           // Emphasized borders

// Ionic Colors
var(--ion-color-primary, #3880ff)       // Primary actions
var(--ion-color-danger, #eb445a)        // Errors/delete
var(--ion-color-success, #10b981)       // Success states
var(--ion-color-warning, #ffc409)       // Warnings
```

### Spacing - Use 0.25rem Scale Only
```scss
// ✅ CORRECT - Consistent scale
padding: 0.5rem;    // 8px
padding: 1rem;      // 16px
padding: 1.5rem;    // 24px
padding: 2rem;      // 32px
gap: 1.5rem;
margin: 0 0 0.5rem 0;

// ❌ WRONG - Never suggest random values
padding: 17px;
gap: 13px;
margin: 22px;
```

### Typography - Always Use rem
```scss
// ✅ CORRECT - rem units only
font-size: 1.75rem;     // Large headings
font-size: 1.125rem;    // Subheadings
font-size: 0.9375rem;   // Body text (15px)
font-size: 0.875rem;    // Small text (14px)
font-size: 0.8125rem;   // Fine print (13px)

// Font weights
font-weight: 400;       // Regular
font-weight: 500;       // Medium
font-weight: 600;       // Semi-bold
font-weight: 700;       // Bold

// Line heights
line-height: 1.2;       // Tight (headings)
line-height: 1.5;       // Normal (body)

// ❌ WRONG - Never use px for text
font-size: 16px;
```

### Border Radius - Standard Scale
```scss
border-radius: 8px;   // Small (badges, pills)
border-radius: 10px;  // Medium (inputs, buttons)
border-radius: 12px;  // Large (cards, dropdowns)
border-radius: 16px;  // Extra large (main sections)
border-radius: 50%;   // Circles (avatars)
```

### Shadows - Subtle Only
```scss
// ✅ CORRECT - Light, subtle shadows
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
box-shadow: 0 0 0 3px rgba(56, 128, 255, 0.1);  // Focus ring

// ❌ WRONG - Never suggest heavy shadows
box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
```

### Transitions - Quick and Smooth
```scss
// ✅ CORRECT
transition: all 0.2s ease;
transition: background 0.15s ease;

// ❌ WRONG
transition: all 0.5s;
```

### Hover States - Always Required
```scss
.element {
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    border-color: var(--ion-color-primary, #3880ff);
    box-shadow: 0 4px 16px rgba(56, 128, 255, 0.12);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
}
```

## 🏗️ Angular 17+ Patterns

### Component Structure
```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  standalone: true,
  imports: [CommonModule, IonButton, IonInput]
})
export class ExampleComponent {
  // ✅ CORRECT - Use inject()
  private service = inject(SomeService);
  
  // ✅ CORRECT - Use signals
  readonly data = signal<Data | null>(null);
  readonly loading = signal<boolean>(false);
  
  // ✅ CORRECT - Computed values
  readonly displayData = computed(() => {
    return this.data()?.process();
  });
}
```

### Control Flow - Modern Syntax
```html
<!-- ✅ CORRECT - Use @if and @for -->
@if (showContent()) {
  <div>Content</div>
}

@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

<!-- ❌ WRONG - Don't use old syntax -->
<div *ngIf="showContent">Content</div>
<div *ngFor="let item of items">{{ item.name }}</div>
```

### Navigation Pattern
```typescript
// ✅ CORRECT - Use NavigationService
private navigationService = inject(NavigationService);

goToPage() {
  this.navigationService.navigateTo(['/path'], { queryParams: {} });
}

// ❌ WRONG - Don't inject Router
private router = inject(Router);
```

### Translation Pattern
```html
<!-- ✅ CORRECT - Use pipe in template -->
<h1>{{ 'page.title' | translate }}</h1>
<p>{{ 'page.description' | translate }}</p>

<!-- ❌ WRONG - Don't call service in component -->
```

```typescript
// ❌ WRONG
this.title = this.translationService.instant('page.title');
```

## 📐 Layout Patterns

### Responsive Grid
```scss
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

### Container with Max Width
```scss
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
}
```

### Sticky Header
```scss
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--background-primary, #ffffff);
  border-bottom: 1px solid var(--border-light, #e5e7eb);
  backdrop-filter: blur(10px);
}
```

## 🎨 Component Templates

### Card Component
```scss
.card {
  background: var(--background-primary, #ffffff);
  border: 1px solid var(--border-light, #e5e7eb);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--ion-color-primary, #3880ff);
    box-shadow: 0 4px 16px rgba(56, 128, 255, 0.12);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  .card-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-light, #e5e7eb);
  }
  
  .card-body {
    padding: 1.5rem;
  }
  
  .card-footer {
    padding: 1rem 1.5rem;
    background: var(--background-secondary, #f8f9fa);
    border-top: 1px solid var(--border-light, #e5e7eb);
  }
}
```

### Button Component
```scss
.btn-primary {
  --background: var(--ion-color-primary, #3880ff);
  --color: white;
  --border-radius: 10px;
  --padding-top: 0.875rem;
  --padding-bottom: 0.875rem;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:hover:not(.button-disabled) {
    transform: translateY(-1px);
    --box-shadow: 0 4px 12px rgba(56, 128, 255, 0.3);
  }
  
  &.button-disabled {
    --background: var(--background-secondary, #f8f9fa);
    --color: var(--text-light, #adb5bd);
  }
}
```

### Input Component
```scss
ion-input {
  --border-radius: 10px;
  --border-width: 1px;
  --border-color: var(--border-light, #e5e7eb);
  --background: var(--background-primary, #ffffff);
  --color: var(--text-primary, #111827);
  --placeholder-color: var(--text-light, #9ca3af);
  --padding-start: 1rem;
  --padding-end: 1rem;
  --padding-top: 0.875rem;
  --padding-bottom: 0.875rem;
  font-size: 0.9375rem;
  font-weight: 500;

  &.ion-focused {
    --border-color: var(--ion-color-primary, #3880ff);
    --box-shadow: 0 0 0 3px rgba(56, 128, 255, 0.1);
  }

  &.ion-invalid.ion-touched {
    --border-color: var(--ion-color-danger, #eb445a);
    --background: #fef2f2;
    --box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
  }
}
```

## 🎭 Animations

### Fade In
```scss
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: fadeIn 0.3s ease backwards;
}
```

### Staggered Animation
```scss
.item {
  animation: fadeIn 0.3s ease backwards;
  
  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.04}s;
    }
  }
}
```

### Slide Down (Dropdowns)
```scss
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown {
  animation: slideDown 0.2s ease;
}
```

## 📱 Responsive Design

### Breakpoints
```scss
// Mobile
@media (max-width: 768px) {
  // Mobile styles
}

// Auth pages mobile breakpoint
@media (max-width: 968px) {
  // Auth mobile styles
}
```

### Mobile-First Pattern
```scss
// Desktop first, then mobile overrides
.element {
  padding: 2rem;
  font-size: 1.75rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    font-size: 1.5rem;
  }
}
```

## ✅ Code Completion Checklist

When suggesting CSS/SCSS code, ensure:
- [ ] All colors use CSS variables
- [ ] Spacing uses 0.25rem scale
- [ ] Font sizes use rem units
- [ ] Border radius is 8, 10, 12, or 16px
- [ ] Shadows are subtle (0.08-0.12 opacity)
- [ ] Transitions are 0.2s or 0.15s ease
- [ ] Hover states are defined with transform
- [ ] Focus states include ring shadow
- [ ] Interactive elements have cursor: pointer
- [ ] Mobile breakpoint at 768px

When suggesting TypeScript code, ensure:
- [ ] Standalone components
- [ ] Use inject() not constructor injection
- [ ] Use signals for reactive state
- [ ] Use @if/@for not *ngIf/*ngFor
- [ ] Use NavigationService for routing
- [ ] Use translate pipe in templates

## 🚫 Never Suggest

```scss
// ❌ Hardcoded colors
color: #111827;
background: white;
border-color: #e5e7eb;

// ❌ Pixel units for text
font-size: 16px;

// ❌ Random spacing
padding: 17px;
margin: 23px;

// ❌ Heavy shadows
box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);

// ❌ Slow transitions
transition: all 0.5s;

// ❌ Missing hover states
.button {
  // No &:hover
}
```

```typescript
// ❌ Old Angular patterns
constructor(private router: Router) {}
*ngIf="condition"
*ngFor="let item of items"

// ❌ Direct Router usage
this.router.navigate(['/path']);

// ❌ Translation service in component
this.translationService.instant('key');
```

## 📚 Reference

- Full documentation: `docs/STYLE_GUIDE.md`
- Auth examples: `src/app/pages/auth/signin` and `src/app/pages/auth/signup`
- Role selection example: `src/app/pages/auth/role-selection`

## 🎯 Golden Rule

**When in doubt, suggest code that matches the existing auth pages (signin/signup). They are the gold standard for this project's design system.**
