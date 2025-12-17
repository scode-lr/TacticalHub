# Action System - Viewer Module

## Overview
This is a **scalable, configuration-based action system** for the Viewer module. Action cards are selectable, and forms are dynamically generated based on configuration.

## Architecture

### 1. Action Configuration (`action.config.ts`)
Central configuration file that defines all available actions and their form fields.

```typescript
export type ActionType = 'register-player' | 'become-member';

export interface ActionConfig {
  type: ActionType;
  title: string;
  description: string;
  icon: string;
  fields: FormField[];
  submitButtonLabel: string;
  successMessage: string;
}
```

### 2. Dynamic Form Component (`dynamic-form.component`)
**Reusable component** for rendering dynamic forms based on field configuration.

**Props:**
- `fields` - Array of form field configurations
- `submitLabel` - Translation key for submit button
- `cancelLabel` - Translation key for cancel button
- `isSubmitting` - Loading state

**Events:**
- `formSubmit` - Emits form data on submission
- `formCancel` - Emits on cancel

**Features:**
- ✅ Dynamic form generation from configuration
- ✅ Field validation (required, email, pattern, min/max length)
- ✅ Real-time validation feedback
- ✅ Error messages with translations
- ✅ Reusable across the entire app

### 3. Action Cards Page (`action.page`)
Displays selectable action cards. Clicking a card navigates to the form page with the action type.

**Features:**
- ✅ Selectable cards (no buttons)
- ✅ Hover states with transform animations
- ✅ Staggered fade-in animations
- ✅ Responsive grid layout
- ✅ Correct navigation with roleId

### 4. Action Form Page (`action-form.page`)
Page that uses the dynamic form component to render action-specific forms.

**Features:**
- ✅ Uses reusable dynamic form component
- ✅ Loading state during submission
- ✅ Success/error toast notifications
- ✅ Responsive layout
- ✅ Correct navigation paths with roleId

## Adding New Actions

To add a new action type:

### Step 1: Add Action Type
```typescript
// action.config.ts
export type ActionType = 'register-player' | 'become-member' | 'your-new-action';
```

### Step 2: Add Configuration
```typescript
// action.config.ts
export const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
  // ... existing configs
  'your-new-action': {
    type: 'your-new-action',
    title: 'viewer.action.yourNewAction',
    description: 'viewer.action.yourNewActionDesc',
    icon: 'add-outline',
    submitButtonLabel: 'viewer.action.form.submit',
    successMessage: 'viewer.action.form.yourNewActionSuccess',
    fields: [
      {
        name: 'fieldName',
        label: 'viewer.action.form.fieldLabel',
        type: 'text',
        required: true,
        placeholder: 'viewer.action.form.fieldPlaceholder'
      }
      // Add more fields as needed
    ]
  }
};
```

### Step 3: Add Card to Action Page
```typescript
// action.page.ts
readonly actions: ActionCard[] = [
  // ... existing actions
  {
    type: 'your-new-action',
    icon: 'add-outline',
    title: 'viewer.action.yourNewAction',
    description: 'viewer.action.yourNewActionDesc'
  }
];
```

### Step 4: Add Translations
```typescript
// projects/shared/i18n/en.ts
action: {
  yourNewAction: 'Your New Action',
  yourNewActionDesc: 'Description of your new action',
  form: {
    fieldLabel: 'Field Label',
    fieldPlaceholder: 'Enter field value',
    yourNewActionSuccess: 'Action completed successfully!'
  }
}
```

Repeat for all supported languages (es.ts, ca.ts).

## Field Types

Supported field types:
- `text` - Text input
- `email` - Email input with validation
- `tel` - Phone number input
- `date` - Date picker
- `number` - Number input
- `select` - Dropdown with options
- `textarea` - Multi-line text area

## Validation

Supported validators:
- `required` - Field is required
- `minLength` - Minimum character length
- `maxLength` - Maximum character length
- `pattern` - RegEx pattern validation
- `email` - Email format validation

## Example: Register Player Action

```typescript
'register-player': {
  type: 'register-player',
  title: 'viewer.action.registerPlayer',
  description: 'viewer.action.registerPlayerDesc',
  icon: 'person-add-outline',
  submitButtonLabel: 'viewer.action.form.submit',
  successMessage: 'viewer.action.form.registerPlayerSuccess',
  fields: [
    {
      name: 'firstName',
      label: 'viewer.action.form.firstName',
      type: 'text',
      required: true,
      placeholder: 'viewer.action.form.firstNamePlaceholder',
      minLength: 2,
      maxLength: 50
    },
    {
      name: 'position',
      label: 'viewer.action.form.position',
      type: 'select',
      required: true,
      placeholder: 'viewer.action.form.positionPlaceholder',
      options: [
        { value: 'goalkeeper', label: 'viewer.action.form.positions.goalkeeper' },
        { value: 'defender', label: 'viewer.action.form.positions.defender' }
      ]
    }
  ]
}
```

## File Structure

```
src/app/
├── components/
│   └── dynamic-form/              # Reusable dynamic form component
│       ├── dynamic-form.component.ts
│       ├── dynamic-form.component.html
│       └── dynamic-form.component.scss
└── pages/viewer/
    ├── action/
    │   ├── action.config.ts       # Action configuration
    │   ├── action.page.ts         # Action cards page
    │   ├── action.page.html
    │   └── action.page.scss
    └── action-form/
        ├── action-form.page.ts    # Form page (uses dynamic-form component)
        ├── action-form.page.html
        └── action-form.page.scss
```

## Routing

Navigation uses the `/app/:roleId/` pattern:

```typescript
{
  path: 'app',
  children: [{
    path: ':roleId',
    children: [
      {
        path: 'action',
        loadComponent: () => import('./pages/viewer/action/action.page')
      },
      {
        path: 'action-form/:type',
        loadComponent: () => import('./pages/viewer/action-form/action-form.page')
      }
    ]
  }]
}
```

**Navigation Example:**
```typescript
// Get roleId from current route
const roleId = this.router.url.split('/')[2];

// Navigate to form
this.navigationService.navigateTo(['/app', roleId, 'action-form', actionType]);

// Navigate back
this.navigationService.navigateTo(['/app', roleId, 'action']);
```

## Design System Compliance

✅ All colors use CSS variables  
✅ Spacing uses 0.25rem scale  
✅ Font sizes use rem units  
✅ Border radius: 8px, 10px, 12px  
✅ Subtle shadows (0.08-0.12 opacity)  
✅ Quick transitions (0.2s ease)  
✅ Hover states with transform  
✅ Focus states with ring shadow  
✅ Mobile responsive (768px breakpoint)

## Future Enhancements

- [ ] Backend integration for form submission
- [ ] File upload field type
- [ ] Multi-step forms
- [ ] Conditional field visibility
- [ ] Custom validators
- [ ] Draft saving (localStorage)
- [ ] Form analytics

## Using Dynamic Form Component Elsewhere

The `DynamicFormComponent` is fully reusable! Use it anywhere in the app:

```typescript
import { DynamicFormComponent } from '@components/dynamic-form/dynamic-form.component';

// In your component
@Component({
  imports: [DynamicFormComponent]
})
export class MyComponent {
  fields: FormField[] = [
    {
      name: 'username',
      label: 'form.username',
      type: 'text',
      required: true
    }
  ];

  onSubmit(data: any): void {
    console.log('Form data:', data);
  }
}
```

```html
<app-dynamic-form
  [fields]="fields"
  [submitLabel]="'form.submit'"
  [cancelLabel]="'form.cancel'"
  [isSubmitting]="isLoading"
  (formSubmit)="onSubmit($event)"
  (formCancel)="onCancel()">
</app-dynamic-form>
```
