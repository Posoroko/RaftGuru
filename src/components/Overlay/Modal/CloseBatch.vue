<script setup>
import { useModal } from '@/composables/useModal'

const { confirm, cancel } = useModal()
</script>

<template>
    <div class="flex column gap20">
        <h2 class="fS18 weight6">Fermer la série</h2>

        <p class="fS14 textColorLight">
            Des radeaux sont encore en test. Que voulez-vous faire ?
        </p>

        <div class="flex column gap10">
            <button
                class="actionBtn closeBtn pointer pad10"
                @click="confirm('close')"
            >
                Fermer et conserver
            </button>

            <button
                class="actionBtn deleteBtn pointer pad10"
                @click="confirm('delete')"
            >
                Supprimer la série
            </button>

            <button
                class="actionBtn cancelBtn pointer pad10"
                @click="cancel()"
            >
                Annuler
            </button>
        </div>
    </div>
</template>

<style scoped>
.actionBtn {
    border-radius: 6px;
    font-size: 0.95em;
    font-weight: 500;
    text-align: center;
    transition: all 0.15s;
}

.closeBtn {
    background: rgba(0, 217, 255, 0.05);
    border: 1px solid rgba(0, 217, 255, 0.2);
}

.closeBtn:hover {
    background: rgba(0, 217, 255, 0.1);
    border-color: rgba(0, 217, 255, 0.3);
}

.deleteBtn {
    background: var(--danger-bg, #3a2020);
    border: 1px solid var(--danger-border, #8b4444);
    color: var(--danger-text, #ff6b6b);
}

.deleteBtn:hover {
    background: var(--danger-bg-hover, #4a2a2a);
    border-color: var(--danger-border-hover, #a85555);
}

.cancelBtn {
    background: rgba(100, 100, 100, 0.1);
    border: 1px solid rgba(100, 100, 100, 0.3);
}

.cancelBtn:hover {
    background: rgba(100, 100, 100, 0.2);
}
</style>
