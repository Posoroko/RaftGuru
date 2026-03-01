import { useAppState } from './useAppState'
import { useAuth } from './useAuth'
import { initializeCurrentBatch } from './testProcess'
import { initializeSubscriptions } from './subscriptions'
import { useUser } from '@/composables/useUser'

export const useAppInit = async () => {
    const appState = useAppState()
    const { autoLogin } = useAuth()

    if (appState.value.initialized) return

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
    window.addEventListener('pageshow', async () => {
        console.log('[appInit] App became active - refreshing data')

        location.reload()
        
        // Re-initialize subscriptions in case WebSocket disconnected
        // initializeSubscriptions()
        
        // Re-fetch current batch in case it was deleted or modified
        // await initializeCurrentBatch()
    })
}