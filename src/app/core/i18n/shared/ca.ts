export const sharedTranslations = {
  welcome: {
    createAccount: 'Crear Compte',
    signIn: 'Iniciar Sessió',
    terms: 'En continuar, acceptes els nostres',
    termsOfService: 'Termes de Servei',
    and: 'i',
    privacyPolicy: 'Política de Privadesa'
  },
  auth: {
    email: 'Correu Electrònic',
    password: 'Contrasenya',
    forgotPassword: 'Has oblidat la contrasenya?',
    signInButton: 'Iniciar Sessió',
    signUpButton: 'Registrar-se',
    or: 'o',
    continueWithGoogle: 'Continuar amb Google',
    continueWithApple: 'Continuar amb Apple'
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
    passwordMismatch: 'Les contrasenyes no coincideixen'
  }
} as const;

export type SharedTranslationKeys = typeof sharedTranslations;
