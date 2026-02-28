<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import Icon from '@/components/Icon/Main.vue'
import TimeParser from '@/components/Widgets/TimeParser.vue'
import { useModal } from '@/composables/useModal'
import { tiles, updateTile, deleteTile as deleteTileHelper } from '@/composables/testProcess'
import RaftSetupModal from './RaftSetup.vue'
import RaftModal from './Raft.vue'

const { modalState, confirm, cancel, showModal } = useModal()

const tileRef = computed(() => {
    return modalState.value.data?.tileRef || 'Unknown'
})

const tile = computed(() => {
    return tiles.value[tileRef.value as any]
})

const isStandup = computed(() => {
    return tiles.value[tileRef.value]?.standup
})

const currentTime = ref(new Date())

onMounted(() => {
    const interval = setInterval(() => {
        currentTime.value = new Date()
    }, 60000) // Update every minute
    
    onBeforeUnmount(() => clearInterval(interval))
})

function isCheckpointReachedAny(): boolean {
    if (!tile.value?.rafts) return false
    const now = currentTime.value
    
    return tile.value.rafts.some(raft => {
        if (raft?.time_pressure1 && now > new Date(raft.time_pressure1)) return true
        if (raft?.time_pressure2 && now > new Date(raft.time_pressure2)) return true
        return false
    })
}

function isFiveMinutesAwayAny(): boolean {
    if (!tile.value?.rafts) return false
    const now = currentTime.value
    
    return tile.value.rafts.some(raft => {
        const fiveMinFromNow = new Date(now.getTime() + 5 * 60 * 1000)
        if (raft?.time_pressure1 && new Date(raft.time_pressure1) <= fiveMinFromNow && new Date(raft.time_pressure1) > now) return true
        if (raft?.time_pressure2 && new Date(raft.time_pressure2) <= fiveMinFromNow && new Date(raft.time_pressure2) > now) return true
        return false
    })
}

function getRaftCheckpointStatus(raft: any): string | null {
    if (!raft) return null
    const now = currentTime.value
    
    // Check if checkpoint reached
    if (raft?.time_pressure1 && now > new Date(raft.time_pressure1)) return 'checkpointReached'
    if (raft?.time_pressure2 && now > new Date(raft.time_pressure2)) return 'checkpointReached'
    
    // Check if checkpoint 5 minutes away
    const fiveMinFromNow = new Date(now.getTime() + 5 * 60 * 1000)
    if (raft?.time_pressure1 && new Date(raft.time_pressure1) <= fiveMinFromNow && new Date(raft.time_pressure1) > now) return 'fiveMinutesAway'
    if (raft?.time_pressure2 && new Date(raft.time_pressure2) <= fiveMinFromNow && new Date(raft.time_pressure2) > now) return 'fiveMinutesAway'
    
    return null
}

async function toggleStandup(value: boolean) {
    if (!tile.value) return
    
    if (value === tile.value.standup) return
    
    try {
        await updateTile(
            tile.value.id, 
            {
                standup: value
            }
        )
        console.log('[Tile Modal] standup toggled')
    } catch (err) {
        console.error('[Tile Modal] failed to toggle standup:', err)
    }
}

async function openNewRaftModal() {
    if (!tile.value?.id) return
    
    await showModal(
        RaftSetupModal, 
        {
            raftSetup: {
                mode: 'create',
                tileId: tile.value.id
            }
        }
    )
}

async function openRaftModal(raft: any) {
    if (!raft?.id) return
    
    await showModal(RaftModal, {
        tileRef: tileRef.value,
        raftId: raft.id
    })
}

async function deleteTile() {
    if (!tile.value?.id) return
    
    try {
        await deleteTileHelper(tile.value.id)
        console.log('[Tile Modal] Tile deleted')
        cancel()
    } catch (err) {
        console.error('[Tile Modal] failed to delete tile:', err)
    }
}

const raftCount = computed(() => {
    return tiles.value[modalState.value.data.tileRef]?.rafts?.length
})

const canAddRaft = computed(() => {
    const tile = tiles.value[modalState.value.data.tileRef]
    
    // Don't allow adding if tile doesn't exist or rafts haven't loaded
    if (!tile || !Array.isArray(tile.rafts)) {
        return false
    }

    if(!tile.standup && tile.rafts.length === 0) {
        return true
    }
    if(tile.standup && tile.rafts.length < 4) {
        return true
    }
    return false
})
</script>

<template>
    <div 
        class="
            flex column gap20
        "
    >
    
        <div 
            class="
                flex justifyBetween alignCenter
            "
        >
            <h2>
                Tile {{ tileRef }}
            </h2>
            
            <button
                @click.prevent.stop="cancel"
                class="pointer">
                ✕
            </button>
        </div>

        <div 
            class="
                flex column gap20
            "
        >
            <!-- Standup Toggle -->
            <div>
                <div
                    class="
                        flex alignCenter justifyEvenly gap10
                    "
                >
                    <p>
                        disposition
                    </p>
                    <div
                        class="
                            flex column pad5 standupBtn radius8
                        "
                        :class="[
                            isStandup ? 'activeSurface' : 'notActiveSurface pointer' 
                        ]"
                    >
                        <Icon
                            @click="toggleStandup(true)"
                            class="standupIcon storage"
                            size="xl"
                        >
                            storage
                        </Icon>

                        <span
                        >
                            debout
                        </span>
                    </div>

                    <div
                        class="flex column pad5 standupBtn radius8"
                        :class="[
                            !isStandup ? 'activeSurface ' : 'notActiveSurface pointer'
                        ]"
                    >
                        <Icon
                            @click="toggleStandup(false)"
                            class="standupIcon"
                            size="xl"
                        >
                            check_box_outline_blank
                        </Icon>

                        <span
                        >
                            normal
                        </span>
                    </div>
                </div>
            </div>

            <div
                v-if="canAddRaft"
                @click.stop="openNewRaftModal"
                class="
                    newRaftButton
                    flex alignCenter justifyCenter gap20 pad10 
                    pointer
                "
            >
                <Icon
                    size="xl"
                >
                    houseboat
                </Icon>

                <span>
                    ajouter
                </span>
            </div>

            <!-- Rafts Display -->
            <div 
                v-if="tile?.rafts?.length"
                class="flex column gap15 marTop20"
            >
                <h3>Radeaux</h3>
                <div 
                    v-for="(raft, idx) in tile.rafts"
                    :key="raft.id"
                    @click.stop="openRaftModal(raft)"
                    :class="[getRaftCheckpointStatus(raft)]"
                    class="flex justifyBetween gap10 pad10 radius8 raftRow pointer"
                    style="background-color: rgba(100, 100, 100, 0.2);"
                >
                    <div class="flex justifyBetween alignCenter">
                        <Icon>houseboat</Icon>
                        {{ raft.serialNumber || '' }}
                    </div>
                    
                    <div class="flex gap20">
                        <div class="flex column alignCenter">
                            <Icon>tire_repair</Icon>
                            <TimeParser 
                                :timestamp="raft.time_inflation"
                            />
                        </div>
                        <div class="flex column alignCenter">
                            <div
                                class="flex alignCenter gap5"
                            >
                                <Icon>speed</Icon>1
                            </div>
                            <TimeParser 
                                :timestamp="raft.time_pressure1"
                                :flashing="true"
                            />
                        </div>
                        <div class="flex column alignCenter">
                            <div
                                class="flex alignCenter gap5"
                            >
                                <Icon>speed</Icon>2
                            </div>
                            <TimeParser 
                                :timestamp="raft.time_pressure2"
                                :flashing="true"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Actions -->
            <div class="actions flex gap10">
                <button
                    @click="deleteTile"
                    class="
                        pointer
                    "
                >
                    Delete Tile
                </button>
            </div>
        </div>
    </div>
</template>


<style scoped>
.standupIcon {
    rotate: 270deg;
}
.standupBtn.notActiveSurface * {
    opacity: 0.2;
}
.standupBtn.activeSurface *{
    opacity: 1;
}
.newRaftButton {
    background-color: rgb(34, 65, 34);
    border-radius: 8px;
    outline: 1px solid rgba(143, 255, 128, 0.141);
}

.alarmStateWarning {
    border-left: 4px solid rgba(255, 165, 0, 0.8);
}

.alarmStateReached {
    border-left: 4px solid rgba(255, 0, 0, 0.8);
}

.raftRow.fiveMinutesAway {
    border-left: 4px solid var(--outline-reached);
    background-color: var(--bgc-reached);
}

.raftRow.checkpointReached {
    border-left: 4px solid var(--outline-reached);
    background-color: var(--bgc-reached) !important;
}
</style>
