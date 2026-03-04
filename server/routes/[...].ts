/**
 * SPA catch-all route
 * Serves index.html for all non-API routes so Vue Router handles client-side routing
 */

import { join } from 'path'
import { readFileSync } from 'fs'

let indexHtml: string | null = null

export default defineEventHandler((event) => {
    // Skip API routes (handled by /server/api/)
    if (event.path?.startsWith('/api/')) {
        return
    }

    // Load index.html once and cache it
    if (!indexHtml) {
        try {
            const publicDir = join(process.cwd(), '.output', 'public')
            indexHtml = readFileSync(join(publicDir, 'index.html'), 'utf-8')
        } catch {
            throw createError({ statusCode: 500, message: 'index.html not found' })
        }
    }

    setResponseHeader(event, 'Content-Type', 'text/html')
    return indexHtml
})
