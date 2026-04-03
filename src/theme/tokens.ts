/**
 * Raw design tokens — single source of truth for all primitive values.
 */
export const tokens = {
  colors: {
    primary: {
      main:         '#007749', // Sodriai žalia
      light:        '#00bf6f', // Ryškiai žalia
      dark:         '#115740', // Tamsiai žalia
      contrastText: '#ffffff',
    },
    secondary: {
      main:         '#ffdf00', // Ryškiai geltona
      light:        '#ffe633',
      dark:         '#ccb200',
      contrastText: '#000000',
    },
    neutral: {
      50:  '#fafafa',
      100: '#f5f5f5',
      200: '#eeeeee',
      300: '#e0e0e0',
      400: '#d0d3d4', // Pilka
      500: '#9e9e9e',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#000000', // Juoda
    },
    error:   '#d32f2f',
    warning: '#ed6c02',
    success: '#2e7d32',
    info:    '#0288d1',
    background: {
      default: '#f9fafb',
      paper:   '#ffffff',
    },
    text: {
      primary:   '#000000',
      secondary: '#757575',
      disabled:  '#d0d3d4',
    },
  },

  fontFamily: {
    base: '"Roboto", "Arial", sans-serif',
  },

  borderRadius: {
    sm:   4,
    md:   8,
    lg:  12,
    xl:  16,
    full: 9999,
  },

  spacing: {
    base: 8, // 1 MUI spacing unit = 8px
  },
} as const
