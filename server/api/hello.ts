export default defineEventHandler(async (event) => {
    return {
        message: 'Hello from Nitro!',
        timestamp: new Date().toISOString()
    }
})
