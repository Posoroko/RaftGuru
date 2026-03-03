import { defineNitroConfig } from 'nitropack'

export default defineNitroConfig({
    srcDir: './server',
    
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
        serverAccessToken: process.env.NITRO_SERVER_ACCESS_TOKEN || '',
        vapidPublicKey: 'BIdAR4wnsPoS3I-t9BF4gch698R8JoyIK_CyNcT89q9aLrR4mE_A2V_R26k8_MPtzoJxomotDlBIMJYtzm6hxqc',
        vapidPrivateKey: process.env.VAPID_PRIVATE || '',
        vapidEmail: 'mailto:eric@posoroko.com'
    },
    compatibilityDate: '2026-03-01'
})
