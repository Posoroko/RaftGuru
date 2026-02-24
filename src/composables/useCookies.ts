import { ref, watch } from 'vue'

export { useCookie }

function useCookie(name: string, defaultValue: string = '') {
    // Initialize from browser cookie
    const getCookieValue = () => {
        const match = document.cookie.match(new RegExp(`(^|;)\\s*${name}=([^;]+)`))
        return match ? decodeURIComponent(match[2]) : defaultValue
    }

    const value = ref(getCookieValue())

    // Sync ref to cookie whenever it changes
    watch(value, (newVal) => {
        if (newVal) {
            document.cookie = `${name}=${encodeURIComponent(newVal)}; Path=/; SameSite=Lax`
        } else {
            // Clear cookie if value is empty
            document.cookie = `${name}=; Max-Age=0; Path=/;`
        }
    })

    return value
}
