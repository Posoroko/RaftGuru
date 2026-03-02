<script setup>
import Icon from '../../Icon/Main.vue'
import User from '../../Overlay/Modal/User.vue'
import { currentBatch, closeBatch } from '../../../composables/testProcess'
import { useUser } from '../../../composables/useUser'
import { useAuth } from '../../../composables/useAuth'
import { useModal } from '../../../composables/useModal'
import { useStorage } from '../../../composables/useStorage'

defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['close'])

const { userState } = useUser()
const { logout } = useAuth()
const { showModal } = useModal()
const { value: keepScreenOn } = useStorage('keepScreenOn', false)

const handleOpenUserModal = async () => {
    emit('close')
    await showModal(User)
}

const handleCloseBatch = async () => {
    await closeBatch()
    emit('close')
}

const handleLogout = async () => {
    await logout()
}

// c5t_ux
const handleToggleScreenOn = () => {
    keepScreenOn.value = !keepScreenOn.value
    setTimeout(() => {
        emit('close')
    }, 1000)
}
</script>


<template>
    <div 
        v-if="isOpen"
        class="menuDropdown"
    >
        <div class="menuContent">
            <!-- User Info -->
            <button 
                class="userButton"
                @click="handleOpenUserModal"
            >
                <div class="menuSection">
                    <p class="menuLabel">User</p>
                    <p class="menuValue">{{ userState.first_name || 'Unknown' }}</p>
                </div>
            </button>

            <!-- Always On Button -->
            <button 
                class="alwaysOnButton"
                :class="{ active: keepScreenOn }"
                @click="handleToggleScreenOn"
            >
                <icon size="md">mobile_check</icon>
                <span>Always On</span>
            </button>

            <!-- Close Batch Button -->
            <button 
                v-if="currentBatch.id"
                class="closeButton"
                @click="handleCloseBatch"
            >
                <icon size="md">close</icon>
                <span>Close Batch</span>
            </button>

            <!-- Logout Button -->
            <button 
                class="logoutButton"
                @click="handleLogout"
            >
                <icon size="md">logout</icon>
                <span>Logout</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
.menuDropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--bg-dark, #1e1e1e);
    border: 1px solid var(--border-color, #444);
    border-top: none;
    padding: 12px;
    min-width: 280px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 100;
}

.menuContent {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.menuSection {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.menuLabel {
    font-size: 0.75em;
    text-transform: uppercase;
    color: var(--text-muted, #888);
    margin: 0;
}

.menuValue {
    font-size: 0.95em;
    color: var(--text-primary, #fff);
    margin: 0;
    word-break: break-all;
}

.userButton {
    display: flex;
    align-items: flex-start;
    padding: 8px;
    background: rgba(0, 217, 255, 0.05);
    border: 1px solid rgba(0, 217, 255, 0.2);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.userButton:hover {
    background: rgba(0, 217, 255, 0.1);
    border-color: rgba(0, 217, 255, 0.3);
}

.closeButton {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--danger-bg, #3a2020);
    border: 1px solid var(--danger-border, #8b4444);
    color: var(--danger-text, #ff6b6b);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.2s ease;
}

.closeButton:hover {
    background: var(--danger-bg-hover, #4a2a2a);
    border-color: var(--danger-border-hover, #a85555);
}

.logoutButton {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--danger-bg, #3a2020);
    border: 1px solid var(--danger-border, #8b4444);
    color: var(--danger-text, #ff6b6b);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.2s ease;
}

.logoutButton:hover {
    background: var(--danger-bg-hover, #4a2a2a);
    border-color: var(--danger-border-hover, #a85555);
}

.alwaysOnButton {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(100, 100, 100, 0.2);
    border: 1px solid rgba(100, 100, 100, 0.4);
    color: rgba(255, 255, 255, 0.5);
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.2s ease;
}

.alwaysOnButton:hover {
    background: rgba(100, 100, 100, 0.3);
    border-color: rgba(100, 100, 100, 0.5);
}

.alwaysOnButton.active {
    background: rgba(76, 175, 80, 0.2);
    border: 1px solid rgba(76, 175, 80, 0.5);
    color: rgba(76, 175, 80, 0.9);
}

.alwaysOnButton.active:hover {
    background: rgba(76, 175, 80, 0.3);
    border-color: rgba(76, 175, 80, 0.7);
}
</style>
<!--
c5t_ux : handleToggleScreenOn()
When the user clicks "Always On", the button immediately turns green.
After 1000ms the menu closes, giving visual feedback that the action was registered.
Without the delay, the menu snaps closed too fast and the user might not see the state change.
-->