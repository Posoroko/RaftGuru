<script setup>
import { useUser } from '@/composables/useUser'
import { useAppState } from '@/composables/useAppState'
import Login from './Login.vue'
import NewBatch from './NewBatch.vue'
import { useModal } from '@/composables/useModal'
import { currentBatch } from '@/composables/testProcess'

const { userState } = useUser()

const { modalState, showModal } = useModal()

</script>

<template>
    <div
        v-if="
            !userState.isLoggedIn
        "
        class="
            allEvents
            backdrop
            full
            flex
            alignCenter
            justifyCenter
            relative
        "
    >
        <div 
            class="
                modal
            "
        >
            <Login />
        </div>
    </div>

    <div
        v-if="
            !currentBatch.id
        "
        class="
            allEvents
            backdrop
            full
            flex
            alignCenter
            justifyCenter
            relative
        "
    >
        <div 
            class="
                modal
            "
        >
            <NewBatch />
        </div>
    </div>

    <div
        v-else-if="
            modalState.visible
        "
        class="
            allEvents
            backdrop
            full
            flex
            alignCenter
            justifyCenter
            relative
        "
    >
        <div 
            class="
                modal
            "
        >
            <component
                :is="modalState.modal"
            />
        </div>
    </div>
</template>

<style scoped>
.backdrop {
    background-color: rgba(0, 0, 0, 0.595);
    z-index: 1000;
}

.modal {
    background-color: var(--color-bg);
    border: 2px solid var(--color-accent);
    border-radius: 12px;
    padding: 20px;
    width: min(400px, 90%);
}
</style>