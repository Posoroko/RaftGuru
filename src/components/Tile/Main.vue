<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import Icon from '@/components/Icon/Main.vue'
import Raft from '@/components/Raft/Main.vue'
import TimeParser from '@/components/Widgets/TimeParser.vue'
import RaftSetupModal from '@/components/Overlay/Modal/RaftSetup.vue'
import TileModal from '@/components/Overlay/Modal/Tile.vue'
import { currentBatch, tiles, createTile } from '@/composables/testProcess'
import { useModal } from '@/composables/useModal'

const props = defineProps({
    tileRef: String
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

const checkpointStatus = computed(() => {
    const tile = tiles.value[props.tileRef]
    if (!tile?.rafts?.length) return null
    
    const now = currentTime.value
    let hasReachedCheckpoint = false
    let hasFiveMinutesAway = false
    
    // Check all rafts and their pressure times
    tile.rafts.forEach(raft => {
        // Check pressure 1
        if (raft.time_pressure1) {
            const p1Date = new Date(raft.time_pressure1)
            if (now > p1Date) {
                hasReachedCheckpoint = true
            } else {
                const fiveMinBefore = new Date(p1Date.getTime() - 5 * 60 * 1000)
                if (now >= fiveMinBefore) {
                    hasFiveMinutesAway = true
                }
            }
        }
        
        // Check pressure 2
        if (raft.time_pressure2) {
            const p2Date = new Date(raft.time_pressure2)
            if (now > p2Date) {
                hasReachedCheckpoint = true
            } else {
                const fiveMinBefore = new Date(p2Date.getTime() - 5 * 60 * 1000)
                if (now >= fiveMinBefore) {
                    hasFiveMinutesAway = true
                }
            }
        }
    })
    
    if (hasReachedCheckpoint) return 'checkpointReached'
    if (hasFiveMinutesAway) return 'fiveMinutesAway'
    return null
})
</script>

<template>
    <div 

        class="
            tile
            full
            flex column
            pointer
        "
        :class="checkpointStatus || (tileExists ? 'activeSurface': '')"
        @click="handleClick"
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

            <div 
                v-if="raftCount"
                class="
                    full
                    rafts
                    flex alignCenter gap10
                "
            >
                <div 
                    v-for="raft in tiles[props.tileRef].rafts"
                    class="
                        grow
                        flex column alignCenter gap10
                    "
                >
                    <Raft
                        :standup="isStandup"
                    />

                    <div 
                        v-if="!raft.pressure1Valid"
                        class="
                            grow
                            flex column alignCenter justifyCenter
                        "
                    >
                        <div
                            class="
                                flex gap5
                            "
                        >
                            <Icon>speed</Icon>
                            <span>1</span>
                        </div>

                        <div
                             
                            class="time textXl fontWeightBold"
                        >
                            <TimeParser
                                :timestamp="raft.time_pressure1"
                                flashing
                            />
                        </div>
                    </div>

                    <div
                        v-if="raft.pressure1Valid"
                        class="
                            grow
                            flex column alignCenter
                        "
                    >
                        <div
                            class="
                                flex gap5
                            "
                        >
                            <Icon>speed</Icon>
                            <span>2</span>
                        </div>

                        <div class="time">
                            <TimeParser
                                :timestamp="raft.time_pressure2"
                                flashing
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tile {
    padding: 10px;
    outline: 1px solid rgba(255, 255, 255, 0.141);
    border-radius: 5px;
    box-shadow: 0 0 10px black;
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

.standupIcon {
    opacity: 0;
    transition: 300ms ease;
    rotate: 270deg;
}
.standupIcon.active {
    opacity: 1;
}
</style>
