/**
 * Dark-futuristic design tokens
 * Components should import and reference these directly
 */

// Dark-futuristic color palette (HSL values)
export const colors = {
  // Base colors
  background: "hsl(220, 13%, 7%)",
  foreground: "hsl(210, 40%, 95%)",
  
  // Primary - Electric blue/cyan
  primary: "hsl(193, 100%, 50%)",
  "primary-foreground": "hsl(220, 13%, 7%)",
  
  // Secondary - Deep purple
  secondary: "hsl(260, 30%, 15%)",
  "secondary-foreground": "hsl(210, 40%, 95%)",
  
  // Accent - Neon green
  accent: "hsl(120, 100%, 50%)",
  "accent-foreground": "hsl(220, 13%, 7%)",
  
  // Muted tones
  muted: "hsl(215, 27%, 12%)",
  "muted-foreground": "hsl(217, 10%, 64%)",
  
  // Borders and surfaces
  border: "hsl(215, 27%, 18%)",
  input: "hsl(215, 27%, 18%)",
  ring: "hsl(193, 100%, 50%)",
  
  // Status colors
  destructive: "hsl(0, 84%, 60%)",
  "destructive-foreground": "hsl(210, 40%, 95%)",
  
  // Card surfaces
  card: "hsl(220, 13%, 9%)",
  "card-foreground": "hsl(210, 40%, 95%)",
  
  // Popover surfaces  
  popover: "hsl(220, 13%, 9%)",
  "popover-foreground": "hsl(210, 40%, 95%)",
} as const;

// Border radius scale
export const radii = {
  none: "0",
  sm: "0.125rem",
  base: "0.25rem", 
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
} as const;

// Spacing scale (following 8pt grid)
export const spacing = {
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem", 
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  11: "2.75rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  36: "9rem",
  40: "10rem",
  44: "11rem",
  48: "12rem",
  52: "13rem",
  56: "14rem",
  60: "15rem",
  64: "16rem",
  72: "18rem",
  80: "20rem",
  96: "24rem",
} as const;

// Typography system
export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'monospace'],
    display: ['Orbitron', 'system-ui', 'sans-serif'], // Futuristic display font
  },
  
  // Font sizes with line heights
  fontSize: {
    xs: { size: '0.75rem', lineHeight: '1rem' },
    sm: { size: '0.875rem', lineHeight: '1.25rem' },
    base: { size: '1rem', lineHeight: '1.5rem' },
    lg: { size: '1.125rem', lineHeight: '1.75rem' },
    xl: { size: '1.25rem', lineHeight: '1.75rem' },
    '2xl': { size: '1.5rem', lineHeight: '2rem' },
    '3xl': { size: '1.875rem', lineHeight: '2.25rem' },
    '4xl': { size: '2.25rem', lineHeight: '2.5rem' },
    '5xl': { size: '3rem', lineHeight: '1' },
    '6xl': { size: '3.75rem', lineHeight: '1' },
    '7xl': { size: '4.5rem', lineHeight: '1' },
    '8xl': { size: '6rem', lineHeight: '1' },
    '9xl': { size: '8rem', lineHeight: '1' },
  },
  
  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// Export types for TypeScript
export type ColorToken = keyof typeof colors;
export type RadiusToken = keyof typeof radii;
export type SpacingToken = keyof typeof spacing;
export type FontSizeToken = keyof typeof typography.fontSize;