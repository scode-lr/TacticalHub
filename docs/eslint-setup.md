# ESLint Configuration for TacticalHub

This project uses ESLint for code linting and quality assurance with Angular-specific rules.

## 📦 Installed Packages

- `eslint` - Core ESLint package
- `@angular-eslint/builder` - Angular ESLint integration
- `@angular-eslint/eslint-plugin` - Angular-specific ESLint rules
- `@angular-eslint/template-parser` - Angular template parser
- `@typescript-eslint/eslint-plugin` - TypeScript ESLint rules
- `@typescript-eslint/parser` - TypeScript parser for ESLint

## 🛠️ Available Scripts

```bash
# Run ESLint on all files
npm run lint

# Run ESLint and automatically fix issues
npm run lint:fix

# Check specific files with ESLint directly
npm run lint:check

# Fix all auto-fixable issues
npm run lint:fix-all
```

## ⚙️ Configuration

### Files
- `.eslintrc.json` - Main ESLint configuration
- `.eslintignore` - Files and directories to ignore

### Rules Enabled

**Angular Rules:**
- Component and directive selector validation
- Template best practices
- Component class suffix enforcement

**General Rules:**
- No console.log (warnings only, allows warn/error)
- No debugger statements
- Prefer const over let when possible
- Enforce single quotes
- Require semicolons
- Require newline at end of files
- No unused variables (via Angular ESLint)

### Rules Disabled
- `@angular-eslint/prefer-inject` - Too strict for migration
- `@angular-eslint/no-empty-lifecycle-method` - Allow empty lifecycle methods
- `@angular-eslint/template/use-track-by-function` - Optional performance optimization

## 🎯 Benefits

1. **Code Quality**: Catches common errors and enforces best practices
2. **Consistency**: Ensures consistent code style across the project
3. **Angular Best Practices**: Enforces Angular-specific coding standards
4. **Automatic Fixes**: Many issues can be auto-fixed with `--fix`
5. **IDE Integration**: Works with VS Code and other editors

## 🔧 IDE Integration

### VS Code
Install the ESLint extension for real-time linting:
```bash
code --install-extension dbaeumer.vscode-eslint
```

### Settings (optional)
Add to VS Code settings.json for auto-fix on save:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "html"
  ]
}
```

## 📋 Common Commands

```bash
# Check for linting issues
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Lint specific file
npx eslint src/app/example.ts

# Lint and fix specific file
npx eslint src/app/example.ts --fix
```

## 🚀 Integration with CI/CD

Add to your CI/CD pipeline:
```yaml
- name: Lint code
  run: npm run lint
```

This ensures code quality standards are maintained across all commits and pull requests.