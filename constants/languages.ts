import { Language, Translation } from '../types';

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' }
];

export const TRANSLATIONS: Record<string, Translation> = {
  en: {
    appTitle: 'Media Vizard',
    appSubtitle: 'AI-Powered Image Face Redaction & Privacy Protection',
    uploadImage: 'Upload Image',
    dragDropImage: 'Drag & drop an image here, or click to select',
    supportedImageFormats: 'Supported: JPG, PNG (max 20MB)',
    detectingFaces: 'Detecting faces and identifiable features...',
    facesDetected: 'faces detected',
    facesWillBeRedacted: 'faces will be protected',
    noFacesDetected: 'No faces detected - try adjusting sensitivity',
    redactionMethod: 'Protection Method',
    detectionSensitivity: 'Detection Level',
    findMore: 'Find More',
    findLess: 'Find Less',
    blur: 'Blur',
    pixelate: 'Pixelate',
    blackout: 'Block Out',
    blurDescription: 'Apply strong blur to faces',
    pixelateDescription: 'Apply pixelation effect to faces',
    blackoutDescription: 'Cover faces with solid black rectangles',
    applyRedaction: 'Protect Image',
    downloadSecureFile: 'Download Protected Image',
    resetToOriginal: 'Reset to Original',
    showOverlay: 'Show Detection',
    hideOverlay: 'Hide Detection',
    securityVerification: 'Security Verification',
    metadataRemoval: 'Metadata Removal',
    privacyProtection: 'Privacy Protection',
    allMetadataRemoved: 'All metadata successfully removed',
    noMetadataFound: 'No metadata found in original',
    facesRedacted: 'Faces protected',
    readyForSharing: 'Ready for sharing',
    noPersonalDataRemains: 'No personal data remains in file',
    readyForDownload: 'Ready for secure download',
    aiGuidance: 'Privacy Guide',
    safetyTips: 'Safety Tips',
    privacyWarning: 'Privacy Warning',
    legalDisclaimer: 'Legal Disclaimer',
    resources: 'Helpful Resources',
    warningText: 'AI detection may not catch all identifiable features. Always review results carefully before sharing.',
    disclaimerText: 'This tool provides privacy protection but cannot guarantee complete anonymity. Use responsibly.',
    metadataRemoved: 'All metadata has been automatically removed from your file.',
    processingComplete: 'Protection complete!',
    errorOccurred: 'An error occurred during processing',
    fileTooLarge: 'File is too large. Maximum size is 20MB.',
    unsupportedFormat: 'Unsupported file format.',
    step1: 'Step 1: Upload',
    step2: 'Step 2: Protect',
    step3: 'Step 3: Download',
    backToUpload: 'Back to Upload',
    startOver: 'Start Over',
    about: 'About',
    howToUse: 'How to Use',
    whyUseful: 'Why Use Media Vizard?',
    realWorldScenarios: 'Real-World Scenarios',
    aboutDescription: 'Media Vizard uses advanced AI to automatically detect and protect faces in your images, ensuring your privacy when sharing photos online.',
    howToUseSteps: [
      'Upload your image by dragging and dropping or clicking to select',
      'Adjust the detection level to find more or fewer faces',
      'Choose your protection method: blur, pixelate, or block out',
      'Review the detected faces and tap to toggle protection',
      'Download your protected image with all metadata removed'
    ],
    whyUsefulText: 'In our digital age, protecting privacy in photos is crucial. Media Vizard helps you share memories while keeping identities safe.',
    scenarios: [
      'Social media posts with friends or family',
      'Professional events and conferences',
      'School activities and sports events',
      'Protests and public gatherings',
      'Real estate and property photos',
      'Medical or sensitive documentation'
    ],
    tapToToggle: 'Tap faces to toggle protection',
    tapToAdd: 'Tap empty areas to add protection zones',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    // NEW: Complete Spanish translations for AI Guidance
    safetyTip1: 'Always review protected images before sharing',
    safetyTip2: 'Check for reflective surfaces that might show unprotected faces',
    safetyTip3: 'Be aware of identifying features like unique clothing or tattoos',
    safetyTip4: 'Consider the background and context of your photos',
    safetyTip5: 'Use secure channels when sharing sensitive content',
    resource1: 'Electronic Frontier Foundation',
    resource2: 'Privacy International',
    resource3: 'Digital Rights Foundation'
  },
  es: {
    appTitle: 'Media Vizard',
    appSubtitle: 'Redacción de rostros y protección de la privacidad con IA',
    uploadImage: 'Subir Imagen',
    dragDropImage: 'Arrastra y suelta una imagen aquí, o haz clic para seleccionar',
    supportedImageFormats: 'Compatibles: JPG, PNG (máx 20MB)',
    detectingFaces: 'Detectando rostros y características identificables...',
    facesDetected: 'rostros detectados',
    facesWillBeRedacted: 'rostros serán protegidos',
    noFacesDetected: 'No se detectaron rostros - intenta ajustar la sensibilidad',
    redactionMethod: 'Método de Protección',
    detectionSensitivity: 'Nivel de Detección',
    findMore: 'Encontrar Más',
    findLess: 'Encontrar Menos',
    blur: 'Difuminar',
    pixelate: 'Pixelar',
    blackout: 'Bloquear',
    blurDescription: 'Aplicar difuminado fuerte a los rostros',
    pixelateDescription: 'Aplicar efecto de pixelación a los rostros',
    blackoutDescription: 'Cubrir rostros con rectángulos negros sólidos',
    applyRedaction: 'Proteger Imagen',
    downloadSecureFile: 'Descargar Imagen Protegida',
    resetToOriginal: 'Restablecer Original',
    showOverlay: 'Mostrar Detección',
    hideOverlay: 'Ocultar Detección',
    securityVerification: 'Verificación de Seguridad',
    metadataRemoval: 'Eliminación de Metadatos',
    privacyProtection: 'Protección de Privacidad',
    allMetadataRemoved: 'Todos los metadatos eliminados exitosamente',
    noMetadataFound: 'No se encontraron metadatos en el original',
    facesRedacted: 'Rostros protegidos',
    readyForSharing: 'Listo para compartir',
    noPersonalDataRemains: 'No quedan datos personales en el archivo',
    readyForDownload: 'Listo para descarga segura',
    aiGuidance: 'Guía de Privacidad',
    safetyTips: 'Consejos de Seguridad',
    privacyWarning: 'Advertencia de Privacidad',
    legalDisclaimer: 'Descargo de Responsabilidad Legal',
    resources: 'Recursos Útiles',
    warningText: 'La detección por IA puede no capturar todas las características identificables. Siempre revisa los resultados cuidadosamente antes de compartir.',
    disclaimerText: 'Esta herramienta proporciona protección de privacidad pero no puede garantizar el anonimato completo. Usar responsablemente.',
    metadataRemoved: 'Todos los metadatos han sido eliminados automáticamente de tu archivo.',
    processingComplete: '¡Protección completa!',
    errorOccurred: 'Ocurrió un error durante el procesamiento',
    fileTooLarge: 'El archivo es demasiado grande. El tamaño máximo es 20MB.',
    unsupportedFormat: 'Formato de archivo no compatible.',
    step1: 'Paso 1: Subir',
    step2: 'Paso 2: Proteger',
    step3: 'Paso 3: Descargar',
    backToUpload: 'Volver a Subir',
    startOver: 'Comenzar de Nuevo',
    about: 'Acerca de',
    howToUse: 'Cómo Usar',
    whyUseful: '¿Por qué usar Media Vizard?',
    realWorldScenarios: 'Escenarios del Mundo Real',
    aboutDescription: 'Media Vizard usa IA avanzada para detectar y proteger automáticamente rostros en tus imágenes, asegurando tu privacidad al compartir fotos en línea.',
    howToUseSteps: [
      'Sube tu imagen arrastrando y soltando o haciendo clic para seleccionar',
      'Ajusta el nivel de detección para encontrar más o menos rostros',
      'Elige tu método de protección: difuminar, pixelar o bloquear',
      'Revisa los rostros detectados y toca para alternar la protección',
      'Descarga tu imagen protegida con todos los metadatos eliminados'
    ],
    whyUsefulText: 'En nuestra era digital, proteger la privacidad en las fotos es crucial. Media Vizard te ayuda a compartir recuerdos manteniendo las identidades seguras.',
    scenarios: [
      'Publicaciones en redes sociales con amigos o familia',
      'Eventos profesionales y conferencias',
      'Actividades escolares y eventos deportivos',
      'Protestas y reuniones públicas',
      'Fotos de bienes raíces y propiedades',
      'Documentación médica o sensible'
    ],
    tapToToggle: 'Toca rostros para alternar protección',
    tapToAdd: 'Toca áreas vacías para agregar zonas de protección',
    lightMode: 'Modo Claro',
    darkMode: 'Modo Oscuro',
    // COMPLETE Spanish translations for AI Guidance
    safetyTip1: 'Siempre revisa las imágenes protegidas antes de compartir',
    safetyTip2: 'Verifica superficies reflectantes que puedan mostrar rostros sin proteger',
    safetyTip3: 'Ten en cuenta características identificables como ropa única o tatuajes',
    safetyTip4: 'Considera el fondo y contexto de tus fotos',
    safetyTip5: 'Usa canales seguros al compartir contenido sensible',
    resource1: 'Fundación Frontera Electrónica',
    resource2: 'Privacidad Internacional',
    resource3: 'Fundación de Derechos Digitales'
  }
};