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
    signOut: 'Tancar Sessió',
    or: 'o',
    continueWithGoogle: 'Continuar amb Google',
    continueWithApple: 'Continuar amb Apple',
    alreadyHaveAccount: 'Ja tens un compte?',
    dontHaveAccount: 'No tens un compte?',
    continueAsGuest: 'Continuar com a Convidat'
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
    close: 'Tancar',
    submitting: 'Enviant...'
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
    confirmPasswordRequired: 'Si us plau confirma la teva contrasenya',
    emailRequired: 'El correu electrònic és obligatori',
    emailInvalid: 'Si us plau introdueix un correu vàlid',
    passwordRequired: 'La contrasenya és obligatòria',
    passwordMinLength: 'La contrasenya ha de tenir almenys 6 caràcters',
    checkInput: 'Si us plau verifica la teva informació',
    fillAllFields: 'Si us plau completa tots els camps correctament'
  },
  messages: {
    accountCreatedSuccess: 'Compte creat amb èxit!',
    signUpError: 'Ha ocorregut un error durant el registre.',
    signInError: 'Ha ocorregut un error',
    googleSignUpSuccess: 'Registre amb Google amb èxit!',
    appleSignUpSuccess: 'Registre amb Apple amb èxit!',
    googleSignUpFailed: 'Registre amb Google ha fallat',
    appleSignUpFailed: 'Registre amb Apple ha fallat',
    googleSignInSuccess: 'Inici de sessió amb Google amb èxit!',
    appleSignInSuccess: 'Inici de sessió amb Apple amb èxit!',
    googleSignInFailed: 'Inici de sessió amb Google ha fallat',
    appleSignInFailed: 'Inici de sessió amb Apple ha fallat'
  },
  loading: {
    signingIn: 'Iniciant sessió...',
    pleaseWait: 'Si us plau espera mentre ho preparem tot',
    loadingProfile: 'Carregant el teu perfil...',
    preparingWorkspace: "Preparant espai de treball...",
    allSet: 'Tot llest!',
    redirecting: 'Redirigint...'
  },
  roleSelection: {
    welcome: 'Benvingut de nou',
    selectRole: 'Selecciona el teu Rol',
    chooseClub: 'Tria un club per continuar',
    noRolesYet: 'Comença afegint el teu primer club',
    defaultDescription: 'Gestiona les activitats del teu club',
    permissions: 'permisos',
    addNewClub: 'Afegir Nou Club',
    joinOrCreate: 'Uneix-te o crea un nou club',
    skipForNow: 'Ometre per ara',
    canAddLater: 'Pots afegir clubs en qualsevol moment des del teu perfil'
  },
  joinTeam: {
    title: "Unir-se a un Equip",
    subtitle: 'Introdueix el codi de l\'equip i selecciona el teu rol per unir-te',
    enterCode: 'Introduir Codi de l\'Equip',
    codeDescription: 'Introdueix el codi de 5 dígits proporcionat per l\'administrador de l\'equip',
    selectRole: 'Selecciona el teu Rol',
    roleDescription: 'Tria com vols participar en aquest equip',
    coachDescription: 'Crear i gestionar activitats de l\'equip, sessions d\'entrenament i partits',
    viewerDescription: 'Veure informació de l\'equip, horaris i resultats de partits',
    submitRequest: 'Enviar Sol·licitud',
    joinInstant: 'Unir-se Instantàniament',
    joiningInstant: 'Unint-se...',
    teamFound: 'Equip Trobat!',
    confirmMatch: 'Selecciona el teu rol a continuació per unir-te a aquest equip',
    tryDifferentCode: 'Provar un Altre Codi'
  },
  roles: {
    coach: 'Entrenador',
    viewer: 'Observador'
  }
} as const;

export type SharedTranslationKeys = typeof sharedTranslations;
