import { ref, watch } from 'vue'
import { dbPost, dbGet, dbPatch } from './fetch'
import { useCookie } from './useCookies'
import { startMainSubscription, stopMainSubscription } from './subscriptions'

export { 
    currentBatch,
    tiles,
    createNewBatch,
    getBatch,
    loadCurrentBatch,
    closeBatch,
    createTile,
    updateTile,
    updateRaft
}

// currentBatch.tiles holds an array of tile id's
// tiles store holds the full tile objects organized by their ref location (A-0, A-1, etc)
// each tile has its rafts as full raft objects that stay in sync via WebSocket
const currentBatch = ref<Batch<false>>({
    id: "",
    tiles: [],
    date_created: "",
    isCurrent: false
})

// Organized by location reference for easy grid access
const tiles = ref<Record<TileRef, TileWithRafts | null>>({
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
})

const batchCookie = useCookie('current_batch')

// Keep cookie in sync with currentBatch.id
watch(currentBatch, (batch) => {
    batchCookie.value = batch?.id ?? ''
}, { deep: true })

async function createNewBatch() {
    console.log('creating new batch')
    const newBatch = await dbPost<Batch<false>>({
        endpoint: '/items/batches',
        body: { 
            isCurrent: true
        },
        query: {
            fields: 'id,tiles,date_created,isCurrent'
        }
    })

    console.log('new batch created:', newBatch)
    currentBatch.value = {
        ...newBatch,
        tiles: newBatch.tiles || []
    }
    startMainSubscription(newBatch.id)

    return currentBatch.value
}

async function getBatch(id?: string) {
    if (id) {
        // Get specific batch by id
        const batch = await dbGet<Batch<false>>({
            endpoint: `/items/batches/${id}`,
            query: {
                fields: 'id,tiles,date_created,isCurrent'
            }
        })

        if (batch) {
            currentBatch.value = {
                ...batch,
                tiles: batch.tiles || []
            }
            startMainSubscription(id)
        }
    } else {
        // Get the currently active batch (where isCurrent === true)
        const batches = await dbGet<Batch<false>[]>({
            endpoint: '/items/batches',
            query: {
                filter: { 
                    isCurrent: { 
                        _eq: true 
                    }
                },
                fields: 'id,tiles,date_created,isCurrent',
                limit: 1
            }
        })

        if (batches?.length) {
            const batch = batches[0]
            currentBatch.value = {
                ...batch,
                tiles: batch.tiles || []
            }
            startMainSubscription(batch.id)
        }
    }

    return currentBatch.value
}

async function loadCurrentBatch() {
    // Fetch the batch marked as isCurrent (no need for cookie anymore)
    return await getBatch()
}

/**
 * Close the current batch by setting isCurrent to false
 */
async function closeBatch() {
    if (!currentBatch.value.id) {
        console.warn('[testProcess] no active batch to close')
        return
    }

    try {
        await dbPatch({
            endpoint: `/items/batches/${currentBatch.value.id}`,
            body: { 
                isCurrent: null
            }
        })
        console.log('[testProcess] batch closed:', currentBatch.value.id)
        currentBatch.value = { id: "", tiles: [], date_created: "", isCurrent: false }
        stopMainSubscription(currentBatch.value.id)
    } catch (err) {
        console.error('[testProcess] failed to close batch:', err)
    }
}

/**
 * Create a new tile in the current batch
 */
async function createTile(ref: TileRef) {
    if (!currentBatch.value.id) {
        console.warn('[testProcess] no active batch to create tile in')
        return null
    }

    try {
        const newTile = await dbPost<TileDataFromDB>({
            endpoint: '/items/tiles',
            body: {
                ref,
                batch: currentBatch.value.id,
                standup: false,
                rafts: []
            },
            query: {
                fields: 'id,ref,standup,rafts,batch,user_created,user_updated'
            }
        })

        // Add to currentBatch.tiles array if not already there
        if (!currentBatch.value.tiles.includes(newTile.id)) {
            currentBatch.value.tiles.push(newTile.id)
        }

        // Update tiles store
        updateTile(newTile)
        
        console.log('[testProcess] tile created:', newTile)
        return newTile
    } catch (err) {
        console.error('[testProcess] failed to create tile:', err)
        return null
    }
}

/**
 * Update or add a tile to the tiles store
 * Called when tile subscription receives updates
 */
function updateTile(tileData: TileDataFromDB) {
    const ref = tileData.ref as TileRef
    if (!tiles.value.hasOwnProperty(ref)) {
        console.warn(`[tiles] invalid tile ref: ${ref}`)
        return
    }

    if (!tiles.value[ref]) {
        // Create new tile entry
        tiles.value[ref] = {
            ...tileData,
            rafts: []
        }
    } else {
        // Update existing tile (but preserve rafts array)
        const existingRafts = tiles.value[ref]!.rafts
        tiles.value[ref] = {
            ...tileData,
            rafts: existingRafts
        }
    }

    console.log(`[tiles] updated "${ref}":`, tiles.value[ref])
}

/**
 * Update or add a raft to the correct tile's rafts array
 * Called when raft subscription receives updates
 */
function updateRaft(raftData: Raft) {
    // Find which tile this raft belongs to
    const tileRef = Object.entries(tiles.value).find(
        ([_, tile]) => tile?.id === raftData.tile
    )?.[0] as TileRef | undefined

    if (!tileRef || !tiles.value[tileRef]) {
        console.warn(`[rafts] tile not found for raft ${raftData.id}`)
        return
    }

    const tile = tiles.value[tileRef]!
    const existingIndex = tile.rafts.findIndex(r => r.id === raftData.id)

    if (existingIndex >= 0) {
        // Update existing raft
        tile.rafts[existingIndex] = raftData
    } else {
        // Add new raft
        tile.rafts.push(raftData)
    }

    console.log(`[rafts] updated raft in "${tileRef}":`, raftData)
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
    time_inflation: Timestamp
    presure1: number
    presure2: number
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

