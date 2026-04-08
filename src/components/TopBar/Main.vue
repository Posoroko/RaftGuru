<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Icon from '../Icon/Main.vue'
import Menu from './Menu/Main.vue'
import Logo from '@/components/Widgets/PlastimoLogo.vue'
import { appState } from '@/composables/appState'

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
            flex
        "
    >
        <div
            class="
                barBox
                flex gap10 alignCenter
                h100
            "
        >
            <div
                class="viewButton pointer"
                :class="{ activeView: appState.activeView === 'grid' }"
                @click="appState.activeView = 'grid'"
            >
                <Icon>apps</Icon>
            </div>
            <div
                class="viewButton pointer"
                :class="{ activeView: appState.activeView === 'inventory' }"
                @click="appState.activeView = 'inventory'"
            >
                <Icon>list</Icon>
            </div>
        </div>

        <div 
            class="
                barBox
                flex alignCenter justifyCenter gap5
            "
        >
            <p 
                class="
                    currentTime
                    text2xl
                "
            >
                {{ currentTime }}
            </p>

            <!-- Wake Lock Indicator -->
            <span 
                v-if="keepScreenOn" 
                class="indicator-dot" 
                :class="wakeLockStatus"
            ></span>
        </div>

        <div
            class="
                barBox
                flex justifyEnd
            "
        >
            <div 
                class="
                    menuButton
                    flex alignCenter
                    pointer
                "
                @click="showMenu = !showMenu"
            >
                <icon size="lg">menu</icon>
            </div>
        </div>

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
    padding: 3px 6px;
}

.barBox {
    width: 33.333333%;
}

.viewButton {
    opacity: 0.4;
}
.viewButton.activeView {
    opacity: 1;
}

.menuButton {
    background: none;
    border: none;
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
