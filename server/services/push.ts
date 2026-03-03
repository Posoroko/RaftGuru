// c5t_howTo
import webpush from 'web-push'
import { serverState } from './state'
import { PushSubscription } from '../types'

export { 
    handleCheckpointReachedNotification,
    handleNewRaftNotification,
    initPush 
}

function initPush() {
    const config = useRuntimeConfig()
    const { vapidPublicKey, vapidPrivateKey, vapidEmail } = config

    if (!vapidPrivateKey) {
        console.error('[push] ✗ VAPID_PRIVATE not set in .env')
        return
    }

    webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey)
    console.log('[push] ✓ VAPID keys configured')
}

// c5t_specs
async function handleCheckpointReachedNotification(
    checkpointData: CheckpointEvent
) {
    const subscriptions = Array.from(serverState.pushSubscriptions.values())

    if (subscriptions.length === 0) {
        console.log('[Push] No subscriptions to notify')
        return
    }

    console.log(`[Push] Sending checkpoint notification to ${subscriptions.length} subscribers`)

    const promises = subscriptions.map(async sub => {
        const payload = createCheckpointReachedNotification(sub, checkpointData)
        await sendNotification(payload)
    })

    const results = await Promise.allSettled(promises)

    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error(`[Push] Failed to notify subscription ${index}:`, result.reason)
        }
    })
}

function createCheckpointReachedNotification(
    sub: PushSubscription, 
    data: CheckpointEvent
): WebPushPayload {
    const userName = typeof sub.user === 'string' ? sub.user : sub.user.first_name

    return {
        endpoint: sub.endpoint,
        keys: {
            auth: sub.auth,
            p256dh: sub.p256dh
        },
        data: {
            title: `Checkpoint ${data.pressureLevel}`,
            body: `Hey ${userName}, pressure ${data.pressureLevel} is due!`,
            badge: '/icon-192.png',
            tag: 'checkpoint-notification'
        }
    }
}

// c5t_specs_02
async function handleNewRaftNotification(raftData: NewRaftEvent) {
    const subscriptions = Array.from(serverState.pushSubscriptions.values())

    if (subscriptions.length === 0) {
        console.log('[push] No subscriptions to notify')
        return
    }

    console.log(`[push] Sending new raft notification to ${subscriptions.length} subscribers`)

    const promises = subscriptions.map(async sub => {
        const payload = createNewRaftNotification(sub, raftData)
        await sendNotification(payload)
    })

    const results = await Promise.allSettled(promises)

    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error(`[push] Failed to notify subscription ${index}:`, result.reason)
        }
    })
}

function createNewRaftNotification(
    sub: PushSubscription,
    data: NewRaftEvent
): WebPushPayload {
    return {
        endpoint: sub.endpoint,
        keys: {
            auth: sub.auth,
            p256dh: sub.p256dh
        },
        data: {
            title: 'New Raft Added',
            body: `Raft started — 1st pressure at ${data.time_pressure1}`,
            badge: '/icon-192.png',
            tag: `new-raft-${data.id}`
        }
    }
}

async function sendNotification(payload: WebPushPayload) {
    await webpush.sendNotification(
        {
            endpoint: payload.endpoint,
            keys: payload.keys
        },
        JSON.stringify(payload.data)
    )
}

interface CheckpointEvent {
    pressureLevel: 1 | 2
    tileRef: string
    timestamp: string
}

interface NewRaftEvent {
    id: string
    time_inflation: string
    time_pressure1: string
}

interface WebPushPayload {
    endpoint: string
    keys: {
        auth: string
        p256dh: string
    }
    data: {
        title: string
        body: string
        badge: string
        tag: string
    }
}

/*
c5t_specs_02 : handleNewRaftNotification
Sends a push notification to all subscribers when a new raft is created.
Used for testing the push flow — create a raft item in the app and
all subscribed devices receive a notification immediately.

c5t_howTo : handleCheckpointReachedNotification
Entry point when a checkpoint is detected. Gets all subscriptions, creates and sends notifications.

Usage:

    import { handleCheckpointReachedNotification } from '@/services/push'

    await handleCheckpointReachedNotification({
        pressureLevel: 1,
        tileRef: 'A-0',
        timestamp: new Date().toISOString()
    })


c5t_specs : handleCheckpointReachedNotification
Workflow: Get all subscriptions → Map each to (create payload + send) → Promise.allSettled to handle failures.
Uses Promise.allSettled so one bad subscription doesn't fail the entire batch.
Error logging but not throwing — other subscribers still get notified.
*/

