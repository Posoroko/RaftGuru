import { ref, computed } from 'vue'
import { dbGet } from './fetch'

export { userState, getUserData, isConfigAdmin }

const userState = ref<{
    isLoggedIn: boolean
    first_name: string
    avatar: string
    email: string
    policies: string[]
}>({
    isLoggedIn: false,
    first_name: '',
    avatar: '',
    email: '',
    policies: []
})

const isConfigAdmin = computed(() => {
    return userState.value.policies.includes('configAdmin')
})

async function getUserData() {
    try {
        const data = await dbGet<any>({
            endpoint: '/users/me',
            query: { 
                fields: '*,policies.policy.name' 
            }
        })

        if (data) {
            const policyNames = (data.policies || [])
                .map((p: any) => p.policy?.name)
                .filter(Boolean)

            console.log('[user] raw policies:', data.policies)
            console.log('[user] parsed policy names:', policyNames)

            userState.value = {
                ...userState.value,
                isLoggedIn: true,
                first_name: data.first_name || '',
                avatar: data.avatar || '',
                email: data.email,
                policies: policyNames
            }
        }

        return data
    } catch (err) {
        console.log('[user] Failed to fetch user data:', err)
        userState.value.isLoggedIn = false
        return null
    }
}