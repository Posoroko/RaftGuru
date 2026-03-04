/**
 * SPA catch-all route
 * Serves index.html for all non-API routes
 */

import { join } from 'path'
import { readFileSync, existsSync } from 'fs'

let indexHtml: string | null = null

export default defineEventHandler((event) => {
    const path = event.path || ''

    // Skip API routes
    if (path.startsWith('/api/')) {
        return
    }

    // Skip static file requests (assets, icons, sw, manifest, etc.)
    if (path.startsWith('/assets/') || 
        path.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|json|webmanifest|map)$/)) {
        return
    }

    // Load index.html once and cache it
    if (!indexHtml) {
        const candidates = [
            join(process.cwd(), '.output', 'public', 'index.html'),
            join(process.cwd(), 'dist', 'index.html'),
            join(process.cwd(), 'public', 'index.html'),
            join(process.cwd(), 'index.html'),
        ]

        for (const path of candidates) {
            if (existsSync(path)) {
                console.log('[SPA] Serving index.html from:', path)
                indexHtml = readFileSync(path, 'utf-8')
                break
            }
        }

        if (!indexHtml) {
            console.error('[SPA] index.html not found. Tried:', candidates)
            console.error('[SPA] cwd:', process.cwd())
            throw createError({ statusCode: 500, message: 'index.html not found' })
        }
    }

    setResponseHeader(event, 'Content-Type', 'text/html')
    return indexHtml
})
