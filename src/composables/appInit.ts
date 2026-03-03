import { useAppState } from './useAppState'
import { useAuth } from './useAuth'
import { initializeCurrentBatch } from './testProcess'
import { initializeSubscriptions } from './subscriptions'
import { useUser } from '@/composables/useUser'

export const useAppInit = async () => {
    const appState = useAppState()
    const { autoLogin } = useAuth()

    if (appState.value.initialized) return

    // Register Service Worker for PWA and push notifications
    registerServiceWorker()

    // autoLogin establishes WebSocket connection and fetches user data
    await autoLogin()

    // Initialize subscriptions after WebSocket is connected
    initializeSubscriptions()

    const { userState } = useUser()

    // Initialize app with current batch from database
    if(userState.value.isLoggedIn) {
        await initializeCurrentBatch()
    }

    // Set up event listeners for app visibility changes
    initEventListeners()
    
    appState.value.initialized = true
}

function initEventListeners() {
    // visibilitychange fires when app returns from background on mobile
    document.addEventListener('visibilitychange', async () => {
        if (document.hidden) {
            console.log('[appInit] App going to background')
            return
        }
        
        console.log('[appInit] App became visible - refreshing data')
        location.reload()
    })
}

// ============================================================================
// Register Service Worker for PWA and Push Notifications
// ============================================================================
function registerServiceWorker() {
    // Check if browser supports Service Workers
    if (!navigator.serviceWorker) {
        console.warn('[appInit] Service Worker not supported in this browser')
        return
    }

    // Register the sw.js file from public folder
    navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
            console.log('[appInit] ✓ Service Worker registered')
            
            // Check for updates every 30 minutes
            setInterval(() => {
                registration.update()
            }, 30 * 60 * 1000)
        })
        .catch((err) => {
            console.error('[appInit] ✗ Service Worker registration failed:', err.message)
        })
}