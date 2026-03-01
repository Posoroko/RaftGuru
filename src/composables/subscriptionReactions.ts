/**
 * subscriptionReactions.ts
 * 
 * Clean, focused reaction functions for WebSocket subscription messages
 * Uses cascading updates: batch updates → refetch all tiles, tile updates → update display
 */

import { tiles } from './testProcess'
import { dbGet } from './fetch'
import { 
    stopBatchSubscriptions 
} from './subscriptions'

import {
    currentBatch,
    loadBatch,
    resetCurrentBatchToDefault,
    resetTilesToDefault
} from '@/composables/testProcess'

export {
    reactToBatchCreate,
    reactToBatchUpdate,
    reactToBatchDelete,

    reactToRaftCreate,
    reactToRaftUpdate,
    reactToRaftDelete,

    reactToTileCreate,
    reactToTileUpdate,
    reactToTileDelete,
    
}

function reactToBatchCreate(batch: any) {
    loadBatch(batch)
}   
/**
 * React to a batch events
 */
async function reactToBatchUpdate(batch: any) {
    if(!batch.isCurrent) {
        reactToBatchDelete()
        return
    }

    try {
        currentBatch.value = batch

        console.log('[Reaction] batch updated:', batch.id)
    } catch (err) {
        console.error('[Reaction] failed to refetch batch tiles:', batch.id, err)
    }
}

function reactToBatchDelete() {
    try {
        location.reload()
        // resetCurrentBatchToDefault()
        // resetTilesToDefault()

        console.log('[Reaction] batch deleted, stopped subscriptions and cleared tiles:', batchId)
    } catch (err) {
        console.error('[Reaction] failed to delete batch tiles')
    }
}

/**
 * React to a raft events
 */
function reactToRaftCreate(raft: any) {
    try {
        const tile = tiles.value[raft.tile.ref]
        if (!tile || !tile.rafts) return

        tile.rafts = [
            ...tile.rafts,
            raft
        ]
        console.log('[Reaction] raft created in tile:', raft.id)
    } catch (err) {
        console.error('[Reaction] failed to create raft:', raft.id, err)
    }
}

function reactToRaftUpdate(raft: any) {
    try {
        const tile = tiles.value[raft.tile.ref]
        if (!tile || !tile.rafts) return

        // Find and update, or append if new
        const index = tile.rafts.findIndex((r: any) => r.id === raft.id)
        if (index >= 0) {
            tile.rafts[index] = raft
        } else {
            tile.rafts.push(raft)
        }

        console.log('[Reaction] raft updated in tile:', raft.id)
    } catch (err) {
        console.error('[Reaction] failed to update raft:', raft.id, err)
    }
}

function reactToRaftDelete(raftId: any) {
    console.log('tiles.value', tiles.value)
    try {
        for (const ref in tiles.value) {
            const tile = tiles.value[ref]
            
            if (tile && tile.rafts?.length) {
                console.log('bofore filtering:', tile.rafts[0])
                tile.rafts = tile.rafts.filter((r: any) => r.id != raftId)
                console.log('after filtering:', tile.rafts[0])
            }
        }
        console.log('[Reaction] raft deleted:', raftId)
    } catch (err) {
        console.error('[Reaction] failed to delete raft:', raftId, err)
    }
}

/**
 * React to a tile events
 */
function reactToTileCreate(tile: any) {
    try {
        tiles.value[tile.ref] = tile
        console.log('[Reaction] tile updated:', tile.ref)
    } catch (err) {
        console.error('[Reaction] failed to update tile:', tile.ref, err)
    }
}

function reactToTileUpdate(tile: any) {
    try {
        tiles.value[tile.ref] = {
            ...tile,
            rafts: tiles.value[tile.ref].rafts
        }
        console.log('[Reaction] tile updated:', tile.ref)
    } catch (err) {
        console.error('[Reaction] failed to update tile:', tile.ref, err)
    }
}

function reactToTileDelete(tileId: any) {
    console.log('[reactToTileDelete] : about to delete', tileId)
    try {
        for (const ref in tiles.value) {
            console.log('iterating:', ref, tiles.value[ref])

            if(tiles.value[ref]?.id == tileId) {
                tiles.value[ref] = null
            }
        }
        console.log(tiles.value)
    } catch (err) {
        console.error('[Reaction] failed to delete tile:', tileId, err)
    }
}

