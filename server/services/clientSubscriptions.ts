/**
 * Client push notification subscriptions
 * Manages which clients want to receive notifications
 */

export {
    clientSubscriptions,
    registerClient,
    unregisterClient,
    getClient
}

interface ClientSubscription {
    endpoint: string
    auth: string
    p256dh: string
}

const clientSubscriptions = new Map<string, ClientSubscription>()

function registerClient(
    userId: string, 
    subscription: ClientSubscription
) {
    console.log(`[ClientSubs] Registering: ${userId}`)
    clientSubscriptions.set(userId, subscription)
}

function unregisterClient(userId: string) {
    console.log(`[ClientSubs] Unregistering: ${userId}`)
    clientSubscriptions.delete(userId)
}

function getClient(userId: string): ClientSubscription | undefined {
    return clientSubscriptions.get(userId)
}
