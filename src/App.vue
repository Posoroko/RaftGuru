<script setup>
import { onMounted, watch } from 'vue'
import GridMain from './components/Grid/Main.vue'
import TopBar from './components/TopBar/Main.vue'
import Overlay from './components/Overlay/Main.vue'
import { useAppInit } from './composables/appInit'
import { useStorage } from './composables/useStorage'
import { useWakeLock } from './composables/useWakeLock'

const { value: keepScreenOn } = useStorage('keepScreenOn', false)
const { requestWakeLock, releaseWakeLock } = useWakeLock()

onMounted(() => {
    useAppInit()
})

// c5t_howTo
watch(keepScreenOn, async (newVal) => {
    if (newVal) {
        console.log('[App] keepScreenOn enabled, requesting wake lock...')
        await requestWakeLock()
    } else {
        console.log('[App] keepScreenOn disabled, releasing wake lock...')
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
        <TopBar />

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
