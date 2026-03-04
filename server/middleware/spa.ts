/**
 * SPA fallback middleware
 * Returns index.html for all non-API, non-file requests
 * so the Vue app handles routing client-side
 */

import { join } from 'path'

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

    // Fallback to index.html
    return sendFile(event, join(process.cwd(), 'dist', 'index.html'))
})
