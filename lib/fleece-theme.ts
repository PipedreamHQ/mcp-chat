// ============================================
// FLEECE AI - OFFICIAL COLOR PALETTE & THEME
// ============================================

export const fleeceColors = {
  // Fonds
  background: {
    primary: '#FFFFFF',      // Blanc - Fond principal
    secondary: '#1C1C1C',    // Gris foncé - Fond secondaire
  },

  // Textes
  text: {
    primary: '#0F0F0F',      // Noir charbon - Texte principal
    secondary: '#6B7280',    // Gris moyen pour texte secondaire
    light: '#9CA3AF',        // Gris clair pour texte tertiaire
  },

  // Accent / Signature
  accent: {
    primary: '#2FD6E3',      // Cyan IA - Couleur signature Fleece AI
    hover: '#1EC5D4',        // Cyan plus foncé pour hover
    light: '#A0F0F7',        // Cyan clair pour backgrounds
    ultraLight: '#E5F9FB',   // Cyan très clair
  },

  // Services
  services: {
    consulting: '#2FD6E3',   // Cyan pour Consulting
    automations: '#8B5CF6',  // Violet pour Automatisations
    formations: '#10B981',   // Vert pour Formations
  },

  // États
  status: {
    success: '#10B981',      // Vert
    warning: '#F59E0B',      // Orange
    error: '#EF4444',        // Rouge
    info: '#3B82F6',         // Bleu
  },

  // Bordures
  border: {
    light: '#E5E7EB',        // Bordure claire
    medium: '#D1D5DB',       // Bordure moyenne
    dark: '#374151',         // Bordure foncée
  },
} as const

export const fleeceGradients = {
  primary: 'linear-gradient(135deg, #2FD6E3 0%, #1EC5D4 100%)',
  consulting: 'linear-gradient(135deg, #2FD6E3 0%, #1EC5D4 100%)',
  automations: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  formations: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  hero: 'linear-gradient(135deg, #2FD6E3 0%, #8B5CF6 50%, #10B981 100%)',
} as const

export const fleeceShadows = {
  sm: '0 1px 2px 0 rgba(47, 214, 227, 0.05)',
  md: '0 4px 6px -1px rgba(47, 214, 227, 0.1)',
  lg: '0 10px 15px -3px rgba(47, 214, 227, 0.1)',
  xl: '0 20px 25px -5px rgba(47, 214, 227, 0.1)',
} as const

// Utility functions
export function getServiceColor(service: 'consulting' | 'automations' | 'formations'): string {
  return fleeceColors.services[service]
}

export function getStatusColor(status: 'success' | 'warning' | 'error' | 'info'): string {
  return fleeceColors.status[status]
}
