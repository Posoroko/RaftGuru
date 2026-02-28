<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Icon from '@/components/Icon/Main.vue'
import TimeParser from '@/components/Widgets/TimeParser.vue'
import { useModal } from '@/composables/useModal'
import { tiles, updateRaft, deleteRaft } from '@/composables/testProcess'
import NewRaftModal from './RaftSetup.vue'

const { modalState, cancel, showModal } = useModal()

const tileRef = computed(() => {
    return modalState.value.data?.tileRef
})

const raftId = computed(() => {
    return modalState.value.data?.raftId
})

const raft = computed(() => {
    const tile = tiles.value[tileRef.value as any]
    if (!tile?.rafts) return null
    return tile.rafts.find((r: any) => r.id === raftId.value) || null
})

// Watch for raft deletion by another user
watch(raft, (newRaft) => {
    if (newRaft === null) {
        console.log('[Raft Modal] Raft was deleted by another user')
        cancel()
    }
}, { immediate: true })

const currentTime = ref(new Date())

onMounted(() => {
    const interval = setInterval(() => {
        currentTime.value = new Date()
    }, 60000) // Update every minute
    
    onBeforeUnmount(() => clearInterval(interval))
})

function getLocalISOString(date: Date): string {
    // Create ISO string using LOCAL time, not UTC
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
}

function isCheckpointReached(timestamp: string): boolean {
    if (!timestamp) return false
    return currentTime.value > new Date(timestamp)
}

function isFiveMinutesAway(timestamp: string): boolean {
    if (!timestamp) return false
    const fiveMinFromNow = new Date(currentTime.value.getTime() + 5 * 60 * 1000)
    const checkpointTime = new Date(timestamp)
    return checkpointTime <= fiveMinFromNow && checkpointTime > currentTime.value
}

function canValidatePressure1(): boolean {
    if (!raft.value?.time_pressure1) return false
    if (raft.value?.pressure1Valid) return false
    return isFiveMinutesAway(raft.value.time_pressure1) || isCheckpointReached(raft.value.time_pressure1)
}

function canValidatePressure2(): boolean {
    if (!raft.value?.time_pressure2) return false
    if (raft.value?.pressure2Valid) return false
    return isFiveMinutesAway(raft.value.time_pressure2) || isCheckpointReached(raft.value.time_pressure2)
}

async function validatePressure1() {
    if (!raft.value?.id) return
    
    try {
        await updateRaft(raft.value.id, {
            pressure1Valid: true
        })
        console.log('[Raft Modal] Pressure 1 validated')
        cancel()
    } catch (err) {
        console.error('[Raft Modal] failed to validate pressure1:', err)
    }
}

async function validatePressure2() {
    if (!raft.value?.id) return
    
    try {
        await updateRaft(raft.value.id, {
            pressure2Valid: true
        })
        console.log('[Raft Modal] Pressure 2 validated')
        cancel()
    } catch (err) {
        console.error('[Raft Modal] failed to validate pressure2:', err)
    }
}

async function resetRaft() {
    if (!raft.value?.id) return
    
    await showModal(NewRaftModal, {
        raftSetup: {
            mode: 'reset',
            resetRaftId: raft.value.id,
            tileId: raft.value.tile
        }
    })
}

async function deleteRaftHandler() {
    
    try {
        await deleteRaft(raft.value.id)
        console.log('[Raft Modal] Raft deleted')
        cancel()
    } catch (err) {
        console.error('[Raft Modal] failed to delete raft:', err)
    }
}

const pressure1Status = computed(() => {
    if (!raft.value?.time_pressure1) return null
    if (raft.value?.pressure1Valid) return 'valid'
    if (isCheckpointReached(raft.value.time_pressure1)) return 'reached'
    if (isFiveMinutesAway(raft.value.time_pressure1)) return 'fiveMinutesAway'
    return null
})

const pressure2Status = computed(() => {
    if (!raft.value?.time_pressure2) return null
    if (raft.value?.pressure2Valid) return 'valid'
    if (isCheckpointReached(raft.value.time_pressure2)) return 'reached'
    if (isFiveMinutesAway(raft.value.time_pressure2)) return 'fiveMinutesAway'
    return null
})
</script>

<template>
    <div 
        class="flex column gap20"
    >
        <div 
            class="
                flex justifyBetween alignCenter
            "
        >
            <h2>
                Radeau {{ raft?.serialNumber || '' }}
            </h2>
            
            <div
                @click.prevent.stop="cancel"
                class="pointer">
                <Icon
                    size="lg"
                >
                    close
                </Icon>
            </div>
        </div>

        <div class="flex column gap10">
            <!-- Inflation -->
            <div 
                class="timeRow flex alignCenter justifyBetween pad10 radius8"
                :class="'waiting'"
            >
                <div class="flex alignCenter gap10" style="flex: 0 0 auto;">
                    <Icon>tire_repair</Icon>
                </div>
                
                <TimeParser class="textXl fontWeightBold" :timestamp="raft?.time_inflation" />
                
                <div style="flex: 0 0 80px;"></div>
            </div>

            <!-- Pressure 1 -->
            <div 
                class="timeRow flex alignCenter justifyBetween pad10 radius8"
                :class="[pressure1Status === 'reached' ? 'checkpointReached' : pressure1Status === 'fiveMinutesAway' ? 'fiveMinutesAway' : pressure1Status === 'valid' ? 'valid' : 'waiting']"
            >
                <div class="flex alignCenter gap10" style="flex: 0 0 auto;">
                    <Icon>speed</Icon>
                    <span>1</span>
                </div>

                <TimeParser class="textXl fontWeightBold" :timestamp="raft?.time_pressure1" :flashing="!raft?.pressure1Valid" />
                
                <div class="actionArea">
                    <button 
                        v-if="canValidatePressure1() && !raft?.pressure1Valid"
                        @click="validatePressure1"
                        class="validateBtn pointer"
                    >
                        Valider
                    </button>
                    <Icon 
                        v-else-if="raft?.pressure1Valid"
                        class="validIcon"
                    >
                        check_circle
                    </Icon>
                </div>
            </div>

            <!-- Pressure 2 -->
            <div 
                class="timeRow flex alignCenter justifyBetween pad10 radius8"
                :class="[pressure2Status === 'reached' ? 'checkpointReached' : pressure2Status === 'fiveMinutesAway' ? 'fiveMinutesAway' : pressure2Status === 'valid' ? 'valid' : 'waiting']"
            >
                <div class="flex alignCenter gap10" style="flex: 0 0 auto;">
                    <Icon>speed</Icon>
                    <span>2</span>
                </div>
                
                <TimeParser class="textXl fontWeightBold" :timestamp="raft?.time_pressure2" :flashing="!raft?.pressure2Valid" />
                
                <div class="actionArea">
                    <button 
                        v-if="canValidatePressure2() && !raft?.pressure2Valid"
                        @click="validatePressure2"
                        class="validateBtn pointer"
                    >
                        Valider
                    </button>
                    <Icon 
                        v-else-if="raft?.pressure2Valid"
                        class="validIcon"
                    >
                        check_circle
                    </Icon>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="actions flex gap10">
            <button
                @click="resetRaft"
                class="pointer centered"
                style="flex: 1"
            >
                Réinitialiser
            </button>
            <button
                @click="deleteRaftHandler"
                class="pointer centered"
                style="flex: 1; background-color: rgba(255, 0, 0, 0.2); color: rgb(255, 100, 100);"
            >
                Supprimer
            </button>
        </div>
    </div>
</template>

<style scoped>
.timeRow {
    border-left: 4px solid transparent;
    transition: all 0.3s ease;
}

.timeRow.waiting {
    border-left-color: rgba(100, 150, 200, 0.6);
    background-color: rgba(100, 150, 200, 0.1);
}

.timeRow.fiveMinutesAway {
    border-left-color: var(--outline-warning);
    background-color: var(--bgc-warning);
}

.timeRow.checkpointReached {
    border-left-color: var(--outline-reached);
    background-color: var(--bgc-reached);
}

.timeRow.valid {
    border-left-color: rgba(143, 255, 128, 0.6);
    background-color: rgba(143, 255, 128, 0.15);
}

.actionArea {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    flex-shrink: 0;
}

.validateBtn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    background-color: rgba(143, 255, 128, 0.3);
    cursor: pointer;
    font-family: inherit;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}

.validateBtn:hover {
    background-color: rgba(143, 255, 128, 0.5);
}

.validIcon {
    font-size: 1.5rem;
    color: rgba(143, 255, 128, 0.8);
}

.actions {
    margin-top: 10px;
}

button {
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: rgba(143, 255, 128, 0.2);
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
}

button:hover {
    background-color: rgba(143, 255, 128, 0.3);
}
</style>
