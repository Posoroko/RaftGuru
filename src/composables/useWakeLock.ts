export { useWakeLock }

import { ref } from 'vue'

// c5t_howTo
function useWakeLock() {
    let wakeLock: WakeLockSentinel | null = null
    const isActive = ref(false)
    const status = ref<'idle' | 'active' | 'error'>('idle')

    // c5t_howTo
    async function requestWakeLock() {
        try {
            // Check browser support
            if (!navigator.wakeLock) {
                console.warn('[useWakeLock] Wake Lock API not available in this browser')
                console.log('[useWakeLock] Supported on: Chrome 84+, Edge 84+, Opera 70+, Android Firefox (experimental)')
                status.value = 'error'
                return false
            }

            // Check if page is visible
            if (document.hidden) {
                console.warn('[useWakeLock] Page is hidden/backgrounded - wake lock won\'t work. Bring app to foreground.')
                status.value = 'error'
                return false
            }

            // Release existing lock first
            if (wakeLock) {
                console.log('[useWakeLock] Releasing previous wake lock...')
                await wakeLock.release()
                wakeLock = null
            }

            status.value = 'idle' // Show loading state
            console.log('[useWakeLock] Requesting wake lock...')
            wakeLock = await navigator.wakeLock.request('screen')
            
            console.log('[useWakeLock] ✓ Wake lock acquired successfully')
            console.log('[useWakeLock] Screen will stay enabled while app is in focus')

            isActive.value = true
            status.value = 'active'

            // Handle when wake lock is released
            wakeLock.addEventListener('release', () => {
                console.log('[useWakeLock] ⚠ Wake lock was released (user locked screen, battery saver, etc)')
                isActive.value = false
                status.value = 'idle'
                wakeLock = null
            })

            // Re-request if page becomes visible again
            const handleVisibilityChange = async () => {
                if (!document.hidden && !wakeLock) {
                    console.log('[useWakeLock] Page became visible, re-requesting wake lock...')
                    await requestWakeLock()
                }
            }

            document.addEventListener('visibilitychange', handleVisibilityChange)

            return true
        } catch (err) {
            if (err instanceof Error) {
                console.error('[useWakeLock] Failed to acquire wake lock:', err.message)
            } else {
                console.error('[useWakeLock] Failed to acquire wake lock:', err)
            }
            isActive.value = false
            status.value = 'error'
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
                console.log('[useWakeLock] ✓ Wake lock released - screen can sleep normally')
            }
            isActive.value = false
            status.value = 'idle'
        } catch (err) {
            if (err instanceof Error) {
                console.error('[useWakeLock] Failed to release wake lock:', err.message)
            } else {
                console.error('[useWakeLock] Failed to release wake lock:', err)
            }
        }
    }

    return {
        requestWakeLock,
        releaseWakeLock,
        isActive,
        status
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
