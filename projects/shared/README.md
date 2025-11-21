# Shared Resources

This folder contains shared resources used across all projects in the TacticalHub workspace.

## Structure

```
shared/
├── i18n/           # Shared translations
│   ├── en.ts       # English translations
│   ├── es.ts       # Spanish translations
│   ├── ca.ts       # Catalan translations
│   └── index.ts    # Export all translations
└── assets/         # Shared assets
    ├── image-non-available.svg
    └── shapes.svg
```

## Translations (i18n)

The shared translations include common strings used across all projects:

- **welcome**: Welcome page strings (createAccount, signIn, terms, etc.)
- **auth**: Authentication strings (email, password, forgotPassword, etc.)
- **common**: Common UI strings (loading, error, success, cancel, etc.)
- **validation**: Form validation messages (required, invalidEmail, etc.)

### Usage in Projects

Each project imports and extends the shared translations:

```typescript
import { sharedTranslationsEn } from '../../shared/i18n';

export const translations = {
  ...sharedTranslationsEn,
  app: {
    name: 'Project Name',
    tagline: 'Project tagline'
  }
} as const;
```

## Assets

Shared assets are automatically included in the build for all projects via `angular.json` configuration.

### Available Assets

- **image-non-available.svg**: Placeholder image for unavailable content
- **shapes.svg**: Decorative shapes used in UI

### Adding New Shared Assets

1. Add the asset file to `projects/shared/assets/`
2. The asset will be automatically available in all projects at `assets/[filename]`

## Projects Using Shared Resources

- **Tactical Hub** (`projects/tactical.hub`)
- **Voltrega CF Hub** (`projects/voltregacf.hub`)

## Notes

- Shared translations are merged with project-specific translations
- Project-specific translations take precedence over shared translations
- Assets in project-specific folders override shared assets with the same name
