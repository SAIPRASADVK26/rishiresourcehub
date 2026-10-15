import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

// Vite plugin to auto-persist formsData to disk so Mobile & Vercel get real links
function autoSaveFormsPlugin() {
  return {
    name: 'auto-save-forms',
    configureServer(server) {
      server.middlewares.use('/api/save-forms', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              if (!Array.isArray(data) || data.length === 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: false, message: 'Invalid or empty centers data' }))
                return
              }
              const fileContent = `// Internal Forms Directory Data\n// Google Drive PDF links updated dynamically\n\nexport const centersData = ${JSON.stringify(data, null, 2)};\n`
              
              // 1. Primary hub path
              const primaryPath = path.resolve('src/data/formsData.js')
              fs.writeFileSync(primaryPath, fileContent, 'utf-8')
              
              // 2. Focused-pasteur workspace path
              const workspacePath = 'c:/Users/ADMIN/Documents/antigravity/focused-pasteur/src/data/formsData.js'
              if (fs.existsSync(path.dirname(workspacePath))) {
                fs.writeFileSync(workspacePath, fileContent, 'utf-8')
              }

              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: true, message: 'Forms saved to formsData.js' }))
            } catch (err) {
              console.error('Failed to save formsData.js:', err)
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ success: false, error: err.message }))
            }
          })
        } else {
          res.writeHead(405)
          res.end()
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    autoSaveFormsPlugin()
  ],
})
