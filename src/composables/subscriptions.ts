/**
 * subscriptions.ts
 * 
 * App-specific subscription management for RaftGuru
 * High-level functions that use the generic websocket.ts
 * 
 * Pattern: Subscribe to collections with filters instead of individual items
 * - Batches collection (filter: isCurrent === true)
 * - Tiles collection (filter: batch === currentBatchId)
 * - Rafts collection (filter: tile.batch === currentBatchId)
 */

import { 
    addCollectionSubscription,
    removeSubscription
} from './websocket'
import { 
    reactToBatchCreate,
    reactToBatchUpdate,
    reactToBatchDelete,
    reactToRaftCreate,
    reactToRaftUpdate, 
    reactToRaftDelete,
    reactToTileCreate,
    reactToTileUpdate,
    reactToTileDelete
} from './subscriptionReactions'

import {
    loadBatch
} from '@/composables/testProcess'

export {
    initializeSubscriptions,
    startTilesSubscription,
    startRaftsSubscription,
    stopBatchSubscriptions
}


/**
 * Start watching the batches collection
 * Filters for isCurrent === true
 * App should call initializeCurrentBatch() when a current batch is detected
 * 
 * (Assumes WebSocket is already initialized via initWebSocket())
 */
function startBatchWatcher() {
    addCollectionSubscription(
        'batches-list',
        'batches',
        (msg) => {
            const event = msg.event

            if(event === 'create') {
                const batch = msg.data[0]
                reactToBatchCreate(batch)
            } else if(event === 'update') {
                reactToBatchUpdate(msg.data[0])
            } else if(event === 'delete') {
                reactToBatchDelete()
            }
        },
        { isCurrent: { _eq: true } },
        ['*,tiles.*,tiles.rafts.*']
    )
}


/**
 * Start subscription for tiles in a specific batch
 * Filters for batch === batchId
 */
function startTilesSubscription(batchId: string) {
    addCollectionSubscription(
        'tiles-list',
        'tiles',
        (msg) => {
            const event = msg.event

            if(event === 'create') {
                console.log('[WS] - tile created', msg.data)
                reactToTileCreate(msg.data[0])
            } else if(event === 'update') {
                reactToTileUpdate(msg.data[0])
            } else if(event === 'delete') {
                console.log('[WS] : Tile deleted event received')
                reactToTileDelete(msg.data[0])
            }
        },
        { batch: { _eq: batchId } },
        ['*','rafts.*']
    )
    console.log('[TileSubscription] started for batch', batchId)
}

/**
 * Stop subscription for tiles
 */
function stopTileSubscription() {
    removeSubscription('tiles-list')
    console.log('[TileSubscription] stopped')
}

/**
 * Start subscription for rafts in tiles of a specific batch
 * Note: Raft data is already included in tile subscriptions (fields: '*,rafts.*')
 * This subscription is not needed since tile updates contain full raft objects
 */
function startRaftsSubscription(batchId: string) {
    addCollectionSubscription(
        'rafts-list',
        'rafts',
        (msg) => {
            const event = msg.event

            if(event === 'create') {
                console.log('[WS] - Raft created', msg.data[0])
                reactToRaftCreate(msg.data[0])
            } else if(event === 'update') {
                reactToRaftUpdate(msg.data[0])
            } else if(event === 'delete') {
                reactToRaftDelete(msg.data[0])
            }
        },
        { },
        ['*,tile.ref']
    )
    console.log('[raftsubscription] started for batch', batchId)
}

/**
 * Stop subscription for rafts
 * Note: Since raft data comes through tile subscriptions, nothing to stop here
 */
function stopRaftSubscription() {
    // No separate raft subscription exists, so nothing to stop
    console.log('[RaftSubscription] stopped (using tile subscriptions)')
}

/**
 * Initialize all app-level subscriptions
 * Called once on app startup to watch for current batch changes
 * Tile and raft subscriptions are started separately when a batch is loaded
 */
function initializeSubscriptions() {
    startBatchWatcher()
    console.log('[subscriptions] initialized')
}

/**
 * Stop batch-specific subscriptions (tiles and rafts)
 * Called when a batch is closed
 */
function stopBatchSubscriptions() {
    stopTileSubscription()
    stopRaftSubscription()
    console.log('[subscriptions] tiles and rafts subscriptions stopped')
}


