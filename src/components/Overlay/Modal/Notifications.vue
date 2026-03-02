<script setup>
import Icon from '@/components/Icon/Main.vue'
import { useModal } from '@/composables/useModal'
import { useUser } from '@/composables/useUser'
import { ref, computed, onMounted } from 'vue'
import { dbGet, dbPost, dbDelete } from '@/composables/fetch'

const { confirm } = useModal()
const { userState } = useUser()

// c5t_howTo
const notificationStates = ref({
    checkpoints: false
})

const isLoading = ref(false)
const error = ref(null)

// c5t_howTo
const hasCheckpointSubscription = computed(() => {
    return notificationStates.value.checkpoints
})

// c5t_howTo
async function loadSubscriptions() {
    try {
        isLoading.value = true
        error.value = null
        
        // Query push_subscriptions collection to see if user has notifications enabled
        const result = await dbGet({
            endpoint: '/items/push_subscriptions',
            query: {
                filter: { user: { _eq: userState.id } },
                fields: ['id', 'notification_type']
            }
        })

        // Reset all states
        notificationStates.value.checkpoints = false

        // Set based on what we found in Directus
        if (result.data && Array.isArray(result.data)) {
            result.data.forEach((sub) => {
                if (sub.notification_type === 'checkpoints') {
                    notificationStates.value.checkpoints = true
                }
            })
        }
    } catch (err) {
        console.error('[Notifications] Failed to load subscriptions:', err)
        error.value = 'Failed to load notification settings'
    } finally {
        isLoading.value = false
    }
}

// c5t_howTo
async function toggleCheckpointNotifications(enabled) {
    try {
        isLoading.value = true
        error.value = null

        if (enabled) {
            // Create subscription in Directus
            await dbPost({
                endpoint: '/items/push_subscriptions',
                body: {
                    user: userState.id,
                    notification_type: 'checkpoints',
                    enabled: true,
                    created_at: new Date().toISOString()
                }
            })
            notificationStates.value.checkpoints = true
        } else {
            // Delete subscription from Directus
            // First, get the subscription ID
            const result = await dbGet({
                endpoint: '/items/push_subscriptions',
                query: {
                    filter: { 
                        _and: [
                            { user: { _eq: userState.id } },
                            { notification_type: { _eq: 'checkpoints' } }
                        ]
                    },
                    fields: ['id']
                }
            })

            if (result.data && Array.isArray(result.data) && result.data.length > 0) {
                const subscriptionId = result.data[0].id
                await dbDelete(`/items/push_subscriptions/${subscriptionId}`)
            }
            notificationStates.value.checkpoints = false
        }
    } catch (err) {
        console.error('[Notifications] Failed to toggle notifications:', err)
        error.value = 'Failed to update notification settings'
        // Revert state on error
        notificationStates.value.checkpoints = !enabled
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    loadSubscriptions()
})
</script>

<template>
    <div class="container">
        <h2 
            class="
                textColorLight
                flex justifyBetween alignCenter
            "
        >
            <span>
                Notifications
            </span>

            <Icon
                @click="() => confirm()"
                class="pointer"
                size="Lg"
            >
                close
            </Icon>
        </h2>

        <div v-if="error" class="errorBox">
            {{ error }}
        </div>

        <div 
            class="
                notificationsList
                flex column gap15
            "
        >
            <!-- Checkpoints Notification -->
            <div class="notificationItem">
                <div class="itemContent">
                    <div class="itemLabel">
                        <h3>Pressure Checkpoints</h3>
                        <p class="description">
                            Get notified when pressure measurement times are due
                        </p>
                    </div>
                </div>

                <div class="toggleSwitch">
                    <input
                        type="checkbox"
                        :checked="notificationStates.checkpoints"
                        :disabled="isLoading"
                        @change="(e) => toggleCheckpointNotifications((e.target).checked)"
                        class="checkbox"
                    />
                    <span class="switchLabel">
                        {{ notificationStates.checkpoints ? 'Enabled' : 'Disabled' }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>


h2 {
    margin: 0;
    font-size: 1.5em;
}

.errorBox {
    padding: 12px;
    background: rgba(255, 107, 107, 0.1);
    border: 1px solid rgba(255, 107, 107, 0.3);
    border-radius: 4px;
    color: #ff6b6b;
    font-size: 0.9em;
}

.notificationsList {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.notificationItem {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: rgba(0, 217, 255, 0.05);
    border: 1px solid rgba(0, 217, 255, 0.2);
    border-radius: 6px;
    transition: all 0.2s ease;
}

.notificationItem:hover {
    background: rgba(0, 217, 255, 0.1);
    border-color: rgba(0, 217, 255, 0.3);
}

.itemContent {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.itemLabel h3 {
    margin: 0;
    font-size: 1em;
    color: var(--text-primary, #fff);
}

.description {
    margin: 4px 0 0 0;
    font-size: 0.85em;
    color: var(--text-muted, #888);
}

.toggleSwitch {
    display: flex;
    align-items: center;
    gap: 10px;
}

.checkbox {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #00d9ff;
}

.checkbox:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.switchLabel {
    font-size: 0.85em;
    color: var(--text-muted, #888);
    min-width: 70px;
    text-align: right;
}
</style>

/*
c5t_howTo : Notifications Modal
Displays notification preferences for the current user. Allows toggling "Checkpoints" notifications.
When toggled, creates or deletes the corresponding push_subscriptions record in Directus.

Usage:
    import Notifications from '@/components/Overlay/Modal/Notifications.vue'
    import { useModal } from '@/composables/useModal'
    
    const { showModal } = useModal()
    await showModal(Notifications)

c5t_specs : Notifications Modal
Real-world: Users need fine-grained control over which notifications they receive. On mount,
loads existing subscriptions from Directus. When toggled, either creates (POST) or deletes (DELETE)
the push_subscriptions record. The server-side checkpoint watcher will only send notifications
to users who have enabled them. Errors are caught and shown to user, with state reverting on failure.
*/
