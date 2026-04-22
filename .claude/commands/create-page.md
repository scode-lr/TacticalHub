---
name: create-page
description: Creates a new page in TacticalHub for a given role section (admin, viewer, coach, etc.). Provide page name, role, and optionally whether it's a detail page.
---

# Create Page — Step-by-step Guide

Use this guide whenever a new page needs to be added to a role section (admin, viewer, coach, etc.).

---

## 1. Create the page files

Create three files under `src/app/pages/<page-name>/`:

**`<page-name>.page.ts`**
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@core/pipes/translate.pipe';

@Component({
  selector: 'app-<page-name>',
  templateUrl: './<page-name>.page.html',
  styleUrls: ['./<page-name>.page.scss'],
  standalone: true,
  imports: [CommonModule, TranslatePipe]
})
export class <PageName>Page {}
```

**`<page-name>.page.html`**
```html
<div class="page-container">
  <div class="section-header">
    <h1 class="section-title">{{ '<role>.menu.<pageName>' | translate }}</h1>
  </div>
</div>
```

**`<page-name>.page.scss`**
```scss
.<page-name>-page {
}
```

---

## 2. Register the route

Open `src/app/pages/<role>/<role>.routes.ts` and add a lazy-loaded entry inside the `children` array:

```typescript
{
  path: '<page-name>',
  loadComponent: () => import('../<page-name>/<page-name>.page').then(m => m.<PageName>Page)
}
```

---

## 3. Add to the role menu

Open `src/app/pages/<role>/<role>.page.ts` and add an entry to the `items` array of the menu config:

```typescript
{ id: '<page-name>', label: '<role>.menu.<pageName>', icon: '<ion-icon-name>', route: '<page-name>' }
```

Pick an appropriate Ionicons icon name (e.g. `document-text-outline`, `settings-outline`, `people-outline`).

---

## 4. Add translations

In all three language files under `projects/shared/i18n/` (`en.ts`, `es.ts`, `ca.ts`), add the key to both the `menu` and `description` sections inside the role object:

**`en.ts`**
```typescript
menu: {
  // ...existing keys
  <pageName>: '<English label>'
},
description: {
  // ...existing keys
  <pageName>: '<English description>'
}
```

**`es.ts`**
```typescript
menu: {
  // ...existing keys
  <pageName>: '<Spanish label>'
},
description: {
  // ...existing keys
  <pageName>: '<Spanish description>'
}
```

**`ca.ts`**
```typescript
menu: {
  // ...existing keys
  <pageName>: '<Catalan label>'
},
description: {
  // ...existing keys
  <pageName>: '<Catalan description>'
}
```

---

## Page header patterns

There are two header patterns depending on whether the page has a back button.

### Standard page (no back button)

```html
<div class="page-container">
  <div class="section-header">
    <div class="header-content">
      <h1 class="section-title">{{ '<role>.menu.<pageName>' | translate }}</h1>
      <p class="section-subtitle">{{ '<role>.description.<pageName>' | translate }}</p>
    </div>
  </div>
</div>
```

### Detail page (with back button)

Use `section-header-with-back-button` and place `<app-back-button />` directly inside — no `header-content` wrapper.

```html
<div class="page-container">
  <div class="section-header-with-back-button">
    <app-back-button />
    <h1 class="section-title">{{ '<role>.menu.<pageName>' | translate }}</h1>
  </div>
</div>
```

**Component import:**
```typescript
import { BackButtonComponent } from '@components/back-button/back-button.component';

@Component({
  // ...
  imports: [CommonModule, TranslatePipe, BackButtonComponent]
})
```

> The `BackButtonComponent` is automatically hidden on mobile (≤ 768px) — no extra CSS needed.
> Detail pages do **not** add a menu item in `<role>.page.ts`.

---

## Checklist

- [ ] `src/app/pages/<page-name>/<page-name>.page.ts` created
- [ ] `src/app/pages/<page-name>/<page-name>.page.html` created with `page-container` + `section-header`
- [ ] `src/app/pages/<page-name>/<page-name>.page.scss` created
- [ ] Route added to `<role>.routes.ts`
- [ ] Menu item added to `<role>.page.ts`
- [ ] Translation keys added to `en.ts`, `es.ts`, `ca.ts` (both `menu` and `description`)

---

## Conventions

- No `IonContent` wrapper — use a plain `<div class="page-container">` matching the parameters page pattern.
- No constructor injection — use `inject()`.
- No `*ngIf` / `*ngFor` — use `@if` / `@for`.
- No hardcoded colors — always use CSS variables.
- No comments in code.
- Use `TranslatePipe` in templates, never call the translation service directly from the component.
- Navigation via `NavigationService`, never inject `Router` directly.
