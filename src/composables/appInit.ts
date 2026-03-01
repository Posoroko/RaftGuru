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