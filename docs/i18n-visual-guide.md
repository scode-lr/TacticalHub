# Translation System - Visual Guide

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Translation Service                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  deepMerge(shared, project) → Final Translations       │ │
│  └────────────────────────────────────────────────────────┘ │
└───────────────┬──────────────────────────────┬──────────────┘
                │                              │
                ▼                              ▼
    ┌───────────────────────┐     ┌──────────────────────────┐
    │  Shared Translations  │     │ Project Translations     │
    │  (Common to all)      │     │ (Unique per project)     │
    ├───────────────────────┤     ├──────────────────────────┤
    │ • welcome.signIn      │     │ • app.name               │
    │ • auth.email          │     │ • app.tagline            │
    │ • common.loading      │     │ • [overrides if needed]  │
    │ • validation.required │     │                          │
    └───────────────────────┘     └──────────────────────────┘
             │                                 │
             │                                 │
    ┌────────┴─────────┐          ┌───────────┴────────────┐
    │                  │          │                        │
    ▼                  ▼          ▼                        ▼
src/app/core/      projects/   projects/              projects/
i18n/shared/    tactical.hub/ voltregacf.hub/    {new-project}/
en.ts           i18n/en.ts    i18n/en.ts         i18n/en.ts
```

## 📊 Merge Process

```
Step 1: Load Shared
┌────────────────────┐
│ welcome:           │
│   signIn: "Sign In"│
│ auth:              │
│   email: "Email"   │
│ common:            │
│   save: "Save"     │
└────────────────────┘

Step 2: Load Project (Tactical Hub)
┌────────────────────┐
│ app:               │
│   name: "Tactical" │
│   tagline: "..."   │
└────────────────────┘

Step 3: Deep Merge (shared + project)
┌────────────────────┐
│ welcome:           │ ← From shared
│   signIn: "Sign In"│
│ auth:              │ ← From shared
│   email: "Email"   │
│ common:            │ ← From shared
│   save: "Save"     │
│ app:               │ ← From project
│   name: "Tactical" │
│   tagline: "..."   │
└────────────────────┘
```

## 🔄 Override Example

### Voltrega CF wants custom "Join" button:

```typescript
// projects/voltregacf.hub/i18n/en.ts
export const translations = {
  app: {
    name: 'Voltrega CF Hub',
    tagline: 'Grow together'
  },
  welcome: {
    createAccount: 'Join Voltrega CF'  // 🎯 Override!
  }
} as const;
```

**Result after merge:**
```typescript
{
  welcome: {
    createAccount: 'Join Voltrega CF', // ✅ Project wins
    signIn: 'Sign In'                  // ✅ From shared
  },
  app: {
    name: 'Voltrega CF Hub',
    tagline: 'Grow together'
  },
  auth: { ... },  // All from shared
  common: { ... } // All from shared
}
```

## 📁 File Organization

```
projects/
├── shared/i18n/
│   └── en.ts              ← 🌍 Shared (100+ keys)
│       ├── welcome { }
│       ├── auth { }
│       ├── common { }
│       ├── validation { }
│       ├── viewer { }
│       └── roleSelection { }
│
├── tactical.hub/i18n/
│   └── en.ts              ← 📦 Tactical (2 keys)
│       └── app { name, tagline }
│
└── voltregacf.hub/i18n/
    └── en.ts              ← 📦 Voltrega (2-3 keys)
        ├── app { name, tagline }
        └── [optional overrides]
```

## 🎯 Key Benefits

1. **DRY Principle**: 100+ shared strings → defined once
2. **Flexibility**: Override anything when needed
3. **Consistency**: All projects use same button texts by default
4. **Easy Updates**: Change shared = all projects updated
5. **Customization**: Each project can be unique where it matters

## 🚀 Real-World Usage

**Component code (same for all projects):**
```typescript
t('welcome.signIn')        // Always works
t('app.name')              // Returns project-specific
t('common.loading')        // From shared
```

**What user sees:**
- Tactical Hub: "Sign In" + "Tactical Hub" + "Loading..."
- Voltrega CF: "Sign In" + "Voltrega CF Hub" + "Loading..."

Same code, different branding! 🎨
