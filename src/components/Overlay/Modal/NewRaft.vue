<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '../../Icon/Main.vue'
import TimeSelector from './Widgets/TimeSelector.vue'
import TimeParser from '@/components/Widgets/TimeParser.vue'
import { useModal } from '@/composables/useModal'
import { currentBatch, currentTileForModal, createRaft, updateRaft } from '@/composables/testProcess'

const { modalState, confirm, cancel } = useModal()

const mode = computed(() => modalState.value.data?.newRaft?.mode || 'create')
const resetRaftId = computed(() => modalState.value.data?.newRaft?.resetRaftId)
const tileId = computed(() => modalState.value.data?.newRaft?.tileId)

const inflationTime = ref<Date | null>(null)
const time_pressure1 = ref<string | null>(null)
const time_pressure2 = ref<string | null>(null)
const serialNumber = ref<string>('SN')
const letters = ['SN', 'E', 'F', 'G', 'H']

const selectedLetter = computed(() => {
    if (serialNumber.value.startsWith('SN')) return 'SN'
    const firstChar = serialNumber.value.charAt(0).toUpperCase()
    return letters.includes(firstChar) ? firstChar : null
})

function selectLetter(letter: string) {
    let currentNumber = serialNumber.value
    // Remove any existing letter prefix (SN or single letter)
    if (currentNumber.startsWith('SN')) {
        currentNumber = currentNumber.slice(2)
    } else if (/^[A-H]/.test(currentNumber)) {
        currentNumber = currentNumber.slice(1)
    }
    serialNumber.value = letter + currentNumber
}

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

function handleTimeChange(newTime: Date) {
    inflationTime.value = new Date(newTime)
    
    // Calculate pressure times and store as ISO strings
    const p1 = new Date(newTime.getTime() + 30 * 60 * 1000)
    const p2 = new Date(newTime.getTime() + 90 * 60 * 1000)
    
    time_pressure1.value = getLocalISOString(p1)
    time_pressure2.value = getLocalISOString(p2)
}

async function handleSubmit() {
    try {
        if (!tileId.value) {
            throw new Error('No tile selected')
        }

        if (!inflationTime.value || !time_pressure1.value || !time_pressure2.value) {
            throw new Error('Missing time values')
        }

        const raftData = {
            time_inflation: inflationTime.value.toISOString(),
            time_pressure1: time_pressure1.value,
            time_pressure2: time_pressure2.value,
            pressure1Valid: false,
            pressure2Valid: false,
            ...(serialNumber.value && { serialNumber: serialNumber.value })
        }

        if (mode.value === 'reset' && resetRaftId.value) {
            // Reset existing raft
            await updateRaft(resetRaftId.value, raftData)
            console.log('[NewRaft] Raft reset:', resetRaftId.value)
            confirm({ mode: 'reset', id: resetRaftId.value })
        } else {
            // Create new raft
            const newRaft = await createRaft(tileId.value, raftData)
            console.log('[NewRaft] Raft created:', newRaft?.id)
            confirm(newRaft)
        }
    } catch (err) {
        console.error('[NewRaft] failed to submit:', err)
    }
}

function handleCancel() {
    cancel()
}
 
</script>

<template>
    <div 
        class="
            flex column
        "
    >
        <div
            class="
                modalHeader
                flex justifyBetween alignCenter
            "
        >
            <h2>{{ mode === 'reset' ? 'Réinitialiser le radeau' : 'Ajouter un radeau' }}</h2>
            <button 
                class="closeBtn centered pointer"
                @click.prevent.stop="handleCancel"
            >
                <Icon>
                    close
                </Icon>
            </button>
        </div>

        <div 
            class="
                formGroup marTop20
            "
        >
            <TimeSelector
                @timeChange="handleTimeChange"
            />
        </div>

        <div 
            class="
                formGroup marTop10 flex column gap10
            "
        >
            <div class="flex gap10 justifyStart">
                <button
                    v-for="letter in letters"
                    :key="letter"
                    @click.prevent.stop="selectLetter(letter)"
                    class="
                        flex alignCenter justifyCenter
                        pointer pad10 radius8
                    "
                    :class="[selectedLetter === letter ? 'activeSurface' : 'notActiveSurface']"
                >
                    {{ letter }}
                </button>
            </div>
            <input 
                v-model="serialNumber"
                type="text"
                inputmode="numeric"
                placeholder="no. de série"
                class="w100 pad10 notActiveSurface"
            />
        </div>

        <div 
            class="
                modalContent flex justifyEvenly marTop20
            "
        >
            <div class="formGroup grow centered">
                <label
                    class="flex gap5 alignCenter"
                >
                    <Icon>tire_repair</Icon>
                </label>
                <TimeParser 
                    :timestamp="inflationTime"
                    class="readOnlyTime text3xl fontWeightBold"
                />
            </div>

            <div class="formGroup grow centered">
                <label
                    class="flex gap5 alignCenter"
                >
                    <Icon>speed</Icon>
                    <span>1</span>
                </label>
                <TimeParser 
                    :timestamp="time_pressure1"
                    class="readOnlyTime text3xl fontWeightBold"
                />
            </div>

            <div class="formGroup grow centered">
                <label
                    class="flex gap5 alignCenter"
                >
                    <Icon>speed</Icon>
                    <span>2</span>    
                </label>
                <TimeParser 
                    :timestamp="time_pressure2"
                    class="readOnlyTime text3xl fontWeightBold"
                />
            </div>
        </div>

        <div 
            class="
                modalFooter flex justifyEvenly marTop20
            "
        >
            <button 
                class="
                    btnSubmit
                    flex alignCenter
                    pointer
                "
                @click.prevent.stop="handleSubmit"
            >
                <Icon
                    size="xl"
                >
                    {{ mode === 'reset' ? 'restart_alt' : 'bookmark_check' }}
                </Icon>

                <span
                    class="textXl fontWeightBold"
                >
                    {{ mode === 'reset' ? 'Réinitialiser' : 'ajouter' }}
                </span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.btnSubmit {
    background-color: var(--color-accent);
    padding: 5px 10px;
    border-radius: 4px;
}
input{
    outline: none;
}
</style>
