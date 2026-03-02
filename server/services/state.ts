/**
 * State management for batch and raft tracking
 */

import { PushSubscription } from '../types'

export { 
    serverState,
    setCurrentBatchId, 
    setRaft,
    deleteRaft,
    clearActiveRafts,
    setPushSubscription,
    deletePushSubscription,
    clearPushSubscriptions
}

const serverState = {
    currentBatchId: null as string | null,
    activeRafts: new Map<string, Raft>(),
    pushSubscriptions: new Map<string, PushSubscription>()
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

function setPushSubscription(sub: PushSubscription) {
    serverState.pushSubscriptions.set(sub.id, sub)
}

function deletePushSubscription(subId: string) {
    serverState.pushSubscriptions.delete(subId)
}

function clearPushSubscriptions() {
    serverState.pushSubscriptions.clear()
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
/*
c5t_specs : pushSubscriptions state
Map<subId, PushSubscription> kept in memory for fast notification lookups.
When a checkpoint triggers, we iterate over this Map to send notifications to all subscribers.
Source of truth is Directus; this is a cache that stays in sync via WebSocket updates.
*/