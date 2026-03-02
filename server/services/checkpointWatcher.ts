/**
 * Checkpoint watcher
 * Monitors pressure times and triggers notifications when reached
 */

import { serverState } from './state'
import { handleCheckpointReachedNotification } from './push'

export {
    startCheckPressureTimes,
    stopCheckPressureTimes
}

let checkInterval: ReturnType<typeof setInterval> | null = null

// c5t_howTo
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

/*
c5t_howTo : startCheckPressureTimes
Initializes a recurring interval that monitors all active rafts for reached pressure checkpoints.
Guards against duplicate intervals by checking if one is already running.

Usage:
    import { startCheckPressureTimes } from '@/services/checkpointWatcher'
    startCheckPressureTimes()

c5t_specs : startCheckPressureTimes
Stops and resets if no batch or rafts exist. Runs checkPressureTimes() every 1 second.
Real-world: In water/pressure monitoring, pressure events have scheduled times. Users need IN REAL-TIME
notifications when these checkpoints are reached. Server-authoritative polling (not client-side) ensures
accurate discovery across all clients. 1-second interval provides <1sec latency while remaining efficient.
*/

// c5t_howTo
function stopCheckPressureTimes() {
    if (checkInterval) {
        clearInterval(checkInterval)
        checkInterval = null
        console.log('[CheckpointWatcher] Stopped')
    }
}

/*
c5t_howTo : stopCheckPressureTimes
Clears the active pressure check interval and resets state.

Usage:
    import { stopCheckPressureTimes } from '@/services/checkpointWatcher'
    stopCheckPressureTimes()

c5t_specs : stopCheckPressureTimes
Safely clears the interval reference and nullifies it. Safe to call even if not running.
*/

// c5t_howTo
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

/*
c5t_howTo : checkPressureTimes
Iterates all active rafts, compares scheduled pressure times against current system time,
and triggers onPressureReached when threshold is met (now >= scheduled_time).

Usage (called automatically from startCheckPressureTimes interval):
    checkPressureTimes()

c5t_specs : checkPressureTimes
Pressure events are time-based milestones. pressure1 is a scheduled measurement time, pressure2 is a
follow-up after pressure1 is marked valid. Sequential validation prevents notifying pressure2 when
pressure1 is incomplete. Uses getTime() to work in milliseconds for accurate threshold detection.
Real-world: This is the heartbeat check—runs every second to catch scheduled checkpoints across all
active rafts at near-real-time latency.
*/

// c5t_howTo
async function onPressureReached(raftId: string, checkpoint: 'pressure1' | 'pressure2') {
    console.log(`[CheckpointWatcher] ${checkpoint} reached for raft ${raftId}`)
    
    const pressureLevel = checkpoint === 'pressure1' ? 1 : 2

    await handleCheckpointReachedNotification({
        pressureLevel,
        tileRef: raftId,
        timestamp: new Date().toISOString()
    })
}

/*
c5t_howTo : onPressureReached
Maps checkpoint string to numeric pressure level (1 or 2) and dispatches a push notification
to all subscribers with the raft ID and current timestamp.

Usage (called from checkPressureTimes when time threshold met):
    onPressureReached(raftId, 'pressure1')

c5t_specs : onPressureReached
The trigger point when a pressure checkpoint arrives. ALL subscribers (across multiple clients/users)
need immediate push notifications. Converts internal checkpoint identifier to the data structure
expected by the push notification system, then sends asynchronously (awaited but non-blocking
to the interval loop via Promise). Real-world: This is where server notifications fire—users on
any device get alerted when their pressure measurement is due.
*/
