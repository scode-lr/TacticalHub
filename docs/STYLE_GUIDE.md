# TacticalHub Style Guide

## 🎨 Design System - Always Use Theme Variables

**CRITICAL RULE:** Always use CSS variables from the theme system. Never use hardcoded colors, sizes, or values.

---

## 📋 Table of Contents
1. [Theme Variables](#theme-variables)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Border & Radius](#border--radius)
6. [Shadows & Effects](#shadows--effects)
7. [Layout Patterns](#layout-patterns)
8. [Component Patterns](#component-patterns)
9. [Animation Standards](#animation-standards)
10. [Responsive Design](#responsive-design)

---

## Theme Variables

### Background Colors
```scss
// ✅ CORRECT - Always use variables
background: var(--background-primary, #ffffff);
background: var(--background-secondary, #f8f9fa);
background: var(--background-tertiary, #e9ecef);

// ❌ WRONG - Never hardcode
background: #ffffff;
background: white;
```

### Text Colors
```scss
// ✅ CORRECT
color: var(--text-primary, #212529);    // Main text
color: var(--text-secondary, #6c757d);  // Secondary text
color: var(--text-light, #adb5bd);      // Light/disabled text

// ❌ WRONG
color: #212529;
color: black;
```

### Border Colors
```scss
// ✅ CORRECT
border: 1px solid var(--border-light, #dee2e6);
border-color: var(--border-medium, #ced4da);

// ❌ WRONG
border: 1px solid #dee2e6;
```

---

## Color System

### Ionic Color Variables (Always Use)
```scss
// Primary Actions
--ion-color-primary: #4a90e2        // Main brand color (blue)
--ion-color-primary-shade: #4180c7  // Hover state
--ion-color-primary-tint: #5c9be5   // Light variant

// Secondary Actions
--ion-color-secondary: #32d74b      // Success/positive (green)
--ion-color-tertiary: #ff9500       // Warning/attention (orange)

// Status Colors
--ion-color-success: #2dd36f        // Success states
--ion-color-warning: #ffc409        // Warning states
--ion-color-danger: #eb445a         // Error/delete states

// Neutral Colors
--ion-color-light: #f8f9fa         // Light backgrounds
--ion-color-medium: #92949c        // Medium gray
--ion-color-dark: #222428          // Dark text
```

### Custom Theme Colors
```scss
// Brand Colors
--tactical-blue: #4a90e2
--tactical-green: #32d74b
--tactical-orange: #ff9500
--tactical-gray: #6c757d

// Button Colors
--button-primary-color: var(--ion-color-primary)
--button-primary-contrast: var(--ion-color-primary-contrast)
```

### Usage Examples
```scss
// ✅ CORRECT - Buttons
.auth-btn {
  --background: var(--button-primary-color, var(--ion-color-primary));
  --color: var(--button-primary-contrast, white);
}

// ✅ CORRECT - Interactive elements
.club-card:hover {
  border-color: var(--ion-color-primary, #3880ff);
  box-shadow: 0 4px 16px rgba(56, 128, 255, 0.12);
}

// ✅ CORRECT - Status indicators
.success-badge {
  background: var(--ion-color-success, #2dd36f);
}

.danger-button {
  color: var(--ion-color-danger, #eb445a);
}
```

---

## Typography

### Font Sizes (Always Use rem)
```scss
// ✅ CORRECT - Use rem units
font-size: 2rem;         // Page titles (h1)
font-size: 1.75rem;      // Section headers
font-size: 1.125rem;     // Subheadings (h3)
font-size: 0.9375rem;    // Body text (15px)
font-size: 0.875rem;     // Small text (14px)
font-size: 0.8125rem;    // Fine print (13px)

// ❌ WRONG - Don't use px for text
font-size: 16px;
```

### Font Weights
```scss
font-weight: 400;  // Normal/regular text
font-weight: 500;  // Medium (interactive elements)
font-weight: 600;  // Semi-bold (subheadings)
font-weight: 700;  // Bold (main headings)
```

### Letter Spacing
```scss
letter-spacing: -0.025em;  // Large headings (tighter)
letter-spacing: -0.015em;  // Subheadings
letter-spacing: 0.025em;   // Uppercase badges (wider)
```

### Line Heights
```scss
line-height: 1.2;   // Tight (headings)
line-height: 1.4;   // Medium (labels)
line-height: 1.5;   // Normal (body text)
line-height: 1.6;   // Relaxed (paragraphs)
```

### Typography Pattern
```scss
// ✅ CORRECT - Page Header
h1 {
  color: var(--text-primary, #111827);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  letter-spacing: -0.025em;
}

// ✅ CORRECT - Body Text
p {
  color: var(--text-secondary, #6b7280);
  font-size: 0.9375rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
}
```

---

## Spacing System

### Base Unit: 0.25rem (4px)

```scss
// ✅ CORRECT - Use consistent spacing scale
padding: 0.25rem;   // 4px
padding: 0.5rem;    // 8px
padding: 0.75rem;   // 12px
padding: 1rem;      // 16px
padding: 1.25rem;   // 20px
padding: 1.5rem;    // 24px
padding: 2rem;      // 32px
padding: 3rem;      // 48px

gap: 0.5rem;        // Small gaps
gap: 1rem;          // Medium gaps
gap: 1.5rem;        // Large gaps
gap: 2rem;          // Extra large gaps

// ❌ WRONG - Random values
padding: 17px;
gap: 13px;
```

### Spacing Examples
```scss
// ✅ CORRECT - Card padding
.club-card-body {
  padding: 1.5rem;  // 24px consistent padding
}

// ✅ CORRECT - Grid gaps
.clubs-grid {
  gap: 1.5rem;  // 24px between cards
}

// ✅ CORRECT - Element spacing
.form-header {
  margin-bottom: 1.5rem;
}
```

---

## Border & Radius

### Border Widths
```scss
border: 1px solid;   // Standard borders
border: 2px solid;   // Emphasized borders (dashed, hover)
border: 2px dashed;  // Add/placeholder elements
```

### Border Radius
```scss
border-radius: 8px;   // Small (badges, pills)
border-radius: 10px;  // Medium (inputs, buttons)
border-radius: 12px;  // Large (cards, dropdowns)
border-radius: 16px;  // Extra large (main cards)
border-radius: 50px;  // Pill shape (user menu)
border-radius: 50%;   // Circle (avatars, icons)
```

### Border Pattern
```scss
// ✅ CORRECT - Card with border
.club-card {
  background: var(--background-primary, #ffffff);
  border: 1px solid var(--border-light, #e5e7eb);
  border-radius: 12px;
}

// ✅ CORRECT - Hover state
.club-card:hover {
  border-color: var(--ion-color-primary, #3880ff);
}
```

---

## Shadows & Effects

### Shadow Scale
```scss
// Subtle shadow (resting state)
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

// Light shadow (cards, dropdowns)
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

// Medium shadow (hover state)
box-shadow: 0 4px 16px rgba(56, 128, 255, 0.12);

// Ring/Focus shadow
box-shadow: 0 0 0 3px rgba(56, 128, 255, 0.1);

// Combined shadows
box-shadow: 0 2px 8px rgba(var(--button-primary-color-rgb, 56, 128, 255), 0.2);
```

### Shadow Usage
```scss
// ✅ CORRECT - Focus state
ion-input.ion-focused {
  --box-shadow: 0 0 0 3px rgba(56, 128, 255, 0.1);
}

// ✅ CORRECT - Dropdown
.user-dropdown {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

// ✅ CORRECT - Hover elevation
.club-card:hover {
  box-shadow: 0 4px 16px rgba(56, 128, 255, 0.12);
  transform: translateY(-2px);
}
```

### Backdrop Blur
```scss
backdrop-filter: blur(10px);  // Glass morphism effect
```

---

## Layout Patterns

### Flexbox Container
```scss
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
```

### CSS Grid
```scss
// ✅ CORRECT - Responsive grid
.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;
}

// Mobile override
@media (max-width: 768px) {
  .clubs-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

### Max Width Container
```scss
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}
```

### Sticky Header
```scss
.page-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--background-primary, #ffffff);
  border-bottom: 1px solid var(--border-light, #e5e7eb);
}
```

---

## Component Patterns

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
}
```

### Button Component
```scss
.btn-primary {
  --background: var(--button-primary-color, var(--ion-color-primary));
  --color: var(--button-primary-contrast, white);
  --border-radius: 10px;
  --box-shadow: 0 2px 8px rgba(var(--button-primary-color-rgb, 56, 128, 255), 0.2);
  --padding-top: 0.875rem;
  --padding-bottom: 0.875rem;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: all 0.2s ease;

  &:hover:not(.button-disabled) {
    --box-shadow: 0 4px 12px rgba(var(--button-primary-color-rgb, 56, 128, 255), 0.3);
    transform: translateY(-1px);
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
    --box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
  }
}
```

### Dropdown Component
```scss
.dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 260px;
  background: var(--background-primary, #ffffff);
  border: 1px solid var(--border-light, #e5e7eb);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  z-index: 1000;
  animation: slideDown 0.2s ease;
  overflow: hidden;

  .dropdown-item {
    padding: 0.875rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: var(--background-secondary, #f8f9fa);
    }
  }
}
```

### Badge Component
```scss
.badge {
  background: var(--background-secondary, #f8f9fa);
  border: 1px solid var(--border-light, #e5e7eb);
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  color: var(--text-secondary, #6b7280);
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}
```

---

## Animation Standards

### Transitions
```scss
transition: all 0.2s ease;      // Default (most elements)
transition: background 0.15s ease;  // Quick (hover states)
transition: transform 0.2s ease;    // Movement
transition: opacity 0.2s ease;      // Fade effects
```

### Keyframe Animations
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
```

### Animation Usage
```scss
.card {
  animation: fadeIn 0.3s ease backwards;

  // Staggered animation
  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.04}s;
    }
  }
}
```

### Hover Transforms
```scss
// Subtle lift
&:hover {
  transform: translateY(-2px);
}

// Button press
&:active {
  transform: translateY(0);
}

// Arrow movement
&:hover .arrow-icon {
  transform: translateX(4px);
}

// Icon rotation
&.menu-open .dropdown-icon {
  transform: rotate(180deg);
}
```

---

## Responsive Design

### Breakpoints
```scss
// Mobile first approach
@media (max-width: 768px) {
  // Mobile styles
}

@media (min-width: 769px) and (max-width: 1024px) {
  // Tablet styles
}

@media (min-width: 1025px) {
  // Desktop styles
}

@media (max-width: 968px) {
  // Auth page mobile breakpoint
}
```

### Responsive Pattern
```scss
// ✅ CORRECT - Mobile-first responsive
.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.page-header {
  padding: 1.5rem 2rem;

  h1 {
    font-size: 1.75rem;
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;

    h1 {
      font-size: 1.5rem;
    }
  }
}
```

---

## Complete Example

### Modern Card Component (Following All Standards)

```scss
.club-card {
  // Layout
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;

  // Colors (using variables)
  background: var(--background-primary, #ffffff);
  border: 1px solid var(--border-light, #e5e7eb);

  // Spacing
  border-radius: 12px;

  // Effects
  box-shadow: none;
  transition: all 0.2s ease;
  animation: fadeIn 0.3s ease backwards;

  // Hover state
  &:hover {
    border-color: var(--ion-color-primary, #3880ff);
    box-shadow: 0 4px 16px rgba(56, 128, 255, 0.12);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  // Nested elements
  .card-header {
    padding: 1.5rem;
    border-bottom: 1px solid var(--border-light, #e5e7eb);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    .card-title {
      color: var(--text-primary, #111827);
      font-size: 1.125rem;
      font-weight: 600;
      margin: 0;
      letter-spacing: -0.015em;
    }
  }

  .card-body {
    padding: 1.5rem;
    flex: 1;

    p {
      color: var(--text-secondary, #6b7280);
      font-size: 0.875rem;
      line-height: 1.5;
      margin: 0;
      font-weight: 400;
    }
  }

  .card-footer {
    padding: 1rem 1.5rem;
    background: var(--background-secondary, #f8f9fa);
    border-top: 1px solid var(--border-light, #e5e7eb);
  }

  // Responsive
  @media (max-width: 768px) {
    .card-header,
    .card-body {
      padding: 1.25rem;
    }
  }
}
```

---

## ✅ Checklist Before Committing

- [ ] All colors use CSS variables (no hardcoded colors)
- [ ] All spacing uses the 0.25rem scale
- [ ] Font sizes use rem units
- [ ] Border radius follows the standard scale (8px, 10px, 12px, 16px)
- [ ] Shadows follow the opacity scale (0.08, 0.12)
- [ ] Transitions are 0.2s ease or 0.15s ease
- [ ] Hover states include transform and shadow changes
- [ ] Focus states include ring shadow
- [ ] Responsive breakpoints at 768px and 968px
- [ ] Grid uses auto-fill with minmax
- [ ] Max-width container is 1400px
- [ ] All interactive elements have cursor: pointer
- [ ] All animations use backwards fill-mode
- [ ] Letter-spacing for headings and uppercase text

---

## 🚫 Common Mistakes to Avoid

```scss
// ❌ WRONG - Hardcoded colors
color: #111827;
background: white;
border-color: #e5e7eb;

// ✅ CORRECT - Use variables
color: var(--text-primary, #111827);
background: var(--background-primary, #ffffff);
border-color: var(--border-light, #e5e7eb);

// ❌ WRONG - Random spacing
padding: 17px;
margin: 23px;
gap: 19px;

// ✅ CORRECT - Scale-based spacing
padding: 1rem;     // 16px
margin: 1.5rem;    // 24px
gap: 1.25rem;      // 20px

// ❌ WRONG - Inconsistent borders
border-radius: 13px;
border: 3px solid;

// ✅ CORRECT - Standard scale
border-radius: 12px;
border: 1px solid;

// ❌ WRONG - Heavy shadows
box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);

// ✅ CORRECT - Subtle shadows
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

// ❌ WRONG - Slow transitions
transition: all 0.5s;

// ✅ CORRECT - Quick, smooth transitions
transition: all 0.2s ease;
```

---

## 📚 Quick Reference

### Most Used Variables
```scss
// Colors
var(--background-primary, #ffffff)
var(--background-secondary, #f8f9fa)
var(--text-primary, #111827)
var(--text-secondary, #6b7280)
var(--border-light, #e5e7eb)
var(--ion-color-primary, #3880ff)
var(--ion-color-danger, #eb445a)

// Spacing
padding: 1.5rem;
gap: 1.5rem;
margin: 0 0 0.5rem 0;

// Typography
font-size: 0.9375rem;
font-weight: 600;
line-height: 1.5;

// Borders
border: 1px solid var(--border-light);
border-radius: 12px;

// Shadows
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

// Transitions
transition: all 0.2s ease;
```

---

**Remember:** Consistency is key. When in doubt, look at existing auth pages (signin, signup) for reference patterns.
