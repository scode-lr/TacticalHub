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
  },
  viewer: {
    proposals: {
      title: 'Propuestas',
      empty: 'No hay propuestas todavía',
      emptyDescription: 'Envía una propuesta al administrador para mejorar la plataforma.',
      form: {
        title: 'Título',
        titlePlaceholder: 'Introduce el título de la propuesta',
        titleError: 'El título es obligatorio (min 5 caracteres)',
        body: 'Descripción',
        bodyPlaceholder: 'Describe tu propuesta en detalle...',
        bodyError: 'La descripción es obligatoria (min 20 caracteres)',
        attachment: 'Adjunto',
        changeFile: 'Cambiar archivo',
        uploadText: 'Haz clic para subir archivo',
        uploadSubtext: 'PDF, DOC, Imágenes (max 5MB)',
        submit: 'Enviar Propuesta',
        fileTypeError: 'Tipo de archivo no válido. Solo se permiten PDF, DOC, Excel e imágenes',
        fileSizeError: 'El archivo excede el límite de 5MB'
      }
    },
    matches: {
      title: 'Partidos',
      empty: 'No hay partidos esta semana',
      emptyDescription: 'No se han programado partidos para esta semana.',
      saturday: 'Sábado',
      sunday: 'Domingo'
    }
  }
} as const;

export type SharedTranslationKeys = typeof sharedTranslations;
