<script setup lang="ts">
import { computed } from 'vue'
import { useModal } from '@/composables/useModal'

const { modalState } = useModal()

const modalContent = computed(() => {
    if(!modalState.value.confirmationProps) return null
    return modalState.value.confirmationProps
})

const emit = defineEmits(['confirm', 'cancel'])

function handleConfirm() {
    emit('confirm', true)
}

function handleCancel() {
    emit('cancel')
}
</script>

<template>
    <div class="full flex column gap20">
        <div class="titleSection">
            <h2
                v-if="modalContent.title"
                class="title"
            >
                {{ modalContent.title }}
            </h2>
        </div>

        <p class="message">{{ modalContent.message }}</p>

        <div class="buttonsSection flex gap10">
            <button
                @click="handleCancel"
                class="cancelBtn"
            >
                {{ modalContent.cancelText }}
            </button>
            <button
                @click="handleConfirm"
                class="confirmBtn"
            >
                {{ modalContent.confirmText }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.titleSection {
    display: flex;
    align-items: center;
    gap: 10px;
}

.title {
    margin: 0;
    font-size: 20px;
    color: var(--beige);
}

.message {
    margin: 0;
    color: var(--beige);
    font-size: 14px;
    line-height: 1.6;
}

.buttonsSection {
    margin-top: 10px;
    justify-content: flex-end;
}

.cancelBtn,
.confirmBtn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 200ms ease;
    font-weight: 500;
}

.cancelBtn {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--beige);
}

.cancelBtn:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.confirmBtn {
    background-color: var(--beige);
    color: var(--green);
}

.confirmBtn:hover {
    background-color: rgba(255, 255, 255, 0.9);
}
</style>
