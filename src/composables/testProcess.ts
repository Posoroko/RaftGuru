import { ref } from 'vue'
import { dbPost, dbGet, dbPatch, dbDelete } from './fetch'
import { 
    startTilesSubscription,
    startRaftsSubscription, 
    stopBatchSubscriptions 
} from './subscriptions'

export { 
    currentBatch,
    resetCurrentBatchToDefault,
    resetTilesToDefault,
    tiles,
    currentTileForModal,
    initializeCurrentBatch,

    createNewBatch, loadBatch, closeBatch, 
    createTile, updateTile, deleteTile,
    createRaft, updateRaft, deleteRaft
}

const DEFAULT_BATCH = {
    id: "",
    tiles: [],
    date_created: "",
    isCurrent: false
}

function resetCurrentBatchToDefault() {
    currentBatch.value = DEFAULT_BATCH
}
function resetTilesToDefault() {
    tiles.value = DEFAULT_TILES
}
const DEFAULT_TILES = {
    'A-0': null,
    'A-1': null,
    'A-2': null,
    'B-0': null,
    'B-1': null,
    'B-2': null,
    'C-0': null,
    'C-1': null,
    'C-2': null,
    'D-0': null,
    'D-1': null,
    'D-2': null
}

const currentBatch = ref<Batch<false>>(DEFAULT_BATCH)
const tiles = ref<Record<TileRef, TileWithRafts | null>>(DEFAULT_TILES)

// Track current tile for modal operations
const currentTileForModal = ref<{ id: string; ref: TileRef } | null>(null)

/**
 * Initialize the app: load current batch and start batch subscriptions
 * Subscriptions are managed by initializeSubscriptions() and startBatchSubscriptions()
 */
async function initializeCurrentBatch() {
    try {
        const batch = await getCurrentBatch()
        if (batch) {
            await loadBatch(batch)
            console.log('[testProcess] initialized with batch:', batch.id)
        }
    } catch (err) {
        console.error('[testProcess] failed to initialize batch:', err)
    }
}

/**
 * Fetch the current batch from database
 * Fetches batch where isCurrent === true
 */
async function getCurrentBatch(): Promise<Batch<false> | null> {
    try {
        const batches = await dbGet<Batch<false>[]>({
            endpoint: '/items/batches',
            query: {
                filter: { isCurrent: { _eq: true } },
                fields: 'id,tiles,date_created,isCurrent',
                limit: 1
            }
        })
        return batches?.length ? batches[0] : null
    } catch (err) {
        console.error('[testProcess] failed to get current batch:', err)
        return null
    }
}

/**
 * Load a batch into local state
 * Fetches all tiles with their rafts and stores in tiles.value
 */
async function loadBatch(batch: Batch<false>) {
    try {
        currentBatch.value = {
            ...batch,
            tiles: batch.tiles || []
        }

        // Fetch all tiles for this batch with their rafts
        if (batch.tiles && batch.tiles.length > 0) {
            const batchTiles = await dbGet<TileDataFromDB[]>({
                endpoint: '/items/tiles',
                query: {
                    filter: { batch: { _eq: batch.id } },
                    fields: '*,rafts.*'
                }
            })

            batchTiles?.forEach(tile => {
                tiles.value[tile.ref as TileRef] = tile as any
            })
        }

        startTilesSubscription(batch.id)
        startRaftsSubscription(batch.id)

        console.log('[testProcess] batch loaded:', batch.id)
    } catch (err) {
        console.error('[testProcess] failed to load batch:', err)
    }
}

/**
 * Close the current batch
 */
async function closeBatch() {
    try {
        if (!currentBatch.value.id) return

        await dbDelete(`/items/batches/${currentBatch.value.id}`)

        console.log('[testProcess] batch closed')
    } catch (err) {
        console.error('[testProcess] failed to close batch:', err)
    }
}

/**
 * Create a new batch and initialize it
 */
async function createNewBatch() {
    try {
        await dbPost<Batch<false>>({
            endpoint: '/items/batches',
            body: {
                isCurrent: true
            }
        })
    } catch (err) {
        console.error('[testProcess] failed to create batch:', err)
    }
}

/**
 * Create a new tile in the current batch
 */
async function createTile(ref: TileRef) {
    try {
        if (!currentBatch.value.id) {
            console.warn('[testProcess] no active batch')
            return null
        }

        const newTile = await dbPost<TileDataFromDB>({
            endpoint: '/items/tiles',
            body: {
                ref,
                batch: currentBatch.value.id,
                standup: false,
                rafts: []
            }
        })

        console.log('[testProcess] tile created:', ref)
        return newTile
    } catch (err) {
        console.error('[testProcess] failed to create tile:', err)
        return null
    }
}

/**
 * Update a tile
 * @param tileId - The tile ID to update
 * @param updates - Partial tile data to update
 */
async function updateTile(tileId: TileId, updates: Partial<TileDataFromDB>): Promise<void> {
    try {
        await dbPatch({
            endpoint: `/items/tiles/${tileId}`,
            body: updates,
            query: { fields: '*,rafts.*' }
        })
        console.log('[testProcess] tile updated:', tileId)
    } catch (err) {
        console.error('[testProcess] failed to update tile:', err)
        throw err
    }
}

/**
 * Delete a tile - handles both app and websocket modes
 */
async function deleteTile(tileId: TileId) {
    try {
        await dbDelete(`/items/tiles/${tileId}`)
       
        console.log('[testProcess] tile deleted:', tileId)
    } catch (err) {
        console.error('[testProcess] failed to delete tile:', err)
    }
}

/**
 * Create a new raft in a tile
 * @param tileId - The tile ID where the raft will be placed
 * @param raftData - Raft data (without id, tile, user_created, user_updated)
 */
async function createRaft(tileId: TileId, raftData: Omit<Raft, 'id' | 'tile' | 'user_created' | 'user_updated'>): Promise<Raft | null> {
    try {
        const newRaft = await dbPost<Raft>({
            endpoint: '/items/rafts',
            body: { ...raftData, tile: tileId }
        })
        console.log('[testProcess] raft created:', newRaft?.id)
        return newRaft || null
    } catch (err) {
        console.error('[testProcess] failed to create raft:', err)
        return null
    }
}

/**
 * Update a raft
 * @param raftId - The raft ID to update
 * @param updates - Partial raft data to update
 */
async function updateRaft(raftId: RaftId, updates: Partial<Raft>): Promise<void> {
    try {
        await dbPatch({
            endpoint: `/items/rafts/${raftId}`,
            body: updates
        })
        console.log('[testProcess] raft updated:', raftId)
    } catch (err) {
        console.error('[testProcess] failed to update raft:', err)
        throw err
    }
}

/**
 * Delete a raft - handles both app and websocket modes
 */
async function deleteRaft(raftId: RaftId) {
    try {
        await dbDelete(`/items/rafts/${raftId}`)
        console.log('[testProcess] raft deleted:', raftId)
    } catch (err) {
        console.error('[testProcess] failed to delete raft:', err)
    }
}

// --- Types ---
type ManuallyEnteredString = string
type Timestamp = string

type User = {
    id: UserId
    email: string
    avatar: string
    first_name: string
}

type BatchId = string

type Batch<StoreFormat extends boolean = true> = {
    id: BatchId
    tiles: StoreFormat extends true ? Tile[] : TileId[]
    date_created: Timestamp
    isCurrent: boolean
}

type TileId = string
type TileRef = 'A-0' | 'A-1' | 'A-2' | 'B-0' | 'B-1' | 'B-2' | 'C-0' | 'C-1' | 'C-2' | 'D-0' | 'D-1' | 'D-2'

/**
 * Tile as stored in database (rafts are IDs)
 */
type TileDataFromDB = {
    id: TileId
    ref: TileRef
    standup: boolean
    rafts: RaftId[]
    batch: BatchId
    user_created: UserId | User
    user_updated: UserId | User
}

/**
 * Tile in our store (rafts are full objects, kept in sync)
 */
type TileWithRafts = {
    id: TileId
    ref: TileRef
    standup: boolean
    rafts: Raft[]
    batch: BatchId
    user_created: UserId | User
    user_updated: UserId | User
}

type RaftId = string

type Raft = {
    id: RaftId
    serialNumber?: string
    time_inflation: Timestamp
    time_pressure1: Timestamp
    pressure1Valid: boolean
    time_pressure2: Timestamp
    pressure2Valid: boolean
    tile: TileId
    user_created: UserId | User
    user_updated: UserId | User
}

type Measure = {
    id: string
    value: number
    user_created: UserId | User
    user_updated: UserId | User
}

