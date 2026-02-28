import { dbPost } from './fetch'
import { useUser } from './useUser'
import { initWebSocket } from './websocket'
import { initializeCurrentBatch } from '@/composables/testProcess'

export const useAuth = () => {

    const login = async (email: string, password: string) => {
        const loginSuccess = await dbPost<any>({
            endpoint: '/auth/login',
            body: { 
                email, 
                password,
                mode: 'session'
            }
        })

        console.log('logging in: ', loginSuccess)
        
        // Store access token for logout if needed
        if (loginSuccess?.access_token) {
            localStorage.setItem('raftguru_access_token', loginSuccess.access_token)
        }
        await initializeCurrentBatch()
        await initWebSocket()
        return loginSuccess
    }

    const autoLogin = async () => {

        try {
            console.log('auto login, getting user data')
            const { getUserData } = useUser()
            const result = await getUserData()
            await initializeCurrentBatch()
            await initWebSocket()
            return result
        } catch (err) {
            console.error('[useAuth] autoLogin failed:', err)
            return null
        }
    }

    const logout = async () => {
        try {
            const accessToken = localStorage.getItem('raftguru_access_token')
            const headers = accessToken ? { 'Authorization': `Bearer ${accessToken}` } : undefined
            
            await dbPost<any>({
                endpoint: '/auth/logout',
                body: {
                    mode: 'session'
                },
                headers
            })
        } catch (err) {
            console.error('[useAuth] logout error:', err)
        } finally {
            // Clear stored tokens regardless of API response
            localStorage.removeItem('raftguru_access_token')
            // Reload the app to reset all state
            location.reload()
        }
    }

    return {
        login,
        autoLogin,
        logout
    }
}
