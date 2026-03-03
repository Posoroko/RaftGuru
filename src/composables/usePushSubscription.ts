import { ref } from 'vue'
import { useUser } from './useUser'
import { useDirectusApi } from './directus'

export { usePushSubscription }

function usePushSubscription() {
    const { userState } = useUser()
    const isSubscribed = ref(false)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    
    // Get VAPID public key from environment
    const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || ''

    // ========================================================================
    // Request push subscription from browser
    // ========================================================================
    async function requestPushSubscription() {
        try {
            isLoading.value = true
            error.value = null
            
            console.log('[usePushSubscription] Requesting push subscription...')

            // Step 1: Check if Service Worker is ready
            if (!navigator.serviceWorker) {
                throw new Error('Service Worker not supported in this browser')
            }

            const registration = await navigator.serviceWorker.ready
            console.log('[usePushSubscription] Service Worker is ready')

            // Step 2: Check if already subscribed
            let subscription = await registration.pushManager.getSubscription()
            if (subscription) {
                console.log('[usePushSubscription] Already subscribed')
                isSubscribed.value = true
                return subscription
            }

            // Step 3: Ask user for notification permission
            console.log('[usePushSubscription] Requesting notification permission...')
            const permission = await Notification.requestPermission()
            
            if (permission !== 'granted') {
                throw new Error('User denied notification permission')
            }

            // Step 4: Subscribe to push notifications
            console.log('[usePushSubscription] Subscribing with VAPID key...')
            
            if (!VAPID_PUBLIC_KEY) {
                throw new Error('VAPID public key not configured')
            }

            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            })

            console.log('[usePushSubscription] ✓ Successfully subscribed')

            // Step 5: Save subscription to database
            await savePushSubscriptionToDB(subscription)

            isSubscribed.value = true
            return subscription
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            console.error('[usePushSubscription] Error:', message)
            error.value = message
            isSubscribed.value = false
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // ========================================================================
    // Save subscription details to Directus database
    // ========================================================================
    async function savePushSubscriptionToDB(subscription: PushSubscription) {
        console.log('[usePushSubscription] Saving to Directus...')

        const subscriptionJSON = subscription.toJSON()
        
        // Extract the three required fields
        const endpoint = subscriptionJSON.endpoint
        const auth = subscriptionJSON.keys?.auth
        const p256dh = subscriptionJSON.keys?.p256dh

        if (!endpoint || !auth || !p256dh) {
            throw new Error('Push subscription missing required fields')
        }

        const { directusApi } = useDirectusApi()

        const payload = {
            endpoint: endpoint,
            auth: auth,
            p256dh: p256dh,
            user: userState.value.id
        }

        const response = await directusApi.post('/items/pushSubscriptions', payload)
        console.log('[usePushSubscription] ✓ Saved to DB with ID:', response.data.id)
        
        return response.data
    }

    // ========================================================================
    // Unsubscribe from push notifications
    // ========================================================================
    async function unsubscribePush() {
        try {
            isLoading.value = true
            console.log('[usePushSubscription] Unsubscribing...')

            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()

            if (!subscription) {
                console.log('[usePushSubscription] No subscription to remove')
                isSubscribed.value = false
                return
            }

            // Remove from browser
            await subscription.unsubscribe()
            console.log('[usePushSubscription] ✓ Unsubscribed')

            // TODO: Remove from Directus database
            // const { directusApi } = useDirectusApi()
            // await directusApi.delete(`/items/pushSubscriptions/{id}`)
            
            isSubscribed.value = false
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err)
            console.error('[usePushSubscription] Error:', message)
            error.value = message
            throw err
        } finally {
            isLoading.value = false
        }
    }

    // ========================================================================
    // Check if user is currently subscribed
    // ========================================================================
    async function checkSubscriptionStatus() {
        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.getSubscription()
            
            if (subscription) {
                isSubscribed.value = true
                console.log('[usePushSubscription] User is subscribed')
            } else {
                isSubscribed.value = false
                console.log('[usePushSubscription] User is NOT subscribed')
            }
            
            return subscription
        } catch (err) {
            console.error('[usePushSubscription] Error checking status:', err)
            isSubscribed.value = false
            return null
        }
    }

    return {
        requestPushSubscription,
        unsubscribePush,
        checkSubscriptionStatus,
        isSubscribed,
        isLoading,
        error
    }
}

// ============================================================================
// Helper: Convert VAPID public key from base64 to Uint8Array
// The browser needs this format for push subscription
// ============================================================================
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    // Add padding if needed
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')

    // Convert to binary string, then to byte array
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    
    return outputArray
}
