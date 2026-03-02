<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Icon from '../Icon/Main.vue'
import Menu from './Menu/Main.vue'

const props = defineProps({
    keepScreenOn: {
        type: Boolean,
        default: false
    },
    wakeLockStatus: {
        type: String,
        default: 'idle'
    }
})

const currentTime = ref('00:00')
const showMenu = ref(false)

// Debug logs for prop changes
watch(() => props.keepScreenOn, (newVal) => {
    console.log('[TopBar] keepScreenOn prop changed to:', newVal)
})

watch(() => props.wakeLockStatus, (newVal) => {
    console.log('[TopBar] wakeLockStatus prop changed to:', newVal)
})

const updateTime = () => {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    currentTime.value = `${hours}:${minutes}`
}

const handleMenuClose = () => {
    showMenu.value = false
}

onMounted(() => {
    updateTime()
    const interval = setInterval(updateTime, 1000)
    onUnmounted(() => clearInterval(interval))
})
</script>

<template>
    <div 
        class="
            topBar
            flex justifyBetween alignCenter
            pad5
        "
    >
        <!-- Wake Lock Indicator -->
        <div v-if="keepScreenOn" class="wakeLockIndicator" :class="wakeLockStatus">
            <span class="indicator-dot" :class="wakeLockStatus"></span>
            <icon size="sm">mobile_check</icon>
        </div>
        <div v-else></div>
        <p 
            class="
                currentTime
                text2xl
            "
        >
            {{ currentTime }}
        </p>
        <button 
            class="menuButton"
            @click="showMenu = !showMenu"
        >
            <icon size="lg">menu</icon>
        </button>

        <!-- Menu Component -->
        <Menu 
            :is-open="showMenu"
            @close="handleMenuClose"
        />
    </div>
</template>

<style scoped>
.topBar {
    border-bottom: 1px solid var(--border-color, #444);
    position: relative;
}

.menuButton {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.wakeLockIndicator {
    display: flex;
    align-items: center;
    gap: 6px;
}

.indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    animation: pulse 2s infinite;
}

.indicator-dot.active {
    background-color: #4caf50;
}

.indicator-dot.error {
    background-color: #f44336;
    animation: none;
}

.indicator-dot.idle {
    background-color: #ff9800;
}

@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}
</style>
