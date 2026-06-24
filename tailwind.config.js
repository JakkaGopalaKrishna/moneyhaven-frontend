/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        fintech: {
          primary: '#3B82F6',
          success: '#22C55E',
          danger: '#EF4444',
          warning: '#F59E0B',
          bg: '#0B1220',
          surface: '#111827',
          border: '#1F2937',
          text: '#F9FAFB',
          textMuted: '#9CA3AF',
        }
      },
      fontSize: {
        'page': ['32px', '1.2'],
        'section': ['20px', '1.3'],
        'card': ['16px', '1.4'],
        'body': ['14px', '1.5'],
        'small': ['12px', '1.5'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      maxWidth: {
        'dashboard': '1800px',
      }
    },
  },
  plugins: [],
}
