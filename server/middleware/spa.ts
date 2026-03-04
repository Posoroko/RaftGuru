/**
 * SPA fallback middleware
 * Returns index.html for all non-API, non-file requests
 * so the Vue app handles routing client-side
 */

import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

export default defineEventHandler(async (event) => {
    const path = event.path || ''

    // Skip API routes
    if (path.startsWith('/api')) {
        return
    }

    // Skip static files (have an extension)
    if (path.includes('.')) {
        return
    }

    // In production, static files live in .output/public/
    // __dirname resolves to .output/server/ so ../public/ is the right path
    const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
    return sendFile(event, join(publicDir, 'index.html'))
})
