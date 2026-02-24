<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../../Icon/Main.vue'
import { useModal } from '@/composables/useModal'

const { confirm, cancel } = useModal()

// Calculate current time rounded to nearest 5 minutes
const getInflationTime = () => {
    const now = new Date()
    const minutes = Math.round(now.getMinutes() / 5) * 5
    now.setMinutes(minutes)
    now.setSeconds(0)
    return now
}

const inflationTime = computed(() => {
    return getInflationTime()
})

const inflationTimeDisplay = computed(() => {
    return inflationTime.value.toISOString().slice(11, 16)
})

// Automatically calculate pressure measurement times
const pressure1Time = computed(() => {
    const date = new Date(inflationTime.value)
    date.setMinutes(date.getMinutes() + 30)
    return date.toISOString().slice(11, 16)
})

const pressure2Time = computed(() => {
    const date = new Date(inflationTime.value)
    date.setMinutes(date.getMinutes() + 90)
    return date.toISOString().slice(11, 16)
})

const handleSubmit = () => {
    confirm({
        time_inflation: inflationTime.value.toISOString()
    })
}

const handleCancel = () => {
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
            <h2>Ajouter un radeau</h2>
            <button 
                class="closeBtn centered"
                @click="handleCancel"
            >
                <icon>close</icon>
            </button>
        </div>

        <div 
            class="
                formGroup
            "
        >
            <label>Début</label>
            <div class="readOnlyTime">{{ inflationTimeDisplay }}</div>
        </div>

        <div 
            class="
                modalContent flex
            "
        >
            <div class="formGroup grow">
                <label>Pression 1</label>
                <div class="readOnlyTime">{{ pressure1Time }}</div>
            </div>

            <div class="formGroup grow">
                <label>Pression 2</label>
                <div class="readOnlyTime">{{ pressure2Time }}</div>
            </div>
        </div>

        <div 
            class="
                modalFooter flex justifyEvenly marTop20
            "
        >
            <button 
                class="btnCancel"
                @click="handleCancel"
            >
                Annuler
            </button>
            <button 
                class="btnSubmit"
                @click="handleSubmit"
            >
                Ajouter
            </button>
        </div>
    </div>
</template>

<style scoped>

</style>
