/**
 * Fetch composable for Directus API calls
 * Provides helper functions for CRUD operations
 * Auth is handled via cookies set by Directus (mode: 'cookie')
 */

const  dbUrl = 'https://db.raftguru.posoroko.com'

export {
    dbGet,
    dbPost,
    dbPatch,
    dbDelete,
    dbUploadFile
}

// Core fetch function - internal, not exported
async function dbFetch<T>(p: {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
    endpoint: string
    body?: any
    query?: Record<string, any>
    headers?: Record<string, string>
}): Promise<{ data: T }> {
    let url = `${dbUrl}${p.endpoint}`

    if (p.query) {
        const params = new URLSearchParams()
        Object.entries(p.query).forEach(([key, value]) => {
            const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value)
            params.append(key, stringValue)
        })
        url += `?${params.toString()}`
    }

    const response = await fetch(url, {
        method: p.method,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...p.headers
        },
        body: p.body ? JSON.stringify(p.body) : undefined
    })

    if (!response.ok) {
        console.log('[dbFetch] : response.ok is not ok ')
        throw new Error(`${p.method} ${p.endpoint} failed: ${response.status}`)
    }

    // Read response as text first to handle empty bodies
    const text = await response.text()
    
    // If response body is empty, return early (common for DELETE requests)
    if (!text || text.trim() === '') {
        return { data: null } as any
    }

    // Parse as JSON if there's content
    const jsonResponse = JSON.parse(text)

    console.log('jsonresponse!:', jsonResponse)
    return jsonResponse
}

// Helpers

async function dbGet<T>(p: {
    endpoint: string
    query?: Record<string, any>
}): Promise<T> {
    const res = await dbFetch<T>({
        method: 'GET',
        endpoint: p.endpoint,
        query: p.query
    })

    return res.data || res
}

async function dbPost<T>(p: {
    endpoint: string
    body?: any
    query?: Record<string, any>
    headers?: Record<string, string>
}): Promise<T> {
    const res = await dbFetch<T>({
        method: 'POST',
        endpoint: p.endpoint,
        body: p.body,
        query: p.query,
        headers: p.headers
    })

    return res.data || res
}

async function dbPatch<T>(p: {
    endpoint: string
    body: any
    query?: Record<string, any>
}): Promise<T> {
    const res = await dbFetch<T>({
        method: 'PATCH',
        endpoint: p.endpoint,
        body: p.body,
        query: p.query
    })

    return res.data || res
}

async function dbDelete(endpoint: string): Promise<void> {
    await dbFetch({
        method: 'DELETE',
        endpoint: endpoint
    })
}

async function dbUploadFile(file: File): Promise<{ id: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const url = `${dbUrl}/api/files`

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData
    })

    if (!response.ok) {
        const errorBody = await response.text().catch(() => 'no body')
        console.error(`[dbUploadFile] POST /files → ${response.status}`, errorBody)
        throw new Error(`File upload failed: ${response.status}`)
    }

    const res = await response.json()
    console.log('[dbUploadFile] Raw response:', res)
    console.log('[dbUploadFile] Response type:', typeof res)
    console.log('[dbUploadFile] Is res.data:', !!res?.data)
    console.log('[dbUploadFile] res.data value:', res?.data)
    
    // Handle different response structures
    const fileData = res.data ? res.data : res
    console.log('[dbUploadFile] fileData:', fileData)
    console.log('[dbUploadFile] fileData type:', typeof fileData)
    
    if (!fileData || fileData.id === undefined) {
        console.error('Unexpected file upload response - fileData:', fileData)
        console.error('Response object:', res)
        throw new Error('File upload response missing id field')
    }
    
    // Extract ID - could be string or number
    const id = String(fileData.id)
    console.log('[dbUploadFile] Extracted ID:', id)
    
    return { id }
}
