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
    let isTestComplete = false
    
    // Check all rafts and their pressure times
    tile.rafts.forEach(raft => {
        // Check if test is complete: both pressures validated and time passed pressure2
        if (raft.pressure1Valid && raft.pressure2Valid && raft.time_pressure2) {
            const pressure2Date = new Date(raft.time_pressure2)
            if (now > pressure2Date) {
                isTestComplete = true
            }
        }
        
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
    
    if (isTestComplete) return 'testComplete'
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
                    flex alignCenter gap10 justifyCenter
                "
            >
                <div 
                    v-for="raft in tiles[props.tileRef].rafts"
                    class="
                        raftCulumn
                        h100
                        flex column alignCenter justifyCenter gap10
                    "
                >
                    <div 
                        class="
                            grow
                            centered
                        "
                    >
                        <Raft
                            :standup="isStandup"
                        />
                    </div>

                    <div 
                        v-if="!raft.pressure1Valid"
                        class="
                            grow
                            flex column alignCenter justifyEvenly
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
                                class="textXl fontWeightBold"
                            />
                        </div>
                    </div>

                    <div
                        v-if="raft.pressure1Valid && !raft.pressure2Valid"
                        class="
                            grow 
                            flex column alignCenter justifyEvenly
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
                                class="textXl fontWeightBold"
                            />
                        </div>
                    </div>

                    <div
                        v-if="raft.pressure1Valid && raft.pressure2Valid"
                        class="
                            grow
                            flex column alignCenter justifyCenter
                        "
                    >
                        <Icon
                            size="xl"
                        >
                            check_circle
                        </Icon>
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
