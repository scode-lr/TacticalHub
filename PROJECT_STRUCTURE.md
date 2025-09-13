# TacticalHub - Project Structure

This document outlines the reorganized project structure for better maintainability and scalability.

## Directory Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── team-card/       # Team card component
│   │   └── index.ts         # Component exports
│   │
│   ├── core/                # Core functionality
│   │   ├── modules/         # Shared Angular modules
│   │   │   ├── components.module.ts
│   │   │   ├── forms.module.ts
│   │   │   ├── ionic.module.ts
│   │   │   ├── shared.module.ts
│   │   │   └── index.ts
│   │   ├── services/        # Application services
│   │   │   ├── auth.service.ts
│   │   │   ├── teams.service.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── pages/               # Application pages
│   │   ├── auth/            # Authentication pages
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── home/            # Home page
│   │   └── teams-search/    # Teams search page
│   │
│   ├── app.component.*      # Root app component
│   └── app.routes.ts        # Application routing
│
├── assets/                  # Static assets
├── environments/            # Environment configurations
├── theme/                   # Global theme files
├── global.scss             # Global styles
├── index.html              # Main HTML file
└── main.ts                 # Application bootstrap
```

## Architecture Principles

### 1. **Pages Directory** (`src/app/pages/`)
- Contains all application pages/routes
- Each page has its own directory with component files
- Organized by feature/module (auth, home, teams-search)

### 2. **Components Directory** (`src/app/components/`)
- Houses reusable UI components
- Components should be feature-independent
- Each component has its own directory
- Exported through index.ts for clean imports

### 3. **Core Directory** (`src/app/core/`)
- Contains application-wide functionality
- **Services**: Business logic and data services
- **Modules**: Shared Angular modules for common imports
- Typically imported once in the application

### 4. **Import Strategy**
```typescript
// Pages import from core
import { TacticalSharedModule } from '../../core/modules';

// Components import from core
import { TacticalSharedModule } from '../../core/modules';

// Services are imported from core/services
import { AuthService } from '../../core/services';
```

## Benefits of This Structure

1. **Scalability**: Easy to add new pages, components, and services
2. **Maintainability**: Clear separation of concerns
3. **Reusability**: Components are easily shareable across pages
4. **Developer Experience**: Predictable file locations
5. **Team Collaboration**: Consistent structure across the project

## File Naming Conventions

- **Pages**: `page-name.page.ts|html|scss`
- **Components**: `component-name.component.ts|html|scss`
- **Services**: `service-name.service.ts`
- **Modules**: `module-name.module.ts`

## Migration Notes

- All import paths have been updated to reflect the new structure
- Routing configuration updated with new page paths
- Shared modules reorganized under core/modules
- Services moved to core/services for better organization

## Usage Examples

### Importing Shared Modules
```typescript
import { TacticalSharedModule } from '../../core/modules';
```

### Using Components
```typescript
import type { Team } from '../../components';
```

### Accessing Services
```typescript
import { AuthService, TeamsService } from '../../core/services';
```

This structure follows Angular best practices and provides a solid foundation for future development.