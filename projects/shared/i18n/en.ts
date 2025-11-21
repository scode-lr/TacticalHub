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
    close: 'Close',
    submitting: 'Submitting...'
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
    canAddLater: 'You can add clubs anytime from your profile',
    pending: 'Pending',
    pendingRequests: 'Pending Requests',
    pendingDescription: 'These requests are awaiting approval from the team administrator'
  },
  joinTeam: {
    title: 'Join a Team',
    subtitle: 'Enter the team code and select your role to join',
    subtitlePrivate: 'Select your role to join the team',
    enterCode: 'Enter Team Code',
    codeDescription: 'Enter the 5-digit code provided by the team administrator',
    selectRole: 'Select Your Role',
    roleDescription: 'Choose how you want to participate in this team',
    coachDescription: 'Create and manage team activities, training sessions, and matches',
    viewerDescription: 'View team information, schedules, and match results',
    submitRequest: 'Submit Join Request',
    joinInstant: 'Join Team Instantly',
    joiningInstant: 'Joining...',
    teamFound: 'Team Found!',
    confirmMatch: 'Select your role below to continue joining this team',
    tryDifferentCode: 'Try Different Code',
    selectTeam: 'Select Team',
    teamDescription: 'Choose which team you want to coach',
    category: 'Category'
  },
  roles: {
    coach: 'Coach',
    viewer: 'Viewer'
  },
  viewer: {
    title: 'Viewer Portal',
    subtitle: 'Access club information and services',
    menu: {
      home: 'Home',
      news: 'News',
      action: 'Actions',
      information: 'Information',
      proposals: 'Proposals & Complaints',
      matches: 'Weekend Matches',
      partners: 'Partners',
      more: 'More'
    },
    description: {
      home: 'Welcome to your club portal',
      news: 'Latest updates and announcements',
      action: 'Register players or become a member',
      information: 'Club information and resources',
      proposals: 'Submit proposals or complaints',
      matches: 'View upcoming weekend matches',
      partners: 'Our club partners and sponsors'
    },
    home: {
      welcome: 'Welcome to the Club!',
      description: 'Here you can access all club services and stay updated with the latest news and events.'
    },
    news: {
      empty: 'No News Available',
      emptyDescription: 'There are no news articles at this time. Check back later for updates.'
    },
    action: {
      registerPlayer: 'Register a Player',
      registerPlayerDesc: 'Register a new player to join the club',
      register: 'Register',
      becomeMember: 'Become a Member',
      becomeMemberDesc: 'Join as an official club member',
      join: 'Join Now'
    },
    information: {
      empty: 'Information Coming Soon',
      emptyDescription: 'Club information and resources will be available here soon.'
    },
    proposals: {
      empty: 'No Proposals Yet',
      emptyDescription: 'Submit your proposals or complaints to help improve the club.'
    },
    matches: {
      empty: 'No Matches Scheduled',
      emptyDescription: 'Weekend match schedule will appear here when available.'
    },
    partners: {
      empty: 'No Partners Listed',
      emptyDescription: 'Our club partners and sponsors will be listed here.'
    }
  }
} as const;

export type SharedTranslationKeys = typeof sharedTranslations;

