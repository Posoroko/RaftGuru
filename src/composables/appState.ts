import { ref } from 'vue'

export const appState = ref<{
    initialized: boolean
    activeBatch: any
    activeView: 'grid' | 'inventory' | 'history' | 'products'
    funkyBassi: boolean // FUNKY BASSI — delete this line when removing the theme
}>({
    initialized: false,
    activeBatch: null,
    activeView: 'grid',
    funkyBassi: false // FUNKY BASSI — delete this line when removing the theme
})
