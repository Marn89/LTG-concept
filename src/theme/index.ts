import { createTheme } from '@mui/material/styles'
import { tokens } from './tokens'
import { typography } from './typography'
import { components } from './components'

export const theme = createTheme({
  palette: {
    primary:   tokens.colors.primary,
    secondary: tokens.colors.secondary,
    error:     { main: tokens.colors.error },
    warning:   { main: tokens.colors.warning },
    success:   { main: tokens.colors.success },
    info:      { main: tokens.colors.info },
    background: tokens.colors.background,
    text:       tokens.colors.text,
  },
  typography,
  components,
  spacing: tokens.spacing.base,
  shape: {
    borderRadius: tokens.borderRadius.md,
  },
})
