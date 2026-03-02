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
        console.log('[App] onMounted: keepScreenOn was enabled, initializing wake lock...')
        requestWakeLock()
    } else {
        console.log('[App] onMounted: keepScreenOn is disabled')
    }
})

// c5t_howTo
watch(keepScreenOn, async (newVal) => {
    console.log('[App] ⚡ keepScreenOn watch triggered, newVal:', newVal, 'current status:', status.value)
    if (newVal) {
        console.log('[App] Requesting wake lock...')
        const result = await requestWakeLock()
        console.log('[App] requestWakeLock result:', result, 'status is now:', status.value)
    } else {
        console.log('[App] Releasing wake lock...')
        await releaseWakeLock()
        console.log('[App] releaseWakeLock complete, status is now:', status.value)
    }
}, { flush: 'post' })
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
        <TopBar :keepScreenOn="keepScreenOn" :wakeLockStatus="status" />

         <GridMain />

        <Overlay />
    </div>
</template>

<style>
#app {
    background-color: var(--color-bg);
}
</style>

<style scoped>
.appBox {
    width: min(100%, 500px);
    background-color: var(--color-bg);
    margin: auto;
}
</style>
