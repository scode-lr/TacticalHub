export const sharedTranslations = {
  welcome: {
    createAccount: 'Create Account',
    signIn: 'Sign In',
    signUpTagline: 'Sign up to start managing your teams',
    terms: 'By continuing, you agree to our',
    termsOfService: 'Terms of Service',
    and: 'and',
    privacyPolicy: 'Privacy Policy'
  },
  auth: {
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    forgotPassword: 'Forgot Password?',
    signInButton: 'Sign In',
    signUpButton: 'Sign Up',
    signOut: 'Sign Out',
    or: 'or',
    continueWithGoogle: 'Continue with Google',
    continueWithApple: 'Continue with Apple',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    continueAsGuest: 'Continue as Guest'
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
    passwordMismatch: 'Passwords do not match',
    minLength6: 'Password must be at least 6 characters',
    firstNameRequired: 'First name is required',
    lastNameRequired: 'Last name is required',
    confirmPasswordRequired: 'Please confirm your password',
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email',
    passwordRequired: 'Password is required',
    passwordMinLength: 'Password must be at least 6 characters',
    checkInput: 'Please check your input',
    fillAllFields: 'Please fill in all required fields correctly'
  },
  messages: {
    accountCreatedSuccess: 'Account created successfully!',
    signUpError: 'An error occurred during sign up.',
    signInError: 'An error occurred',
    googleSignUpSuccess: 'Google sign-up successful!',
    appleSignUpSuccess: 'Apple sign-up successful!',
    googleSignUpFailed: 'Google sign-up failed',
    appleSignUpFailed: 'Apple sign-up failed',
    googleSignInSuccess: 'Google sign-in successful!',
    appleSignInSuccess: 'Apple sign-in successful!',
    googleSignInFailed: 'Google sign-in failed',
    appleSignInFailed: 'Apple sign-in failed'
  },
  loading: {
    signingIn: 'Signing you in...',
    pleaseWait: 'Please wait while we prepare everything',
    loadingProfile: 'Loading your profile...',
    preparingWorkspace: 'Preparing workspace...',
    allSet: 'All set!',
    redirecting: 'Redirecting...'
  },
  roleSelection: {
    welcome: 'Welcome Back',
    selectRole: 'Select Your Role',
    chooseClub: 'Choose a club to continue',
    noRolesYet: 'Start by adding your first club',
    defaultDescription: 'Manage your club activities',
    permissions: 'permissions',
    addNewClub: 'Add New Club',
    joinOrCreate: 'Join or create a new club',
    skipForNow: 'Skip for now',
    canAddLater: 'You can add clubs anytime from your profile'
  }
} as const;

export type SharedTranslationKeys = typeof sharedTranslations;

