/**
 * subscriptions.ts
 * 
 * App-specific subscription management for RaftGuru
 * High-level functions that use the generic websocket.ts
 */

import { 
    initWebSocket, 
    addSubscription,
    addCollectionSubscription,
    removeSubscription 
} from './websocket'
import { getBatch, updateTile, updateRaft } from './testProcess'

export {
    startBatchWatcher,
    stopBatchWatcher,
    startMainSubscription,
    stopMainSubscription,
    addItem,
    removeItem
}


/**
 * Start watching the batches collection
 * Automatically loads new active batches when created
 * 
 * (Assumes WebSocket is already initialized via initWebSocket())
 */
function startBatchWatcher() {
    addCollectionSubscription(
        'batches-list',
        'batches',
        async (msg) => {
            // Only handle subscription messages (updates to batches)
            if (msg.type === 'subscription' && msg.data?.length) {
                const batches = msg.data as any[]
                
                batches.forEach(batch => {
                    if (batch.isCurrent === true) {
                        console.log('[BatchWatcher] active batch found:', batch.id)
                        getBatch(batch.id).catch(err => 
                            console.error('[BatchWatcher] failed to load batch:', err)
                        )
                    }
                })
            } else if (msg.type === 'delete') {
                // Batch deletion is handled by main subscription
                console.log('[BatchWatcher] batch deleted (handled by main subscription)')
            }
        },
        // No filter - subscribe to all batches, filter client-side for isCurrent=true
        undefined,
        ['id', 'isCurrent']
    )
}

/**
 * Stop watching the batches collection
 */
function stopBatchWatcher() {
    removeSubscription('batches-list')
    console.log('[BatchWatcher] stopped')
}

/**
 * Start main subscription for a specific batch
 * Subscribes to the batch and automatically cascades to tiles/rafts
 */
function startMainSubscription(batchId: string) {
    // Subscribe to this batch
    addSubscription(
        `batch-${batchId}`,
        'batches',
        batchId,
        (msg) => {
            if (msg.type === 'subscription' && msg.data?.length) {
                const batch = msg.data[0]
                console.log('[MainSubscription] batch updated:', batch)
                
                // Handle tiles cascade
                handleTilesCascade(batch.tiles || [])
            } else if (msg.type === 'delete') {
                console.log('[MainSubscription] batch was deleted:', batchId)
            }
        },
        ['id', 'tiles', 'date_created', 'isCurrent']
    )
}

/**
 * Stop main subscription for a batch and all its cascaded items
 */
function stopMainSubscription(batchId: string) {
    removeSubscription(`batch-${batchId}`)
    console.log('[MainSubscription] stopped for batch', batchId)
}

/**
 * Add subscription for a tile or raft
 * Used when a new item needs to be watched
 */
function addItem(
    uid: string,
    collection: 'tiles' | 'rafts',
    itemId: string,
    callback: ItemHandler
) {
    const fields = collection === 'tiles' 
        ? ['id', 'ref', 'standup', 'rafts', 'batch']
        : ['id', 'time_inflation', 'presure1', 'presure2', 'tile']

    addSubscription(
        uid,
        collection,
        itemId,
        (msg) => {
            if (msg.type === 'subscription' && msg.data?.length) {
                const item = msg.data[0]
                console.log(`[Item] ${collection} updated:`, item)

                // Update store based on collection type
                if (collection === 'tiles') {
                    updateTile(item)
                    // Handle cascade for rafts
                    if (item.rafts?.length) {
                        handleRaftsCascade(item.rafts)
                    }
                } else if (collection === 'rafts') {
                    updateRaft(item)
                }
            } else if (msg.type === 'delete') {
                console.log(`[Item] ${collection} was deleted:`, itemId)
            }

            callback(msg)
        },
        fields
    )
}

/**
 * Remove subscription for a tile or raft
 */
function removeItem(uid: string) {
    removeSubscription(uid)
    console.log('[Item] subscription removed:', uid)
}

/**
 * Internal: Handle cascade when tiles array changes
 * Subscribe to any new tiles not yet watched
 */
function handleTilesCascade(tileIds: string[]) {
    tileIds.forEach(tileId => {
        const uid = `tile-${tileId}`
        
        addItem(
            uid,
            'tiles',
            tileId,
            () => {}  // Tile updates are handled in addItem's subscription handler
        )
    })
}

/**
 * Internal: Handle cascade when rafts array changes
 * Subscribe to any new rafts not yet watched
 */
function handleRaftsCascade(raftIds: string[]) {
    raftIds.forEach(raftId => {
        const uid = `raft-${raftId}`
        
        addItem(
            uid,
            'rafts',
            raftId,
            () => {}  // Raft updates are handled in addItem's subscription handler
        )
    })
}


// --- Types ---

type ItemHandler = (msg: any) => void
