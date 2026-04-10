import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const NOTES_FILE = resolve(process.cwd(), 'notes.json')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'notes-api',
      configureServer(server) {
        server.middlewares.use('/api/notes', (req, res) => {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          if (req.method === 'GET') {
            const data = existsSync(NOTES_FILE) ? readFileSync(NOTES_FILE, 'utf-8') : '[]'
            res.end(data)
          } else if (req.method === 'POST') {
            let body = ''
            req.on('data', chunk => { body += chunk })
            req.on('end', () => {
              writeFileSync(NOTES_FILE, body, 'utf-8')
              res.end('{"ok":true}')
            })
          } else {
            res.end('{}')
          }
        })
      },
    },
  ],
})
