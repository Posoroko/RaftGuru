// c5t_howTo
import { ref, watch } from 'vue'

export { useStorage }

// c5t_specs01
function useStorage<T>(
    key: string, 
    defaultValue: T
) {
    const getStoredValue = (): T => {
        const stored = localStorage.getItem(key)
        if (stored === null) return defaultValue
        try {
            return JSON.parse(stored)
        } catch {
            return defaultValue
        }
    }

    const value = ref<T>(getStoredValue()) as ReturnType<typeof ref<T>>

    watch(value, (newVal) => {
        if (newVal === null || newVal === undefined) {
            localStorage.removeItem(key)
        } else {
            localStorage.setItem(key, JSON.stringify(newVal))
        }
    }, { deep: true })

    function remove() {
        localStorage.removeItem(key)
        value.value = defaultValue
    }

    return { value, remove }
}

/*
c5t_howTo : useStorage

    import { useStorage } from '@/composables/useStorage'

Arguments:
    key         - the name used in localStorage (string)
    defaultValue - initial value if nothing stored yet, also used on reset

Returns:
    value  - reactive ref that auto-syncs with localStorage
    remove - function to clear storage and reset to defaultValue


Example 1: Boolean setting
Store a user preference for keeping the screen awake.

    const { value: keepScreenOn, remove } = useStorage('keepScreenOn', false)

Reading the value:
    
    if (keepScreenOn.value) { ... }

Updating the value (auto-saved to localStorage):

    keepScreenOn.value = true

Resetting to default and clearing from storage:

    remove()


Example 2: Object with nested properties
Store user settings with multiple fields.

    const { value: settings } = useStorage('userSettings', { 
        theme: 'dark', 
        volume: 80 
    })

Updating a nested property (deep watch detects the change and saves):

    settings.value.volume = 50


c5t_specs01 : useStorage()

Reactive localStorage wrapper. The ref syncs both ways:
- On init: reads from localStorage, falls back to defaultValue if not found
- On change: writes to localStorage automatically via deep watcher
- On remove(): clears storage AND resets ref to defaultValue

Deep watcher is required for objects/arrays to detect nested changes.
JSON.parse/stringify handles all serializable types (boolean, number, string, object, array).
*/
