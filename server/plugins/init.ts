/**
 * Nitro server plugin
 * Initializes subscriptions and services on server startup
 */

import { 
    initializeServer, 
    shutdownServer 
} from '../utils/serverInit'

export default defineNitroPlugin(async function initPlugin(nitroApp) {
    console.log('Nitro server starting...')
    await initializeServer()
    
    nitroApp.hooks.hook('close', async function onClose() {
        console.log('Nitro server closing...')
        await shutdownServer()
    })
})
