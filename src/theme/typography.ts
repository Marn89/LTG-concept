import type { ThemeOptions } from '@mui/material/styles'
import { tokens } from './tokens'

export const typography: ThemeOptions['typography'] = {
  fontFamily: tokens.fontFamily.base,

  h1: { fontSize: '2.5rem',   fontWeight: 700, lineHeight: 1.2  },
  h2: { fontSize: '2rem',     fontWeight: 700, lineHeight: 1.25 },
  h3: { fontSize: '1.75rem',  fontWeight: 600, lineHeight: 1.3  },
  h4: { fontSize: '1.5rem',   fontWeight: 600, lineHeight: 1.35 },
  h5: { fontSize: '1.25rem',  fontWeight: 600, lineHeight: 1.4  },
  h6: { fontSize: '1rem',     fontWeight: 600, lineHeight: 1.4  },

  body1:    { fontSize: '1rem',      lineHeight: 1.5 },
  body2:    { fontSize: '0.875rem',  lineHeight: 1.5 },

  button:   { fontSize: '0.875rem', fontWeight: 600, textTransform: 'none' },
  caption:  { fontSize: '0.75rem',  lineHeight: 1.4 },
  overline: { fontSize: '0.75rem',  fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' },
}
