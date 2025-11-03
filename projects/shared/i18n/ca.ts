export const sharedTranslations = {
  welcome: {
    createAccount: 'Crear Compte',
    signIn: 'Iniciar Sessió',
    signUpTagline: "Registra't per començar a gestionar els teus equips",
    terms: 'En continuar, acceptes els nostres',
    termsOfService: 'Termes de Servei',
    and: 'i',
    privacyPolicy: 'Política de Privadesa'
  },
  auth: {
    email: 'Correu Electrònic',
    password: 'Contrasenya',
    confirmPassword: 'Confirmar Contrasenya',
    firstName: 'Nom',
    lastName: 'Cognom',
    forgotPassword: 'Has oblidat la contrasenya?',
    signInButton: 'Iniciar Sessió',
    signUpButton: 'Registrar-se',
    or: 'o',
    continueWithGoogle: 'Continuar amb Google',
    continueWithApple: 'Continuar amb Apple',
    alreadyHaveAccount: 'Ja tens un compte?',
    dontHaveAccount: 'No tens un compte?'
  },
  common: {
    loading: 'Carregant...',
    error: 'Error',
    success: 'Èxit',
    cancel: 'Cancel·lar',
    confirm: 'Confirmar',
    save: 'Desar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Enrere',
    next: 'Següent',
    submit: 'Enviar',
    close: 'Tancar'
  },
  validation: {
    required: 'Aquest camp és obligatori',
    invalidEmail: 'Adreça de correu invàlida',
    minLength: 'Es requereixen mínim {min} caràcters',
    maxLength: 'Màxim {max} caràcters permesos',
    passwordMismatch: 'Les contrasenyes no coincideixen',
    minLength6: 'La contrasenya ha de tenir almenys 6 caràcters',
    firstNameRequired: 'El nom és obligatori',
    lastNameRequired: 'El cognom és obligatori',
    confirmPasswordRequired: 'Si us plau confirma la teva contrasenya'
  }
} as const;

export type SharedTranslationKeys = typeof sharedTranslations;
