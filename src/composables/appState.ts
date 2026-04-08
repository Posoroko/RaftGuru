import { ref } from 'vue'

export const appState = ref<{
    initialized: boolean
    activeBatch: any
    activeView: 'grid' | 'inventory'
}>({
    initialized: false,
    activeBatch: null,
    activeView: 'grid'
})
