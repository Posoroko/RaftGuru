/**
 * WebSocket service for server-side Directus subscriptions
 * Single shared connection with subscription management
 */

export {
    initWebSocket,
    addSubscription,
    removeSubscription,
    closeWebSocket,
    isConnected
}

const WS_URL = process.env.DIRECTUS_WS_URL || 'wss://db.raftguru.posoroko.com/websocket'
const ACCESS_TOKEN = process.env.NITRO_SERVER_ACCESS_TOKEN || ''

let ws: WebSocket | null = null
let authenticated = false
const subscriptions = new Set<string>()

type MessageHandler = (msg: any) => void
const handlers = new Map<string, MessageHandler>()

let wsReadyPromise: Promise<void> | null = null

/**
 * Initialize WebSocket connection
 */
function initWebSocket(): Promise<void> {
    if (ws?.readyState === WebSocket.OPEN) {
        console.log('[Server WS] already connected')
        return Promise.resolve()
    }

    if (wsReadyPromise) {
        return wsReadyPromise
    }

    wsReadyPromise = new Promise<void>((resolve) => {
        ws = new WebSocket(WS_URL)

        ws.addEventListener('open', () => {
            console.log('[Server WS] connected, authenticating...')
            ws!.send(JSON.stringify({
                type: 'auth',
                access_token: ACCESS_TOKEN
            }))
        })

        ws.addEventListener('message', (event) => {
            const msg = JSON.parse(event.data.toString())

            // Handle auth response before dispatching
            if (msg.type === 'auth' && msg.status === 'ok') {
                authenticated = true
                console.log('[Server WS] ✓ authenticated')
                resolve()
                return
            }
            if (msg.type === 'auth' && msg.status === 'error') {
                console.error('[Server WS] ✗ auth failed:', msg.error)
                return
            }

            dispatcher(msg)
        })

        ws.addEventListener('close', () => {
            console.log('[Server WS] disconnected')
            ws = null
            wsReadyPromise = null
            authenticated = false
            subscriptions.clear()
            handlers.clear()
        })

        ws.addEventListener('error', (err) => {
            console.error('[Server WS] error:', err)
        })
    })

    return wsReadyPromise
}

/**
 * Add a subscription
 */
function addSubscription(
    uid: string,
    collection: string,
    handler: MessageHandler,
    filter?: any,
    fields?: string[]
) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.error('[Server WS] not connected')
        return
    }

    if (subscriptions.has(uid)) {
        console.log(`[Server WS] already subscribed to ${uid}`)
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

    console.log(`[Server WS] subscribed to ${uid}`)
}

/**
 * Remove a subscription
 */
function removeSubscription(uid: string) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.error('[Server WS] not connected')
        return
    }

    if (!subscriptions.has(uid)) {
        return
    }

    subscriptions.delete(uid)
    handlers.delete(uid)

    ws.send(JSON.stringify({
        type: 'unsubscribe',
        uid: uid
    }))

    console.log(`[Server WS] unsubscribed from ${uid}`)
}

/**
 * Handle incoming messages: ping/pong and route to handlers
 */
function dispatcher(msg: any) {
    const { uid, type } = msg

    if (type === 'ping') {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'pong' }))
        }
        return
    }

    console.log('[Server WS] message received:', JSON.stringify(msg).substring(0, 200))

    const handler = handlers.get(uid)
    if (handler) {
        handler(msg)
    } else {
        console.log('[Server WS] no handler for uid:', uid)
    }
}

/**
 * Close WebSocket and cleanup
 */
function closeWebSocket() {
    if (ws) {
        ws.close()
        ws = null
        subscriptions.clear()
        handlers.clear()
    }
    console.log('[Server WS] closed')
}

/**
 * Check connection status
 */
function isConnected(): boolean {
    return ws?.readyState === WebSocket.OPEN
}
