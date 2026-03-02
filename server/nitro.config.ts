import { defineNitroConfig } from 'nitropack'

export default defineNitroConfig({
    srcDir: 'server',
    rootDir: '.',
    
    // Build output directory
    buildDir: '.output',
    
    // Serve static files from dist/ (Vue build)
    public: {
        dir: './dist',
        maxAge: 60 * 60 * 24 * 365 // 1 year for assets
    },
    
    // Server configuration
    dev: true,
    nitroErrorHandler: true,
    
    // Environment variables
    runtimeConfig: {
        public: {
            apiBase: process.env.DIRECTUS_URL || 'http://localhost:3000'
        }
    },
    compatibilityDate: '2026-03-01'
})
