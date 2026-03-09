<script setup lang="ts">
import { 
    computed, 
    ref, 
    onMounted, 
    onBeforeUnmount
} from 'vue'
import Icon from '@/components/Icon/Main.vue'
import DefaultRafts from '@/components/Tile/Default.vue'
import CondensedRafts from '@/components/Tile/Condensed.vue'
import RaftSetupModal from '@/components/Overlay/Modal/RaftSetup.vue'
import TileModal from '@/components/Overlay/Modal/Tile.vue'
import { currentBatch, tiles, createTile } from '@/composables/testProcess'
import { useModal } from '@/composables/useModal'

const props = withDefaults(defineProps<{
    tileRef: string
    raftOrientation: 'west' | 'south' | 'east'
}>(), {
    raftOrientation: 'south'
})

const { showModal } = useModal()

const isMultiRaft = computed(() => {
    const tile = tiles.value[props.tileRef as any]
    return tile && tile.rafts && tile.rafts.length > 1
})

const isStandup = computed(() => {
    return tiles.value[props.tileRef]?.standup
})

async function createTileAndAddFirstRaft() {
    // create tile and 
    const newTile = await createTile(props.tileRef)
    console.log('new tile:', newTile)
    if (newTile) {
        await showModal(
        RaftSetupModal, 
        {
            raftSetup: {
                mode: 'create',
                tileId: newTile.id
            }
        }
    )
    }
}

async function handleClick() {
    const tile = tiles.value[props.tileRef as any]
    
    if (tile?.id) {
        // Tile exists, open tile modal
        await showModal(
            TileModal,
            {
                tileRef: props.tileRef
            }
        )
    } else {
        // Tile doesn't exist, create and add first raft
        await createTileAndAddFirstRaft()
    }
}

const tileExists = computed(() => {
    return tiles.value[props.tileRef] ? true : false
})
const raftCount = computed(() => {
    return tiles.value[props.tileRef]?.rafts?.length
})

const currentTime = ref(new Date())

onMounted(() => {
    const interval = setInterval(() => {
        currentTime.value = new Date()
    }, 60000) // Update every minute
    
    onBeforeUnmount(() => clearInterval(interval))
})

// comment_order
const checkpointStatus = computed(() => {
    const tile = tiles.value[props.tileRef]
    if (!tile?.rafts?.length) return null
    
    const now = currentTime.value
    let hasReachedCheckpoint = false
    let hasFiveMinutesAway = false
    let allRaftsComplete = true
    
    tile.rafts.forEach(raft => {
        const raftComplete = raft.pressure1Valid && raft.pressure2Valid
        
        if (raftComplete) return // Skip time checks for completed rafts
        
        allRaftsComplete = false
        
        // Determine which pressure time to check based on validation status
        const pressureTime = raft.pressure1Valid ? raft.time_pressure2 : raft.time_pressure1
        
        if (pressureTime) {
            const pressureDate = new Date(pressureTime)
            if (now > pressureDate) {
                hasReachedCheckpoint = true
            } else {
                const fiveMinBefore = new Date(pressureDate.getTime() - 5 * 60 * 1000)
                if (now >= fiveMinBefore) {
                    hasFiveMinutesAway = true
                }
            }
        }
    })
    
    if (allRaftsComplete) return 'testComplete'
    if (hasReachedCheckpoint) return 'checkpointReached'
    if (hasFiveMinutesAway) return 'fiveMinutesAway'
    return null
})
</script>

<template>
    <button 

        class="
            tile
            full
            flex column
            pointer
        "
        :class="checkpointStatus || (tileExists ? 'activeSurface': '')"
        @click.prevent.stop="handleClick"
    >
        <div
            v-if="currentBatch.id"
            class="
                centered grow
            "
        >
            <Icon
                v-if="!tileExists"
                size="xl"
            >
                add
            </Icon>

            <Icon
                v-if="tileExists && !raftCount"
                size="xl"
            >
                houseboat
            </Icon>

            <CondensedRafts
                v-if="raftCount && isStandup"
                :rafts="tiles[props.tileRef].rafts"
                :standup="true"
                :raftOrientation="raftOrientation"
            />

            <DefaultRafts
                v-if="raftCount && !isStandup"
                :rafts="tiles[props.tileRef].rafts"
                :standup="false"
                :raftOrientation="raftOrientation"
            />
        </div>
    </button>
</template>

<style scoped>
.tile {
    padding: 10px;
    outline: 1px solid rgba(255, 255, 255, 0.141);
    border-radius: 5px;
    box-shadow: 0 0 10px black;
    overflow: hidden;
}

.tile.existing {
    outline: 1px solid rgba(143, 255, 128, 0.141);
    background-color: rgb(34, 65, 34);
}

.tile.fiveMinutesAway {
    outline: 1px solid var(--outline-fiveMinutes);
    background-color: var(--bgc-fiveMinutes);
}

.tile.checkpointReached {
    outline: 1px solid var(--outline-reached);
    background-color: var(--bgc-reached);
}

.tile.testComplete {
    outline: 1px solid rgba(41, 204, 90, 0.5);
    background-color: rgba(38, 206, 89, 0.453);
}

.standupIcon {
    opacity: 0;
    transition: 300ms ease;
    rotate: 270deg;
}
.standupIcon.active {
    opacity: 1;
}
</style>

<!--
comment_order
checkpointStatus state hierarchy (order matters):
1. testComplete - all rafts have both pressures validated. This MUST win over time-based states,
   otherwise a tile stays yellow even after validation if we validated early.
2. checkpointReached - at least one raft has passed its checkpoint time without validation.
   Urgent: user needs to act now.
3. fiveMinutesAway - a checkpoint is coming soon. Heads-up, not urgent.
4. null - no pending checkpoints.

Completed rafts are skipped entirely in the forEach to prevent their future times
from triggering fiveMinutesAway after early validation.
-->