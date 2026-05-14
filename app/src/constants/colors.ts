// ============================================================================
// FocusFlow 2.0 - Design Tokens & Color System
// ============================================================================
// Source of Truth: docs/architecture/system_overview.md + PDF visual analysis
// Constraint: NO hardcoded colors in components - use only these tokens
// Aesthetic: Neon Glassmorphism (dark base + glowing neon accents)
// ============================================================================

/**
 * NEON GLASSMORPHISM PALETTE
 * 
 * Based on visual analysis of FocusFlow – Matrix Planner.pdf
 * - Background: Deep slate/dark base for glassmorphism layers
 * - Quadrants: Neon accent colors (Q1=green, Q2=purple, Q3=blue, Q4=gray)
 * - Status: Semantic colors for actions (success, danger, warning)
 * - Text: High contrast for readability on dark backgrounds
 */

export const COLORS = {
  // ==========================================================================
  // BRAND - Neon Accent Colors (Glowing elements)
  // ==========================================================================
  brand: {
    // Primary neon - cyan (main action color)
    primary: '#00F0FF',
    primaryMuted: 'rgba(0, 240, 255, 0.6)',
    primaryGlow: 'rgba(0, 240, 255, 0.3)',
    
    // Secondary neon - magenta (highlights, special actions)
    secondary: '#FF00F0',
    secondaryMuted: 'rgba(255, 0, 240, 0.6)',
    secondaryGlow: 'rgba(255, 0, 240, 0.3)',
    
    // Tertiary neon - lime (success, growth indicators)
    tertiary: '#39FF14',
    tertiaryMuted: 'rgba(57, 255, 20, 0.6)',
    tertiaryGlow: 'rgba(57, 255, 20, 0.3)',
    
    // Accent neon - yellow/orange (warnings, attention)
    accent: '#FFF100',
    accentMuted: 'rgba(255, 241, 0, 0.6)',
    accentGlow: 'rgba(255, 241, 0, 0.3)',
    
    // Danger neon - red (errors, critical)
    danger: '#FF4757',
    dangerMuted: 'rgba(255, 71, 87, 0.6)',
    dangerGlow: 'rgba(255, 71, 87, 0.3)',
  },

  // ==========================================================================
  // SURFACE - Glassmorphism & Background Layers
  // ==========================================================================
  surface: {
    // Deep background (app base)
    background: '#0F172A', // slate-900
    backgroundElevated: '#1E293B', // slate-800
    
    // Glassmorphism layers
    glass: {
      light: 'rgba(255, 255, 255, 0.08)',
      medium: 'rgba(255, 255, 255, 0.12)',
      heavy: 'rgba(255, 255, 255, 0.18)',
      border: 'rgba(255, 255, 255, 0.15)',
      borderStrong: 'rgba(255, 255, 255, 0.25)',
    },
    
    // Dark overlay (modals, popovers)
    overlay: 'rgba(15, 23, 42, 0.85)',
    overlayHeavy: 'rgba(15, 23, 42, 0.95)',
    
    // Card surfaces
    card: 'rgba(30, 41, 59, 0.6)',
    cardHover: 'rgba(30, 41, 59, 0.8)',
    cardActive: 'rgba(51, 65, 85, 0.6)',
    
    // Input fields
    input: 'rgba(15, 23, 42, 0.6)',
    inputFocus: 'rgba(15, 23, 42, 0.8)',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    inputBorderFocus: 'rgba(0, 240, 255, 0.5)',
  },

  // ==========================================================================
  // TEXT - Typography Colors
  // ==========================================================================
  text: {
    // Primary text (headlines, important)
    primary: '#FFFFFF',
    primaryMuted: 'rgba(255, 255, 255, 0.9)',
    
    // Secondary text (body, descriptions)
    secondary: 'rgba(255, 255, 255, 0.7)',
    secondaryMuted: 'rgba(255, 255, 255, 0.5)',
    
    // Tertiary text (captions, hints)
    tertiary: 'rgba(255, 255, 255, 0.4)',
    disabled: 'rgba(255, 255, 255, 0.3)',
    
    // Vibrant text (neon accents for special emphasis)
    vibrant: {
      cyan: '#00F0FF',
      magenta: '#FF00F0',
      lime: '#39FF14',
      yellow: '#FFF100',
    },
    
    // Quadrant-specific text
    q1: '#39FF14', // lime green
    q2: '#A855F7', // purple
    q3: '#00F0FF', // cyan
    q4: '#94A3B8', // slate-400
  },

  // ==========================================================================
  // QUADRANTS - Eisenhower Matrix Colors (from PDF analysis)
  // ==========================================================================
  // Based on: FocusFlow – Matrix Planner.pdf
  // Q1 (Pilne/Ważne): Neon green - "Do it now" urgency [cite: 84, 442]
  // Q2 (Nie-pilne/Ważne): Purple - "Schedule" for growth
  // Q3 (Pilne/Nie-ważne): Blue - "Delegate" administrative
  // Q4 (Nie-pilne/Nie-ważne): Gray - "Delete" or archive
  // ==========================================================================
  quadrants: {
    q1: {
      // Pilne i Ważne - EMERGENCY (neon green)
      base: '#39FF14',
      light: 'rgba(57, 255, 20, 0.2)',
      medium: 'rgba(57, 255, 20, 0.4)',
      glow: 'rgba(57, 255, 20, 0.3)',
      border: 'rgba(57, 255, 20, 0.5)',
      text: '#39FF14',
      gradient: 'linear-gradient(135deg, rgba(57, 255, 20, 0.2) 0%, rgba(57, 255, 20, 0.05) 100%)',
    },
    
    q2: {
      // Nie-pilne i Ważne - GROWTH (purple)
      base: '#A855F7',
      light: 'rgba(168, 85, 247, 0.2)',
      medium: 'rgba(168, 85, 247, 0.4)',
      glow: 'rgba(168, 85, 247, 0.3)',
      border: 'rgba(168, 85, 247, 0.5)',
      text: '#A855F7',
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(168, 85, 247, 0.05) 100%)',
    },
    
    q3: {
      // Pilne i Nie-ważne - ADMIN (cyan)
      base: '#00F0FF',
      light: 'rgba(0, 240, 255, 0.2)',
      medium: 'rgba(0, 240, 255, 0.4)',
      glow: 'rgba(0, 240, 255, 0.3)',
      border: 'rgba(0, 240, 255, 0.5)',
      text: '#00F0FF',
      gradient: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2) 0%, rgba(0, 240, 255, 0.05) 100%)',
    },
    
    q4: {
      // Nie-pilne i Nie-ważne - WASTE/ARCHIVE (gray)
      base: '#64748B',
      light: 'rgba(100, 116, 139, 0.2)',
      medium: 'rgba(100, 116, 139, 0.4)',
      glow: 'rgba(100, 116, 139, 0.3)',
      border: 'rgba(100, 116, 139, 0.5)',
      text: '#94A3B8',
      gradient: 'linear-gradient(135deg, rgba(100, 116, 139, 0.2) 0%, rgba(100, 116, 139, 0.05) 100%)',
    },
  },

  // ==========================================================================
  // STATUS - Action & State Colors (from PDF str. 24)
  // ==========================================================================
  // Based on: FocusFlow – Matrix Planner.pdf str. 24 [cite: 590, 602]
  // Buttons: "Zrobione" (Done), "Odrzuć" (Discard), "Przywróć" (Restore)
  // ==========================================================================
  status: {
    // Success - Done, Complete, Success
    success: {
      base: '#39FF14',
      light: 'rgba(57, 255, 20, 0.15)',
      border: 'rgba(57, 255, 20, 0.4)',
      glow: 'rgba(57, 255, 20, 0.2)',
    },
    
    // Danger - Delete, Discard, Error
    danger: {
      base: '#FF4757',
      light: 'rgba(255, 71, 87, 0.15)',
      border: 'rgba(255, 71, 87, 0.4)',
      glow: 'rgba(255, 71, 87, 0.2)',
    },
    
    // Warning - Alert, Attention, Limit
    warning: {
      base: '#FFA502',
      light: 'rgba(255, 165, 2, 0.15)',
      border: 'rgba(255, 165, 2, 0.4)',
      glow: 'rgba(255, 165, 2, 0.2)',
    },
    
    // Info - Neutral, Restore, Secondary
    info: {
      base: '#00F0FF',
      light: 'rgba(0, 240, 255, 0.15)',
      border: 'rgba(0, 240, 255, 0.4)',
      glow: 'rgba(0, 240, 255, 0.2)',
    },
    
    // Neutral - Archive, Inactive
    neutral: {
      base: '#64748B',
      light: 'rgba(100, 116, 139, 0.15)',
      border: 'rgba(100, 116, 139, 0.4)',
      glow: 'rgba(100, 116, 139, 0.2)',
    },
  },

  // ==========================================================================
  // UTILITY - Helper Colors
  // ==========================================================================
  utility: {
    // Dividers
    divider: 'rgba(255, 255, 255, 0.1)',
    dividerStrong: 'rgba(255, 255, 255, 0.2)',
    
    // Shadows
    shadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
      glow: '0 0 20px rgba(0, 240, 255, 0.3)',
    },
    
    // Blur (for glassmorphism)
    blur: {
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
    },
  },
} as const;

// ============================================================================
// TAILWIND MAPPING - Pre-configured class combinations
// ============================================================================
// Use these for common patterns to maintain consistency
// ============================================================================

export const TW = {
  // Glassmorphism panels
  glass: {
    base: 'backdrop-blur-md bg-white/[0.08] border border-white/[0.15] rounded-xl',
    hover: 'hover:bg-white/[0.12] transition-colors duration-200',
    active: 'active:bg-white/[0.18]',
  },
  
  // Neon glow effects
  glow: {
    cyan: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]',
    green: 'shadow-[0_0_20px_rgba(57,255,20,0.3)]',
    purple: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    red: 'shadow-[0_0_20px_rgba(255,71,87,0.3)]',
  },
  
  // Quadrant-specific card styles
  quadrant: {
    q1: 'border-l-4 border-l-[#39FF14] bg-gradient-to-r from-[rgba(57,255,20,0.1)] to-transparent',
    q2: 'border-l-4 border-l-[#A855F7] bg-gradient-to-r from-[rgba(168,85,247,0.1)] to-transparent',
    q3: 'border-l-4 border-l-[#00F0FF] bg-gradient-to-r from-[rgba(0,240,255,0.1)] to-transparent',
    q4: 'border-l-4 border-l-[#64748B] bg-gradient-to-r from-[rgba(100,116,139,0.1)] to-transparent',
  },
  
  // Status badges
  badge: {
    success: 'bg-[rgba(57,255,20,0.15)] text-[#39FF14] border border-[rgba(57,255,20,0.4)]',
    danger: 'bg-[rgba(255,71,87,0.15)] text-[#FF4757] border border-[rgba(255,71,87,0.4)]',
    warning: 'bg-[rgba(255,165,2,0.15)] text-[#FFA502] border border-[rgba(255,165,2,0.4)]',
    info: 'bg-[rgba(0,240,255,0.15)] text-[#00F0FF] border border-[rgba(0,240,255,0.4)]',
  },
  
  // Text gradients
  textGradient: {
    cyan: 'bg-gradient-to-r from-[#00F0FF] to-[#00D4FF] bg-clip-text text-transparent',
    neon: 'bg-gradient-to-r from-[#39FF14] via-[#00F0FF] to-[#FF00F0] bg-clip-text text-transparent',
  },
} as const;

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type ColorTheme = typeof COLORS;
export type BrandColors = keyof typeof COLORS.brand;
export type QuadrantColors = keyof typeof COLORS.quadrants;
export type StatusColors = keyof typeof COLORS.status;

// ============================================================================
// USAGE EXAMPLES (for developers):
// ============================================================================
// 
// 1. Direct color access:
//    import { COLORS } from '@/constants/colors';
//    <div style={{ backgroundColor: COLORS.surface.background }} />
//
// 2. Tailwind with arbitrary values (use sparingly):
//    <div className="bg-[#0F172A]" /> ❌ DON'T - hardcoded!
//    <div className={`bg-[${COLORS.surface.background}]`} /> ✅ DO
//
// 3. Pre-configured Tailwind classes:
//    import { TW } from '@/constants/colors';
//    <div className={TW.glass.base} />
//    <div className={TW.quadrant.q1} />
//
// 4. Quadrant colors:
//    <span style={{ color: COLORS.quadrants.q1.text }} />
//    <div className={COLORS.quadrants.q2.gradient} />
//
// 5. Status actions:
//    <button className={TW.badge.success}>Zrobione</button>
//    <button className={TW.badge.danger}>Odrzuć</button>
//
// ============================================================================
