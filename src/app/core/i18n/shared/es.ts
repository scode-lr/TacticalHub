export const sharedTranslations = {
  welcome: {
    createAccount: 'Crear Cuenta',
    signIn: 'Iniciar Sesión',
    terms: 'Al continuar, aceptas nuestros',
    termsOfService: 'Términos de Servicio',
    and: 'y',
    privacyPolicy: 'Política de Privacidad'
  },
  auth: {
    email: 'Correo Electrónico',
    password: 'Contraseña',
    forgotPassword: '¿Olvidaste tu Contraseña?',
    signInButton: 'Iniciar Sesión',
    signUpButton: 'Registrarse',
    or: 'o',
    continueWithGoogle: 'Continuar con Google',
    continueWithApple: 'Continuar con Apple'
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
    passwordMismatch: 'Las contraseñas no coinciden'
  }
} as const;

export type SharedTranslationKeys = typeof sharedTranslations;
