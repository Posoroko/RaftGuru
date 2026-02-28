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
    
    appState.value.initialized = true
}
