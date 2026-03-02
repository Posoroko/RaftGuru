/**
 * Checkpoint watcher
 * Monitors pressure times and triggers notifications when reached
 */

import { serverState } from './state'

export {
    startCheckPressureTimes,
    stopCheckPressureTimes
}

let checkInterval: ReturnType<typeof setInterval> | null = null

/**
 * Start the pressure time check loop (runs every second)
 */
function startCheckPressureTimes() {
    if (checkInterval) {
        console.log('[CheckpointWatcher] Already running')
        return
    }

    console.log('[CheckpointWatcher] Starting...')
    
    checkInterval = setInterval(() => {
        // Stop if no batch or no rafts
        if (!serverState.currentBatchId || serverState.activeRafts.size === 0) {
            console.log('[CheckpointWatcher] No batch or rafts, stopping...')
            stopCheckPressureTimes()
            return
        }

        checkPressureTimes()
    }, 1000)
}

/**
 * Stop the pressure time check loop
 */
function stopCheckPressureTimes() {
    if (checkInterval) {
        clearInterval(checkInterval)
        checkInterval = null
        console.log('[CheckpointWatcher] Stopped')
    }
}

/**
 * Check all active rafts for reached pressure times
 */
function checkPressureTimes() {
    const now = Date.now()

    for (const [raftId, raft] of serverState.activeRafts) {
        // Check pressure1
        if (!raft.pressure1Valid && raft.time_pressure1) {
            const p1Time = new Date(raft.time_pressure1).getTime()
            if (now >= p1Time) {
                onPressureReached(raftId, 'pressure1')
            }
        }

        // Check pressure2
        if (raft.pressure1Valid && !raft.pressure2Valid && raft.time_pressure2) {
            const p2Time = new Date(raft.time_pressure2).getTime()
            if (now >= p2Time) {
                onPressureReached(raftId, 'pressure2')
            }
        }
    }
}

/**
 * Called when a pressure checkpoint is reached
 */
function onPressureReached(raftId: string, checkpoint: 'pressure1' | 'pressure2') {
    console.log(`[CheckpointWatcher] ${checkpoint} reached for raft ${raftId}`)
    // TODO: Send notification to clients
}
