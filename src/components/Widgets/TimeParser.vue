<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

interface Props {
    timestamp?: string | Date | null
    flashing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    timestamp: null,
    flashing: false
})

const currentTime = ref(new Date())

onMounted(() => {
    const interval = setInterval(() => {
        currentTime.value = new Date()
    }, 60000) // Update every minute
    
    onBeforeUnmount(() => clearInterval(interval))
})

function formatTime(date: Date | string): string {
    if (!date) return '--:--'
    
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const h = String(dateObj.getHours()).padStart(2, '0')
    const m = String(dateObj.getMinutes()).padStart(2, '0')
    return `${h}:${m}`
}

const displayTime = computed(() => {
    return formatTime(props.timestamp as any)
})

const isTimeReached = computed(() => {
    if (!props.timestamp) return false
    const time = new Date(props.timestamp)
    return currentTime.value > time
})

const shouldFlash = computed(() => {
    return props.flashing && isTimeReached.value
})
</script>

<template>
    <p :class="[shouldFlash ? 'flashingTime' : '']">
        {{ displayTime }}
    </p>
</template>

<style scoped>
@keyframes flashing {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.3;
    }
}

.flashingTime {
    animation: flashing 1s infinite;
}
</style>
