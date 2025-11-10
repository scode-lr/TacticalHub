export const sharedTranslations = {
  welcome: {
    createAccount: 'Crear Cuenta',
    signIn: 'Iniciar Sesión',
    signUpTagline: 'Regístrate para comenzar a gestionar tus equipos',
    terms: 'Al continuar, aceptas nuestros',
    termsOfService: 'Términos de Servicio',
    and: 'y',
    privacyPolicy: 'Política de Privacidad'
  },
  auth: {
    email: 'Correo Electrónico',
    password: 'Contraseña',
    confirmPassword: 'Confirmar Contraseña',
    firstName: 'Nombre',
    lastName: 'Apellido',
    forgotPassword: '¿Olvidaste tu Contraseña?',
    signInButton: 'Iniciar Sesión',
    signUpButton: 'Registrarse',
    or: 'o',
    continueWithGoogle: 'Continuar con Google',
    continueWithApple: 'Continuar con Apple',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    dontHaveAccount: '¿No tienes una cuenta?',
    continueAsGuest: 'Continuar como Invitado'
  },
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Atrás',
    next: 'Siguiente',
    submit: 'Enviar',
    close: 'Cerrar'
  },
  validation: {
    required: 'Este campo es obligatorio',
    invalidEmail: 'Dirección de correo inválida',
    minLength: 'Se requieren mínimo {min} caracteres',
    maxLength: 'Máximo {max} caracteres permitidos',
    passwordMismatch: 'Las contraseñas no coinciden',
    minLength6: 'La contraseña debe tener al menos 6 caracteres',
    firstNameRequired: 'El nombre es obligatorio',
    lastNameRequired: 'El apellido es obligatorio',
    confirmPasswordRequired: 'Por favor confirma tu contraseña',
    emailRequired: 'El correo electrónico es obligatorio',
    emailInvalid: 'Por favor ingresa un correo válido',
    passwordRequired: 'La contraseña es obligatoria',
    passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
    checkInput: 'Por favor verifica tu información',
    fillAllFields: 'Por favor completa todos los campos correctamente'
  },
  messages: {
    accountCreatedSuccess: '¡Cuenta creada exitosamente!',
    signUpError: 'Ocurrió un error durante el registro.',
    signInError: 'Ocurrió un error',
    googleSignUpSuccess: '¡Registro con Google exitoso!',
    appleSignUpSuccess: '¡Registro con Apple exitoso!',
    googleSignUpFailed: 'Registro con Google falló',
    appleSignUpFailed: 'Registro con Apple falló',
    googleSignInSuccess: '¡Inicio de sesión con Google exitoso!',
    appleSignInSuccess: '¡Inicio de sesión con Apple exitoso!',
    googleSignInFailed: 'Inicio de sesión con Google falló',
    appleSignInFailed: 'Inicio de sesión con Apple falló'
  }
} as const;

export type SharedTranslationKeys = typeof sharedTranslations;
