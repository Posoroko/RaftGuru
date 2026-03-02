export { 
    getSubscriptionFromBrowser
}

// c5t_howTo
async function getSubscriptionFromBrowser() {
    console.log('[browser.getSubscriptionFromBrowser] Starting browser subscription retrieval...')
    
    // Check if Service Worker API is available
    if (!navigator.serviceWorker) {
        console.error('[browser.getSubscriptionFromBrowser] Service Worker API not available')
        throw new Error('Service Workers are not supported in this browser')
    }
    
    console.log('[browser.getSubscriptionFromBrowser] Service Worker API available')
    
    // Get service worker registration with timeout
    console.log('[browser.getSubscriptionFromBrowser] Waiting for Service Worker to be ready...')
    
    let registration
    try {
        const readyPromise = navigator.serviceWorker.ready
        
        // Set a 5-second timeout to avoid hanging
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Service Worker ready timeout - SW may not be registered')), 5000)
        )
        
        registration = await Promise.race([readyPromise, timeoutPromise])
        console.log('[browser.getSubscriptionFromBrowser] Service Worker registered:', registration)
    } catch (err) {
        console.error('[browser.getSubscriptionFromBrowser] Failed to get Service Worker registration:', err)
        console.log('[browser.getSubscriptionFromBrowser] Available registrations:', await navigator.serviceWorker.getRegistrations())
        throw err
    }
    
    // Get existing push subscription
    const subscription = await registration.pushManager.getSubscription()
    console.log('[browser.getSubscriptionFromBrowser] Current subscription:', subscription)
    
    if (!subscription) {
        console.error('[browser.getSubscriptionFromBrowser] No push subscription found - user may not have subscribed to push')
        throw new Error('No push subscription available from browser')
    }
    
    // Convert to JSON to access keys
    const subscriptionJSON = subscription.toJSON()
    console.log('[browser.getSubscriptionFromBrowser] Subscription JSON:', {
        endpoint: subscriptionJSON.endpoint ? '***' : 'missing',
        auth: subscriptionJSON.keys?.auth ? '***' : 'missing',
        p256dh: subscriptionJSON.keys?.p256dh ? '***' : 'missing'
    })
    
    if (!subscriptionJSON.endpoint || !subscriptionJSON.keys?.auth || !subscriptionJSON.keys?.p256dh) {
        console.error('[browser.getSubscriptionFromBrowser] Subscription missing required fields', subscriptionJSON)
        throw new Error('Push subscription missing required fields (endpoint, auth, p256dh)')
    }
    
    console.log('[browser.getSubscriptionFromBrowser] Successfully retrieved browser subscription')
    
    return {
        endpoint: subscriptionJSON.endpoint,
        auth: subscriptionJSON.keys.auth,
        p256dh: subscriptionJSON.keys.p256dh
    }
}

/*
c5t_howTo : getSubscriptionFromBrowser
Retrieves the browser's push notification subscription from the Service Worker.
Returns the endpoint, auth, and p256dh (public key) needed to save to Directus.

Usage:
    import { getSubscriptionFromBrowser } from '@/composables/browser'
    const subscription = await getSubscriptionFromBrowser()

c5t_specs : getSubscriptionFromBrowser
Real-world: The browser's Service Worker stores the active push subscription. We retrieve it
via pushManager and extract the endpoint and keys. If no subscription exists, user hasn't
opted in to push notifications yet and needs to be prompted with a subscription request.
Logs extensively to debug Service Worker and push subscription issues.
*/
