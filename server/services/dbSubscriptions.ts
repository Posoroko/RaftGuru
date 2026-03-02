/**
 * Subscription definitions
 * Uses websocket.ts to create subscriptions for batches and rafts
 */

import { 
    initWebSocket, 
    addSubscription, 
    removeSubscription, 
    closeWebSocket 
} from '../plugins/websocket'
import { 
    serverState, 
    setCurrentBatchId, 
    setRaft,
    deleteRaft,
    clearActiveRafts,
    setPushSubscription,
    deletePushSubscription,
    clearPushSubscriptions
} from './state'

export { 
    startSubscriptions, 
    stopSubscriptions 
}

async function startSubscriptions() {
    await initWebSocket()
    
    addSubscription(
        'batch-subscription',
        'batches',
        (msg) => dispatcher(
            msg, 
            batchesCallbacks
        ),
        { 
            status: { 
                _eq: 'active' 
            }
        }
    )

    startPushSubscriptions()
}

function startRaftSubscription(batchId: string) {
    addSubscription(
        'raft-subscription',
        'rafts',
        (msg) => dispatcher(msg, raftsCallbacks),
        { batch: { _eq: batchId } }
    )
}

function stopSubscriptions() {
    removeSubscription('batch-subscription')
    removeSubscription('raft-subscription')
    removeSubscription('push-subscriptions')
    closeWebSocket()
}

function dispatcher(
    message: any,
    callbacks: Callbacks
) {
    if (message.event === 'init') {
        callbacks.init(message)
    } else if (message.event === 'create') {
        callbacks.create(message)
    } else if (message.event === 'delete') {
        callbacks.delete(message)
    } else if (message.event === 'update') {
        callbacks.update(message)
    }
}

const batchesCallbacks = {
    init(message: any) {
        const batches = message.data
        if (batches?.length > 0) {
            clearActiveRafts()
            setCurrentBatchId(batches[0].id)
            startRaftSubscription(batches[0].id)
        }
    },
    create(message: any) {
        const batch = message.data?.[0]
        if (batch) {
            clearActiveRafts()
            setCurrentBatchId(batch.id)
            startRaftSubscription(batch.id)
        }
    },
    update(message: any) {
        // probably not much to do server side
    },
    delete(message: any) {
        removeSubscription('raft-subscription')
        clearActiveRafts()
        setCurrentBatchId(null)
    }
}

const raftsCallbacks = {
    init(message: any) {
        message.data?.forEach(setRaft)
    },
    create(message: any) {
        message.data?.forEach(setRaft)
    },
    update(message: any) {
        message.data?.forEach(setRaft)
    },
    delete(message: any) {
        if (!serverState.currentBatchId) {
            clearActiveRafts()
            return
        }
        message.data?.forEach((id: string) => deleteRaft(id))
    }
}

function startPushSubscriptions() {
    addSubscription(
        'push-subscriptions',
        'pushSubscriptions',
        (msg) => dispatcher(msg, pushSubscriptionsCallbacks)
    )
}

const pushSubscriptionsCallbacks = {
    init(message: any) {
        clearPushSubscriptions()
        message.data?.forEach(setPushSubscription)
        console.log(`[Subscriptions] Loaded ${serverState.pushSubscriptions.size} push subscriptions`)
    },
    create(message: any) {
        message.data?.forEach(setPushSubscription)
    },
    update(message: any) {
        message.data?.forEach(setPushSubscription)
    },
    delete(message: any) {
        if (typeof message.data === 'string') {
            deletePushSubscription(message.data)
        } else {
            message.data?.forEach((id: string) => deletePushSubscription(id))
        }
    }
}

type Callbacks = {
    init: Function
    create: Function
    update: Function
    delete: Function
}

/*
c5t_realWorld : startPushSubscriptions()
Push subscriptions are synced from Directus via WebSocket. We keep them in memory
(serverState.pushSubscriptions) so when a checkpoint event triggers, we can immediately
broadcast the notification to all subscribed clients without DB queries.

c5t_specs : pushSubscriptionsCallbacks
init - load all existing subscriptions from Directus on server startup
create - when client subscribes via Directus (adds new device/user combo)
update - when a subscription is modified (user data changes, endpoint updates)
delete - when client unsubscribes (removes the subscription entry)

On update, we replace (not merge) because user data or auth might have changed.
*/
