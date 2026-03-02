/**
 * State management for batch and raft tracking
 */

export { 
    serverState,
    setCurrentBatchId, 
    setRaft,
    deleteRaft,
    clearActiveRafts
}

const serverState = {
    currentBatchId: null as string | null,
    activeRafts: new Map<string, Raft>(), // this only stores rafts that still have future times.
    isInitialized: false
}

function setCurrentBatchId(batchId: string | null) {
    serverState.currentBatchId = batchId
    if (!batchId) {
        serverState.activeRafts.clear()
    }
}

function setRaft(
    raft: Raft
) {
    serverState.activeRafts.set(
        raft.id, 
        raft
    )
}

function deleteRaft(raftId: string) {
    serverState.activeRafts.delete(raftId)
}

function clearActiveRafts() {
    serverState.activeRafts.clear()
}

type Raft = {
    id: string
    batch: string
    time_inflation: string
    time_pressure1: string
    pressure1Valid: boolean
    time_pressure2: string
    pressure2Valid: boolean
}
