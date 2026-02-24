<script setup>
import { createNewBatch } from '@/composables/testProcess'
import { useModal } from '@/composables/useModal'

const { confirm } = useModal()

async function handleCreateBatch() {
    await createNewBatch()
    confirm()
}
</script>

<template>
    <div class="flex column">
        <h2>Aucune test en cours</h2>

        <p>
            <!-- Voulez vous commencer une nouvelle série de test ? -->
        </p>
        
        <button
            class="
                flex
                justifyCenter
                alignCenter
                pointer
            "
            @click="handleCreateBatch"
        >
            <span class="text4xl fontWeightBold">
                Commencer
            </span>
        </button>
    </div>
</template>

<style scoped>
h2 {
    margin-bottom: 15px;
    color: var(--color-text);
}

p {
    margin-bottom: 25px;
    color: var(--color-text);
    opacity: 0.8;
}

button {
    background-color: var(--color-btn);
    padding: 12px 30px;
    border-radius: 6px;
    font-weight: 600;
    border: none;
    cursor: pointer;
}

button:hover {
    opacity: 0.9;
}
</style>
