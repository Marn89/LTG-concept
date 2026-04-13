import type { ThemeOptions } from '@mui/material/styles'
import { tokens } from './tokens'

export const components: ThemeOptions['components'] = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: 'transparent',
      },
    },
  },

  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: tokens.borderRadius.md,
        fontWeight: 600,
      },
    },
  },

  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: tokens.borderRadius.lg,
      },
    },
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: tokens.borderRadius.lg,
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      },
    },
  },

  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'small',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: tokens.borderRadius.md,
        },
      },
    },
  },

  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        color: tokens.colors.neutral[600],
        '&.Mui-selected': {
          color: tokens.colors.primary.main,
        },
      },
      label: {
        fontSize: '0.625rem !important',
      },
    },
  },

  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: '12px 16px',
        fontSize: '12px',
      },
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: tokens.borderRadius.sm,
      },
    },
  },
}
