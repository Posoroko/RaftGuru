// ============================================================================
// 1 - PUSH NOTIFICATIONS
// 2 - PWA BASIC SUPPORT
// ============================================================================

// ============================================================================
// 1 - PUSH NOTIFICATIONS
// ============================================================================

// c5t_stack_01


function handleIncomingPush(event) {
    console.log('[service-worker] Push notification received')

    if (!event.data) {
        console.warn('[service-worker] Push event has no data')
        return
    }

    let notificationData
    try {
        notificationData = event.data.json()
    } catch (err) {
        console.warn('[service-worker] Could not parse push as JSON, using text fallback')
        notificationData = {
            title: 'TestGuru',
            body: event.data.text()
        }
    }

    const options = {
        body: notificationData.body || 'New notification',
        icon: '/icon-192.png',
        badge: '/favicon.png',
        tag: 'testguru-notification'
    }

    event.waitUntil(
        self.registration.showNotification(
            notificationData.title || 'TestGuru',
            options
        )
    )
}

function handleNotificationClick(event) {
    console.log('[service-worker] User clicked notification')
    event.notification.close()

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (let client of clientList) {
                if ('focus' in client) {
                    console.log('[service-worker] Focusing existing app window')
                    return client.focus()
                }
            }
            if (clients.openWindow) {
                console.log('[service-worker] Opening new app window')
                return clients.openWindow('/')
            }
        })
    )
}

self.addEventListener('push', handleIncomingPush)
self.addEventListener('notificationclick', handleNotificationClick)

// ============================================================================
// 2 - PWA BASIC SUPPORT
// ============================================================================

function handleInstall(event) {
    console.log('[service-worker] Installing service worker')
    self.skipWaiting()
}

function handleActivate(event) {
    console.log('[service-worker] Activating service worker')
    self.clients.claim()
}

self.addEventListener('install', handleInstall)
self.addEventListener('activate', handleActivate)

console.log('[service-worker] Service worker loaded')

/*

c5t_realWorld : TestGuru Notifications in the workshop.

    TestGuru helps life raft servicing technicians manage timed tasks. Each raft requires
    pressure measurements at specific intervals (e.g., inflate at 13:00, 1st check at 13:30, 2nd at 14:30).
    The technician walks around a grid-arranged floor with 5-11 rafts. Without notifications,
    they must repeatedly check a paper sheet and easily lose track of time.
    Notifications alert them: "Raft at [grid position] - 1st pressure measurement due now"
    This keeps them focused on the physical work instead of clock-watching.


c5t_stack_01 : Notification Flow

    our stack : client, nitro server and Directus app for DB.
    To sub to push nitifications, the client sends the sub data 
    directly to  directus in the "pushSubscriptions" collection.
    The nitro server has a websocket subscription to "pushSubscriptions" collection
    and the "rafts" collection. 
    when nitro gets an update, it send notifications
*/
