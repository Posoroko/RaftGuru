import { appState } from './appState'
import { useAuth } from './useAuth'
import { initializeCurrentBatch } from './testProcess'
import { initializeSubscriptions } from './subscriptions'
import { useUser } from '@/composables/useUser'
import { useStorage } from '@/composables/useStorage'

export const useAppInit = async () => {
    const { autoLogin } = useAuth()
    const { value: keepScreenOn } = useStorage('keepScreenOn', false)

    if (appState.value.initialized) return

    // Initialize keepScreenOn to false if not already set
    if (keepScreenOn.value === undefined) {
        keepScreenOn.value = false
    }

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