# Translation System (i18n) - Hybrid Approach

## Overview
This translation system uses a **hybrid approach** combining shared and project-specific translations. It's designed to be easily migrated to an external translation service/API in the future while currently working with local translation files.

## Architecture

### **Shared Translations**
Common strings used across all projects (buttons, forms, validation, etc.)

### **Project-Specific Translations**
Unique strings per project (app name, tagline, custom messages)

### **Merge Strategy**
Final translations = `{ ...shared, ...project }` (project overrides shared)

## Structure

```
src/
├── app/core/
│   ├── services/i18n/
│   │   └── translation.service.ts  # Handles merging
│   └── i18n/shared/
│       ├── index.ts
│       └── en.ts                   # ✨ Shared translations
└── i18n/
    ├── index.ts
    └── en.ts                        # Default project-specific

projects/
├── tactical.hub/
│   ├── config.ts
│   └── i18n/
│       ├── index.ts
│       └── en.ts                    # Only app.name, app.tagline
└── voltregacf.hub/
    ├── config.ts
    └── i18n/
        ├── index.ts
        └── en.ts                    # Only app.name, app.tagline
```

## Usage

### In Components

```typescript
import { TranslationService } from '../../../core/services/i18n/translation.service';
import { environment } from '../../../../environments/environment';

export class MyComponent implements OnInit {
  constructor(private translationService: TranslationService) {}

  ngOnInit() {
    // Initialize translations
    this.translationService.setTranslations(environment.translations);
  }

  // Use in component
  getTranslation(key: string): string {
    return this.translationService.t(key);
  }
}
```

### In Templates

```html
<h1>{{ t('app.name') }}</h1>
<p>{{ t('app.tagline') }}</p>
<button>{{ t('welcome.signIn') }}</button>
```

## Translation Files

### **Shared Translations** (`src/app/core/i18n/shared/en.ts`)

Contains common strings used across ALL projects:

```typescript
export const sharedTranslations = {
  welcome: {
    createAccount: 'Create Account',
    signIn: 'Sign In',
    // ... other common welcome strings
  },
  auth: {
    email: 'Email',
    password: 'Password',
    // ... common auth strings
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    // ... common UI strings
  },
  validation: {
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    // ... common validation messages
  }
} as const;
```

### **Project-Specific Translations** (`projects/{project}/i18n/en.ts`)

Contains ONLY unique strings for that project:

```typescript
// Tactical Hub
export const translations = {
  app: {
    name: 'Tactical Hub',
    tagline: 'Manage your football teams and strategies with ease'
  }
  // Can override shared translations:
  // welcome: {
  //   signIn: 'Custom Sign In'  // Overrides shared
  // }
} as const;
```

```typescript
// Voltrega CF Hub
export const translations = {
  app: {
    name: 'Voltrega CF Hub',
    tagline: 'Grow together'
  }
  // Can override shared translations:
  // welcome: {
  //   createAccount: 'Join Voltrega'  // Overrides shared
  // }
} as const;
```

## How It Works

1. **Shared translations** are loaded automatically by the service
2. **Project translations** are passed via environment
3. **Service merges** them: `{ ...shared, ...project }`
4. **Project wins** if there's a conflict

Example:
```typescript
// Shared has: welcome.signIn = 'Sign In'
// Project has: welcome.signIn = 'Login'
// Result: welcome.signIn = 'Login' ✅
```

## Adding New Translations

### 1. **Adding to Shared** (if common across projects)

Edit `src/app/core/i18n/shared/en.ts`:

```typescript
export const sharedTranslations = {
  // ... existing
  teams: {
    createTeam: 'Create Team',
    editTeam: 'Edit Team',
    deleteTeam: 'Delete Team'
  }
} as const;
```

All projects get these automatically! ✅

### 2. **Adding to Project-Specific** (if unique)

Edit `projects/tactical.hub/i18n/en.ts`:

```typescript
export const translations = {
  app: {
    name: 'Tactical Hub',
    tagline: 'Manage your football teams and strategies with ease'
  },
  // Add new unique keys
  tactics: {
    customFeature: 'This is unique to Tactical Hub'
  }
} as const;
```

### 3. **Overriding Shared** (customize per project)

Edit `projects/voltregacf.hub/i18n/en.ts`:

```typescript
export const translations = {
  app: {
    name: 'Voltrega CF Hub',
    tagline: 'Grow together'
  },
  // Override shared translation
  welcome: {
    createAccount: 'Join Voltrega CF'  // Overrides shared 'Create Account'
  }
} as const;
```

## Adding New Languages

Currently, the system uses English (`en.ts`) by default. To add new languages:

### 1. Create language file

Create `projects/{project-name}/i18n/es.ts` (for Spanish):

```typescript
export const translations = {
  app: {
    name: 'Mi Aplicación',
    tagline: 'Mi eslogan'
  }
  // ... translate all keys
} as const;
```

### 2. Update index.ts

Modify `projects/{project-name}/i18n/index.ts` to dynamically load:

```typescript
// Future implementation
const currentLanguage = 'es'; // Get from user preference
export { translations } from `./${currentLanguage}`;
```

## Migration to External Translation Service

The system is designed for easy migration. Here's how:

### 1. Update TranslationService

Replace `setTranslations()` with API calls:

```typescript
private async loadTranslations(language: string): Promise<void> {
  const response = await fetch(`${API_URL}/translations/${language}`);
  this.translations = await response.json();
}
```

### 2. Add caching

```typescript
private translationCache = new Map<string, any>();

async loadTranslations(lang: string): Promise<void> {
  if (this.translationCache.has(lang)) {
    this.translations = this.translationCache.get(lang);
    return;
  }
  
  const data = await this.fetchFromAPI(lang);
  this.translationCache.set(lang, data);
  this.translations = data;
}
```

### 3. Update initialization

Instead of loading from environment, fetch from API:

```typescript
ngOnInit() {
  await this.translationService.loadLanguage('en');
}
```

### 4. Keep the same interface

The `t(key)` method stays the same, so components don't need changes!

## Benefits

✅ **Best of Both Worlds**: Shared common strings + project-specific customization
✅ **No Duplication**: Common strings defined once
✅ **Override Capable**: Projects can customize any shared string
✅ **Easy to maintain**: Add to shared = all projects benefit
✅ **Type-safe**: TypeScript const assertions for autocomplete
✅ **Migration ready**: Designed to switch to API without code changes
✅ **Scalable**: Add new projects easily

## When to Use What?

### Use **Shared Translations** for:
- Button labels (Save, Cancel, Delete, Edit)
- Form labels (Email, Password, Name)
- Validation messages (Required, Invalid email)
- Common actions (Loading, Success, Error)
- Generic UI text

### Use **Project Translations** for:
- App name and tagline
- Project-specific features
- Custom terminology
- Brand-specific messages
- Overriding shared strings for customization

## Current Projects

- **Tactical Hub**: "Manage your football teams and strategies with ease"
- **Voltrega CF Hub**: "Grow together"

Each project has its own translations while sharing the same structure and service.
