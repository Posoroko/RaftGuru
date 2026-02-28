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

// Map of subscription handlers by uid
type MessageHandler = (msg: any) => void
const handlers = new Map<string, MessageHandler>()

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
            dispatcher(msg)
        })

        ws.addEventListener('close', () => {
            console.log('[WS] disconnected')
            ws = null
            wsReadyPromise = null
            subscriptions.clear()
            handlers.clear()
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
    handlers.set(uid, handler)

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
    handlers.set(uid, handler)

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
    handlers.delete(uid)

    ws.send(JSON.stringify({
        type: 'unsubscribe',
        uid: uid
    }))

    console.log(`[WS] unsubscribed from ${uid}`)
}

/**
 * Handle incoming WebSocket messages: ping/pong keepalive and route to handlers
 */
function dispatcher(msg: any) {
    const { uid, type } = msg

    // Handle ping/pong to keep connection alive
    if (type === 'ping') {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'pong' }))
        }
        return
    }

    // Route subscription messages to their handlers
    const handler = handlers.get(uid)
    if (handler) {
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
        handlers.clear()
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
