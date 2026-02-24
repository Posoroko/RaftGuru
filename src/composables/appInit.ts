import { useAppState } from './useAppState'
import { useAuth } from './useAuth'
import { loadCurrentBatch } from './testProcess'
import { startBatchWatcher } from './subscriptions'
import { useUser } from '@/composables/useUser'

export const useAppInit = async () => {
    const appState = useAppState()
    const { autoLogin } = useAuth()

    if (appState.value.initialized) return

    // autoLogin fetches user data and populates userState, then starts batch watcher
    await autoLogin()

    const { userState } = useUser()

    // Load current batch from database
    if(userState.value.isLoggedIn) {
        await loadCurrentBatch()
    }
    
    appState.value.initialized = true
}
