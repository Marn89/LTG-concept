import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App'
import { theme } from './theme'
import { PranesiamaiProvider } from './features/darbuotojas/PranesiamaiContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PranesiamaiProvider>
          <App />
        </PranesiamaiProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
