// Translations for the onboarding form

export type TranslationKey =
  | 'form.title'
  | 'form.description'
  | 'form.submit'
  | 'form.next'
  | 'form.previous'
  | 'form.reviewAnswers'
  | 'form.backToForm'
  | 'form.submitApplication'
  | 'form.submitting'
  | 'form.required'
  | 'form.optional'
  | 'form.section'
  | 'form.of'
  | 'form.questions'
  | 'form.complete'
  | 'form.saveDraft'
  | 'form.restoreDraft'
  | 'form.startFresh'
  | 'form.welcomeBack'
  | 'form.savedDraftMessage'
  | 'form.progressSaved'
  | 'form.emailSent'
  | 'form.linkExpires'
  | 'form.continueWithForm'
  | 'form.saveProgress'
  | 'form.emailAddress'
  | 'form.sendLink'
  | 'form.cancel'
  | 'form.autoSaveNote'
  | 'validation.required'
  | 'validation.invalidEmail'
  | 'validation.invalidSSN'
  | 'validation.invalidPhone'
  | 'validation.invalidDate'
  | 'validation.minLength'
  | 'validation.maxLength'
  | 'validation.fixErrors'
  | 'review.title'
  | 'review.subtitle'
  | 'review.edit'
  | 'review.notProvided'
  | 'review.fileUploaded'
  | 'success.title'
  | 'success.message'
  | 'success.confirmationNumber'
  | 'success.downloadPDF'
  | 'success.startNew'
  | 'documents.title'
  | 'documents.subtitle'
  | 'documents.governmentId'
  | 'documents.resume'
  | 'documents.licenses'
  | 'documents.certifications'
  | 'faq.title'
  | 'accessibility.title'
  | 'accessibility.darkMode'
  | 'accessibility.highContrast'
  | 'accessibility.textSize'
  | 'accessibility.language'
  | 'session.warning'
  | 'session.extend'
  | 'time.minutes'
  | 'time.estimatedTime';

type Translations = {
  [key in TranslationKey]: string;
};

const translations: Record<'en' | 'es', Translations> = {
  en: {
    'form.title': 'Fountain Onboarding: New Hire Information',
    'form.description': 'Demographic / Personal Information\nPlease fill out all required fields. This form is for all new hires',
    'form.submit': 'Submit',
    'form.next': 'Continue',
    'form.previous': 'Previous',
    'form.reviewAnswers': 'Review Answers',
    'form.backToForm': 'Back to Form',
    'form.submitApplication': 'Submit Application',
    'form.submitting': 'Submitting...',
    'form.required': 'Required',
    'form.optional': 'Optional',
    'form.section': 'Section',
    'form.of': 'of',
    'form.questions': 'Questions',
    'form.complete': 'Complete',
    'form.saveDraft': 'Save & Continue Later',
    'form.restoreDraft': 'Restore Draft',
    'form.startFresh': 'Start Fresh',
    'form.welcomeBack': 'Welcome back!',
    'form.savedDraftMessage': 'You have a saved draft. Continue where you left off?',
    'form.progressSaved': 'Progress Saved!',
    'form.emailSent': "We've sent a link to",
    'form.linkExpires': 'The link expires in 7 days',
    'form.continueWithForm': 'Continue with Form',
    'form.saveProgress': 'Save Your Progress',
    'form.emailAddress': 'Email Address',
    'form.sendLink': 'Send Link',
    'form.cancel': 'Cancel',
    'form.autoSaveNote': 'Your progress is auto-saved locally, but this link lets you continue on any device.',
    'validation.required': 'This field is required',
    'validation.invalidEmail': 'Please enter a valid email address',
    'validation.invalidSSN': 'Please enter a valid SSN (###-##-####)',
    'validation.invalidPhone': 'Please enter a valid phone number',
    'validation.invalidDate': 'Please enter a valid date',
    'validation.minLength': 'Minimum {count} characters required',
    'validation.maxLength': 'Maximum {count} characters allowed',
    'validation.fixErrors': 'Please fix {count} error(s) before continuing',
    'review.title': 'Review Your Answers',
    'review.subtitle': 'Please review your information before submitting',
    'review.edit': 'Edit',
    'review.notProvided': 'Not provided',
    'review.fileUploaded': 'File uploaded',
    'success.title': 'Submission Complete!',
    'success.message': 'Thank you for completing the onboarding form. Our HR team will review your submission.',
    'success.confirmationNumber': 'Confirmation Number',
    'success.downloadPDF': 'Download PDF Copy',
    'success.startNew': 'Start New Submission',
    'documents.title': 'Documents You\'ll Need',
    'documents.subtitle': 'Have these ready before you begin:',
    'documents.governmentId': 'Government-issued ID (Driver\'s License, Passport)',
    'documents.resume': 'Resume / CV',
    'documents.licenses': 'Professional licenses (if applicable)',
    'documents.certifications': 'Board certifications (if applicable)',
    'faq.title': 'Frequently Asked Questions',
    'accessibility.title': 'Accessibility Settings',
    'accessibility.darkMode': 'Dark Mode',
    'accessibility.highContrast': 'High Contrast',
    'accessibility.textSize': 'Text Size',
    'accessibility.language': 'Language',
    'session.warning': 'Your session will expire soon. Would you like to continue?',
    'session.extend': 'Continue Session',
    'time.minutes': 'min',
    'time.estimatedTime': 'Estimated time',
  },
  es: {
    'form.title': 'Incorporación de Fountain: Información del Nuevo Empleado',
    'form.description': 'Información Demográfica / Personal\nPor favor complete todos los campos requeridos. Este formulario es para todos los nuevos empleados',
    'form.submit': 'Enviar',
    'form.next': 'Continuar',
    'form.previous': 'Anterior',
    'form.reviewAnswers': 'Revisar Respuestas',
    'form.backToForm': 'Volver al Formulario',
    'form.submitApplication': 'Enviar Solicitud',
    'form.submitting': 'Enviando...',
    'form.required': 'Requerido',
    'form.optional': 'Opcional',
    'form.section': 'Sección',
    'form.of': 'de',
    'form.questions': 'Preguntas',
    'form.complete': 'Completo',
    'form.saveDraft': 'Guardar y Continuar Después',
    'form.restoreDraft': 'Restaurar Borrador',
    'form.startFresh': 'Empezar de Nuevo',
    'form.welcomeBack': '¡Bienvenido de vuelta!',
    'form.savedDraftMessage': 'Tienes un borrador guardado. ¿Continuar donde lo dejaste?',
    'form.progressSaved': '¡Progreso Guardado!',
    'form.emailSent': 'Hemos enviado un enlace a',
    'form.linkExpires': 'El enlace expira en 7 días',
    'form.continueWithForm': 'Continuar con el Formulario',
    'form.saveProgress': 'Guardar Tu Progreso',
    'form.emailAddress': 'Dirección de Correo Electrónico',
    'form.sendLink': 'Enviar Enlace',
    'form.cancel': 'Cancelar',
    'form.autoSaveNote': 'Tu progreso se guarda automáticamente, pero este enlace te permite continuar en cualquier dispositivo.',
    'validation.required': 'Este campo es requerido',
    'validation.invalidEmail': 'Por favor ingrese un correo electrónico válido',
    'validation.invalidSSN': 'Por favor ingrese un SSN válido (###-##-####)',
    'validation.invalidPhone': 'Por favor ingrese un número de teléfono válido',
    'validation.invalidDate': 'Por favor ingrese una fecha válida',
    'validation.minLength': 'Se requieren mínimo {count} caracteres',
    'validation.maxLength': 'Se permiten máximo {count} caracteres',
    'validation.fixErrors': 'Por favor corrija {count} error(es) antes de continuar',
    'review.title': 'Revisa Tus Respuestas',
    'review.subtitle': 'Por favor revisa tu información antes de enviar',
    'review.edit': 'Editar',
    'review.notProvided': 'No proporcionado',
    'review.fileUploaded': 'Archivo subido',
    'success.title': '¡Envío Completado!',
    'success.message': 'Gracias por completar el formulario de incorporación. Nuestro equipo de RH revisará tu envío.',
    'success.confirmationNumber': 'Número de Confirmación',
    'success.downloadPDF': 'Descargar Copia PDF',
    'success.startNew': 'Iniciar Nuevo Envío',
    'documents.title': 'Documentos que Necesitarás',
    'documents.subtitle': 'Ten estos listos antes de comenzar:',
    'documents.governmentId': 'Identificación oficial (Licencia de conducir, Pasaporte)',
    'documents.resume': 'Currículum / CV',
    'documents.licenses': 'Licencias profesionales (si aplica)',
    'documents.certifications': 'Certificaciones de la junta (si aplica)',
    'faq.title': 'Preguntas Frecuentes',
    'accessibility.title': 'Configuración de Accesibilidad',
    'accessibility.darkMode': 'Modo Oscuro',
    'accessibility.highContrast': 'Alto Contraste',
    'accessibility.textSize': 'Tamaño del Texto',
    'accessibility.language': 'Idioma',
    'session.warning': 'Tu sesión expirará pronto. ¿Deseas continuar?',
    'session.extend': 'Continuar Sesión',
    'time.minutes': 'min',
    'time.estimatedTime': 'Tiempo estimado',
  },
};

export function getTranslation(key: TranslationKey, language: 'en' | 'es' = 'en', params?: Record<string, string | number>): string {
  let text = translations[language][key] || translations.en[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(`{${paramKey}}`, String(value));
    });
  }

  return text;
}

export function useTranslation(language: 'en' | 'es') {
  return {
    t: (key: TranslationKey, params?: Record<string, string | number>) => getTranslation(key, language, params),
  };
}
