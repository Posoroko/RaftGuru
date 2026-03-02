export { useWakeLock }

// c5t_howTo
function useWakeLock() {
    let wakeLock: WakeLockSentinel | null = null

    // c5t_howTo
    async function requestWakeLock() {
        try {
            if (!navigator.wakeLock) {
                console.log('[useWakeLock] Wake Lock API not available in this browser')
                return false
            }

            console.log('[useWakeLock] Requesting wake lock...')
            wakeLock = await navigator.wakeLock.request('screen')
            
            // Handle when user turns off screen manually or system timeout occurs
            wakeLock.addEventListener('release', () => {
                console.log('[useWakeLock] Wake lock was released')
                wakeLock = null
            })

            console.log('[useWakeLock] Wake lock acquired successfully')
            return true
        } catch (err) {
            console.error('[useWakeLock] Failed to acquire wake lock:', err)
            return false
        }
    }

    // c5t_howTo
    async function releaseWakeLock() {
        try {
            if (wakeLock) {
                console.log('[useWakeLock] Releasing wake lock...')
                await wakeLock.release()
                wakeLock = null
                console.log('[useWakeLock] Wake lock released')
            }
        } catch (err) {
            console.error('[useWakeLock] Failed to release wake lock:', err)
        }
    }

    return {
        requestWakeLock,
        releaseWakeLock
    }
}

/*
c5t_howTo : useWakeLock
Manages the browser's Wake Lock API to prevent the screen from sleeping.
Provides methods to acquire and release the wake lock on demand.

Usage:
    import { useWakeLock } from '@/composables/useWakeLock'
    const { requestWakeLock, releaseWakeLock } = useWakeLock()
    
    await requestWakeLock()  // Keep screen on
    await releaseWakeLock()   // Allow screen to sleep

c5t_specs : useWakeLock
Real-world: On mobile and tablets, the screen will auto-lock after a timeout. The Wake Lock API
prevents this programmatically. If the API isn't available, it fails gracefully - the app continues
to work but the screen won't stay on. Handles "release" events when the system releases the lock
(e.g., user manually locks device, battery saver mode, etc).
*/
