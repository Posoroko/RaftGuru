<script setup>
import { defineProps } from 'vue'
import Icon from '../../Icon/Main.vue'
import { currentBatch, closeBatch } from '../../../composables/testProcess'
import { useUser } from '../../../composables/useUser'
import { useAuth } from '../../../composables/useAuth'

defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['close'])

const { userState } = useUser()
const { logout } = useAuth()

const handleCloseBatch = async () => {
    await closeBatch()
    emit('close')
}

const handleLogout = async () => {
    await logout()
}
</script>

<template>
    <div 
        v-if="isOpen"
        class="menuDropdown"
    >
        <div class="menuContent">
            <!-- User Info -->
            <div class="menuSection">
                <p class="menuLabel">User</p>
                <p class="menuValue">{{ userState.first_name || 'Unknown' }}</p>
            </div>

            <!-- Batch Info -->
            <div class="menuSection">
                <p class="menuLabel">Batch ID</p>
                <p class="menuValue" style="font-family: monospace; font-size: 0.85em;">
                    {{ currentBatch.id || 'None' }}
                </p>
            </div>

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
</style>
