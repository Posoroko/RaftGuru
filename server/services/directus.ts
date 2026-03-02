// c5t_howTo
export { directusGet }

// c5t_specs01
async function directusGet<T>(
    collection: string,
    query?: Record<string, string | number | boolean>
): Promise<T[]> {
    const token = process.env.NITRO_SERVER_ACCESS_TOKEN
    const baseUrl = process.env.DIRECTUS_URL || 'http://localhost:8055'

    if (!token) {
        throw new Error('NITRO_SERVER_ACCESS_TOKEN not set')
    }

    const url = new URL(`${baseUrl}/items/${collection}`)
    
    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            url.searchParams.append(key, String(value))
        })
    }

    const response = await fetch(url.toString(), {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })

    if (!response.ok) {
        throw new Error(`Directus error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data || []
}

/*
c5t_howTo : directusGet
Simple wrapper around Directus REST API. Reads auth token from NITRO_SERVER_ACCESS_TOKEN env var.

Usage:

    import { directusGet } from '@/services/directus'

    // Get all push subscriptions
    const subs = await directusGet('pushSubscriptions')

    // Get with query filter (Directus query syntax)
    const userSubs = await directusGet('pushSubscriptions', {
        'filter[userId][_eq]': userId
    })

Arguments:
    collection - name of the collection to query (string)
    query      - optional Directus query object for filtering/pagination

Returns:
    Promise<T[]> - array of items from Directus

c5t_specs01 : directusGet()
Minimal Directus client for server-side queries. Uses Bearer token auth from env.
Directus REST API returns { data: [...] }, we extract and return the data array.
Throws if token is missing or request fails.
*/
