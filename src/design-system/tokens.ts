/**
 * MASTER DESIGN SYSTEM TOKENS
 * Derived from the Master Product & Design Specification.
 * Designed for 1:1 translation to Flutter Theme & Widgets.
 */

export const DESIGN_TOKENS = {
  colors: {
    // Dark base hierarchy
    background: '#0A0D14',      // Deepest canvas background
    surface: '#121722',         // Base card/container surface
    surfaceElevated: '#182030', // Elevated cards/dialogs/sheets
    surfaceHighlight: '#1F293D',// Active/hover/pressed surface
    
    // Borders & Dividers
    borderSubtle: 'rgba(255, 255, 255, 0.07)',
    borderDefault: 'rgba(255, 255, 255, 0.12)',
    borderStrong: 'rgba(255, 255, 255, 0.20)',
    borderFocus: '#E5A93C',

    // Primary Brand Accent: Refined Warm Amber Gold
    accent: '#E5A93C',
    accentHover: '#D49629',
    accentMuted: 'rgba(229, 169, 60, 0.15)',
    accentSubtle: 'rgba(229, 169, 60, 0.08)',
    accentForeground: '#0A0D14',

    // Text Tokens
    textPrimary: '#F8FAFC',    // Off-white headline/primary text
    textSecondary: '#94A3B8',  // Subtitles & descriptions
    textMuted: '#64748B',      // Placeholders, captions, timestamps
    textDisabled: '#475569',   // Inactive controls

    // Functional State Colors
    success: '#10B981',
    successMuted: 'rgba(16, 185, 129, 0.15)',
    warning: '#F59E0B',
    warningMuted: 'rgba(245, 158, 11, 0.15)',
    error: '#EF4444',
    errorMuted: 'rgba(239, 68, 68, 0.15)',
    info: '#3B82F6',
    infoMuted: 'rgba(59, 130, 246, 0.15)',

    // Platform Badge Indicators
    onPlatformBadge: '#E5A93C',
    scannedCardBadge: '#64748B',
  },

  typography: {
    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    monoFontFamily: "'JetBrains Mono', monospace",
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
  },

  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    '2xl': '24px',
    pill: '9999px',
  },

  touchTarget: {
    minHeight: '48px',
    minWidth: '48px',
  },
} as const;
