<script setup>
import { onMounted, watch } from 'vue'
import GridMain from './components/Grid/Main.vue'
import TopBar from './components/TopBar/Main.vue'
import Overlay from './components/Overlay/Main.vue'
import { useAppInit } from './composables/appInit'
import { useStorage } from './composables/useStorage'
import { useWakeLock } from './composables/useWakeLock'

const { value: keepScreenOn } = useStorage('keepScreenOn', false)
const { requestWakeLock, releaseWakeLock, isActive, status } = useWakeLock()

onMounted(() => {
    useAppInit()
    
    // Initialize wake lock if it was enabled before refresh
    if (keepScreenOn.value) {
        console.log('[App] keepScreenOn was enabled, initializing wake lock...')
        requestWakeLock()
    }
})

// c5t_howTo
watch(keepScreenOn, async (newVal) => {
    console.log('[App] keepScreenOn changed to:', newVal)
    if (newVal) {
        console.log('[App] Requesting wake lock...')
        await requestWakeLock()
    } else {
        console.log('[App] Releasing wake lock...')
        await releaseWakeLock()
    }
})
</script>

<template>
    <div 
        class="
            full
            appBox
            flex column
            relative
        "
    >
        <!-- Wake Lock Status Indicator -->
        <div 
            v-if="keepScreenOn"
            class="wakeLockIndicator"
            :class="status"
        >
            <span v-if="status === 'active'" class="indicator-dot active"></span>
            <span v-else-if="status === 'error'" class="indicator-dot error"></span>
            <span v-else class="indicator-dot idle"></span>
            <span class="indicator-text">
                {{ status === 'active' ? '🔒 Screen On' : status === 'error' ? '❌ Failed' : '⏳ Loading...' }}
            </span>
        </div>

        <TopBar />

         <GridMain />

        <Overlay />
    </div>
</template>

<style>
#app {
    background-color: var(--color-bg);
}

.wakeLockIndicator {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    font-size: 0.85em;
    border-bottom: 1px solid rgba(100, 100, 100, 0.2);
}

.wakeLockIndicator.active {
    background-color: rgba(76, 175, 80, 0.1);
    color: #4caf50;
}

.wakeLockIndicator.error {
    background-color: rgba(244, 67, 54, 0.1);
    color: #f44336;
}

.wakeLockIndicator.idle {
    background-color: rgba(255, 152, 0, 0.1);
    color: #ff9800;
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

.indicator-text {
    font-weight: 500;
}
</style>

<style scoped>
.appBox {
    width: min(100%, 500px);
    background-color: var(--color-bg);
    margin: auto;
}
</style>
