// Shared Translations - English
// These translations are common across all projects
// Can be overridden by project-specific translations

export const sharedTranslations = {
  welcome: {
    createAccount: 'Create Account',
    signIn: 'Sign In',
    terms: 'By continuing, you agree to our',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy'
  },
  auth: {
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot Password?',
    signInButton: 'Sign In',
    signUpButton: 'Sign Up',
    or: 'or',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple'
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    close: 'Close'
  },
  validation: {
    required: 'This field is required',
    invalidEmail: 'Invalid email address',
    minLength: 'Minimum {min} characters required',
    maxLength: 'Maximum {max} characters allowed',
    passwordMismatch: 'Passwords do not match'
  }
} as const;

export type SharedTranslationKeys = typeof sharedTranslations;
