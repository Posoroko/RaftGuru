<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Icon from '../Icon/Main.vue'
import Menu from './Menu/Main.vue'

const currentTime = ref('00:00')
const showMenu = ref(false)

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
        <div>

        </div>
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
</style>
