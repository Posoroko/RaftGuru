import { ref } from 'vue'
import { dbGet } from './fetch'

export { useUser }

const userState = ref<{
    isLoggedIn: boolean
    first_name: string
    avatar: string
    email: string
}>({
    isLoggedIn: false,
    first_name: '',
    avatar: '',
    email: ''
})

const useUser = () => {
    const getUserData = async () => {
        try {
            const data = await dbGet<any>({
                endpoint: '/users/me'
            })

            if (data) {
                userState.value = {
                    ...userState.value,
                    isLoggedIn: true,
                    first_name: data.first_name || '',
                    avatar: data.avatar || '',
                    email: data.email
                }
            }

            return data
        } catch (err) {
            console.log('[useUser] Failed to fetch user data:', err)
            userState.value.isLoggedIn = false
            return null
        }
    }

    return {
        userState,
        getUserData
    }
}