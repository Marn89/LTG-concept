import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App'
import { theme } from './theme'
import { CommentPanel } from './components/CommentPanel'
import { PranesiamaiProvider } from './features/darbuotojas/PranesiamaiContext'
import { WoFormProvider } from './features/vadovas/WoFormContext'
import { PranesimasFormProvider } from './features/darbuotojas/PranesimasFormContext'
import { WoProvider } from './features/vadovas/WoContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PranesiamaiProvider>
          <WoProvider>
            <WoFormProvider>
              <PranesimasFormProvider>
                <App />
                <CommentPanel />
              </PranesimasFormProvider>
            </WoFormProvider>
          </WoProvider>
        </PranesiamaiProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
