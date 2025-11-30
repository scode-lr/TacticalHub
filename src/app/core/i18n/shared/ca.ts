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
  },
  viewer: {
    proposals: {
      title: 'Propostes',
      empty: 'No hi ha propostes encara',
      emptyDescription: 'Envia una proposta a l\'administrador per millorar la plataforma.',
      form: {
        title: 'Títol',
        titlePlaceholder: 'Introdueix el títol de la proposta',
        titleError: 'El títol és obligatori (min 5 caràcters)',
        body: 'Descripció',
        bodyPlaceholder: 'Descriu la teva proposta en detall...',
        bodyError: 'La descripció és obligatòria (min 20 caràcters)',
        attachment: 'Adjunt',
        changeFile: 'Canviar arxiu',
        uploadText: 'Fes clic per pujar arxiu',
        uploadSubtext: 'PDF, DOC, Imatges (max 5MB)',
        submit: 'Enviar Proposta',
        fileTypeError: 'Tipus d\'arxiu no vàlid. Només es permeten PDF, DOC, Excel i imatges',
        fileSizeError: 'L\'arxiu excedeix el límit de 5MB'
      }
    }
  }
} as const;

export type SharedTranslationKeys = typeof sharedTranslations;
