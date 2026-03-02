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
    clearActiveRafts
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

type Callbacks = {
    init: Function
    create: Function
    update: Function
    delete: Function
}