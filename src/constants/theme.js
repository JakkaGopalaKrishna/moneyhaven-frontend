export const THEME = {
  colors: {
    primary: '#3B82F6',
    success: '#22C55E',
    danger: '#EF4444',
    warning: '#F59E0B',
    
    // Dark Theme Colors
    dark: {
      background: '#0B1220',
      surface: '#111827',
      border: '#1F2937',
      textPrimary: '#F9FAFB',
      textSecondary: '#9CA3AF',
    },
    
    // Light Theme Colors (keeping subtle references for graceful fallback)
    light: {
      background: '#F3F4F6',
      surface: '#FFFFFF',
      border: '#E5E7EB',
      textPrimary: '#111827',
      textSecondary: '#6B7280',
    }
  },
  typography: {
    pageTitle: '32px',
    sectionTitle: '20px',
    cardTitle: '16px',
    body: '14px',
    smallText: '12px',
  },
  shadows: {
    soft: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    card: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  borderRadius: {
    standard: '12px',
    large: '16px',
    pill: '9999px',
  }
};
