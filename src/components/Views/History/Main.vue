<script setup>
import { ref, onMounted } from 'vue'
import Icon from '@/components/Icon/Main.vue'
import { getClosedBatches, getBatchDetails } from '@/composables/testProcess'
import { appState } from '@/composables/appState'

const batches = ref([])
const loading = ref(true)
const loadingMore = ref(false)
const hasMore = ref(true)
const PAGE_SIZE = 10

const selectedBatch = ref(null)
const batchTiles = ref([])
const loadingDetails = ref(false)

onMounted(async () => {
    const result = await getClosedBatches(0, PAGE_SIZE)
    batches.value = result
    hasMore.value = result.length === PAGE_SIZE
    loading.value = false
})

async function loadMore() {
    loadingMore.value = true
    const result = await getClosedBatches(batches.value.length, PAGE_SIZE)
    batches.value = [...batches.value, ...result]
    hasMore.value = result.length === PAGE_SIZE
    loadingMore.value = false
}

function formatDate(timestamp) {
    if (!timestamp) return '—'
    const d = new Date(timestamp)
    return d.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function formatTime(timestamp) {
    if (!timestamp) return '--:--'
    const d = new Date(timestamp)
    const h = String(d.getHours()).padStart(2, '0')
    const m = String(d.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
}

function raftCount(batch) {
    if (!batch.tiles?.length) return 0
    return batch.tiles.reduce((sum, tile) => sum + (tile.rafts?.length || 0), 0)
}

function allRafts() {
    const rafts = []
    for (const tile of batchTiles.value) {
        if (tile.rafts?.length) {
            for (const raft of tile.rafts) {
                rafts.push({ ...raft, tileRef: tile.ref })
            }
        }
    }
    return rafts
}

async function handleSelect(batch) {
    selectedBatch.value = batch
    loadingDetails.value = true
    batchTiles.value = await getBatchDetails(batch.id)
    loadingDetails.value = false
}

function goBackToList() {
    selectedBatch.value = null
    batchTiles.value = []
}

function goBackToGrid() {
    appState.value.activeView = 'grid'
}
</script>

<template>
    <div class="historyView full flex column overflowHidden">

        <!-- Batch detail -->
        <template v-if="selectedBatch">
            <div class="flex alignCenter gap10 pad15">
                <div class="pointer flex alignCenter pad5" @click="goBackToList">
                    <Icon>arrow_back</Icon>
                </div>
                <div class="flex column grow">
                    <h2 class="fS18 weight6">{{ formatDate(selectedBatch.date_created) }}</h2>
                    <span class="fS12 textColorLight">{{ allRafts().length }} radeau{{ allRafts().length !== 1 ? 'x' : '' }}</span>
                </div>
            </div>

            <p v-if="loadingDetails" class="textColorLight pad15">Chargement…</p>

            <p v-else-if="!allRafts().length" class="textColorLight pad15">Aucun radeau dans cette série.</p>

            <div v-else class="raftList flex column gap10 pad15">
                <div
                    v-for="raft in allRafts()"
                    :key="raft.id"
                    class="raftCard pad15"
                >
                    <div class="flex alignCenter gap10 marBot10">
                        <Icon>directions_boat</Icon>
                        <span class="fS14 weight6">{{ raft.tileRef }}</span>
                        <span v-if="raft.serialNumber" class="fS12 textColorLight">{{ raft.serialNumber }}</span>
                    </div>

                    <div class="raftTimes flex gap15">
                        <div class="timeBlock flex column alignCenter">
                            <span class="fS10 textColorLight uppercase">Gonflage</span>
                            <span class="fS18 weight6">{{ formatTime(raft.time_inflation) }}</span>
                        </div>
                        <div class="timeBlock flex column alignCenter">
                            <span class="fS10 textColorLight uppercase">Pression 1</span>
                            <span class="fS18 weight6" :class="{ valid: raft.pressure1Valid, invalid: raft.pressure1Valid === false }">
                                {{ formatTime(raft.time_pressure1) }}
                            </span>
                        </div>
                        <div class="timeBlock flex column alignCenter">
                            <span class="fS10 textColorLight uppercase">Pression 2</span>
                            <span class="fS18 weight6" :class="{ valid: raft.pressure2Valid, invalid: raft.pressure2Valid === false }">
                                {{ formatTime(raft.time_pressure2) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Batch list -->
        <template v-else>
            <div class="flex alignCenter gap10 pad15">
                <div class="pointer flex alignCenter pad5" @click="goBackToGrid">
                    <Icon>arrow_back</Icon>
                </div>
                <h2>Historique des séries</h2>
            </div>

            <p v-if="loading" class="textColorLight pad15">Chargement…</p>

            <p v-else-if="!batches.length" class="textColorLight pad15">Aucune série terminée.</p>

            <div v-else class="batchList flex column gap10 pad15">
                <div
                    v-for="batch in batches"
                    :key="batch.id"
                    class="batchCard flex alignCenter gap15 pad15 pointer"
                    @click="handleSelect(batch)"
                >
                    <div class="cardIcon flex alignCenter justifyCenter">
                        <Icon>inventory_2</Icon>
                    </div>

                    <div class="flex column grow gap2">
                        <span class="fS16 weight6">{{ formatDate(batch.date_created) }}</span>
                        <span class="fS12 textColorLight">{{ raftCount(batch) }} radeau{{ raftCount(batch) !== 1 ? 'x' : '' }}</span>
                    </div>

                    <Icon>chevron_right</Icon>
                </div>

                <button
                    v-if="hasMore"
                    class="loadMoreButton flex alignCenter justifyCenter gap10 pad10 pointer"
                    :disabled="loadingMore"
                    @click="loadMore"
                >
                    <span v-if="loadingMore">Chargement…</span>
                    <span v-else>Charger plus</span>
                </button>
            </div>
        </template>
    </div>
</template>

<style scoped>
.historyView {
    overflow-y: auto;
}

.batchList,
.raftList {
    overflow-y: auto;
}

.batchCard {
    background-color: var(--color-accent);
    border: 1px solid var(--color-accent-faded);
    border-radius: 8px;
    transition: background-color 0.15s;
}

.batchCard:hover {
    background-color: var(--color-accent-faded);
}

.cardIcon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    background-color: var(--color-accent-faded);
}

.raftCard {
    background-color: var(--color-accent);
    border: 1px solid var(--color-accent-faded);
    border-radius: 8px;
}

.raftTimes {
    justify-content: space-around;
}

.timeBlock {
    min-width: 70px;
}

.valid {
    color: rgba(76, 175, 80, 0.9);
}

.invalid {
    color: rgba(255, 107, 107, 0.9);
}

.loadMoreButton {
    background-color: var(--color-accent);
    border: 1px solid var(--color-accent-faded);
    border-radius: 8px;
    font-size: 0.9em;
    transition: background-color 0.15s;
}

.loadMoreButton:hover:not(:disabled) {
    background-color: var(--color-accent-faded);
}

.loadMoreButton:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
