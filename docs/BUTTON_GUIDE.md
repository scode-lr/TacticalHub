# Unified Button System

This guide explains how to use the unified button styles across the TacticalHub application.

## Overview

All button styles are defined in `src/app/styles/_buttons.scss` and automatically imported via `global.scss`. This ensures consistent button styling throughout the entire application.

## Button Classes

### Primary Button (`.btn-primary`)
The main call-to-action button with primary brand color.

```html
<ion-button expand="block" class="btn-primary">
  Primary Action
</ion-button>
```

**Styling:**
- Background: Primary color (`#3880ff`)
- Text: White
- Shadow: Subtle elevation
- Hover: Lifts up with stronger shadow

---

### Secondary Button (`.btn-secondary`)
Secondary actions with a subtle gray background.

```html
<ion-button expand="block" class="btn-secondary">
  Secondary Action
</ion-button>
```

**Styling:**
- Background: Light gray (`#f8f9fa`)
- Text: Dark (`#111827`)
- Border: Light border
- Hover: Changes to white with primary border

---

### Outline Button (`.btn-outline`)
Outlined button for tertiary actions.

```html
<ion-button expand="block" class="btn-outline">
  Outline Action
</ion-button>
```

**Styling:**
- Background: Transparent
- Border: Primary color
- Text: Primary color
- Hover: Fills with primary color

---

### Danger Button (`.btn-danger`)
For destructive or critical actions.

```html
<ion-button expand="block" class="btn-danger">
  Delete
</ion-button>
```

**Styling:**
- Background: Danger color (`#eb445a`)
- Text: White
- Shadow: Red-tinted elevation

---

### Success Button (`.btn-success`)
For successful or positive actions.

```html
<ion-button expand="block" class="btn-success">
  Confirm
</ion-button>
```

**Styling:**
- Background: Success color (`#10b981`)
- Text: White
- Shadow: Green-tinted elevation

---

### Text Button (`.btn-text`)
Minimal button with no background, for subtle actions.

```html
<ion-button fill="clear" class="btn-text">
  Skip for now
</ion-button>
```

**Styling:**
- Background: Transparent
- Text: Secondary gray
- Hover: Changes to primary color and scales slightly

---

## Size Modifiers

### Large Button (`.btn-large`)
Bigger padding for prominent actions.

```html
<ion-button expand="block" class="btn-primary btn-large">
  Large Primary
</ion-button>
```

**Sizing:**
- Padding: `1rem` top/bottom
- Border radius: `12px`
- Font size: `1rem`

---

### Small Button (`.btn-small`)
Compact button for tight spaces.

```html
<ion-button class="btn-primary btn-small">
  Small
</ion-button>
```

**Sizing:**
- Padding: `0.625rem` top/bottom
- Border radius: `8px`
- Font size: `0.875rem`

---

## Icon Buttons

### Standard Icon Button (`.btn-icon`)
Button with icon, rectangular shape.

```html
<ion-button class="btn-primary btn-icon">
  <ion-icon name="add"></ion-icon>
</ion-button>
```

---

### Round Icon Button (`.btn-icon-round`)
Circular icon button.

```html
<ion-button class="btn-primary btn-icon-round">
  <ion-icon name="close"></ion-icon>
</ion-button>
```

**Sizing:**
- Width: `44px`
- Height: `44px`
- Border radius: `50%` (circle)

---

## Disabled State

All button classes automatically handle disabled states. Simply add the `disabled` attribute:

```html
<ion-button expand="block" class="btn-primary" [disabled]="true">
  Disabled Button
</ion-button>
```

**Disabled Styling:**
- Background: Light gray
- Text: Light gray
- No hover effects
- No shadow

---

## Combining Classes

You can combine style classes with size modifiers:

```html
<!-- Large primary button -->
<ion-button expand="block" class="btn-primary btn-large">
  Submit
</ion-button>

<!-- Small secondary button -->
<ion-button class="btn-secondary btn-small">
  Cancel
</ion-button>

<!-- Large outline button -->
<ion-button expand="block" class="btn-outline btn-large">
  Learn More
</ion-button>
```

---

## Common Patterns

### Form Submit Buttons
```html
<ion-button 
  expand="block" 
  class="btn-primary"
  [disabled]="!form.valid || isSubmitting()">
  @if (isSubmitting()) {
    <ion-spinner></ion-spinner>
    <span>Submitting...</span>
  } @else {
    <span>Submit</span>
  }
</ion-button>
```

### Button with Icon
```html
<ion-button expand="block" class="btn-primary">
  <ion-icon name="add" slot="start"></ion-icon>
  Create New
</ion-button>
```

### Button Group
```html
<div class="button-group">
  <ion-button expand="block" class="btn-primary">
    Confirm
  </ion-button>
  <ion-button expand="block" class="btn-secondary">
    Cancel
  </ion-button>
</div>
```

---

## Migration Guide

### Before (Custom Styles)
```scss
.my-button {
  --background: #3880ff;
  --color: white;
  --border-radius: 10px;
  --padding-top: 0.875rem;
  --padding-bottom: 0.875rem;
  font-weight: 600;
  // ... more custom styles
}
```

### After (Unified System)
```html
<ion-button expand="block" class="btn-primary">
  My Button
</ion-button>
```

Or if you need custom extensions:
```scss
.my-button {
  @extend .btn-primary;
  // Add only your specific customizations
  margin-top: 1rem;
}
```

---

## Design Tokens

All buttons use these CSS variables from the design system:

- `--ion-color-primary` - Primary brand color
- `--ion-color-danger` - Error/destructive actions
- `--ion-color-success` - Success/positive actions
- `--background-primary` - Main background
- `--background-secondary` - Secondary background
- `--text-primary` - Main text color
- `--text-secondary` - Secondary text color
- `--text-light` - Light/disabled text
- `--border-light` - Border color

---

## Best Practices

1. **Use semantic classes**: Choose button types based on their purpose (primary for main actions, secondary for alternatives, danger for destructive actions)

2. **Maintain hierarchy**: Use only one primary button per view/section to establish clear visual hierarchy

3. **Consistent sizing**: Use `.btn-large` for main CTAs, default size for standard actions, and `.btn-small` for tertiary actions

4. **Disabled feedback**: Always provide visual feedback when actions are unavailable

5. **Loading states**: Show spinners for async operations to provide user feedback

---

## Examples in the Codebase

- **Auth pages**: `src/app/pages/auth/signin`, `src/app/pages/auth/signup`, `src/app/pages/auth/welcome`
- **Join team**: `src/app/pages/teams/join/join-team.page.scss`
- **Role selection**: `src/app/pages/teams/selection/selection.page.scss`

---

## Support

For questions or to suggest improvements to the button system, please refer to the style guide in `docs/STYLE_GUIDE.md`.
