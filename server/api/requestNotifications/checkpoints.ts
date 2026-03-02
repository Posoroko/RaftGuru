/**
 * API endpoint to register for checkpoint notifications
 * POST /api/requestNotifications/checkpoints
 * 
 * Body: { userId, subscription: { endpoint, auth, p256dh } }
 */

import { registerClient } from '../../services/clientSubscriptions'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    
    const { userId, subscription } = body
    
    if (!userId || !subscription) {
        throw createError({
            statusCode: 400,
            message: 'Missing userId or subscription'
        })
    }
    
    if (!subscription.endpoint || !subscription.auth || !subscription.p256dh) {
        throw createError({
            statusCode: 400,
            message: 'Invalid subscription: missing endpoint, auth, or p256dh'
        })
    }
    
    registerClient(userId, {
        endpoint: subscription.endpoint,
        auth: subscription.auth,
        p256dh: subscription.p256dh
    })
    
    return {
        success: true,
        message: 'Registered for checkpoint notifications',
        userId
    }
})
