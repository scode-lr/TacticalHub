export type ActionType = 'register-player' | 'become-member';

export type FieldType = 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'number';

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  errorMessage?: string;
}

export interface ActionConfig {
  type: ActionType;
  title: string;
  description: string;
  icon: string;
  fields: FormField[];
  submitButtonLabel: string;
  successMessage: string;
}

export const ACTION_CONFIG: Record<ActionType, ActionConfig> = {
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
        name: 'lastName',
        label: 'viewer.action.form.lastName',
        type: 'text',
        required: true,
        placeholder: 'viewer.action.form.lastNamePlaceholder',
        minLength: 2,
        maxLength: 50
      },
      {
        name: 'dateOfBirth',
        label: 'viewer.action.form.dateOfBirth',
        type: 'date',
        required: true,
        placeholder: 'viewer.action.form.dateOfBirthPlaceholder'
      },
      {
        name: 'email',
        label: 'viewer.action.form.email',
        type: 'email',
        required: true,
        placeholder: 'viewer.action.form.emailPlaceholder',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        errorMessage: 'viewer.action.form.emailError'
      },
      {
        name: 'phone',
        label: 'viewer.action.form.phone',
        type: 'tel',
        required: true,
        placeholder: 'viewer.action.form.phonePlaceholder',
        pattern: '^[+]?[0-9]{9,15}$',
        errorMessage: 'viewer.action.form.phoneError'
      },
      {
        name: 'previousClub',
        label: 'viewer.action.form.previousClub',
        type: 'text',
        required: false,
        placeholder: 'viewer.action.form.previousClubPlaceholder',
        maxLength: 100
      },
      {
        name: 'position',
        label: 'viewer.action.form.position',
        type: 'select',
        required: true,
        placeholder: 'viewer.action.form.positionPlaceholder',
        options: [
          { value: 'goalkeeper', label: 'viewer.action.form.positions.goalkeeper' },
          { value: 'defender', label: 'viewer.action.form.positions.defender' },
          { value: 'midfielder', label: 'viewer.action.form.positions.midfielder' },
          { value: 'forward', label: 'viewer.action.form.positions.forward' }
        ]
      },
      {
        name: 'notes',
        label: 'viewer.action.form.notes',
        type: 'textarea',
        required: false,
        placeholder: 'viewer.action.form.notesPlaceholder',
        maxLength: 500
      }
    ]
  },
  'become-member': {
    type: 'become-member',
    title: 'viewer.action.becomeMember',
    description: 'viewer.action.becomeMemberDesc',
    icon: 'card-outline',
    submitButtonLabel: 'viewer.action.form.submit',
    successMessage: 'viewer.action.form.becomeMemberSuccess',
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
        name: 'lastName',
        label: 'viewer.action.form.lastName',
        type: 'text',
        required: true,
        placeholder: 'viewer.action.form.lastNamePlaceholder',
        minLength: 2,
        maxLength: 50
      },
      {
        name: 'dateOfBirth',
        label: 'viewer.action.form.dateOfBirth',
        type: 'date',
        required: true,
        placeholder: 'viewer.action.form.dateOfBirthPlaceholder'
      },
      {
        name: 'email',
        label: 'viewer.action.form.email',
        type: 'email',
        required: true,
        placeholder: 'viewer.action.form.emailPlaceholder',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        errorMessage: 'viewer.action.form.emailError'
      },
      {
        name: 'phone',
        label: 'viewer.action.form.phone',
        type: 'tel',
        required: true,
        placeholder: 'viewer.action.form.phonePlaceholder',
        pattern: '^[+]?[0-9]{9,15}$',
        errorMessage: 'viewer.action.form.phoneError'
      },
      {
        name: 'address',
        label: 'viewer.action.form.address',
        type: 'text',
        required: true,
        placeholder: 'viewer.action.form.addressPlaceholder',
        maxLength: 200
      },
      {
        name: 'city',
        label: 'viewer.action.form.city',
        type: 'text',
        required: true,
        placeholder: 'viewer.action.form.cityPlaceholder',
        maxLength: 100
      },
      {
        name: 'postalCode',
        label: 'viewer.action.form.postalCode',
        type: 'text',
        required: true,
        placeholder: 'viewer.action.form.postalCodePlaceholder',
        pattern: '^[0-9]{5}$',
        errorMessage: 'viewer.action.form.postalCodeError'
      },
      {
        name: 'membershipType',
        label: 'viewer.action.form.membershipType',
        type: 'select',
        required: true,
        placeholder: 'viewer.action.form.membershipTypePlaceholder',
        options: [
          { value: 'basic', label: 'viewer.action.form.membershipTypes.basic' },
          { value: 'premium', label: 'viewer.action.form.membershipTypes.premium' },
          { value: 'family', label: 'viewer.action.form.membershipTypes.family' }
        ]
      },
      {
        name: 'comments',
        label: 'viewer.action.form.comments',
        type: 'textarea',
        required: false,
        placeholder: 'viewer.action.form.commentsPlaceholder',
        maxLength: 500
      }
    ]
  }
};
