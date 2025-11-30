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
  },
  viewer: {
    proposals: {
      title: 'Proposals',
      empty: 'No proposals yet',
      emptyDescription: 'Send a proposal to the admin to improve the platform.',
      form: {
        title: 'Title',
        titlePlaceholder: 'Enter proposal title',
        titleError: 'Title is required (min 5 chars)',
        body: 'Description',
        bodyPlaceholder: 'Describe your proposal in detail...',
        bodyError: 'Description is required (min 20 chars)',
        attachment: 'Attachment',
        changeFile: 'Change file',
        uploadText: 'Click to upload file',
        uploadSubtext: 'PDF, DOC, Images (max 5MB)',
        submit: 'Submit Proposal',
        fileTypeError: 'Invalid file type. Only PDF, DOC, Excel, and images are allowed',
        fileSizeError: 'File size exceeds 5MB limit'
      }
    }
  }
} as const;

export type SharedTranslationKeys = typeof sharedTranslations;
