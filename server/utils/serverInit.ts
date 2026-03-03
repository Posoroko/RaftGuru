/**
 * Server initialization
 * Called on startup to initialize subscriptions and services  
 */

import { serverState } from '../services/state'
import { startSubscriptions, stopSubscriptions } from '../services/dbSubscriptions'
import { initPush } from '../services/push'

export { initializeServer, shutdownServer }

async function initializeServer() {
    console.log('Initializing server...')
    
    try {
        initPush()
        await startSubscriptions()
        serverState.isInitialized = true
        console.log('Server initialization complete')
    } catch (error) {
        console.error('Server initialization failed:', error)
        throw error
    }
}

async function shutdownServer() {
    console.log('Shutting down server...')
    
    try {
        stopSubscriptions()
        serverState.isInitialized = false
        console.log('Server shutdown complete')
    } catch (error) {
        console.error('Server shutdown failed:', error)
    }
}
