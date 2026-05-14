/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // ============================================================================
      // COLORS - FocusFlow Neon Glassmorphism Palette
      // Source: src/constants/colors.ts
      // ============================================================================
      colors: {
        // Background & Surface
        background: '#0F172A',
        'background-elevated': '#1E293B',
        
        // Brand Neon Colors
        neon: {
          cyan: '#00F0FF',
          magenta: '#FF00F0',
          lime: '#39FF14',
          yellow: '#FFF100',
        },
        
        // Quadrant Colors (Eisenhower Matrix)
        q1: {
          DEFAULT: '#39FF14',
          light: 'rgba(57, 255, 20, 0.2)',
          medium: 'rgba(57, 255, 20, 0.4)',
          glow: 'rgba(57, 255, 20, 0.3)',
        },
        q2: {
          DEFAULT: '#A855F7',
          light: 'rgba(168, 85, 247, 0.2)',
          medium: 'rgba(168, 85, 247, 0.4)',
          glow: 'rgba(168, 85, 247, 0.3)',
        },
        q3: {
          DEFAULT: '#00F0FF',
          light: 'rgba(0, 240, 255, 0.2)',
          medium: 'rgba(0, 240, 255, 0.4)',
          glow: 'rgba(0, 240, 255, 0.3)',
        },
        q4: {
          DEFAULT: '#64748B',
          light: 'rgba(100, 116, 139, 0.2)',
          medium: 'rgba(100, 116, 139, 0.4)',
          glow: 'rgba(100, 116, 139, 0.3)',
        },
        
        // Status Colors
        status: {
          success: '#39FF14',
          danger: '#FF4757',
          warning: '#FFA502',
          info: '#00F0FF',
          neutral: '#64748B',
        },
        
        // Glassmorphism
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          medium: 'rgba(255, 255, 255, 0.12)',
          heavy: 'rgba(255, 255, 255, 0.18)',
          border: 'rgba(255, 255, 255, 0.15)',
        },
      },
      
      // ============================================================================
      // BACKDROP BLUR - Glassmorphism Support
      // ============================================================================
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
      },
      
      // ============================================================================
      // BOX SHADOW - Neon Glows
      // ============================================================================
      boxShadow: {
        // Neon glows
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-lime': '0 0 20px rgba(57, 255, 20, 0.3)',
        'neon-magenta': '0 0 20px rgba(255, 0, 240, 0.3)',
        'neon-yellow': '0 0 20px rgba(255, 241, 0, 0.3)',
        
        // Quadrant glows
        'glow-q1': '0 0 20px rgba(57, 255, 20, 0.3)',
        'glow-q2': '0 0 20px rgba(168, 85, 247, 0.3)',
        'glow-q3': '0 0 20px rgba(0, 240, 255, 0.3)',
        'glow-q4': '0 0 20px rgba(100, 116, 139, 0.3)',
        
        // Glass panels
        'glass': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glass-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
        
        // Inner glows (for inputs)
        'inner-cyan': 'inset 0 0 10px rgba(0, 240, 255, 0.2)',
        'inner-lime': 'inset 0 0 10px rgba(57, 255, 20, 0.2)',
      },
      
      // ============================================================================
      // MAX WIDTH - Mobile-First Constraint (CRITICAL)
      // ============================================================================
      maxWidth: {
        'app': '480px', // Primary constraint for FocusFlow
      },
      
      // ============================================================================
      // FONT FAMILY
      // ============================================================================
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      
      // ============================================================================
      // ANIMATIONS - Micro-interactions for ADHD UX
      // ============================================================================
      animation: {
        // Focus feedback
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flash': 'flash 0.3s ease-out',
        
        // Transitions
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        
        // Attention getters (for ADHD)
        'bounce-subtle': 'bounce-subtle 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 240, 255, 0.5)' },
        },
        'flash': {
          '0%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
      },
      
      // ============================================================================
      // TRANSITIONS - Smooth but snappy (ADHD-friendly)
      // ============================================================================
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
      },
      
      transitionTimingFunction: {
        'snappy': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      // ============================================================================
      // Z-INDEX - Layer management
      // ============================================================================
      zIndex: {
        'background': '-10',
        'default': '0',
        'elevated': '10',
        'dropdown': '20',
        'sticky': '30',
        'modal': '40',
        'popover': '50',
        'toast': '60',
        'tooltip': '70',
      },
      
      // ============================================================================
      // SPACING - Consistent rhythm (4px base)
      // ============================================================================
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  
  // ============================================================================
  // PLUGINS
  // ============================================================================
  plugins: [
    // Custom plugin for FocusFlow utilities
    function({ addComponents, addUtilities, theme }) {
      // Glassmorphism components
      addComponents({
        '.glass-panel': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '0.75rem',
        },
        '.glass-card': {
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
        },
        '.glass-input': {
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.5rem',
          '&:focus': {
            borderColor: 'rgba(0, 240, 255, 0.5)',
            boxShadow: '0 0 0 2px rgba(0, 240, 255, 0.2)',
          },
        },
      });
      
      // ============================================================================
      // VIBRANT NEON TEXT - High contrast against glassmorphism
      // Drop shadows ensure text 'cuts' through glass layers and appears to glow
      // ============================================================================
      addUtilities({
        // Vibrant neon text colors with built-in glow
        '.text-neon-cyan': {
          color: '#00F0FF',
          textShadow: '0 0 5px rgba(0, 240, 255, 0.5), 0 0 10px rgba(0, 240, 255, 0.3)',
        },
        '.text-neon-lime': {
          color: '#39FF14',
          textShadow: '0 0 5px rgba(57, 255, 20, 0.5), 0 0 10px rgba(57, 255, 20, 0.3)',
        },
        '.text-neon-magenta': {
          color: '#FF00F0',
          textShadow: '0 0 5px rgba(255, 0, 240, 0.5), 0 0 10px rgba(255, 0, 240, 0.3)',
        },
        '.text-neon-yellow': {
          color: '#FFF100',
          textShadow: '0 0 5px rgba(255, 241, 0, 0.5), 0 0 10px rgba(255, 241, 0, 0.3)',
        },
        '.text-neon-purple': {
          color: '#A855F7',
          textShadow: '0 0 5px rgba(168, 85, 247, 0.5), 0 0 10px rgba(168, 85, 247, 0.3)',
        },
        
        // Additional glow intensities (for emphasis)
        '.text-glow-cyan': {
          textShadow: '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        },
        '.text-glow-lime': {
          textShadow: '0 0 10px rgba(57, 255, 20, 0.5), 0 0 20px rgba(57, 255, 20, 0.3)',
        },
        '.text-glow-purple': {
          textShadow: '0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)',
        },
        '.text-glow-magenta': {
          textShadow: '0 0 10px rgba(255, 0, 240, 0.5), 0 0 20px rgba(255, 0, 240, 0.3)',
        },
        '.text-glow-yellow': {
          textShadow: '0 0 10px rgba(255, 241, 0, 0.5), 0 0 20px rgba(255, 241, 0, 0.3)',
        },
        
        // Strong glow for maximum emphasis (CTAs, alerts)
        '.text-glow-strong': {
          textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor',
        },
      });
      
      // Quadrant border utilities
      addUtilities({
        '.border-l-q1': {
          borderLeftWidth: '4px',
          borderLeftColor: '#39FF14',
        },
        '.border-l-q2': {
          borderLeftWidth: '4px',
          borderLeftColor: '#A855F7',
        },
        '.border-l-q3': {
          borderLeftWidth: '4px',
          borderLeftColor: '#00F0FF',
        },
        '.border-l-q4': {
          borderLeftWidth: '4px',
          borderLeftColor: '#64748B',
        },
      });
    },
  ],
  
  // ============================================================================
  // CORE PLUGINS (to enable)
  // ============================================================================
  corePlugins: {
    backdropBlur: true,
    backdropOpacity: true,
  },
};
