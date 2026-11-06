import type { BearThemeOverride, CustomVariantsMap } from '@forgedevstack/bear';

export const BABY_CORAL = {
  50: '#FFF0F0',
  100: '#FFE0E0',
  200: '#FFC2C2',
  300: '#FFA3A3',
  400: '#FF8A8A',
  500: '#FF7A7A', // Warm Coral
  600: '#E86262',
  700: '#C94949',
  800: '#A33333',
  900: '#7A2222',
  950: '#4D1212',
} as const;

export const BABY_NEUTRAL = {
  50: '#FFFDFB',
  100: '#FBF7F2',
  200: '#F0EBE6',
  300: '#DDD5CD',
  400: '#A89E95',
  500: '#71788E',
  600: '#4F5466',
  700: '#3A3E4E',
  800: '#2D3142', // Dark Text
  900: '#1C1F2B',
  950: '#0E1017',
} as const;

export const babyDailyTheme: BearThemeOverride = {
  colors: {
    primary: BABY_CORAL,
    secondary: BABY_NEUTRAL,
  },
  typography: {
    fontFamily: {
      sans: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
};

export const babyDailyVariants: CustomVariantsMap = {
  babyCoral: {
    bg: '#FF7A7A',
    bgHover: '#E86262',
    text: '#ffffff',
    ring: '#FFA3A3',
  },
  babyMint: {
    bg: '#48C78E',
    bgHover: '#34A873',
    text: '#ffffff',
    ring: '#64D3A1',
  },
  babyLavender: {
    bg: '#8C7AE6',
    bgHover: '#7361CE',
    text: '#ffffff',
    ring: '#A495EC',
  },
  babyOutline: {
    bg: 'transparent',
    bgHover: '#FFF0F0',
    text: '#FF7A7A',
    border: '#FF7A7A',
  },
};
