// c5t_howTo
import webpush from 'web-push'
import { serverState } from './state'
import { PushSubscription } from '../types'

export { handleCheckpointReachedNotification }

// c5t_specs
async function handleCheckpointReachedNotification(checkpointData: CheckpointEvent) {
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

