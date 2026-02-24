<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@/components/Icon/Main.vue'
import Raft from '@/components/Raft/Main.vue'
import NewRaftModal from '@/components/Overlay/Modal/NewRaft.vue'
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

async function handleClick() {
    const tileRef = props.tileRef as any
    const tile = tiles.value[tileRef]
    
    if (!tile?.id) {
        // Tile doesn't exist, create it and open NewRaft modal
        const newTile = await createTile(tileRef)
        if (newTile) {
            openNewRaftModal()
        }
    } else {
        // Tile exists
        if (!tile.rafts || tile.rafts.length === 0) {
            // No rafts, open NewRaft modal
            openNewRaftModal()
        } else if (tile.rafts.length === 1) {
            // One raft, open raft modal
            // TODO: open raft modal for existing raft
        } else {
            // Multiple rafts, open multi-raft selection modal
            // TODO: open multi-raft modal
        }
    }
}

async function openNewRaftModal() {
    try {
        const raftData = await showModal(NewRaftModal, {
            title: 'Ajouter un radeau',
            message: ''
        })
        
        console.log('New raft data:', raftData)
        // TODO: Create raft in database
    } catch (err) {
        console.log('NewRaft modal cancelled')
    }
}
</script>

<template>
    <div 
        class="
            cell
            full
            pad20
            centered
            pointer
        "
        @click="handleClick"
    >
        <Icon
            v-if="currentBatch.id"
            size="xl"
        >
            add
        </Icon>
    </div>
</template>

<style scoped>
.cell {
    outline: 1px solid rgba(255, 255, 255, 0.141);
    border-radius: 5px;
    box-shadow: 0 0 10px black;
}
</style>
