<script setup>
import { onMounted } from 'vue'
import GridMain from './components/Grid/Main.vue'
import TopBar from './components/TopBar/Main.vue'
import Overlay from './components/Overlay/Main.vue'
import { useAppInit } from './composables/appInit'

onMounted(() => {
    useAppInit()
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
