<script setup lang="ts">
import Icon from '@/components/Icon/Main.vue'
import { useUser } from '@/composables/useUser'
import { getSubscriptionFromBrowser } from '@/composables/browser'
import { dbPost, dbDelete } from '@/composables/fetch'
import { ref } from 'vue'

const { userState, getUserData } = useUser()
const isPending = ref(false)

function isSubscribed() {
    return userState.value.pushSubscriptions && userState.value.pushSubscriptions.length > 0
}

function getSubscriptionId() {
    return userState.value.pushSubscriptions?.[0] || null
}

async function cancelNotifications() {
    const subId = getSubscriptionId()
    console.log('[NotificationsToggle] Deleting subscription:', subId)
    await dbDelete(`/items/pushSubscriptions/${subId}`)
    console.log('[NotificationsToggle] Subscription deleted')
}

async function activateNotifications() {
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
    console.log('[NotificationsToggle] Subscription saved')
}

async function toggleNotifications() {
    try {
        isPending.value = true
        
        if (isSubscribed()) {
            await cancelNotifications()
        } else {
            await activateNotifications()
        }
        
        // Refresh user data to update pushSubscriptions array
        await getUserData()
    } catch (err) {
        console.error('[NotificationsToggle] Error toggling notifications:', err)
        // Refresh to revert UI on error
        await getUserData()
    } finally {
        isPending.value = false
    }
}
</script>

<template>
    <button 
        class="notificationsButton"
        @click="toggleNotifications"
        :disabled="isPending"
    >
        <icon size="md">
            {{ isSubscribed() ? 'check_box' : 'check_box_outline_blank' }}
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
c5t_realWorld : Notification Subscriptions
Technician can toggle push notifications on/off. When enabled, browser subscribes to receive
reminders about raft measurement deadlines. Subscription details (endpoint, keys) are stored
in Directus so server knows where to send push notifications.

c5t_stack_01 : isSubscribed
Checks if user has any subscriptions in their pushSubscriptions array.
Since pushSubscriptions is a one-to-many relationship on the user record,
it's available in userState after user login.

c5t_stack_02 : toggleNotifications
Creates or deletes subscription in Directus. After change, calls getUserData() to refresh
the user record so pushSubscriptions array is updated and UI reflects current state.
*/
