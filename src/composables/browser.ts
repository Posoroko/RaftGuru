export { 
    getSubscriptionFromBrowser
}

import appConfig from './appConfig'

// c5t_stack_01
async function getSubscriptionFromBrowser() {
    console.log('[browser] Getting push subscription...')
    
    if (!navigator.serviceWorker) {
        throw new Error('Service Workers not supported in this browser')
    }

    // Step 1: Wait for Service Worker to be ready
    const registration = await navigator.serviceWorker.ready
    console.log('[browser] Service Worker is ready')

    // Step 2: Check if already subscribed
    let subscription = await registration.pushManager.getSubscription()
    
    if (subscription) {
        console.log('[browser] Found existing subscription')
        return extractSubscriptionData(subscription)
    }

    // Step 3: Request notification permission
    console.log('[browser] Requesting notification permission...')
    const permission = await Notification.requestPermission()
    console.log('[browser] Permission result:', permission)
    
    if (permission !== 'granted') {
        throw new Error('Notification permission denied')
    }

    // Step 4: Subscribe to push with VAPID key
    if (!appConfig.vapidPublic) {
        throw new Error('VAPID public key not configured in appConfig')
    }

    console.log('[browser] Subscribing to push...')
    subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(appConfig.vapidPublic).buffer as ArrayBuffer
    })
    console.log('[browser] ✓ Subscribed to push')

    return extractSubscriptionData(subscription)
}

function extractSubscriptionData(subscription: PushSubscription) {
    const json = subscription.toJSON()
    
    if (!json.endpoint || !json.keys?.auth || !json.keys?.p256dh) {
        throw new Error('Subscription missing required fields')
    }

    return {
        endpoint: json.endpoint,
        auth: json.keys.auth,
        p256dh: json.keys.p256dh
    }
}

// c5t_stack_02
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

/*
c5t_stack_01 : getSubscriptionFromBrowser
Stack: Browser Push API / Service Worker / Notification API
Flow:
  1. navigator.serviceWorker.ready → wait for SW to be active
  2. pushManager.getSubscription() → check if already subscribed
  3. Notification.requestPermission() → browser prompts user "Allow notifications?"
  4. pushManager.subscribe() → creates subscription with VAPID public key
  5. Returns { endpoint, auth, p256dh } to save to Directus

The VAPID public key must match the private key on the server.
Set via VITE_VAPID_PUBLIC_KEY environment variable.

c5t_stack_02 : urlBase64ToUint8Array
pushManager.subscribe() requires applicationServerKey as Uint8Array.
VAPID public keys are base64url-encoded strings, so we convert.
*/
