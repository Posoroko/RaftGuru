import { ref } from 'vue'

export {
    initWebSocket,
    addSubscription,
    addCollectionSubscription,
    removeSubscription,
    closeWebSocket,
    isConnected,
    getSubscriptions
}

const WS_URL = 'wss://db.raftguru.posoroko.com/websocket'

let ws: WebSocket | null = null
const subscriptions = new Set<string>()

// Promise to wait for WebSocket connection
let wsReadyPromise: Promise<void> | null = null

// Simple message dispatcher
type MessageHandler = (msg: any) => void
const dispatchers = new Map<string, MessageHandler>()

/**
 * Initialize WebSocket connection
 * Returns a promise that resolves when connection is open
 */
function initWebSocket(): Promise<void> {
    if (ws?.readyState === WebSocket.OPEN) {
        console.log('[WS] already connected')
        return Promise.resolve()
    }

    if (wsReadyPromise) {
        return wsReadyPromise
    }

    wsReadyPromise = new Promise<void>((resolve) => {
        ws = new WebSocket(WS_URL)

        ws.addEventListener('open', () => {
            console.log('[WS] connected')
            resolve()
        })

        ws.addEventListener('message', (event) => {
            const msg = JSON.parse(event.data)
            createDispatcher(msg)
        })

        ws.addEventListener('close', () => {
            console.log('[WS] disconnected')
            ws = null
            wsReadyPromise = null
            subscriptions.clear()
            dispatchers.clear()
        })

        ws.addEventListener('error', (err) => {
            console.error('[WS] error:', err)
        })
    })

    return wsReadyPromise
}

/**
 * Add a new subscription to watch a specific item
 * Can be a batch, tile, or raft
 */
function addSubscription(
    uid: string,
    collection: string,
    itemId: string,
    handler: MessageHandler,
    fields?: string[]
) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.error('[WS] WebSocket not connected')
        return
    }

    if (subscriptions.has(uid)) {
        console.log(`[WS] already subscribed to ${uid}`)
        return
    }

    subscriptions.add(uid)
    dispatchers.set(uid, handler)

    ws.send(JSON.stringify({
        type: 'subscribe',
        collection: collection,
        query: {
            filter: { id: { _eq: itemId } },
            ...(fields && { fields })
        },
        uid: uid
    }))

    console.log(`[WS] subscribed to ${uid}`)
}

/**
 * Add a collection-wide subscription with optional filter
 * Used for watching collections (e.g., all active batches) instead of specific items
 */
function addCollectionSubscription(
    uid: string,
    collection: string,
    handler: MessageHandler,
    filter?: any,
    fields?: string[]
) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.error('[WS] WebSocket not connected')
        return
    }

    if (subscriptions.has(uid)) {
        console.log(`[WS] already subscribed to ${uid}`)
        return
    }

    subscriptions.add(uid)
    dispatchers.set(uid, handler)

    ws.send(JSON.stringify({
        type: 'subscribe',
        collection: collection,
        query: {
            ...(filter && { filter }),
            ...(fields && { fields })
        },
        uid: uid
    }))

    console.log(`[WS] subscribed to ${uid}`)
}

/**
 * Remove subscription for an item
 */
function removeSubscription(uid: string) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.error('[WS] WebSocket not connected')
        return
    }

    if (!subscriptions.has(uid)) {
        console.log(`[WS] not subscribed to ${uid}`)
        return
    }

    subscriptions.delete(uid)
    dispatchers.delete(uid)

    ws.send(JSON.stringify({
        type: 'unsubscribe',
        uid: uid
    }))

    console.log(`[WS] unsubscribed from ${uid}`)
}

/**
 * Create dispatcher: route messages to appropriate handlers based on uid
 */
function createDispatcher(msg: any) {
    const { uid, type, data } = msg

    // Find handler for this uid
    const handler = dispatchers.get(uid)
    if (!handler) {
        console.warn(`[WS] no handler for uid: ${uid}`)
        return
    }

    // Handle different message types
    if (type === 'subscription') {
        // New data or update
        console.log(`[WS] subscription update for ${uid}:`, data)
        handler(msg)
    } else if (type === 'delete') {
        // Item was deleted
        console.log(`[WS] item deleted: ${uid}`)
        handler(msg)
    } else if (type === 'error') {
        // Error occurred
        console.error(`[WS] error for ${uid}:`, data)
    } else {
        console.log(`[WS] unknown message type "${type}" for ${uid}:`, data)
        handler(msg)
    }
}

/**
 * Close WebSocket connection and cleanup
 */
function closeWebSocket() {
    if (ws) {
        ws.close()
        ws = null
        subscriptions.clear()
        dispatchers.clear()
    }
    console.log('[WS] closed')
}

/**
 * Get connection status
 */
function isConnected(): boolean {
    return ws?.readyState === WebSocket.OPEN
}

/**
 * Get active subscriptions (for debugging)
 */
function getSubscriptions(): string[] {
    return Array.from(subscriptions)
}
