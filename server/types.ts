export interface DirectusUser {
    id: string
    first_name: string
    email: string
}

export interface PushSubscription {
    id: string
    endpoint: string
    auth: string
    p256dh: string
    user: string | DirectusUser
}
