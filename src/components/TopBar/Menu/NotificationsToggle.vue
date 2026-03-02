<script setup lang="ts">
import Icon from '@/components/Icon/Main.vue'
import { useUser } from '@/composables/useUser'
import { getSubscriptionFromBrowser } from '@/composables/browser'
import { dbGet, dbPost, dbDelete } from '@/composables/fetch'
import { ref, onMounted } from 'vue'

const { userState } = useUser()

const subscriptionId = ref<string | null>(null)
const isPending = ref(false)

// c5t_howTo
async function loadNotifications() {
    try {
        isPending.value = true
        const result = await dbGet({
            endpoint: '/items/pushSubscriptions',
            query: {
                filter: { 
                    user: { 
                        _eq: userState.value.id
                    }
                },
                fields: 'id'
            }
        })
        
        if (!result || !Array.isArray(result) || result.length === 0) {
            console.log('[NotificationsToggle] No subscription found')
            subscriptionId.value = null
        } else {
            subscriptionId.value = result[0].id
        }
    } catch (err) {
        console.log('[NotificationsToggle] No subscription found')
        subscriptionId.value = null
    } finally {
        isPending.value = false
    }
}

// c5t_howTo
async function toggleNotifications() {
    try {
        isPending.value = true
        
        if (subscriptionId.value) {
            // Disable: delete subscription using stored ID
            console.log('[NotificationsToggle] Deleting subscription:', subscriptionId.value)
            await dbDelete(
                `/items/pushSubscriptions/${subscriptionId.value}`
            )
            console.log('[NotificationsToggle] Subscription deleted successfully')
            subscriptionId.value = null
        } else {
            // Enable: create subscription

            const subscription = await getSubscriptionFromBrowser()
            
            console.log('[NotificationsToggle] Saving subscription to Directus...')
            
            await dbPost({
                endpoint: '/items/pushSubscriptions',
                body: {
                    user: userState.value.id,
                    endpoint: subscription.endpoint,
                    auth: subscription.auth,
                    p256dh: subscription.p256dh
                }
            })
            
            console.log('[NotificationsToggle] Subscription saved successfully')
            
            // Reload to get the new subscription ID
            await loadNotifications()
        }
    } catch (err) {
        console.error('[NotificationsToggle] Failed to toggle notifications:', err)
        if (err instanceof Error) {
            console.error('[NotificationsToggle] Error message:', err.message)
            console.error('[NotificationsToggle] Error stack:', err.stack)
        }
        // Revert state on error
        await loadNotifications()
    } finally {
        isPending.value = false
    }
}

onMounted(() => {
    loadNotifications()
})
</script>

<template>
    <button 
        class="notificationsButton"
        @click="toggleNotifications"
        :disabled="isPending"
    >
        <icon size="md">
            {{ subscriptionId ? 'check_box' : 'check_box_outline_blank' }}
        </icon>
        <span>Notifications</span>
    </button>
</template>

<style scoped>
.notificationsButton {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(0, 217, 255, 0.05);
    border: 1px solid rgba(0, 217, 255, 0.2);
    color: #00d9ff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9em;
    transition: all 0.2s ease;
}

.notificationsButton:hover:not(:disabled) {
    background: rgba(0, 217, 255, 0.1);
    border-color: rgba(0, 217, 255, 0.3);
}

.notificationsButton:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>

/*
c5t_howTo : NotificationsToggle
Standalone component that manages push notification subscriptions. Loads current subscription
status on mount and provides toggle functionality to enable/disable notifications.

Usage:
    import NotificationsToggle from '@/components/TopBar/Menu/NotificationsToggle.vue'
    <NotificationsToggle />

c5t_specs : NotificationsToggle
Queries pushSubscriptions collection to see if user has active subscription. When toggled,
creates or deletes the subscription in Directus. Real-world: Before creating, needs to request
browser's push subscription details (endpoint, auth, p256dh) from Service Worker registration.
*/
